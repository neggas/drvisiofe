import React, { Suspense } from "react";
import { PageFallback, LoginPage } from "@/components";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Login",
  description: "Login",
};

export default function Login() {
  const headersList = headers();
  const referer = headersList.get("referer");

  return (
    <Suspense fallback={<PageFallback />}>
      <LoginPage referer={referer} />
    </Suspense>
  );
}
