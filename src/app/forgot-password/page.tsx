import React, { Suspense } from "react";
import { PageFallback, ForgotPasswordPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Forgot Password",
};

export default function ForgotPassword() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
