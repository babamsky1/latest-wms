/**
 * Audit Trail System - Comprehensive logging of all user actions
 * Provides complete traceability and compliance support
 */

import { AuditLogEntry, UserSession } from '@/types/wms';
import { globalEventEmitter, WMSEvents } from './EventEmitter';

export class AuditTrail {
  private auditLogs: AuditLogEntry[] = [];
  private userSessions: UserSession[] = [];
  private currentSession: UserSession | null = null;

  constructor() {
    this.loadFromStorage();

    // Listen for various events to log them
    globalEventEmitter.on(WMSEvents.ASSIGNMENT_COMPLETED, (data) => {
      this.logAction('update', 'assignment', data.id, data, 'Assignment completed');
    });

    globalEventEmitter.on(WMSEvents.STOCK_LEDGER_UPDATED, (data) => {
      this.logAction('update', 'stock', data.entry.id, data.entry, 'Stock ledger updated');
    });

    globalEventEmitter.on(WMSEvents.ERROR_OCCURRED, (data) => {
      this.logError('System error occurred', data);
    });
  }

  /**
   * Start a user session
   */
  startSession(userId: string, userName: string, ipAddress?: string, userAgent?: string): UserSession {
    // End any existing session
    if (this.currentSession) {
      this.endSession();
    }

    this.currentSession = {
      id: this.generateId(),
      userId,
      userName,
      loginTime: new Date().toISOString(),
      ipAddress,
      userAgent,
      isActive: true,
    };

    this.userSessions.push(this.currentSession);
    this.saveToStorage();

    // Log login action
    this.logAction('login', 'user', userId, { sessionId: this.currentSession.id }, 'User logged in');

    return this.currentSession;
  }

  /**
   * End the current user session
   */
  endSession(): void {
    if (this.currentSession) {
      this.currentSession.logoutTime = new Date().toISOString();
      this.currentSession.isActive = false;

      // Log logout action
      this.logAction('logout', 'user', this.currentSession.userId, { sessionId: this.currentSession.id }, 'User logged out');

      this.saveToStorage();
      this.currentSession = null;
    }
  }

  /**
   * Log a user action
   */
  logAction(
    action: AuditLogEntry['action'],
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    changes?: Record<string, any> | any,
    entityName?: string,
    metadata?: Record<string, any>
  ): AuditLogEntry {
    if (!this.currentSession) {
      throw new Error('No active user session');
    }

    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      userId: this.currentSession.userId,
      userName: this.currentSession.userName,
      action,
      entityType,
      entityId,
      entityName,
      changes,
      timestamp: new Date().toISOString(),
      ipAddress: this.currentSession.ipAddress,
      userAgent: this.currentSession.userAgent,
      sessionId: this.currentSession.id,
      success: true,
      metadata,
    };

    this.auditLogs.push(auditEntry);
    this.saveToStorage();

    // Emit audit log created event
    globalEventEmitter.emit(WMSEvents.AUDIT_LOG_CREATED, auditEntry);

    return auditEntry;
  }

  /**
   * Log an error or failed action
   */
  logError(errorMessage: string, metadata?: Record<string, any>): AuditLogEntry | null {
    if (!this.currentSession) {
      // Log error even without session for system errors
      const systemError: AuditLogEntry = {
        id: this.generateId(),
        userId: 'system',
        userName: 'System',
        action: 'view', // Generic action for errors
        entityType: 'stock', // Generic entity
        entityId: 'system_error',
        entityName: 'System Error',
        timestamp: new Date().toISOString(),
        success: false,
        errorMessage,
        metadata,
      };

      this.auditLogs.push(systemError);
      this.saveToStorage();
      return systemError;
    }

    const errorEntry: AuditLogEntry = {
      id: this.generateId(),
      userId: this.currentSession.userId,
      userName: this.currentSession.userName,
      action: 'view', // Generic action for errors
      entityType: 'stock', // Generic entity
      entityId: 'error',
      entityName: 'Error',
      timestamp: new Date().toISOString(),
      ipAddress: this.currentSession.ipAddress,
      userAgent: this.currentSession.userAgent,
      sessionId: this.currentSession.id,
      success: false,
      errorMessage,
      metadata,
    };

    this.auditLogs.push(errorEntry);
    this.saveToStorage();

    return errorEntry;
  }

  /**
   * Get audit logs with filtering options
   */
  getAuditLogs(filters?: {
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    success?: boolean;
    limit?: number;
  }): AuditLogEntry[] {
    let logs = [...this.auditLogs];

    if (filters) {
      if (filters.userId) {
        logs = logs.filter(log => log.userId === filters.userId);
      }
      if (filters.entityType) {
        logs = logs.filter(log => log.entityType === filters.entityType);
      }
      if (filters.entityId) {
        logs = logs.filter(log => log.entityId === filters.entityId);
      }
      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action);
      }
      if (filters.startDate) {
        logs = logs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter(log => log.timestamp <= filters.endDate!);
      }
      if (filters.success !== undefined) {
        logs = logs.filter(log => log.success === filters.success);
      }
    }

    // Sort by timestamp descending (most recent first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filters?.limit) {
      logs = logs.slice(0, filters.limit);
    }

    return logs;
  }

  /**
   * Get user sessions
   */
  getUserSessions(userId?: string, activeOnly = false): UserSession[] {
    let sessions = [...this.userSessions];

    if (userId) {
      sessions = sessions.filter(session => session.userId === userId);
    }

    if (activeOnly) {
      sessions = sessions.filter(session => session.isActive);
    }

    // Sort by login time descending
    sessions.sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());

    return sessions;
  }

  /**
   * Get current session
   */
  getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  /**
   * Export audit logs to CSV
   */
  exportAuditLogs(filters?: Parameters<typeof this.getAuditLogs>[0]): string {
    const logs = this.getAuditLogs(filters);

    const headers = [
      'Timestamp',
      'User ID',
      'User Name',
      'Action',
      'Entity Type',
      'Entity ID',
      'Entity Name',
      'Success',
      'Error Message',
      'IP Address',
      'Session ID'
    ];

    const csvData = logs.map(log => [
      log.timestamp,
      log.userId,
      log.userName,
      log.action,
      log.entityType,
      log.entityId,
      log.entityName || '',
      log.success.toString(),
      log.errorMessage || '',
      log.ipAddress || '',
      log.sessionId || ''
    ]);

    return [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }

  /**
   * Clean up old audit logs (keep last 90 days by default)
   */
  cleanupOldLogs(daysToKeep = 90): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const initialCount = this.auditLogs.length;
    this.auditLogs = this.auditLogs.filter(log =>
      new Date(log.timestamp) >= cutoffDate
    );

    const removedCount = initialCount - this.auditLogs.length;

    if (removedCount > 0) {
      this.saveToStorage();
      console.log(`Cleaned up ${removedCount} old audit log entries`);
    }

    return removedCount;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const auditData = localStorage.getItem('wms_audit_logs');
      if (auditData) {
        this.auditLogs = JSON.parse(auditData);
      }

      const sessionData = localStorage.getItem('wms_user_sessions');
      if (sessionData) {
        this.userSessions = JSON.parse(sessionData);
        // Find active session
        this.currentSession = this.userSessions.find(s => s.isActive) || null;
      }
    } catch (error) {
      console.error('Error loading audit trail from storage:', error);
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('wms_audit_logs', JSON.stringify(this.auditLogs));
      localStorage.setItem('wms_user_sessions', JSON.stringify(this.userSessions));
    } catch (error) {
      console.error('Error saving audit trail to storage:', error);
    }
  }
}

// Global audit trail instance
export const auditTrail = new AuditTrail();
