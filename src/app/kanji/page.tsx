import Image from "next/image";
import Link from "next/link";
import kanjiMascot from "@/assets/kanji-mascot.png";
import { Button } from "@/components/Atoms/Button/Button";
import { allCharactersLevel } from "@/constant/common";
import { Header } from "@/components/Molecules/Header/Header";
import { ChooseLevelLayout } from "@/components/Molecules/Layout/ChooseLevelLayout";


const kanjiLevelChoices = [
  {
    character: 'N5',
    characters: [],
    href: '/kanji/n5',
    skipChooseQuestionCount: true
  }, {
    character: 'N4',
    characters: [],
    href: '/kanji/n4',
    skipChooseQuestionCount: true
  }, {
    character: 'N3',
    characters: [],
    href: '/kanji/n3',
    skipChooseQuestionCount: true
  }, {
    character: 'N2',
    characters: [],
    href: '/kanji/n2',
    skipChooseQuestionCount: true
  }, {
    character: 'N1',
    characters: [],
    href: '/kanji/n1',
    skipChooseQuestionCount: true
  },
]

export default function Page() {
  return (
    <>
      <Header />
      <ChooseLevelLayout choices={kanjiLevelChoices} />
    </>
  );
}
