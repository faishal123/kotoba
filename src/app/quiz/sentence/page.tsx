"use client";

import { SentenceQuizScreen } from "@/components/Page/SentenceQuizScreen/SentenceQuizScreen";
import { Suspense, useEffect, useState } from "react";

export default function Page() {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);
  if (!rendered) {
    return null;
  }
  return (
    <Suspense>
      <SentenceQuizScreen />
    </Suspense>
  );
}
