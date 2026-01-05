import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWms } from "@/hooks/useWms";
import { Beaker, ShieldAlert } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export const DevTools = () => {
  const wms = useWms();
  const location = useLocation();

  // Only show in development
  const isDev = import.meta.env.MODE === "development";
  if (!isDev) return null;

  const addTestData = () => {
    const timestamp = Date.now();
    const path = location.pathname;

    if (path.includes("stock-buffering")) {
      wms.addItem({
        id: timestamp.toString(),
        psc: `TEST-${timestamp % 10000}`,
        shortDescription: `Test Item ${timestamp % 1000}`,
        longDescription: `Dev test item created at ${new Date().toLocaleTimeString()}`,
        invoiceDescription: `TEST ITEM ${timestamp % 1000}`,
        picklistCode: `PK-DEV-${timestamp % 100}`,
        barcode: `DEV${timestamp}`,
        productType: "Test Data",
        igDescription: "Generated for testing",
        subId: "SUB-DEV",
        brand: "KLIK",
        group: "Development",
        category: "Supplies",
        subCategory: "Testing",
        size: "N/A",
        color: "Transparent",
        isSaleable: true,
        cost: 100,
        srp: 200,
        isTestData: true
      });
      toast.success("🧪 Dev: Test Item added!");
    }
    else if (path.includes("purchase-order")) {
      wms.addPO({
        id: timestamp.toString(),
        poNumber: `PO-TEST-${timestamp % 1000}`,
        orderDate: new Date().toISOString().split('T')[0],
        supplierName: "Test Supplier Corp",
        expectedDate: "2024-12-31",
        totalAmount: 50000,
        status: "Draft",
        priority: "Medium",
        createdBy: "DevBot",
        createdAt: new Date().toLocaleString(),
        updatedBy: "DevBot",
        updatedAt: new Date().toLocaleString(),
        isTestData: true
      });
      toast.success("🧪 Dev: Test PO added!");
    }
    else if (path.includes("adjustments")) {
      wms.addAdjustment({
        id: timestamp.toString(),
        referenceNo: `ADJ-TEST-${timestamp % 1000}`,
        adjustmentDate: new Date().toISOString().split('T')[0],
        sourceReference: `REF-${timestamp % 100}`,
        category: "Wrong Encode",
        warehouse: "DEV-WH",
        status: "Open",
        createdBy: "DevBot",
        createdAt: new Date().toLocaleString(),
        updatedBy: "DevBot",
        updatedAt: new Date().toLocaleString(),
        isTestData: true
      });
      toast.success("🧪 Dev: Test Adjustment added!");
    }
    else if (path.includes("withdrawal")) {
      wms.addWithdrawal({
        id: timestamp.toString(),
        referenceNo: `WTH-TEST-${timestamp % 1000}`,
        transferDate: new Date().toISOString().split('T')[0],
        category: "Industrial",
        warehouse: "DEV-ZONE",
        status: "Open",
        createdBy: "DevBot",
        createdAt: new Date().toLocaleString(),
        updatedBy: "DevBot",
        updatedAt: new Date().toLocaleString(),
        isTestData: true
      });
      toast.success("🧪 Dev: Test Withdrawal added!");
    }
    else if (path.includes("supplier/delivery")) {
      wms.addDelivery({
        id: timestamp.toString(),
        referenceNo: `DEL-TEST-${timestamp % 1000}`,
        transferDate: new Date().toISOString().split('T')[0],
        supplierCode: "SUP-TEST",
        packingNo: `PK-${timestamp % 1000}`,
        containerNo: `CTN-${timestamp % 100}`,
        transferType: "Local",
        status: "Open",
        warehouse: "DEV-WH",
        createdBy: "DevBot",
        createdAt: new Date().toLocaleString(),
        updatedBy: "DevBot",
        updatedAt: new Date().toLocaleString(),
        isTestData: true
      });
      toast.success("🧪 Dev: Test Delivery added!");
    }
    else if (path.includes("supplier/profile")) {
      wms.addSupplier({
        id: timestamp.toString(),
        supplierCode: `SUP-TEST-${timestamp % 100}`,
        supplierName: "Global Test Logistics",
        companyName: "Test Logistics Ltd.",
        supplierType: "International",
        company: "Dev Corp",
        status: "Active",
        isTestData: true
      });
      toast.success("🧪 Dev: Test Supplier added!");
    }
    else if (path.includes("stock-management/transfers")) {
      wms.addTransfer({
        id: timestamp.toString(),
        referenceNo: `TRF-TEST-${timestamp % 1000}`,
        transferDate: new Date().toISOString().split('T')[0],
        neededDate: new Date(timestamp + 86400000 * 2).toISOString().split('T')[0],
        sourceWarehouse: "Main Warehouse",
        destinationWarehouse: "Regional Hub",
        requestedBy: "DevBot",
        status: "Open",
        updatedBy: "DevBot",
        updatedAt: new Date().toLocaleString(),
        isTestData: true
      });
      toast.success("🧪 Dev: Test Transfer added!");
    }
    else if (path.includes("operations/monitoring")) {
      wms.addOrder({
        id: timestamp.toString(),
        poNo: `PO-${timestamp % 10000}`,
        seriesNo: `S-${timestamp % 100}`,
        customerName: "SM Supermarket (Dev)",
        brand: "KLIK",
        pickerStatus: "Done",
        barcoderStatus: "In Progress",
        taggerStatus: "Pending",
        checkerStatus: "Pending",
        overallStatus: "Processing",
        deliverySchedule: new Date(timestamp + 86400000).toISOString().split('T')[0],
        updatedAt: new Date().toLocaleString(),
        isTestData: true
      });
      toast.success("🧪 Dev: Test Order added!");
    }
    else {
      toast.error("No test data generator for this page yet.");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-2 px-3 py-1">
        <ShieldAlert className="h-4 w-4 text-warning" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dev Mode</span>
      </div>
      <Button
        size="sm"
        variant="default"
        className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
        onClick={addTestData}
      >
        <Beaker className="h-4 w-4 mr-2" />
        Add Page Test Data
      </Button>
    </div>
  );
};

export const DevBadge = () => {
  return (
    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-bold text-[10px] px-1.5 h-4 ml-2">
      DEV DATA
    </Badge>
  );
};
