import { Metadata } from "next";
import React from "react";
import Articles from "./page";

export const metadata: Metadata = {
  title: {
    template: "%s | DrVisio Articles",
    default: "DrVisio Articles",
  },
  description: "Articles Description",
};

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
