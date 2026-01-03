// App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Routes } from "react-router-dom";
import { DevTools } from "./components/dev/DevTools";
import { MainLayout } from "./components/layout/MainLayout";
import { WmsProvider } from "./context/WmsContext";

// Import page components
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import InventoryReport from "./pages/InventoryReport";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OrderMonitoring from "./pages/OrderMonitoring";
import AllocationSummary from "./pages/order-completion/AllocationSummary";
import BarcoderAssignment from "./pages/order-completion/BarcoderAssignment";
import CheckerAssignment from "./pages/order-completion/CheckerAssignment";
import PickerAssignment from "./pages/order-completion/PickerAssignment";
import TaggerAssignment from "./pages/order-completion/TaggerAssignment";
import TransferAssignment from "./pages/order-completion/TransferAssignment";
import Adjustments from "./pages/stock-management/Adjustments";
import StockBuffering from "./pages/stock-management/StockBuffering";
import StockInquiry from "./pages/stock-management/StockInquiry";
import StockLocationInquiry from "./pages/stock-management/StockLocationInquiry";
import Transfers from "./pages/stock-management/Transfers";
import Withdrawal from "./pages/stock-management/Withdrawal";
import PurchaseOrder from "./pages/supplier/PurchaseOrder";
import SupplierDelivery from "./pages/supplier/SupplierDelivery";
import SupplierProfile from "./pages/supplier/SupplierProfile";
import { QueryProvider } from "./providers/QueryProvider";

const App = () => (
  <QueryProvider>
    <WmsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* DevTools now sits inside the <BrowserRouter> provided by main.tsx */}
        <DevTools />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes with Layout */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Stock Management */}
            <Route path="/stock-management/stock-buffering" element={<StockBuffering />} />
            <Route path="/stock-management/stock-inquiry" element={<StockInquiry />} />
            <Route path="/stock-management/stock-location-inquiry" element={<StockLocationInquiry />} />
            <Route path="/stock-management/adjustments" element={<Adjustments />} />
            <Route path="/stock-management/withdrawal" element={<Withdrawal />} />
            <Route path="/stock-management/transfers" element={<Transfers />} />        
            <Route path="/operations/monitoring" element={<OrderMonitoring />} />
            <Route path="/order-completion/allocation" element={<AllocationSummary />} />
            <Route path="/order-completion/picker" element={<PickerAssignment />} />
            <Route path="/order-completion/barcoder" element={<BarcoderAssignment />} />
            <Route path="/order-completion/tagger" element={<TaggerAssignment />} />
            <Route path="/order-completion/checker" element={<CheckerAssignment />} />
            <Route path="/order-completion/transfer" element={<TransferAssignment />} />
            <Route path="/supplier/delivery" element={<SupplierDelivery />} />
            <Route path="/supplier/profile" element={<SupplierProfile />} />
            <Route path="/supplier/purchase-order" element={<PurchaseOrder />} />
            <Route path="/reports/inventory" element={<InventoryReport />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </WmsProvider>
  </QueryProvider>
);

export default App;
