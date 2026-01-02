import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, MoreHorizontal, Package, Search } from "lucide-react";
import { useReducer } from "react";

interface ReturnRecord {
  [key: string]: unknown;
  id: string;
  referenceNo: string;
  customer: string;
  orderRef: string;
  itemCount: number;
  totalQuantity: number;
  status: "pending" | "processed" | "approved";
  returnDate: string;
  processedBy: string;
}

type State = {
  records: ReturnRecord[];
  searchQuery: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "DELETE_RECORD"; payload: string }
  | { type: "ADD_RECORD"; payload: ReturnRecord }
  | { type: "UPDATE_RECORD"; payload: ReturnRecord };

const initialRecords: ReturnRecord[] = [
  { id: "1", referenceNo: "RT-2024-001", customer: "Customer A", orderRef: "ORD-5001", itemCount: 2, totalQuantity: 100, status: "processed", returnDate: "2024-01-15", processedBy: "John Smith" },
  { id: "2", referenceNo: "RT-2024-002", customer: "Customer B", orderRef: "ORD-5002", itemCount: 1, totalQuantity: 50, status: "pending", returnDate: "2024-01-16", processedBy: "-" },
  { id: "3", referenceNo: "RT-2024-003", customer: "Customer C", orderRef: "ORD-5003", itemCount: 5, totalQuantity: 300, status: "approved", returnDate: "2024-01-14", processedBy: "Jane Doe" },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "DELETE_RECORD":
      return { ...state, records: state.records.filter(r => r.id !== action.payload) };
    case "ADD_RECORD":
      return {
        ...state,
        records: [
          { ...action.payload, status: "pending", processedBy: "-" },
          ...state.records,
        ],
      };
    case "UPDATE_RECORD":
      return {
        ...state,
        records: state.records.map((r) => r.id === action.payload.id ? action.payload : r),
      };
    default:
      return state;
  }
};

const Returns = () => {
  const [state, dispatch] = useReducer(reducer, {
    records: initialRecords,
    searchQuery: "",
  });

  // Generate next Reference number
  const nextRefNumber = state.records.length > 0
    ? Math.max(...state.records.map(r => parseInt(r.referenceNo.split('-')[2] || "0"))) + 1
    : 1;
  const generatedRefNumber = `RT-2024-${nextRefNumber.toString().padStart(3, "0")}`;

  // Form fields configuration
  const returnFields: AddField<ReturnRecord>[] = [
    { label: "Reference No (Auto)", name: "referenceNo", type: "text", disabled: true },
    { label: "Customer", name: "customer", type: "text", placeholder: "Enter customer name", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Return Date", name: "returnDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
  ];

  const editReturnFields: EditField<ReturnRecord>[] = [
    { label: "Reference No", name: "referenceNo", type: "text", disabled: true },
    { label: "Customer", name: "customer", type: "text", placeholder: "Enter customer name", required: true },
    { label: "Order Reference", name: "orderRef", type: "text", placeholder: "e.g., ORD-5001", required: true },
    { label: "Item Count", name: "itemCount", type: "number", placeholder: "0", required: true },
    { label: "Total Quantity", name: "totalQuantity", type: "number", placeholder: "0", required: true },
    { label: "Return Date", name: "returnDate", type: "text", placeholder: "YYYY-MM-DD", required: true },
    { label: "Processed By", name: "processedBy", type: "text", placeholder: "e.g., John Smith", required: false },
  ];

  const getStatusBadge = (status: ReturnRecord["status"]) => {
    const config = {
      processed: { class: "status-active", icon: CheckCircle },
      pending: { class: "status-warning", icon: Clock },
      approved: { class: "status-success", icon: CheckCircle },
    };
    const { class: className, icon: Icon } = config[status];
    return (
      <span className={`status-badge ${className}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </span>
    );
  };

  const filteredRecords = state.records.filter(
    r =>
      r.referenceNo.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Returns</h1>
            <p className="page-description">Manage returned items and customer returns</p>
          </div>
          <AddModal<ReturnRecord>
            title="Add New Return"
            description="Create a new return record"
            fields={returnFields}
            initialData={{
              id: String(Date.now()),
              referenceNo: generatedRefNumber,
              customer: "",
              orderRef: "",
              itemCount: 0,
              totalQuantity: 0,
              status: "pending",
              returnDate: "",
              processedBy: "-",
            }}
            onSubmit={(data) => dispatch({ type: "ADD_RECORD", payload: data as ReturnRecord })}
            triggerLabel="New Return"
            submitLabel="Create Return"
            size="lg"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="stat-label">Today's Returns</p>
              <p className="stat-value">50</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="stat-label">Pending</p>
              <p className="stat-value">5</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="stat-label">Approved</p>
              <p className="stat-value">45</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="content-section">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference or customer..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Reference No.</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order Ref</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total Qty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Return Date</TableHead>
              <TableHead>Processed By</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map(record => (
              <TableRow key={record.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-medium">{record.referenceNo}</TableCell>
                <TableCell>{record.customer}</TableCell>
                <TableCell className="font-mono text-sm">{record.orderRef}</TableCell>
                <TableCell className="text-right">{record.itemCount}</TableCell>
                <TableCell className="text-right font-semibold">{record.totalQuantity.toLocaleString()}</TableCell>
                <TableCell>{getStatusBadge(record.status)}</TableCell>
                <TableCell className="text-muted-foreground">{record.returnDate}</TableCell>
                <TableCell>{record.processedBy}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="p-2">
                      <div className="flex flex-col gap-2 w-full">
                        {/* Edit Button */}
                        <EditModal<ReturnRecord>
                          title="Edit Return"
                          description="Update return record"
                          fields={editReturnFields}
                          data={record}
                          onSubmit={(data) => dispatch({ type: "UPDATE_RECORD", payload: data as ReturnRecord })}
                          triggerLabel="Edit"
                          triggerSize="default"
                          submitLabel="Update Return"
                          size="lg"
                        />

                        {/* Delete Button */}
                        <DeleteModal
                          title="Delete Return"
                          description={`Are you sure you want to delete the return record "${record.referenceNo}"? This action cannot be undone.`}
                          onSubmit={() => dispatch({ type: "DELETE_RECORD", payload: record.id })}
                          triggerLabel="Delete"
                          triggerSize="default"
                        />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Returns;
