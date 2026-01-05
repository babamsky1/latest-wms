// App.tsx
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Routes } from "react-router-dom";
import { DevTools } from "./components/dev/DevTools";
import { QueryDevTools, DevInfoPanel } from "./components/dev/ReactQueryDevTools";
import { MainLayout } from "./components/layout/MainLayout";
import { WmsProvider } from "./context/WmsContext";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
import CustomerReturns from "./pages/stock-management/CustomerReturns";
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
    <AuthProvider>
      <WmsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes with Layout */}
            <Route element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Stock Management - Operator level and above */}
              <Route path="/stock-management/stock-buffering" element={
                <ProtectedRoute requiredRole="operator">
                  <StockBuffering />
                </ProtectedRoute>
              } />
              <Route path="/stock-management/stock-inquiry" element={
                <ProtectedRoute requiredRole="viewer">
                  <StockInquiry />
                </ProtectedRoute>
              } />
              <Route path="/stock-management/stock-location-inquiry" element={
                <ProtectedRoute requiredRole="operator">
                  <StockLocationInquiry />
                </ProtectedRoute>
              } />
              <Route path="/stock-management/adjustments" element={
                <ProtectedRoute requiredRole="warehouse_manager">
                  <Adjustments />
                </ProtectedRoute>
              } />
              <Route path="/stock-management/customer-returns" element={
                <ProtectedRoute requiredRole="operator">
                  <CustomerReturns />
                </ProtectedRoute>
              } />
              <Route path="/stock-management/withdrawal" element={
                <ProtectedRoute requiredRole="operator">
                  <Withdrawal />
                </ProtectedRoute>
              } />
              <Route path="/stock-management/transfers" element={
                <ProtectedRoute requiredRole="warehouse_manager">
                  <Transfers />
                </ProtectedRoute>
              } />

              {/* Operations - Operator level and above */}
              <Route path="/operations/monitoring" element={
                <ProtectedRoute requiredRole="operator">
                  <OrderMonitoring />
                </ProtectedRoute>
              } />

              {/* Order Completion - Operator level and above */}
              <Route path="/order-completion/allocation" element={
                <ProtectedRoute requiredRole="operator">
                  <AllocationSummary />
                </ProtectedRoute>
              } />
              <Route path="/order-completion/picker" element={
                <ProtectedRoute requiredRole="operator">
                  <PickerAssignment />
                </ProtectedRoute>
              } />
              <Route path="/order-completion/barcoder" element={
                <ProtectedRoute requiredRole="operator">
                  <BarcoderAssignment />
                </ProtectedRoute>
              } />
              <Route path="/order-completion/tagger" element={
                <ProtectedRoute requiredRole="operator">
                  <TaggerAssignment />
                </ProtectedRoute>
              } />
              <Route path="/order-completion/checker" element={
                <ProtectedRoute requiredRole="operator">
                  <CheckerAssignment />
                </ProtectedRoute>
              } />
              <Route path="/order-completion/transfer" element={
                <ProtectedRoute requiredRole="operator">
                  <TransferAssignment />
                </ProtectedRoute>
              } />

              {/* Supplier Management - Warehouse Manager and above */}
              <Route path="/supplier/delivery" element={
                <ProtectedRoute requiredRole="warehouse_manager">
                  <SupplierDelivery />
                </ProtectedRoute>
              } />
              <Route path="/supplier/profile" element={
                <ProtectedRoute requiredRole="warehouse_manager">
                  <SupplierProfile />
                </ProtectedRoute>
              } />
              <Route path="/supplier/purchase-order" element={
                <ProtectedRoute requiredRole="warehouse_manager">
                  <PurchaseOrder />
                </ProtectedRoute>
              } />

              {/* Reports - Viewer level and above */}
              <Route path="/reports/inventory" element={
                <ProtectedRoute requiredRole="viewer">
                  <InventoryReport />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Development Tools */}
          <DevTools />
          <QueryDevTools />
          <DevInfoPanel />
        </TooltipProvider>
      </WmsProvider>
    </AuthProvider>
  </QueryProvider>
);

export default App;
