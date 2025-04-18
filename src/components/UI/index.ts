// src/components/UI/index.ts
import dynamic from "next/dynamic";
import Glitch from "./Glitch";
import TypeWriter from "./TypeWriter";

// Lazy load the CRT effect component using Next.js dynamic import
const CRTEffect = dynamic(() => import("./CRTEffect"), {
  ssr: false,
  loading: () => null,
});

export { CRTEffect, Glitch, TypeWriter };
