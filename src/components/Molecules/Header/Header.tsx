"use client";

import { characterChoices } from "@/constant/characterChoices";
import { usePathname } from "next/navigation";
import { HeaderBackButton } from "./BackButton";

const headerTextMap: Record<string, { character: string; title: string }> =
  characterChoices.reduce((a, c) => {
    return {
      ...a,
      [c.href]: {
        character: c.character,
        title: c.label,
      },
    };
  }, {});

export const Header = ({
  customTitle,
  customCharacter,
  showBackButton = true,
  backUrl,
}: {
  customTitle?: string;
  customCharacter?: string;
  showBackButton?: boolean;
  backUrl?: string;
}) => {
  const pathName = usePathname();
  const character = headerTextMap?.[pathName]?.character;
  const title = headerTextMap?.[pathName]?.title;
  return (
    <div className="text-center items-center flex px-10 justify-between bg-primary text-white py-5 text-shadow-lg/15">
      <HeaderBackButton backUrl={backUrl} hidden={!showBackButton} />
      <div>
        <div className="text-4xl xs:text-6xl font-bold">
          {character || customCharacter}
        </div>
        <div className="text-sm xs:text-base font-bold">
          {title || customTitle}
        </div>
      </div>
      <HeaderBackButton hidden />
    </div>
  );
};
