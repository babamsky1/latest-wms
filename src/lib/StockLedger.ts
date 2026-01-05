/**
 * Stock Ledger System - Sophisticated inventory tracking with location-specific stock
 * Provides audit trail and real-time stock balance calculations
 */

import { StockLedgerEntry, StockBalance, StockLocation, StockReservation } from '@/types/wms';
import { globalEventEmitter, WMSEvents } from './EventEmitter';

export class StockLedger {
  private ledger: StockLedgerEntry[] = [];
  private balances: Map<string, StockBalance> = new Map(); // key: productId_warehouseId_locationId
  private reservations: StockReservation[] = [];

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Record a stock transaction
   */
  recordTransaction(entry: Omit<StockLedgerEntry, 'id' | 'previousBalance' | 'newBalance' | 'transactionDate'>): StockLedgerEntry {
    const balanceKey = this.getBalanceKey(entry.productId, entry.location.warehouseId, entry.location.locationId);

    // Get current balance
    const currentBalance = this.balances.get(balanceKey)?.totalQuantity || 0;
    const previousBalance = currentBalance;

    // Calculate new balance
    let newBalance = previousBalance;
    switch (entry.transactionType) {
      case 'in':
      case 'transfer_in':
        newBalance = previousBalance + entry.quantity;
        break;
      case 'out':
      case 'transfer_out':
        newBalance = previousBalance - entry.quantity;
        break;
      case 'adjustment':
        // For adjustments, quantity can be positive or negative
        newBalance = previousBalance + entry.quantity;
        break;
      case 'count':
        // Physical count replaces the balance
        newBalance = entry.quantity;
        break;
    }

    // Create ledger entry
    const ledgerEntry: StockLedgerEntry = {
      ...entry,
      id: this.generateId(),
      previousBalance,
      newBalance,
      transactionDate: new Date().toISOString(),
    };

    // Add to ledger
    this.ledger.push(ledgerEntry);

    // Update balance
    this.updateBalance(ledgerEntry);

    // Save to storage
    this.saveToStorage();

    // Emit event
    globalEventEmitter.emit(WMSEvents.STOCK_LEDGER_UPDATED, {
      entry: ledgerEntry,
      previousBalance,
      newBalance,
    });

    return ledgerEntry;
  }

  /**
   * Get current stock balance for a specific location
   */
  getStockBalance(productId: string, warehouseId: string, locationId?: string): StockBalance | null {
    const balanceKey = this.getBalanceKey(productId, warehouseId, locationId);
    return this.balances.get(balanceKey) || null;
  }

  /**
   * Get total stock balance across all locations for a product and warehouse
   */
  getTotalStockBalance(productId: string, warehouseId: string): StockBalance | null {
    const warehouseBalances = Array.from(this.balances.values())
      .filter(balance => balance.productId === productId && balance.warehouseId === warehouseId);

    if (warehouseBalances.length === 0) return null;

    const totalAvailable = warehouseBalances.reduce((sum, b) => sum + b.availableQuantity, 0);
    const totalReserved = warehouseBalances.reduce((sum, b) => sum + b.reservedQuantity, 0);
    const latestUpdate = warehouseBalances.reduce((latest, b) =>
      b.lastUpdated > latest ? b.lastUpdated : latest, '');

    return {
      productId,
      warehouseId,
      availableQuantity: totalAvailable,
      reservedQuantity: totalReserved,
      totalQuantity: totalAvailable + totalReserved,
      lastUpdated: latestUpdate,
      lastUpdatedBy: warehouseBalances.find(b => b.lastUpdated === latestUpdate)?.lastUpdatedBy || '',
    };
  }

  /**
   * Reserve stock for future use (e.g., sales order)
   */
  reserveStock(reservation: Omit<StockReservation, 'id' | 'reservedAt' | 'status'>): StockReservation {
    const balanceKey = this.getBalanceKey(
      reservation.productId,
      reservation.location.warehouseId,
      reservation.location.locationId
    );

    const balance = this.balances.get(balanceKey);
    if (!balance || balance.availableQuantity < reservation.quantity) {
      throw new Error('Insufficient stock available for reservation');
    }

    const stockReservation: StockReservation = {
      ...reservation,
      id: this.generateId(),
      reservedAt: new Date().toISOString(),
      status: 'active',
    };

    // Update balance to reflect reservation
    balance.reservedQuantity += reservation.quantity;
    balance.availableQuantity -= reservation.quantity;
    balance.lastUpdated = new Date().toISOString();
    balance.lastUpdatedBy = reservation.reservedBy;

    this.reservations.push(stockReservation);
    this.saveToStorage();

    return stockReservation;
  }

  /**
   * Release a stock reservation
   */
  releaseReservation(reservationId: string, releasedBy: string): void {
    const reservation = this.reservations.find(r => r.id === reservationId);
    if (!reservation || reservation.status !== 'active') {
      throw new Error('Reservation not found or not active');
    }

    const balanceKey = this.getBalanceKey(
      reservation.productId,
      reservation.location.warehouseId,
      reservation.location.locationId
    );

    const balance = this.balances.get(balanceKey);
    if (balance) {
      balance.reservedQuantity -= reservation.quantity;
      balance.availableQuantity += reservation.quantity;
      balance.lastUpdated = new Date().toISOString();
      balance.lastUpdatedBy = releasedBy;
    }

    reservation.status = 'released';
    this.saveToStorage();
  }

  /**
   * Get ledger entries for a product
   */
  getLedgerEntries(productId: string, warehouseId?: string, limit = 50): StockLedgerEntry[] {
    return this.ledger
      .filter(entry =>
        entry.productId === productId &&
        (!warehouseId || entry.location.warehouseId === warehouseId)
      )
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, limit);
  }

  /**
   * Get all active reservations for a product
   */
  getActiveReservations(productId: string): StockReservation[] {
    return this.reservations.filter(r =>
      r.productId === productId && r.status === 'active'
    );
  }

  /**
   * Check if sufficient stock is available
   */
  checkAvailability(productId: string, warehouseId: string, quantity: number, locationId?: string): boolean {
    const balance = locationId
      ? this.getStockBalance(productId, warehouseId, locationId)
      : this.getTotalStockBalance(productId, warehouseId);

    return balance ? balance.availableQuantity >= quantity : false;
  }

  /**
   * Generate unique ID for ledger entries
   */
  private generateId(): string {
    return `LEDGER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get balance key for Map lookup
   */
  private getBalanceKey(productId: string, warehouseId: string, locationId?: string): string {
    return `${productId}_${warehouseId}_${locationId || 'default'}`;
  }

  /**
   * Update stock balance from ledger entry
   */
  private updateBalance(entry: StockLedgerEntry): void {
    const balanceKey = this.getBalanceKey(entry.productId, entry.location.warehouseId, entry.location.locationId);

    const existingBalance = this.balances.get(balanceKey);

    if (existingBalance) {
      existingBalance.totalQuantity = entry.newBalance;
      existingBalance.availableQuantity = entry.newBalance - existingBalance.reservedQuantity;
      existingBalance.lastUpdated = entry.transactionDate;
      existingBalance.lastUpdatedBy = entry.performedBy;
    } else {
      this.balances.set(balanceKey, {
        productId: entry.productId,
        warehouseId: entry.location.warehouseId,
        locationId: entry.location.locationId,
        availableQuantity: entry.newBalance, // Initially no reservations
        reservedQuantity: 0,
        totalQuantity: entry.newBalance,
        lastUpdated: entry.transactionDate,
        lastUpdatedBy: entry.performedBy,
      });
    }
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const ledgerData = localStorage.getItem('wms_stock_ledger');
      if (ledgerData) {
        this.ledger = JSON.parse(ledgerData);
      }

      const balanceData = localStorage.getItem('wms_stock_balances');
      if (balanceData) {
        const balancesArray = JSON.parse(balanceData);
        this.balances = new Map(balancesArray);
      }

      const reservationData = localStorage.getItem('wms_stock_reservations');
      if (reservationData) {
        this.reservations = JSON.parse(reservationData);
      }
    } catch (error) {
      console.error('Error loading stock ledger from storage:', error);
    }
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('wms_stock_ledger', JSON.stringify(this.ledger));
      localStorage.setItem('wms_stock_balances', JSON.stringify(Array.from(this.balances.entries())));
      localStorage.setItem('wms_stock_reservations', JSON.stringify(this.reservations));
    } catch (error) {
      console.error('Error saving stock ledger to storage:', error);
    }
  }

  /**
   * Clean up expired reservations
   */
  cleanupExpiredReservations(): void {
    const now = new Date();
    const expiredReservations = this.reservations.filter(r =>
      r.expiresAt && new Date(r.expiresAt) < now && r.status === 'active'
    );

    expiredReservations.forEach(reservation => {
      reservation.status = 'expired';
      // Release the stock back to available
      const balanceKey = this.getBalanceKey(
        reservation.productId,
        reservation.location.warehouseId,
        reservation.location.locationId
      );

      const balance = this.balances.get(balanceKey);
      if (balance) {
        balance.reservedQuantity -= reservation.quantity;
        balance.availableQuantity += reservation.quantity;
      }
    });

    if (expiredReservations.length > 0) {
      this.saveToStorage();
    }
  }
}

// Global stock ledger instance
export const stockLedger = new StockLedger();
