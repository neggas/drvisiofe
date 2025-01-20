import React, { Suspense } from "react";
import { PageFallback, SearchPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DrViso Rechercher praticien",
  description: "Rechercher praticien pour patients",
};

export default function DoctorsList() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SearchPage />
    </Suspense>
  );
}
