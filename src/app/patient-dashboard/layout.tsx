import PatientDashboardTemplate from "@/templates/PatientDashboardTemplate";
import { ProtectedRoutes } from "@/utility";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "DrVisio Patient Dashboard",
    default: "DrVisio Patient Dashboard",
  },
  description: "Patient Dashboard Description",
};

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoutes>
      <PatientDashboardTemplate>{children}</PatientDashboardTemplate>
    </ProtectedRoutes>
  );
}
