import React, { Suspense } from "react";
import { PageFallback, LoginUnblockPage } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Unblock",
  description: "Login Unblock",
};

export default function Login() {
  return (
    <Suspense fallback={<PageFallback />}>
      <LoginUnblockPage />
    </Suspense>
  );
}
