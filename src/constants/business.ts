/**
 * Business constants - customers, brands, categories, etc.
 */

export const BRANDS = ["BW", "KLIK", "OMG", "ORO"] as const;

export const BRAND_OPTIONS = BRANDS.map(brand => ({ value: brand, label: brand }));

export const CATEGORIES = [
  "Paint",
  "Ink",
  "Paper",
  "Supplies",
  "Chemicals",
] as const;

export const CATEGORY_OPTIONS = CATEGORIES.map(category => ({ value: category, label: category }));

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
] as const;

export const CUSTOMER_OPTIONS = CUSTOMERS.map(customer => ({
  value: customer.name,
  label: customer.name
}));

export const SUPPLIERS = [
  {
    code: "SUP-001",
    name: "TechPro Solutions",
    companyName: "TechPro Philippines Inc.",
    type: "Local" as const,
    company: "Main Corp",
  },
] as const;

export const SUPPLIER_OPTIONS = SUPPLIERS.map(supplier => ({
  value: supplier.supplierCode,
  label: supplier.supplierName
}));

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
] as const;

export const WAREHOUSE_OPTIONS = WAREHOUSES.map(warehouse => ({
  value: warehouse.name,
  label: warehouse.name
}));

export const TRANSFER_TYPES = [
  { value: "Local", label: "Local" },
  { value: "International", label: "International" },
] as const;

export const PRIORITIES = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
] as const;

export const SUPPLIER_TYPES = [
  { value: "Local", label: "Local" },
  { value: "International", label: "International" },
] as const;

export const CUSTOMER_TYPES = [
  { value: "Retail", label: "Retail" },
  { value: "Wholesale", label: "Wholesale" },
  { value: "Distributor", label: "Distributor" },
] as const;

export const WAREHOUSE_TYPES = [
  { value: "Main", label: "Main" },
  { value: "Branch", label: "Branch" },
  { value: "Production", label: "Production" },
  { value: "Third Party", label: "Third Party" },
] as const;
