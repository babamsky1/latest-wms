/**
 * Drawer Components - Advanced drawer UIs using Vaul
 * Provides smooth animations and flexible drawer layouts
 */

import React from 'react';
import { Drawer as VaulDrawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from 'vaul';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ============================================================================
// BASE DRAWER COMPONENT
// ============================================================================

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

/**
 * Base drawer component with Vaul animations
 */
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  side = 'right',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[32rem]',
    xl: 'w-[40rem]',
    full: 'w-full',
  };

  return (
    <VaulDrawer open={open} onOpenChange={onOpenChange} direction={side}>
      <DrawerContent
        className={cn(
          'bg-background border-l',
          side === 'right' && sizeClasses[size],
          side === 'left' && `${sizeClasses[size]} border-r border-l-0`,
          side === 'bottom' && 'h-96 border-t border-l-0',
          side === 'top' && 'h-96 border-b border-l-0',
          className
        )}
      >
        {(title || description) && (
          <DrawerHeader className="border-b px-6 py-4">
            {title && <DrawerTitle className="text-lg font-semibold">{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}

        <ScrollArea className="flex-1 px-6 py-4">
          {children}
        </ScrollArea>
      </DrawerContent>
    </VaulDrawer>
  );
};

// ============================================================================
// DRAWER VARIANTS FOR SPECIFIC USE CASES
// ============================================================================

/**
 * Detail Drawer - For showing detailed information
 */
export const DetailDrawer: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ open, onOpenChange, title, children, actions }) => {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="lg"
    >
      <div className="space-y-6">
        {children}

        {actions && (
          <div className="flex justify-end gap-3 pt-6 border-t">
            {actions}
          </div>
        )}
      </div>
    </Drawer>
  );
};

/**
 * Form Drawer - For forms and data entry
 */
export const FormDrawer: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
}) => {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleSubmit = () => {
    onSubmit?.();
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {children}

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

/**
 * Quick Action Drawer - For quick actions and confirmations
 */
export const QuickActionDrawer: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'default' | 'destructive' | 'secondary';
  isLoading?: boolean;
}> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
    >
      <div className="space-y-6">
        {children}

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

/**
 * Filter Drawer - For advanced filtering options
 */
export const FilterDrawer: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  onApply?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
}> = ({
  open,
  onOpenChange,
  title = 'Filters',
  children,
  onApply,
  onReset,
  isLoading = false,
}) => {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="md"
      side="left"
    >
      <div className="space-y-6">
        {children}

        <div className="flex justify-between gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={isLoading}
          >
            Reset
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={onApply}
              disabled={isLoading}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

// ============================================================================
// DRAWER TRIGGER COMPONENTS
// ============================================================================

/**
 * Drawer Trigger - Button that opens a drawer
 */
export const DrawerTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
}> = ({ children, asChild }) => {
  return <>{children}</>;
};

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

/**
 * Drawer Section - For organizing drawer content
 */
export const DrawerSection: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

/**
 * Drawer Divider - Visual separator
 */
export const DrawerDivider: React.FC = () => {
  return <hr className="border-muted" />;
};
