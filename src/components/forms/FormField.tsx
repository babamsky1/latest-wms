/**
 * Form Field Components - Standardized form components with validation
 * Uses react-hook-form + Zod for type-safe form handling
 */

import React from 'react';
import { useFormContext, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

// ============================================================================
// FORM FIELD COMPONENTS
// ============================================================================

interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Text input field with validation
 */
export const TextField: React.FC<FormFieldProps & {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
}> = ({
  name,
  label,
  placeholder,
  description,
  required,
  disabled,
  className,
  type = 'text',
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className={cn(required && "after:content-['*'] after:ml-1 after:text-destructive")}>
          {label}
        </Label>
      )}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={cn(error && 'border-destructive')}
      />
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
};

/**
 * Textarea field with validation
 */
export const TextAreaField: React.FC<FormFieldProps & {
  rows?: number;
}> = ({
  name,
  label,
  placeholder,
  description,
  required,
  disabled,
  className,
  rows = 3,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className={cn(required && "after:content-['*'] after:ml-1 after:text-destructive")}>
          {label}
        </Label>
      )}
      <Textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        {...register(name)}
        className={cn(error && 'border-destructive')}
      />
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
};

/**
 * Select field with validation
 */
export const SelectField: React.FC<FormFieldProps & {
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({
  name,
  label,
  description,
  required,
  disabled,
  className,
  options,
  placeholder = 'Select an option',
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const value = watch(name);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className={cn(required && "after:content-['*'] after:ml-1 after:text-destructive")}>
          {label}
        </Label>
      )}
      <Select
        value={value || ''}
        onValueChange={(newValue) => setValue(name, newValue)}
        disabled={disabled}
      >
        <SelectTrigger className={cn(error && 'border-destructive')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
};

/**
 * Checkbox field with validation
 */
export const CheckboxField: React.FC<FormFieldProps & {
  checked?: boolean;
}> = ({
  name,
  label,
  description,
  disabled,
  className,
  checked,
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const value = watch(name);

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Checkbox
        id={name}
        checked={value ?? checked ?? false}
        onCheckedChange={(checked) => setValue(name, checked)}
        disabled={disabled}
        className={cn(error && 'border-destructive')}
      />
      {label && (
        <Label htmlFor={name} className="text-sm font-normal">
          {label}
        </Label>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
};

/**
 * Radio group field with validation
 */
export const RadioField: React.FC<FormFieldProps & {
  options: { value: string; label: string }[];
}> = ({
  name,
  label,
  description,
  required,
  disabled,
  className,
  options,
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const value = watch(name);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className={cn(required && "after:content-['*'] after:ml-1 after:text-destructive")}>
          {label}
        </Label>
      )}
      <RadioGroup
        value={value || ''}
        onValueChange={(newValue) => setValue(name, newValue)}
        disabled={disabled}
        className="flex flex-col space-y-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
            <Label htmlFor={`${name}-${option.value}`} className="text-sm font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
};

/**
 * Date picker field with validation
 */
export const DateField: React.FC<FormFieldProps & {
  dateFormat?: string;
}> = ({
  name,
  label,
  description,
  required,
  disabled,
  className,
  dateFormat = 'PPP',
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const value = watch(name);

  const date = value ? new Date(value) : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className={cn(required && "after:content-['*'] after:ml-1 after:text-destructive")}>
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
              error && 'border-destructive'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, dateFormat) : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setValue(name, selectedDate?.toISOString().split('T')[0]);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
};

// ============================================================================
// FORM CONTAINER COMPONENT
// ============================================================================

interface FormContainerProps<T extends z.ZodSchema> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<T>>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  loading?: boolean;
}

/**
 * Form container with validation and submission handling
 */
export function FormContainer<T extends z.ZodSchema>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  loading = false,
}: FormContainerProps<T>) {
  const methods = useFormContext();

  // If no form context, this component manages its own form
  if (!methods) {
    return (
      <FormProvider schema={schema} onSubmit={onSubmit} defaultValues={defaultValues}>
        <FormContainer
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          children={children}
          className={className}
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
          onCancel={onCancel}
          loading={loading}
        />
      </FormProvider>
    );
  }

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
      {children}

      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" disabled={loading || hasErrors}>
          {loading ? 'Submitting...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

// ============================================================================
// FORM PROVIDER COMPONENT
// ============================================================================

interface FormProviderProps<T extends z.ZodSchema> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<T>>;
  children: React.ReactNode;
}

/**
 * Form provider that sets up react-hook-form with Zod validation
 */
export function FormProvider<T extends z.ZodSchema>({
  schema,
  onSubmit,
  defaultValues,
  children,
}: FormProviderProps<T>) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  return <FormProvider methods={methods} children={children} />;
}

// Re-export useForm for convenience
export { useForm } from 'react-hook-form';
