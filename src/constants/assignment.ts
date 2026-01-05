/**
 * Assignment constants - categories, suppliers, and staff data
 */

// Categories for stock buffering and assignments
export const BRANDS = ["BW", "KLIK", "OMG", "ORO"] as const;

export const BRAND_OPTIONS = BRANDS.map(brand => ({ value: brand, label: brand }));

export const CATEGORIES = [
  "Paint",
  "Ink",
  "Paper",
  "Supplies",
  "Chemicals",
  "Hardware",
  "Electronics",
  "Furniture",
  "Office Supplies"
] as const;

export const CATEGORY_OPTIONS = CATEGORIES.map(category => ({ value: category, label: category }));

// Staff members for assignments
export const STAFF_MEMBERS = [
  { value: "John Doe", label: "John Doe" },
  { value: "Jane Smith", label: "Jane Smith" },
  { value: "Robert Garcia", label: "Robert Garcia" },
  { value: "Alice Williams", label: "Alice Williams" },
  { value: "Michael Brown", label: "Michael Brown" },
  { value: "Sarah Davis", label: "Sarah Davis" },
  { value: "David Wilson", label: "David Wilson" },
  { value: "Maria Rodriguez", label: "Maria Rodriguez" },
];

// Staff counts for different roles
export const DEFAULT_STAFF_COUNT = {
  PICKERS: 12,
  BARCODERS: 8,
  TAGGERS: 5,
  CHECKERS: 4,
  DRIVERS: 3,
} as const;

// Suppliers for purchase orders and deliveries
export const SUPPLIERS = [
  {
    code: "SUP-001",
    name: "TechPro Solutions",
    companyName: "TechPro Philippines Inc.",
    type: "Local" as const,
    company: "Main Corp",
  },
  {
    code: "SUP-002",
    name: "Global Supplies Ltd",
    companyName: "Global Supplies Philippines",
    type: "International" as const,
    company: "Global Corp",
  },
  {
    code: "SUP-003",
    name: "Local Distributors Inc",
    companyName: "Local Distributors Philippines",
    type: "Local" as const,
    company: "Local Corp",
  },
];

export const SUPPLIER_OPTIONS = SUPPLIERS.map(supplier => ({
  value: supplier.name,
  label: supplier.name
}));

// Warehouses for transfers and assignments
export const WAREHOUSES = [
  {
    code: "WH-MAIN",
    name: "Main Warehouse",
    type: "Main" as const,
    location: "Taguig",
  },
  {
    code: "WH-PROD",
    name: "TSD / Production",
    type: "Production" as const,
    location: "Cavite",
  },
  {
    code: "WH-RET",
    name: "Retail Outlet",
    type: "Branch" as const,
    location: "Makati",
  },
  {
    code: "WH-BULK",
    name: "Bulk Storage",
    type: "Branch" as const,
    location: "Mandaue",
  },
];

export const WAREHOUSE_OPTIONS = WAREHOUSES.map(warehouse => ({
  value: warehouse.name,
  label: warehouse.name
}));

// Customers for sales orders
export const CUSTOMERS = [
  {
    code: "SM001",
    name: "SM Supermarket",
    company: "SM Prime Holdings",
    address: "Mandaluyong",
    type: "Retail" as const,
  },
  {
    code: "RR001",
    name: "Robinsons Retail",
    company: "Robinsons Land",
    address: "Ortigas",
    type: "Retail" as const,
  },
  {
    code: "PC001",
    name: "Puregold Price Club",
    company: "Puregold",
    address: "Manila",
    type: "Wholesale" as const,
  },
  {
    code: "AM001",
    name: "Ayala Malls",
    company: "Ayala Corporation",
    address: "Makati",
    type: "Retail" as const,
  },
];

export const CUSTOMER_OPTIONS = CUSTOMERS.map(customer => ({
  value: customer.name,
  label: customer.name
}));
