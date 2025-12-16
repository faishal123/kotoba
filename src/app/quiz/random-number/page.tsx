"use client";

import RandomNumberQuiz from "@/components/Page/RandomNumberQuiz/RandomNumberQuiz";
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
      <RandomNumberQuiz />
    </Suspense>
  );
}
