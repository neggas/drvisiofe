import React, { Suspense } from "react";
import { PageFallback, ResetPasswordPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Reset Password",
};

export default function ResetPassword() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
