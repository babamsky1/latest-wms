import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Filter,
} from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

export interface ColumnDef<T extends Record<string, unknown>> {
  key: keyof T;
  label: string;
  sortable: boolean;
  filterable: boolean;
  filterType: "text" | "select" | "date";
  filterOptions?: { value: string; label: string }[];
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  actions: (row: T) => ReactNode;
  pageSize: number;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  pageSize,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...data];

    if (search) {
      rows = rows.filter((row) =>
        Object.values(row).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    Object.entries(filters).forEach(([k, v]) => {
      rows = rows.filter((r) => String(r[k]).includes(v));
    });

    if (sortKey) {
      rows.sort((a, b) =>
        String(a[sortKey]).localeCompare(String(b[sortKey]))
      );
    }

    return rows;
  }, [data, search, filters, sortKey]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={String(c.key)}>
                <div className="flex items-center gap-1">
                  <button onClick={() => setSortKey(c.key)}>
                    {c.label}
                    <ChevronsUpDown className="inline h-4 w-4 ml-1" />
                  </button>

                  {c.filterable && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56">
                        {c.filterType === "select" && (
                          <Select
                            onValueChange={(v) =>
                              setFilters({ ...filters, [c.key]: v })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {c.filterOptions!.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {c.filterType === "date" && (
                          <Input
                            type="date"
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                [c.key]: e.target.value,
                              })
                            }
                          />
                        )}

                        {c.filterType === "text" && (
                          <Input
                            placeholder="Filter..."
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                [c.key]: e.target.value,
                              })
                            }
                          />
                        )}
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((r) => (
            <TableRow key={String(r.id)}>
              {columns.map((c) => (
                <TableCell key={String(c.key)}>
                  {c.render ? c.render(r) : String(r[c.key])}
                </TableCell>
              ))}
              <TableCell>{actions(r)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-2">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          <ChevronLeft />
        </Button>
        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
