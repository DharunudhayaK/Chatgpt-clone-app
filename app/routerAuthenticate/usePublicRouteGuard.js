"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export const usePublicRouteGuard = () => {
  const { isLoggedin } = useSelector((state) => state.reduxState);
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isLoggedin) {
      router.replace("/chatList");
    } else {
      setAllowed(true);
    }
  }, [isLoggedin]);

  return allowed;
};
