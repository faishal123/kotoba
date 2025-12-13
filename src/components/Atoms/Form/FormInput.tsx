import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

type FormInputProps<FormType extends FieldValues> = {
  name: Path<FormType>;
  control: Control<FormType>;
  placeholder?: string;
  description?: string;
  label?: string;
};

export const FormInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  description,
}: FormInputProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input placeholder={placeholder} {...field} />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
