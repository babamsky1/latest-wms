/**
 * Staff constants - centralized staff data
 */

export const STAFF_MEMBERS = [
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Robert Garcia", label: "Robert Garcia" },
  { value: "Alice Williams", label: "Alice Williams" },
  { value: "Michael Brown", label: "Michael Brown" },
];

export const DEFAULT_STAFF_COUNT = {
  PICKERS: 12,
  BARCODERS: 8,
  TAGGERS: 5,
  CHECKERS: 4,
  DRIVERS: 3,
} as const;

export const ADMIN_USER = {
  name: "John Doe",
  title: "Warehouse Manager",
  email: "admin@wms.com",
} as const;
