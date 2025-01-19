import { CustomFullScreenLoader } from "@/components";
import QuizzTemplate from "@/templates/QuizzTemplate";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dr Visio Quizz",
  description: "Quizz description",
};

export default function QuizzLayout({ children }: { children: React.ReactNode }) {
  return (
    <QuizzTemplate>
      <Suspense
        fallback={
          <>
            <CustomFullScreenLoader />
          </>
        }>
        {children}
      </Suspense>
    </QuizzTemplate>
  );
}
