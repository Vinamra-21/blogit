"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8",
            "bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-white/20",
            "focus:border-emerald-500 dark:focus:border-[#00ff9d]",
            className
          )}
          onChange={handleChange}
          {...props}>
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

const SelectTrigger = Select;
const SelectValue = ({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
);
const SelectContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
const SelectItem = ({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <option
    value={value}
    className={cn(
      "py-2 bg-white dark:bg-black text-gray-900 dark:text-white",
      "hover:bg-emerald-50 dark:hover:bg-white/5",
      className
    )}>
    {children}
  </option>
);

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
