import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export interface Field<T> {
  label: string;
  name: keyof T;
  type?: "text" | "number" | "select";
  placeholder?: string;
  disabled?: boolean;
  options?: string[];
}

interface AddModalProps<T> {
  title?: string;
  fields: Field<T>[];
  onSubmit: (data: T) => void;
  initialData?: Partial<T>;
}

const AddModal = <T extends Record<string, unknown>>({
  title = "Add New Item",
  fields,
  onSubmit,
  initialData,
}: AddModalProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});

  // Update form data if initialData changes (important for the auto-SKU)
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  const handleChange = (name: keyof T, value: unknown) => {
    const finalValue = typeof value === "number" && value < 0 ? 0 : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as T);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {fields.map((field) => (
              <div key={String(field.name)} className="grid gap-2">
                <Label htmlFor={String(field.name)}>{field.label}</Label>
                {field.type === "select" ? (
                  <select
                    id={String(field.name)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
                    value={String(formData[field.name] ?? "")}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required
                  >
                    <option value="" disabled>Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={String(field.name)}
                    type={field.type || "text"}
                    value={String(formData[field.name] ?? "")}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    min={field.type === "number" ? 0 : undefined}
                    required
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        field.type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Product</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;