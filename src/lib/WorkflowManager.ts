/**
 * Workflow Manager - Event-driven workflow orchestration
 * Replaces setTimeout-based sequential operations
 */

import { globalEventEmitter, WMSEvents } from './EventEmitter';

export interface WorkflowStep {
  id: string;
  name: string;
  action: () => Promise<void> | void;
  dependsOn?: string[]; // IDs of steps that must complete first
  timeout?: number; // Max time to wait for completion
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export class WorkflowManager {
  private workflows: Map<string, Workflow> = new Map();
  private activeWorkflows: Map<string, Set<string>> = new Map(); // workflowId -> completed steps
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    // Listen for assignment completion events
    globalEventEmitter.on(WMSEvents.ASSIGNMENT_COMPLETED, (data) => {
      this.handleAssignmentCompleted(data);
    });
  }

  /**
   * Register a workflow
   */
  registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string): Promise<void> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow '${workflowId}' not found`);
    }

    try {
      // Initialize workflow tracking
      this.activeWorkflows.set(workflowId, new Set());

      // Execute steps in dependency order
      const executedSteps = new Set<string>();
      const pendingSteps = [...workflow.steps];

      while (pendingSteps.length > 0) {
        const readySteps = pendingSteps.filter(step =>
          !step.dependsOn ||
          step.dependsOn.every(dep => executedSteps.has(dep))
        );

        if (readySteps.length === 0) {
          throw new Error('Circular dependency or missing dependency detected');
        }

        // Execute ready steps in parallel
        await Promise.all(readySteps.map(async (step) => {
          try {
            await step.action();
            executedSteps.add(step.id);

            // Set timeout if specified
            if (step.timeout) {
              const timeoutId = setTimeout(() => {
                console.warn(`Workflow step '${step.id}' timed out after ${step.timeout}ms`);
                this.timeouts.delete(`${workflowId}:${step.id}`);
              }, step.timeout);
              this.timeouts.set(`${workflowId}:${step.id}`, timeoutId);
            }

          } catch (error) {
            console.error(`Error in workflow step '${step.id}':`, error);
            throw error;
          }
        }));

        // Remove executed steps from pending
        readySteps.forEach(step => {
          const index = pendingSteps.indexOf(step);
          if (index > -1) {
            pendingSteps.splice(index, 1);
          }
        });
      }

      // Workflow completed successfully
      workflow.onComplete?.();
      globalEventEmitter.emit(WMSEvents.ASSIGNMENT_COMPLETED, {
        workflowId,
        status: 'completed'
      });

    } catch (error) {
      workflow.onError?.(error as Error);
      globalEventEmitter.emit(WMSEvents.ERROR_OCCURRED, {
        workflowId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    } finally {
      // Cleanup
      this.activeWorkflows.delete(workflowId);
      // Clear any remaining timeouts for this workflow
      this.timeouts.forEach((timeout, key) => {
        if (key.startsWith(`${workflowId}:`)) {
          clearTimeout(timeout);
          this.timeouts.delete(key);
        }
      });
    }
  }

  /**
   * Handle assignment completion events
   */
  private handleAssignmentCompleted(data: any): void {
    // Logic to handle completion events and trigger next steps
    console.log('Assignment completed:', data);
  }

  /**
   * Cancel a running workflow
   */
  cancelWorkflow(workflowId: string): void {
    this.activeWorkflows.delete(workflowId);

    // Clear timeouts for this workflow
    this.timeouts.forEach((timeout, key) => {
      if (key.startsWith(`${workflowId}:`)) {
        clearTimeout(timeout);
        this.timeouts.delete(key);
      }
    });
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(workflowId: string): { completed: string[], total: number } | null {
    const completed = this.activeWorkflows.get(workflowId);
    const workflow = this.workflows.get(workflowId);

    if (!completed || !workflow) {
      return null;
    }

    return {
      completed: Array.from(completed),
      total: workflow.steps.length
    };
  }
}

// Global workflow manager instance
export const workflowManager = new WorkflowManager();
