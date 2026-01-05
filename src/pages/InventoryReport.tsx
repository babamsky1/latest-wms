import { StatCard } from "@/components/dashboard/StatCard";
import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWms } from "@/hooks/useWms";
import {
  Calendar,
  Download,
  FileText,
  Filter,
  Package,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

const InventoryReport = () => {
  const { items, deliveries, withdrawals, transfers, adjustments } = useWms();
  const [reportType, setReportType] = useState("stock-summary");
  const [period, setPeriod] = useState("this-month");

  // Generate report data from actual transactions
  const reportData = items.map(item => {
    // Calculate stock movements from various sources
    const stockIn = deliveries.filter(d => d.itemCode === item.psc).reduce((sum, d) => sum + d.quantity, 0);
    const stockOut = withdrawals.filter(w => w.psc === item.psc).reduce((sum, w) => sum + 1, 0); // Simplified
    const adj = adjustments.filter(a => a.psc === item.psc).length; // Simplified

    return {
      id: item.id,
      sku: item.psc,
      name: item.shortDescription,
      category: item.category,
      openingStock: 0, // Would need historical data
      stockIn,
      stockOut,
      adjustments: adj,
      closingStock: Math.max(0, stockIn - stockOut + adj),
      value: (stockIn - stockOut + adj) * item.cost,
    };
  });

  const totalValue = reportData.reduce((sum, item) => sum + item.value, 0);
  const totalItems = reportData.reduce((sum, item) => sum + item.closingStock, 0);

  const columns: ColumnDef<ReportItem>[] = [
    {
      key: "sku",
      label: "SKU",
      className: "font-mono font-medium",
    },
    {
      key: "name",
      label: "Product Name",
      className: "font-medium",
    },
    {
      key: "category",
      label: "Category",
      render: (row) => (
        <Badge variant="outline" className="font-normal">{row.category}</Badge>
      ),
    },
    {
      key: "openingStock",
      label: "Opening",
      className: "text-left",
      render: (row) => row.openingStock.toLocaleString(),
    },
    {
      key: "stockIn",
      label: "Stock In",
      className: "text-left text-success",
      render: (row) => `+${row.stockIn.toLocaleString()}`,
    },
    {
      key: "stockOut",
      label: "Stock Out",
      className: "text-left text-destructive",
      render: (row) => `-${row.stockOut.toLocaleString()}`,
    },
    {
      key: "adjustments",
      label: "Adjustments",
      className: "text-left",
      render: (row) => (
        <span className={row.adjustments < 0 ? "text-destructive" : row.adjustments > 0 ? "text-success" : ""}>
          {row.adjustments !== 0 ? (row.adjustments > 0 ? `+${row.adjustments}` : row.adjustments) : "0"}
        </span>
      ),
    },
    {
      key: "closingStock",
      label: "Closing",
      className: "text-left font-semibold",
      render: (row) => row.closingStock.toLocaleString(),
    },
    {
      key: "value",
      label: "Value",
      className: "text-left font-semibold",
      render: (row) => `$${row.value.toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Items"
          value={totalItems.toLocaleString()}
          icon={Package}
          variant="primary"
        />
        <StatCard
          label="Stock In"
          value={reportData.reduce((sum, item) => sum + item.stockIn, 0).toLocaleString()}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          label="Stock Out"
          value={reportData.reduce((sum, item) => sum + item.stockOut, 0).toLocaleString()}
          icon={TrendingDown}
          variant="warning"
        />
        <StatCard
          label="Total Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={FileText}
          variant="info"
        />
      </div>

      {/* Filters */}
      <div className="content-section">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
             {/* Search handled by DataTable */}
            <div className="flex items-center gap-2">
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
        </div>
      </div>

      <DataTable
        data={reportData}
        columns={columns}
        searchPlaceholder="Search by SKU, name, or category..."
        actions={(row) => (
          <ActionMenu>
            <Button size="sm" variant="ghost" className="text-blue-600">
              View Details
            </Button>
            <Button size="sm" variant="ghost" className="text-green-600">
              Export Item
            </Button>
          </ActionMenu>
        )}
      />
    </div>
  );
};

export default InventoryReport;
