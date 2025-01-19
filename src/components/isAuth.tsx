"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { getLocalStorageData } from "@/utility";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const auth = getLocalStorageData("isLoggedIn", false);

    useEffect(() => {
      if (auth) {
        return redirect("/");
      }
    }, []);

    return <Component {...props} />;
  };
}
