import { ReactNode } from "react";
import { Card } from "../Card/Card";
import { cn } from "@/lib/utils";

const sizeClassName = {
  xs: "min-w-[40px] min-h-[40px] text-xl",
  sm: "min-w-[60px] min-h-[60px] text-2xl",
  md: "min-w-[80px] min-h-[80px] text-3xl",
  lg: "min-w-[120px] min-h-[120px] text-5xl",
};

export const CardButton = ({
  children,
  onClick,
  className,
  size = "md",
  variant,
  omitTextColor = false,
}: {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "correct" | "wrong";
  omitTextColor?: boolean;
}) => {
  return (
    <Card
      omitTextColor={omitTextColor}
      variant={variant}
      onClick={onClick}
      tabIndex={0}
      role="button"
      className={cn([
        "cursor-pointer flex items-center font-bold justify-center focus:outline-none transition-background duration-200",
        sizeClassName[size],
        className,
      ])}
    >
      {children}
    </Card>
  );
};
