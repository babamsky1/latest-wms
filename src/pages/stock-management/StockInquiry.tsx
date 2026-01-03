/**
 * Stock Inquiry Page - READ-ONLY
 * 
 * Spec:
 * ✅ READ-ONLY (No create/update/delete)
 * ✅ Columns: PSC, AN #, Barcode, Description, Brand (BW, KLIK, OMG, ORO), Item Group, Color
 * ✅ Rule: No editing, no posting, no manual quantity changes
 */

import { StatCard } from "@/components/dashboard/StatCard";
import { DevBadge } from "@/components/dev/DevTools";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { useWms } from "@/context/WmsContext";
import { Layers, Package, Tag } from "lucide-react";

interface StockRecord {
  id: string;
  psc: string;
  anNo: string;
  barcode: string;
  description: string;
  brand: "BW" | "KLIK" | "OMG" | "ORO";
  itemGroup: string;
  color: string;
  quantity: number;
  isTestData?: boolean;
}

export default function StockInquiry() {
  const { items } = useWms();

  // Map shared items to the StockRecord format used on this page
  const stockData: StockRecord[] = items.map(item => ({
    id: item.id,
    psc: item.psc,
    anNo: item.subId || "N/A", // Using subId as placeholder for AN #
    barcode: item.barcode,
    description: item.shortDescription,
    brand: item.brand,
    itemGroup: item.group,
    color: item.color,
    quantity: item.isTestData ? Math.floor(Math.random() * 5000) : 0, // Mock quantity for dev data
    isTestData: item.isTestData
  }));
  const columns: ColumnDef<StockRecord>[] = [
    {
      key: "psc",
      label: "PSC",
      className: "font-mono font-bold text-primary",
    },
    {
      key: "anNo",
      label: "AN #",
      className: "font-mono",
    },
    {
      key: "barcode",
      label: "Barcode",
      className: "font-mono text-muted-foreground",
    },
    {
      key: "description",
      label: "Description",
      className: "font-medium",
      render: (row) => (
        <div className="flex items-center">
          {row.description}
          {row.isTestData && <DevBadge />}
        </div>
      )
    },
    {
      key: "brand",
      label: "Brand",
      render: (row) => (
        <Badge variant="outline" className="font-bold">
          {row.brand}
        </Badge>
      ),
    },
    {
      key: "itemGroup",
      label: "Item Group",
    },
    {
      key: "color",
      label: "Color",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full border border-muted" 
            style={{ backgroundColor: row.color.toLowerCase() === 'multi' ? 'transparent' : row.color.toLowerCase() }}
          />
          {row.color}
        </div>
      ),
    },
    {
      key: "quantity",
      label: "System Balance",
      className: "font-bold",
      render: (row) => row.quantity.toLocaleString(),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Inquiry</h1>
          <p className="page-description">View real-time balances derived from transaction history</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="secondary" className="px-3 py-1">READ-ONLY</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total PSCs"
          value={stockData.length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          label="Stocked Brands"
          value={new Set(stockData.map(s => s.brand)).size}
          icon={Tag}
          variant="info"
        />
        <StatCard
          label="Active Groups"
          value={new Set(stockData.map(s => s.itemGroup)).size}
          icon={Layers}
          variant="success"
        />
      </div>

      <DataTable
        data={stockData}
        columns={columns}
        searchPlaceholder="Search by PSC, AN #, Barcode, or Description..."
        defaultPageSize={10}
        emptyMessage="No stock records found."
      />

      <div className="p-4 bg-muted/30 border border-dashed rounded-lg text-xs text-muted-foreground italic text-center">
        Note: Quantities are system-computed and cannot be manually adjusted on this page.
      </div>
    </div>
  );
}
