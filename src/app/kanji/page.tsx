import Image from "next/image";
import Link from "next/link";
import kanjiMascot from "@/assets/kanji-mascot.png";
import { Button } from "@/components/Atoms/Button/Button";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <Image width={100} alt="Kanji" src={kanjiMascot} />
      <div className="text-center text-lg font-bold mb-5">
        <div>This page is still under construction</div>
        <div>Stay tuned for the next version!</div>
      </div>
      <Link href={"/hiragana"}>
        <Button label="Go to Hiragana" />
      </Link>
    </div>
  );
}
