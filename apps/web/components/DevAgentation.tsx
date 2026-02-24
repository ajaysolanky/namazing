"use client";

import { useEffect, useState } from "react";
import { Agentation } from "agentation";

export function DevAgentation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <Agentation />;
}

