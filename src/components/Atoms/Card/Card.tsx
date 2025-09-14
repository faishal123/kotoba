import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const textColorClassNames = {
  default: "text-primary",
  correct: "text-white",
  wrong: "text-white",
};

const variantClassNames = {
  default: "bg-white button-shadow-primary border-primary",
  correct: "bg-green-secondary button-shadow-green! border-green",
  wrong: "bg-red-secondary button-shadow-red! border-red",
};

export const Card = ({
  children,
  className,
  role,
  tabIndex,
  onClick,
  variant = "default",
  omitTextColor = false,
}: {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  role?: "button";
  tabIndex?: number;
  variant?: "default" | "correct" | "wrong";
  omitTextColor?: boolean;
}) => {
  return (
    <div
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      className={cn([
        "border rounded-2xl transition-all focus:outline-none",
        variantClassNames[variant],
        !omitTextColor && textColorClassNames[variant],
        className,
      ])}
    >
      {children}
    </div>
  );
};
