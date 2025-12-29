import { InventoryByCategory } from "@/components/dashboard/InventoryByCategory";
import { LowStockTable } from "@/components/dashboard/LowStockTable";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatCard } from "@/components/dashboard/StatCard";
import { StockMovementChart } from "@/components/dashboard/StockMovementChart";
import { AlertTriangle, Boxes, Package, PackageMinus, TrendingDown, TruckIcon, Warehouse, Users } from "lucide-react";

const Overview = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <p className="page-description">
          Quick snapshot of your warehouse operations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value="2,847"
          icon={Package}
          iconColor="text-primary"
          change={{ value: 12, type: "increase" }}
        />
        <StatCard
          title="Active Warehouses"
          value="3"
          icon={Warehouse}
          iconColor="text-info"
        />
        <StatCard
          title="Low Stock Alerts"
          value="23"
          icon={AlertTriangle}
          iconColor="text-warning"
          change={{ value: 5, type: "decrease" }}
        />
        <StatCard
          title="Active Users"
          value="12"
          icon={Users}
          iconColor="text-success"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Stock Units"
          value="145,328"
          icon={Boxes}
          iconColor="text-primary"
          change={{ value: 8, type: "increase" }}
        />
        <StatCard
          title="Out of Stock"
          value="8"
          icon={TrendingDown}
          iconColor="text-destructive"
          change={{ value: 2, type: "increase" }}
        />
        <StatCard
          title="Today's Inbound"
          value="1,247"
          icon={TruckIcon}
          iconColor="text-success"
          change={{ value: 18, type: "increase" }}
        />
        <StatCard
          title="Today's Outbound"
          value="892"
          icon={PackageMinus}
          iconColor="text-primary"
          change={{ value: 3, type: "neutral" }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockMovementChart />
        </div>
        <div>
          <InventoryByCategory />
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LowStockTable />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Overview;
