import { Metadata } from "next";
import React from "react";
import TeleconsultDoctor from "./page";

export const metadata: Metadata = {
  title: {
    template: "%s | DrVisio Teleconsultation",
    default: "DrVisio Teleconsultation",
  },
  description: "Teleconsultation Doctor Description",
};

export default function TeleconsultDoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TeleconsultDoctor />
    </>
  );
}
