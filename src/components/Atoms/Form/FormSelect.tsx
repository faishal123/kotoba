import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { SelectComponent, SelectOptionType } from "../Select/Select";

type FormSelectProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  placeholder?: string;
  description?: string;
  label?: string;
  options: SelectOptionType[];
  disabled?: boolean;
};

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  placeholder,
  description,
  options,
  label,
  disabled,
}: FormSelectProps<T>) => {
  return (
    <FormField
      disabled={disabled}
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <SelectComponent
                disabled={disabled}
                onChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
                options={options}
                placeholder={placeholder}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
