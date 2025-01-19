import TeleconsultationTemplate from "@/templates/TeleconsultationTemplate";
import { ProtectedRoutes } from "@/utility";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Teleconsultation",
  description: "teleconsultation description",
};

export default function TeleconsultationLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoutes>
      <TeleconsultationTemplate>{children}</TeleconsultationTemplate>
    </ProtectedRoutes>
  );
}
