import PractitionerRegistrationTemplate from "@/templates/PractitionerRegistrationTemplate";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Practitioner",
  description: "Create Practitioner",
};

export default function PractitionerRegistrationLayout({ children }: { children: React.ReactNode }) {
  return <PractitionerRegistrationTemplate>{children}</PractitionerRegistrationTemplate>;
}
