/**
 * ActionMenu Component
 * 
 * Purpose: Standardized dropdown menu for table row actions
 * 
 * Comment: Eliminates duplicate DropdownMenu boilerplate across all pages.
 * Provides consistent action menu styling and behavior.
 */

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ReactNode, isValidElement, Children, ReactElement } from "react";

interface ActionMenuProps {
  children: ReactNode; // EditModal, DeleteModal, or custom actions
  align?: "start" | "end" | "center"; // Menu alignment
  closeOnAction?: boolean | string[]; // Whether to close dropdown, or array of button text that should close
}

/**
 * Comment: Simple wrapper that provides consistent action menu structure.
 * Children should be modal components (EditModal, DeleteModal, etc.) or buttons.
 * Buttons are automatically wrapped in DropdownMenuItem for proper dropdown closing (unless closeOnAction is false).
 */
export const ActionMenu = ({ children, align = "end", closeOnAction = true }: ActionMenuProps) => {
  const shouldCloseButton = (buttonText: string) => {
    if (typeof closeOnAction === 'boolean') {
      return closeOnAction;
    }
    return closeOnAction.includes(buttonText);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Comment: Icon-only button with consistent sizing */}
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="p-2 w-auto min-w-[120px]">
        {/* Comment: Conditionally wrap buttons in DropdownMenuItem based on closeOnAction */}
        <div className="flex flex-col gap-2 w-full">
          {Children.map(children, (child) => {
            // If it's a Button element, check if it should close the dropdown
            if (isValidElement(child) && (child as ReactElement).type === Button) {
              const buttonText = child.props.children;
              if (shouldCloseButton(buttonText)) {
                return (
                  <DropdownMenuItem asChild>
                    {child}
                  </DropdownMenuItem>
                );
              }
              // Button exists but shouldn't close dropdown - render as-is
              return child;
            }
            // Otherwise, render as-is (for EditModal, DeleteModal, etc.)
            return child;
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
