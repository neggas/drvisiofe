import PractitionerDashboardTemplate from "@/templates/PractitionerDashboardTemplate";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | DrVisio Practitioner Dashboard",
    default: "DrVisio Practitioner Dashboard",
  },
  description: "Practitioner Dashboard Description",
};

export default function PractitionerDashboardLayout({ children }: { children: React.ReactNode }) {
  return <PractitionerDashboardTemplate>{children}</PractitionerDashboardTemplate>;
}
