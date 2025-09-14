import { ReactNode } from "react";
import { Card } from "../Card/Card";
import { cn } from "@/lib/utils";

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
  size?: "md" | "lg";
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
        "cursor-pointer flex items-center font-bold justify-center focus:outline-none",
        size === "md"
          ? "min-w-[80px] min-h-[80px] text-3xl"
          : "min-w-[120px] min-h-[120px] text-5xl",
        className,
      ])}
    >
      {children}
    </Card>
  );
};
