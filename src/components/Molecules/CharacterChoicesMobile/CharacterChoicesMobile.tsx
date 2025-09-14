import { Card } from "@/components/Atoms/Card/Card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const choices = [
  {
    href: "/hiragana",
    label: "Hiragana",
    character: "あ",
  },
  {
    href: "/katakana",
    label: "Katakana",
    character: "ア",
  },
  {
    href: "/kanji",
    label: "Kanji",
    character: "字",
  },
];

export const CharacterChoicesMobile = () => {
  const pathname = usePathname();
  return (
    <Card className="pb-10 px-3 pt-3 xs:px-5 xs:pt-5 fixed bottom-0 left-0 flex justify-around rounded-none w-screen h-[126px] sm:h-[0px] sm:p-0 overflow-hidden transition-all sm:border-none">
      {choices.map((choice) => {
        const isActive = pathname === choice.href;
        return (
          <Link
            className={cn([
              "transition-all flex flex-col xs:flex-row items-center gap-0 xs:gap-2 p-2 xs:py-3 xs:px-5 w-[180px] hover:text-primary rounded-lg hover:bg-primary/10",
              isActive ? "text-primary" : "text-gray",
            ])}
            key={choice.href}
            href={choice.href}
          >
            <span className="text-2xl xs:text-4xl font-bold">
              {choice.character}
            </span>
            <span className="xs:text-lg">{choice.label}</span>
          </Link>
        );
      })}
    </Card>
  );
};
