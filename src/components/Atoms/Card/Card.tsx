import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const textColorClassNames = {
  default: "text-primary",
  correct: "text-white",
  wrong: "text-white",
  plain: "text-white",
};

const variantClassNames = {
  plain: "bg-none border-none shadow-none",
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
  variant?: "default" | "correct" | "wrong" | "plain";
  omitTextColor?: boolean;
}) => {
  return (
    <div
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      className={cn([
        "border rounded-2xl focus:outline-none",
        variantClassNames[variant],
        !omitTextColor && textColorClassNames[variant],
        className,
      ])}
    >
      {children}
    </div>
  );
};
