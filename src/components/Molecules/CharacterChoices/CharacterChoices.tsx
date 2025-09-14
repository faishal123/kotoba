import { Card } from "@/components/Atoms/Card/Card";

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

export const CharacterChoices = () => {
  return (
    <Card className="p-10 flex flex-col gap-10">
      {choices.map((choice) => (
        <a key={choice.href} href={choice.href}>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold">{choice.character}</span>
            <span className="text-lg">{choice.label}</span>
          </div>
        </a>
      ))}
    </Card>
  );
};
