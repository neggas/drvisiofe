import React, { Suspense } from "react";
import { PageFallback, IdentifyPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Identify",
};

export default function Identity() {
  return (
    <Suspense fallback={<PageFallback />}>
      <IdentifyPage />
    </Suspense>
  );
}
