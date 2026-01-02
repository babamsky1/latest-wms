import AddModal, { AddField } from "@/components/modals/AddModal";
import DeleteModal from "@/components/modals/DeleteModal";
import EditModal, { EditField } from "@/components/modals/EditModal";
import { ActionMenu } from "@/components/table/ActionMenu";
import { ColumnDef, DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useReducer } from "react";

interface Location {
  [key: string]: unknown;
  id: string;
  code: string;
  warehouse: string;
  zone: string;
  rack: string;
  shelf: string;
  bin: string;
  type: "picking" | "storage" | "staging" | "receiving";
  capacity: number;
  usedCapacity: number;
  status: "available" | "full" | "reserved";
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

type State = {
  locations: Location[];
  searchQuery: string;
  warehouseFilter: string;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_WAREHOUSE_FILTER"; payload: string }
  | { type: "DELETE_LOCATION"; payload: string }
  | { type: "ADD_LOCATION"; payload: Location }
  | { type: "UPDATE_LOCATION"; payload: Location };

const initialLocations: Location[] = [
  {
    id: "1",
    code: "A-01-02-03",
    warehouse: "Main Warehouse",
    zone: "A",
    rack: "01",
    shelf: "02",
    bin: "03",
    type: "picking",
    capacity: 500,
    usedCapacity: 250,
    status: "available",
    created_by: "Admin",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z",
  },
  {
    id: "2",
    code: "A-01-02-04",
    warehouse: "Main Warehouse",
    zone: "A",
    rack: "01",
    shelf: "02",
    bin: "04",
    type: "picking",
    capacity: 500,
    usedCapacity: 500,
    status: "full",
    created_by: "Admin",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z",
  },
  {
    id: "3",
    code: "B-02-01-01",
    warehouse: "Main Warehouse",
    zone: "B",
    rack: "02",
    shelf: "01",
    bin: "01",
    type: "storage",
    capacity: 1000,
    usedCapacity: 280,
    status: "available",
    created_by: "Admin",
    created_at: "2024-01-02T09:00:00Z",
    updated_at: "2024-01-02T09:00:00Z",
  },
  {
    id: "4",
    code: "C-01-03-02",
    warehouse: "Secondary Warehouse",
    zone: "C",
    rack: "01",
    shelf: "03",
    bin: "02",
    type: "storage",
    capacity: 2000,
    usedCapacity: 1200,
    status: "available",
    created_by: "Admin",
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-05T10:00:00Z",
  },
  {
    id: "5",
    code: "STG-001",
    warehouse: "Main Warehouse",
    zone: "Staging",
    rack: "-",
    shelf: "-",
    bin: "-",
    type: "staging",
    capacity: 5000,
    usedCapacity: 1500,
    status: "available",
    created_by: "Admin",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z",
  },
  {
    id: "6",
    code: "RCV-001",
    warehouse: "Main Warehouse",
    zone: "Receiving",
    rack: "-",
    shelf: "-",
    bin: "-",
    type: "receiving",
    capacity: 3000,
    usedCapacity: 0,
    status: "available",
    created_by: "Admin",
    created_at: "2024-01-01T08:00:00Z",
    updated_at: "2024-01-01T08:00:00Z",
  },
  {
    id: "7",
    code: "D-01-02-01",
    warehouse: "Main Warehouse",
    zone: "D",
    rack: "01",
    shelf: "02",
    bin: "01",
    type: "picking",
    capacity: 300,
    usedCapacity: 300,
    status: "reserved",
    created_by: "Admin",
    created_at: "2024-01-10T11:00:00Z",
    updated_at: "2024-01-10T11:00:00Z",
  },
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_WAREHOUSE_FILTER":
      return { ...state, warehouseFilter: action.payload };
    case "DELETE_LOCATION":
      return {
        ...state,
        locations: state.locations.filter((l) => l.id !== action.payload),
      };
    case "ADD_LOCATION":
      return {
        ...state,
        locations: [
          { 
            ...action.payload, 
            status: "available", 
            usedCapacity: 0,
            created_at: new Date().toISOString(),
            created_by: "Current User",
            updated_at: new Date().toISOString(),
          },
          ...state.locations,
        ],
      };
    case "UPDATE_LOCATION":
      return {
        ...state,
        locations: state.locations.map((l) =>
          l.id === action.payload.id ? {
            ...action.payload,
            updated_at: new Date().toISOString(),
            updated_by: "Current User"
          } : l
        ),
      };
    default:
      return state;
  }
};

const Locations = () => {
  const [state, dispatch] = useReducer(reducer, {
    locations: initialLocations,
    searchQuery: "",
    warehouseFilter: "all",
  });

  // Generate next location code
  const nextLocationNumber =
    state.locations.length > 0
      ? Math.max(
          ...state.locations.map((l) => {
            const match = l.code.match(/\d+/);
            return match ? parseInt(match[0]) : 0;
          })
        ) + 1
      : 1;
  const generatedLocationCode = `LOC-${nextLocationNumber
    .toString()
    .padStart(3, "0")}`;

  // Form fields configuration
  const locationFields: AddField<Location>[] = [
    { label: "Code (Auto)", name: "code", type: "text", disabled: true },
    {
      label: "Warehouse",
      name: "warehouse",
      type: "select",
      required: true,
      options: [
        { value: "Main Warehouse", label: "Main Warehouse" },
        { value: "Secondary Warehouse", label: "Secondary Warehouse" },
        { value: "Cold Storage", label: "Cold Storage" },
      ],
    },
    {
      label: "Zone",
      name: "zone",
      type: "text",
      placeholder: "e.g., A",
      required: true,
    },
    {
      label: "Rack",
      name: "rack",
      type: "text",
      placeholder: "e.g., 01",
      required: true,
    },
    {
      label: "Shelf",
      name: "shelf",
      type: "text",
      placeholder: "e.g., 02",
      required: true,
    },
    {
      label: "Bin",
      name: "bin",
      type: "text",
      placeholder: "e.g., 03",
      required: true,
    },
    {
      label: "Type",
      name: "type",
      type: "select",
      required: true,
      options: [
        { value: "picking", label: "Picking" },
        { value: "storage", label: "Storage" },
        { value: "staging", label: "Staging" },
        { value: "receiving", label: "Receiving" },
      ],
    },
    {
      label: "Capacity",
      name: "capacity",
      type: "number",
      placeholder: "0",
      required: true,
    },
  ];

  const editLocationFields: EditField<Location>[] = [
    { label: "Code", name: "code", type: "text", disabled: true },
    {
      label: "Warehouse",
      name: "warehouse",
      type: "select",
      required: true,
      options: [
        { value: "Main Warehouse", label: "Main Warehouse" },
        { value: "Secondary Warehouse", label: "Secondary Warehouse" },
        { value: "Cold Storage", label: "Cold Storage" },
      ],
    },
    {
      label: "Zone",
      name: "zone",
      type: "text",
      placeholder: "e.g., A",
      required: true,
    },
    {
      label: "Rack",
      name: "rack",
      type: "text",
      placeholder: "e.g., 01",
      required: true,
    },
    {
      label: "Shelf",
      name: "shelf",
      type: "text",
      placeholder: "e.g., 02",
      required: true,
    },
    {
      label: "Bin",
      name: "bin",
      type: "text",
      placeholder: "e.g., 03",
      required: true,
    },
    {
      label: "Type",
      name: "type",
      type: "select",
      required: true,
      options: [
        { value: "picking", label: "Picking" },
        { value: "storage", label: "Storage" },
        { value: "staging", label: "Staging" },
        { value: "receiving", label: "Receiving" },
      ],
    },
    {
      label: "Capacity",
      name: "capacity",
      type: "number",
      placeholder: "0",
      required: true,
    },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: [
        { value: "available", label: "Available" },
        { value: "full", label: "Full" },
        { value: "reserved", label: "Reserved" },
      ],
    },
  ];

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-warning";
    return "bg-success";
  };

  const getStatusBadge = (status: Location["status"]) => {
    const config = {
      available: "status-active",
      full: "status-error",
      reserved: "status-warning",
    };
    return <span className={`status-badge ${config[status]}`}>{status}</span>;
  };

  const getTypeBadge = (type: Location["type"]) => {
    const config = {
      picking: "bg-primary/10 text-primary",
      storage: "bg-info/10 text-info",
      staging: "bg-warning/10 text-warning",
      receiving: "bg-success/10 text-success",
    };
    return (
      <Badge variant="outline" className={cn("font-normal", config[type])}>
        {type}
      </Badge>
    );
  };

  const columns: ColumnDef<Location>[] = [
    {
      key: "code",
      label: "Location Code",
      render: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-mono font-medium">{row.code}</span>
        </div>
      ),
    },
    {
      key: "warehouse",
      label: "Warehouse",
      render: (row) => (
        <Badge variant="outline" className="font-normal">
          {row.warehouse}
        </Badge>
      ),
    },
    { key: "zone", label: "Zone" },
    {
      key: "type",
      label: "Type",
      render: (row) => getTypeBadge(row.type),
    },
    {
      key: "capacity",
      label: "Capacity",
      render: (row) => {
        const usagePercent = Math.round((row.usedCapacity / row.capacity) * 100);
        return (
          <div className="flex items-center gap-3">
            <Progress
              value={usagePercent}
              className={cn("h-2 w-20", getCapacityColor(usagePercent))}
            />
            <span className="text-sm text-muted-foreground w-16">
              {row.usedCapacity}/{row.capacity}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "created_by",
      label: "Created By",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
    },
    {
      key: "updated_at",
      label: "Updated At",
      className: "hidden xl:table-cell text-sm text-muted-foreground",
      render: (row) => row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Locations</h1>
            <p className="page-description">
              Manage warehouse locations, zones, racks, and bins
            </p>
          </div>
          <AddModal<Location>
            title="Add New Location"
            description="Create a new warehouse location"
            fields={locationFields}
            initialData={{
              id: String(Date.now()),
              code: generatedLocationCode,
              warehouse: "Main Warehouse",
              zone: "",
              rack: "",
              shelf: "",
              bin: "",
              type: "storage",
              capacity: 0,
              usedCapacity: 0,
              status: "available",
            }}
            onSubmit={(data) =>
              dispatch({ type: "ADD_LOCATION", payload: data as Location })
            }
            triggerLabel="Add Location"
            submitLabel="Create Location"
            size="lg"
          />
        </div>
      </div>

      <DataTable
        data={state.locations}
        columns={columns}
        searchPlaceholder="Search by location code..."
        actions={(location) => (
          <ActionMenu>
            <EditModal<Location>
              title="Edit Location"
              description="Update location details"
              fields={editLocationFields}
              data={location}
              onSubmit={(data) =>
                dispatch({
                  type: "UPDATE_LOCATION",
                  payload: data as Location,
                })
              }
              triggerLabel="Edit"
              submitLabel="Update Location"
              size="lg"
            />
            <DeleteModal
              title="Delete Location"
              description={`Are you sure you want to delete the location "${location.code}"? This action cannot be undone.`}
              onSubmit={() =>
                dispatch({
                  type: "DELETE_LOCATION",
                  payload: location.id,
                })
              }
              triggerLabel="Delete"
            />
          </ActionMenu>
        )}
      />
    </div>
  );
};

export default Locations;
