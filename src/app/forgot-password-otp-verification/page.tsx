import React, { Suspense } from "react";
import { PageFallback, ForgotPasswordOtpPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot Password",
};

export default function ForgotPassword() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ForgotPasswordOtpPage />
    </Suspense>
  );
}
