// App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";

// Import all your page components
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import InventoryReport from "./pages/InventoryReport";
import Locations from "./pages/Locations";
import Login from "./pages/Login";
import LowStocks from "./pages/LowStocks";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import Overview from "./pages/Overview";
import AllProducts from "./pages/products/AllProducts";
import Categories from "./pages/products/Categories";
import Receiving from "./pages/Receiving";
import Returns from "./pages/Returns";
import Settings from "./pages/Settings";
import Shipping from "./pages/Shipping";
import StockIn from "./pages/StockIn";
import Movements from "./pages/StockMovements";
import StockOut from "./pages/StockOut";
import Suppliers from "./pages/Suppliers";
import Transfers from "./pages/Transfers";
import Users from "./pages/UserManagement";
import Warehouses from "./pages/Warehouses";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>
);

export default App;
