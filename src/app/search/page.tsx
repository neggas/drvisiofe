import React, { Suspense } from "react";
import { PageFallback, SearchPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Practitioner",
  description: "Search Practitioner for Patients",
};

export default function DoctorsList() {
  return (
    <Suspense fallback={<PageFallback />}>
      <SearchPage />
    </Suspense>
  );
}
