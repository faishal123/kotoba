import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const baseButtonClassName =
  "rounded-2xl font-bold border py-3 px-6 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all";

const buttonVariantClassNames = {
  primary:
    "bg-primary text-white border-blue-secondary button-shadow-blue-secondary hover:bg-primary/90 transition-all",
  secondary:
    "bg-white text-primary border-white-secondary button-shadow-white-secondary hover:bg-white/90 transition-all",
  answerChoice: "bg-green-500 text-white hover:bg-green-600",
};

type ButtonProps = {
  variant?: "primary" | "secondary" | "answerChoice";
  label?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export const Button = ({
  variant = "primary",
  label,
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      className={cn([
        baseButtonClassName,
        buttonVariantClassNames[variant],
        className,
      ])}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
