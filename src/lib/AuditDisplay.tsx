/**
 * Audit Display Utilities
 * Consistent formatting and display of audit information across the application
 */

import React from 'react';

export interface AuditInfo {
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export const AuditDisplay: React.FC<{
  audit: AuditInfo;
  showLabels?: boolean;
  compact?: boolean;
  className?: string;
}> = ({ audit, showLabels = true, compact = false, className = "" }) => {
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const hasUpdates = audit.updatedAt && audit.updatedAt !== audit.createdAt;

  if (compact) {
    return (
      <div className={`text-xs text-muted-foreground space-y-1 ${className}`}>
        <div>Created: {formatDate(audit.createdAt)} by {audit.createdBy || 'N/A'}</div>
        {hasUpdates && (
          <div>Updated: {formatDate(audit.updatedAt)} by {audit.updatedBy || 'N/A'}</div>
        )}
        {audit.approvedAt && (
          <div className="text-green-600">
            Approved: {formatDate(audit.approvedAt)}
            {audit.approvedBy && ` by ${audit.approvedBy}`}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          {showLabels && <span className="font-medium text-muted-foreground">Created:</span>}
          <div className="text-foreground">
            {formatDateTime(audit.createdAt)}
            {audit.createdBy && (
              <span className="text-muted-foreground ml-2">by {audit.createdBy}</span>
            )}
          </div>
        </div>

        {hasUpdates && (
          <div>
            {showLabels && <span className="font-medium text-muted-foreground">Updated:</span>}
            <div className="text-foreground">
              {formatDateTime(audit.updatedAt)}
              {audit.updatedBy && (
                <span className="text-muted-foreground ml-2">by {audit.updatedBy}</span>
              )}
            </div>
          </div>
        )}

        {audit.approvedAt && (
          <div className="col-span-2">
            {showLabels && <span className="font-medium text-green-600">Approved:</span>}
            <div className="text-green-600">
              {formatDateTime(audit.approvedAt)}
              {audit.approvedBy && (
                <span className="text-muted-foreground ml-2">by {audit.approvedBy}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AuditBadge: React.FC<{
  audit: AuditInfo;
  variant?: 'created' | 'updated' | 'approved';
  size?: 'sm' | 'md';
}> = ({ audit, variant = 'created', size = 'sm' }) => {
  const getContent = () => {
    switch (variant) {
      case 'created':
        return {
          label: 'Created',
          value: audit.createdAt ? new Date(audit.createdAt).toLocaleDateString() : 'N/A',
          user: audit.createdBy
        };
      case 'updated':
        return {
          label: 'Updated',
          value: audit.updatedAt ? new Date(audit.updatedAt).toLocaleDateString() : 'N/A',
          user: audit.updatedBy
        };
      case 'approved':
        return {
          label: 'Approved',
          value: audit.approvedAt ? new Date(audit.approvedAt).toLocaleDateString() : 'N/A',
          user: audit.approvedBy
        };
    }
  };

  const content = getContent();
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <div className={`inline-flex items-center rounded-md bg-muted ${sizeClasses}`}>
      <span className="font-medium text-muted-foreground mr-2">{content.label}:</span>
      <span className="text-foreground">{content.value}</span>
      {content.user && (
        <span className="text-muted-foreground ml-2">by {content.user}</span>
      )}
    </div>
  );
};

// Utility function to get audit info from any record
export const getAuditInfo = (record: any): AuditInfo => ({
  createdBy: record.createdBy,
  createdAt: record.createdAt,
  updatedBy: record.updatedBy,
  updatedAt: record.updatedAt,
  approvedBy: record.approvedBy,
  approvedAt: record.approvedAt,
});

// Hook to format audit info for display
export const useAuditFormatter = () => {
  const formatAuditSummary = (audit: AuditInfo): string => {
    const parts = [];
    if (audit.createdAt) {
      parts.push(`Created ${new Date(audit.createdAt).toLocaleDateString()}`);
    }
    if (audit.updatedAt && audit.updatedAt !== audit.createdAt) {
      parts.push(`Updated ${new Date(audit.updatedAt).toLocaleDateString()}`);
    }
    if (audit.approvedAt) {
      parts.push(`Approved ${new Date(audit.approvedAt).toLocaleDateString()}`);
    }
    return parts.join(' • ') || 'No audit information';
  };

  return { formatAuditSummary };
};
