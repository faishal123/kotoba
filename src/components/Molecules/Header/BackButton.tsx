"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Atoms/Button/Button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const HeaderBackButton = ({
  hidden,
  backUrl,
}: {
  hidden?: boolean;
  backUrl?: string;
}) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        if (backUrl) {
          router.replace(backUrl);
        } else {
          router.back();
        }
      }}
      label={<ArrowLeft width={30} height={30} />}
      className={cn([
        "p-0 size-12 rounded-full flex justify-center items-center",
        hidden && "invisible",
      ])}
      variant="secondary"
    />
  );
};
