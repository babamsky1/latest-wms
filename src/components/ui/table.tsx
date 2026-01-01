import { cn } from "@/lib/utils";
import * as React from "react";

type TableVariant = "default" | "dashboard" | "inventory" | "transfers" | "orders" | "custom";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: TableVariant;
}
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(
          "w-full table-fixed caption-bottom text-sm text-left border-collapse",
          variant !== "default" && `table-variant-${variant}`,
          className
        )}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  variant?: TableVariant;
}
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        "[&_tr]:border-b bg-muted/50 text-left",
        variant !== "default" && `table-header-variant-${variant}`,
        className
      )}
      {...props}
    />
  )
);
TableHeader.displayName = "TableHeader";

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  variant?: TableVariant;
}
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        "[&_tr:last-child]:border-0 text-left",
        variant !== "default" && `table-body-variant-${variant}`,
        className
      )}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  variant?: TableVariant;
}
const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 text-left",
        variant !== "default" && `table-footer-variant-${variant}`,
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  variant?: TableVariant;
}
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50 text-left",
        variant !== "default" && `table-row-variant-${variant}`,
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  variant?: TableVariant;
}
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 align-middle font-medium text-muted-foreground text-left [&:has([role=checkbox])]:pr-0",
        variant !== "default" && `table-head-variant-${variant}`,
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  variant?: TableVariant;
}
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle text-left [&:has([role=checkbox])]:pr-0",
        variant !== "default" && `table-cell-variant-${variant}`,
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

// **New Wide TableCell variant for Transfers**
interface TableCellWideProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  variant?: TableVariant;
}
const TableCellWide = React.forwardRef<HTMLTableCellElement, TableCellWideProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle text-left min-w-[220px] md:min-w-[280px] [&:has([role=checkbox])]:pr-0",
        variant !== "default" && `table-cellwide-variant-${variant}`,
        className
      )}
      {...props}
    />
  )
);
TableCellWide.displayName = "TableCellWide";

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  variant?: TableVariant;
}
const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-sm text-muted-foreground text-left",
        variant !== "default" && `table-caption-variant-${variant}`,
        className
      )}
      {...props}
    />
  )
);
TableCaption.displayName = "TableCaption";

export { Table, TableBody, TableCaption, TableCell, TableCellWide, TableFooter, TableHead, TableHeader, TableRow };

