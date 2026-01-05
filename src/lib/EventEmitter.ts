/**
 * Event-driven architecture implementation
 * Replaces setTimeout-based polling with proper event emission
 */

export interface EventData {
  [key: string]: any;
}

export interface EventListener<T = EventData> {
  (data: T): void;
}

export class EventEmitter {
  private listeners: Map<string, EventListener[]> = new Map();

  /**
   * Register an event listener
   */
  on<T = EventData>(event: string, listener: EventListener<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener as EventListener);
  }

  /**
   * Remove an event listener
   */
  off<T = EventData>(event: string, listener: EventListener<T>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener as EventListener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event to all registered listeners
   */
  emit<T = EventData>(event: string, data?: T): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for '${event}':`, error);
        }
      });
    }
  }

  /**
   * Register a one-time event listener
   */
  once<T = EventData>(event: string, listener: EventListener<T>): void {
    const onceListener = (data: T) => {
      this.off(event, onceListener);
      listener(data);
    };
    this.on(event, onceListener);
  }

  /**
   * Remove all listeners for an event or all events
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount(event: string): number {
    return this.listeners.get(event)?.length || 0;
  }

  /**
   * Get all event names that have listeners
   */
  eventNames(): string[] {
    return Array.from(this.listeners.keys());
  }
}

// Global event emitter instance
export const globalEventEmitter = new EventEmitter();

// Common WMS events
export const WMSEvents = {
  // Assignment events
  ASSIGNMENT_COMPLETED: 'assignment:completed',
  ASSIGNMENT_CREATED: 'assignment:created',
  ASSIGNMENT_UPDATED: 'assignment:updated',

  // Stock events
  STOCK_UPDATED: 'stock:updated',
  STOCK_LEDGER_UPDATED: 'stock:ledger:updated',

  // Order events
  ORDER_STATUS_CHANGED: 'order:status:changed',
  ORDER_COMPLETED: 'order:completed',

  // Inventory events
  INVENTORY_ADJUSTED: 'inventory:adjusted',
  INVENTORY_COUNTED: 'inventory:counted',

  // Audit events
  AUDIT_LOG_CREATED: 'audit:log:created',

  // Error events
  ERROR_OCCURRED: 'error:occurred',
  VALIDATION_FAILED: 'validation:failed',

  // UI events
  NOTIFICATION_SHOWN: 'notification:shown',
  MODAL_OPENED: 'modal:opened',
  MODAL_CLOSED: 'modal:closed',
} as const;
