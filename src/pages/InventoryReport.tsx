import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Download,
  FileText,
  Filter,
  Package,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface ReportItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  openingStock: number;
  stockIn: number;
  stockOut: number;
  adjustments: number;
  closingStock: number;
  value: number;
}

const reportData: ReportItem[] = [
  { id: "1", sku: "WGT-A123", name: "Widget A-123", category: "Electronics", openingStock: 400, stockIn: 150, stockOut: 100, adjustments: 0, closingStock: 450, value: 4500.0 },
  { id: "2", sku: "CMP-B456", name: "Component B-456", category: "Components", openingStock: 50, stockIn: 100, stockOut: 122, adjustments: 0, closingStock: 28, value: 560.0 },
  { id: "3", sku: "RAW-C789", name: "Raw Material C-789", category: "Raw Materials", openingStock: 1000, stockIn: 500, stockOut: 300, adjustments: -50, closingStock: 1150, value: 11500.0 },
  { id: "4", sku: "ELC-E345", name: "Electronic E-345", category: "Electronics", openingStock: 800, stockIn: 200, stockOut: 144, adjustments: 0, closingStock: 856, value: 8560.0 },
  { id: "5", sku: "MCH-F678", name: "Machine Part F-678", category: "Machinery", openingStock: 200, stockIn: 50, stockOut: 16, adjustments: 0, closingStock: 234, value: 2340.0 },
  { id: "6", sku: "PKG-H234", name: "Packaging H-234", category: "Packaging", openingStock: 1200, stockIn: 800, stockOut: 500, adjustments: 0, closingStock: 1500, value: 3000.0 },
];

const InventoryReport = () => {
  const [reportType, setReportType] = useState("stock-summary");
  const [period, setPeriod] = useState("this-month");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered data
  const filteredData = reportData.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);
  const totalItems = filteredData.reduce((sum, item) => sum + item.closingStock, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Inventory Reports</h1>
            <p className="page-description">Generate and analyze inventory reports</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Total Items</p>
              <p className="stat-value">{totalItems.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Stock In</p>
              <p className="stat-value">
                {filteredData.reduce((sum, item) => sum + item.stockIn, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <TrendingDown className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Stock Out</p>
              <p className="stat-value">
                {filteredData.reduce((sum, item) => sum + item.stockOut, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <FileText className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="stat-label">Total Value</p>
              <p className="stat-value">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="content-section">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by SKU, name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stock-summary">Stock Summary</SelectItem>
              <SelectItem value="movement">Stock Movement</SelectItem>
              <SelectItem value="valuation">Inventory Valuation</SelectItem>
              <SelectItem value="aging">Aging Report</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Report Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Opening</TableHead>
              <TableHead>Stock In</TableHead>
              <TableHead>Stock Out</TableHead>
              <TableHead>Adjustments</TableHead>
              <TableHead>Closing</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{item.sku}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">{item.category}</Badge>
                </TableCell>
                <TableCell className="text-left">{item.openingStock.toLocaleString()}</TableCell>
                <TableCell className="text-left text-success">+{item.stockIn.toLocaleString()}</TableCell>
                <TableCell className="text-left text-destructive">-{item.stockOut.toLocaleString()}</TableCell>
                <TableCell className="text-left">
                  <span className={item.adjustments < 0 ? "text-destructive" : item.adjustments > 0 ? "text-success" : ""}>
                    {item.adjustments !== 0 ? (item.adjustments > 0 ? `+${item.adjustments}` : item.adjustments) : "0"}
                  </span>
                </TableCell>
                <TableCell className="text-left font-semibold">{item.closingStock.toLocaleString()}</TableCell>
                <TableCell className="text-left font-semibold">${item.value.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredData.length} items
        </p>
      </div>
    </div>
  );
};

export default InventoryReport;
