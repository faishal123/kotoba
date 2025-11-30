"use client";

import { CardButton } from "@/components/Atoms/CardButton/CardButton";
import { questionCountOptions } from "@/constant/common";
import { useMutableSearchParams } from "@/utils/url";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const ChooseQuestionCountPage = () => {
  const router = useRouter();
  const pathName = usePathname();
  const mutableSearchParams = useMutableSearchParams();

  return (
    <div className="flex-1 flex items-center justify-center flex-col">
      <div className="font-bold text-2xl text-primary">
        How many questions ?
      </div>
      <div className="flex gap-5 justify-around py-5">
        {questionCountOptions.map((option) => (
          <CardButton
            onClick={() => {
              mutableSearchParams.append("questionCount", `${option}`);
              router.replace(pathName + "?" + mutableSearchParams.toString());
            }}
            key={option}
          >
            {option}
          </CardButton>
        ))}
      </div>
    </div>
  );
};
