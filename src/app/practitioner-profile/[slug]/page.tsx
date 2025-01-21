import React, { Suspense } from "react";
import { PractitionerProfilePage, CustomLoader } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DrVisio Recherche de praticien",
  description: "DrVisio Recherche de praticien",
};

function PractitionerProfilePageFallback() {
  return <CustomLoader showImage />;
}

export default function PractitionerProfile({ params }: { readonly params: { slug: number } }) {
  return (
    <Suspense fallback={<PractitionerProfilePageFallback />}>
      <PractitionerProfilePage slug={params?.slug} />
    </Suspense>
  );
}
