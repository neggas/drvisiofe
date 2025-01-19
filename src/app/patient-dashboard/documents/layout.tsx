import DocumentTemplate from "@/templates/DocumentTemplate";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Document",
  description: "document description",
};

export default function TeleconsultationLayout({ children }: { children: React.ReactNode }) {
  return <DocumentTemplate>{children}</DocumentTemplate>;
}
