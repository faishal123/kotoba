"use client";

import { CharacterChoices } from "@/components/Molecules/CharacterChoices/CharacterChoices";
import { Header } from "@/components/Molecules/Header/Header";

export default function LevelsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Header backUrl="/" />
        <div className="relative flex pb-[calc(40px+126px)] sm:pb-10 p-10 gap-0 sm:gap-10 transition-all">
          <div className="flex flex-col gap-5 w-0 transition-all overflow-hidden sm:w-[250px]">
            <CharacterChoices />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
