/**
 * UI constants - colors, sizes, limits, etc.
 */

export const PAGINATION_LIMITS = [5, 10, 25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 10;

export const STATUS_COLORS = {
  // Generic status colors
  active: "status-active",
  warning: "status-warning",
  pending: "status-pending",
  muted: "status-muted",
  success: "status-success",

  // Specific status mappings
  "Open": "status-pending",
  "Pending": "status-warning",
  "Approved": "status-active",
  "Done": "status-active",
  "Received": "status-success",
  "Assigned": "status-warning",
  "Picking": "status-pending",
  "Picked": "status-active",
  "Scanning": "status-pending",
  "Scanned": "status-active",
  "Tagging": "status-pending",
  "Tagged": "status-active",
  "Checking": "status-pending",
  "Checked": "status-active",
  "On Delivery": "status-pending",
  "Delivered": "status-active",
  "For Approval": "status-warning",
  "No Assignment": "status-muted",
} as const;

export const PRIORITY_COLORS = {
  "High": {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: "⚡"
  },
  "Medium": {
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: ""
  },
  "Low": {
    bg: "bg-gray-100",
    text: "text-gray-700",
    icon: ""
  },
} as const;

export const PROGRESS_COLORS = {
  complete: "bg-success",
  partial: "bg-warning",
  none: "bg-muted",
} as const;
