import { Card } from "@/components/Atoms/Card/Card";
import { characterChoices } from "@/constant/characterChoices";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const CharacterChoices = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  return (
    <Card
      className={cn([
        "p-10 flex flex-col text-left align-left items-center gap-10",
        className,
      ])}
    >
      {characterChoices.map((choice) => {
        const isActive = pathname === choice.href;
        return (
          <Link
            className={cn([
              "transition-all flex items-center gap-2 py-3 px-5 w-[180px] hover:text-primary rounded-lg hover:bg-primary/10",
              isActive ? "text-primary" : "text-gray",
            ])}
            key={choice.href}
            href={choice.href}
          >
            <span className="text-4xl font-bold">{choice.character}</span>
            <span className="text-lg">{choice.label}</span>
          </Link>
        );
      })}
    </Card>
  );
};
