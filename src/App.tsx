import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Import all your page components
import AllProducts from "./pages/AllProducts";
import Categories from "./pages/Categories";
import Inventory from "./pages/Inventory";
import Locations from "./pages/Locations";
import LowStocks from "./pages/LowStocks";
import Orders from "./pages/Orders";
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
            <Route path="/products" element={<AllProducts />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/stock-in" element={<StockIn />} />
            <Route path="/stock-out" element={<StockOut />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/receiving" element={<Receiving />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/movements" element={<Movements />} />
            <Route path="/low-stocks" element={<LowStocks />} />
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
