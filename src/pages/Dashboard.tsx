import { InventoryByCategory } from "@/components/dashboard/InventoryByCategory";
import { LowStockTable } from "@/components/dashboard/LowStockTable";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatCard } from "@/components/dashboard/StatCard";
import { StockMovementChart } from "@/components/dashboard/StockMovementChart";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Overview of your warehouse operations and inventory status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Products"
          value="2,847"
          contentType="products"
          variant="primary"
          change={{ value: 12, type: "increase" }}
        />
        <StatCard
          label="Total Stock"
          value="145,328"
          contentType="stock"
          variant="default"
          change={{ value: 8, type: "increase" }}
        />
        <StatCard
          label="Low Stock Items"
          value="23"
          contentType="low-stock"
          variant="warning"
          change={{ value: 5, type: "decrease" }}
        />
        <StatCard
          label="Out of Stock"
          value="8"
          contentType="alert"
          variant="destructive"
          change={{ value: 2, type: "increase" }}
        />
        <StatCard
          label="Today's Inbound"
          value="1,247"
          contentType="receiving"
          variant="success"
          change={{ value: 18, type: "increase" }}
        />
        <StatCard
          label="Today's Outbound"
          value="892"
          contentType="shipping"
          variant="primary"
          change={{ value: 3, type: "neutral" }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockMovementChart />
        </div>
        <div>
          <InventoryByCategory />
        </div>
      </div>

      {/* Bottom Row */}
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

export default Dashboard;
