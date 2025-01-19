import React, { Suspense } from "react";
import { PractitionerProfilePage, CustomLoader } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practitioner Profile",
  description: "Practitioner Profile",
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
