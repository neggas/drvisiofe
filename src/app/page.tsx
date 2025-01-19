import { HomePage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr Visio",
  description: "Dr. Visio est un service de téléconsultation pour les soins de santé.",
};

export default function Home() {
  return <HomePage />;
}
