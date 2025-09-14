import { usePathname } from "next/navigation";

const headerTextMap: Record<string, { character: string; title: string }> = {
  "/katakana": {
    character: "ア",
    title: "KATAKANA",
  },
  "/hiragana": {
    character: "あ",
    title: "HIRAGANA",
  },
};

export const Header = () => {
  const pathName = usePathname();
  const character = headerTextMap[pathName].character;
  const title = headerTextMap[pathName].title;
  return (
    <div className="text-center bg-primary text-white py-5 text-shadow-lg/15">
      <div className="text-4xl xs:text-6xl font-bold">{character}</div>
      <div className="text-sm xs:text-base font-bold">{title}</div>
    </div>
  );
};
