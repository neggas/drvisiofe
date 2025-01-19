"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { PageFallback } from "@/components";
import { selectLoginResponse } from "@/store/reducers/loginSlice";

export function WithAuth(Component: any) {
  return function WithAuth(props: any) {
    const router = useRouter();
    const loggedInUser = useSelector(selectLoginResponse);

    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    // Redirect to login page if not authenticated
    if (!loggedInUser?.data?.id) {
      router.push("/");
      return null;
    }

    return isClient && loggedInUser?.data?.id ? <Component {...props} /> : <PageFallback />;
  };
}
