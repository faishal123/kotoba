"use client";

import { Card } from "@/components/Atoms/Card/Card";
import { Header } from "@/components/Molecules/Header/Header";
import { characterChoices } from "@/constant/characterChoices";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header
        showBackButton={false}
        customTitle="KOTOBA"
        customCharacter="言葉"
      />
      <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {characterChoices.map((choice) => (
          <Link key={choice.href} href={choice.href}>
            <Card className="w-full h-full p-5 flex gap-5 items-center">
              <div className="text-4xl font-bold">{choice.character}</div>
              <div>
                <div className="text-lg font-bold">{choice.label}</div>
                <div className="text-lg">{choice.description}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
