// App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";

// Import all your page components
import Settings from "./pages/admin/Settings";
import Users from "./pages/admin/UserManagement";
import Suppliers from "./pages/contacts/Suppliers";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Adjustments from "./pages/inventory/Adjustments";
import Overview from "./pages/inventory/Overview";
import StockBuffering from "./pages/inventory/StockBuffering";
import StockIn from "./pages/inventory/StockIn";
import StockInquiry from "./pages/inventory/StockInquiry";
import StockLocationInquiry from "./pages/inventory/StockLocationInquiry";
import StockOut from "./pages/inventory/StockOut";
import Transfers from "./pages/inventory/Transfers";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Orders from "./pages/operations/Orders";
import Receiving from "./pages/operations/Receiving";
import Returns from "./pages/operations/Returns";
import Shipping from "./pages/operations/Shipping";
import AllProducts from "./pages/products/AllProducts";
import Categories from "./pages/products/Categories";
import InventoryReport from "./pages/reports/InventoryReport";
import LowStocks from "./pages/reports/LowStocks";
import Movements from "./pages/reports/StockMovements";
import Locations from "./pages/warehouse/Locations";
import Warehouses from "./pages/warehouse/Warehouses";
import { QueryProvider } from "./providers/QueryProvider";

const App = () => (
  <QueryProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes with Layout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products/allproducts" element={<AllProducts />} />
            <Route path="/products/categories" element={<Categories />} />
            <Route path="/inventory/overview" element={<Overview />} />
            <Route path="/inventory/adjustments" element={<Adjustments />} />
            <Route path="/inventory/stock-inquiry" element={<StockInquiry />} />
            <Route path="/inventory/stock-location-inquiry" element={<StockLocationInquiry />} />
            <Route path="/inventory/stock-buffering" element={<StockBuffering />} />
            <Route path="/inventory/stock-in" element={<StockIn />} />
            <Route path="/inventory/stock-out" element={<StockOut />} />
            <Route path="/inventory/transfers" element={<Transfers />} />
            <Route path="/warehouse/warehouses" element={<Warehouses />} />
            <Route path="/warehouse/locations" element={<Locations />} />
            <Route path="/operations/receiving" element={<Receiving />} />
            <Route path="/operations/shipping" element={<Shipping />} />
            <Route path="/operations/returns" element={<Returns />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/reports/movements" element={<Movements />} />
            <Route path="/reports/low-stocks" element={<LowStocks />} />
            <Route path="/reports/inventory" element={<InventoryReport />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryProvider>
);

export default App;
