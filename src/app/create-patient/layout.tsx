import RegistrationTemplate from "@/templates/RegistrationTemplate";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Patient",
  description: "Create Patient",
};

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return <RegistrationTemplate>{children}</RegistrationTemplate>;
}
