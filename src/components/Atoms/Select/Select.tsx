import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface SelectOptionType {
  value: string;
  label: ReactNode;
}

interface SelectComponentProps {
  triggerClassName?: string;
  valueClassName?: string;
  itemClassName?: string;
  contentClassName?: string;
  options: SelectOptionType[];
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  disabled?: boolean;
}

export const SelectComponent = ({
  triggerClassName,
  valueClassName,
  itemClassName,
  contentClassName,
  placeholder,
  options,
  onChange,
  value,
  disabled,
}: SelectComponentProps) => {
  return (
    <Select
      disabled={disabled}
      onValueChange={onChange}
      value={value}
      defaultValue={value}
    >
      <SelectTrigger className={cn([triggerClassName, "w-full"])}>
        <SelectValue placeholder={placeholder} className={valueClassName} />
      </SelectTrigger>
      <SelectContent className={cn([contentClassName, "bg-background"])}>
        {options.map((option) => (
          <SelectItem
            className={cn([
              itemClassName,
              "cursor-pointer hover:bg-gray-100 transition-all",
            ])}
            value={option.value}
            key={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
