// components/SessionWatcher.js
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SessionExpiredModal from "./Expiredmodal";

export default function SessionWatcher() {
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated =
    typeof window !== "undefined" && localStorage.getItem("token");
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;

  useEffect(() => {
    const checkTokenExpiry = () => {
      const currentTime = Date.now();
      const storedExpiryTime = localStorage.getItem("expiry_time");
      const hasModalBeenShown = localStorage.getItem("has_modal_shown");

      if (isAuthenticated && pathname !== "/login") {
        if (storedExpiryTime) {
          const expiryTime = new Date(storedExpiryTime).getTime();
          if (currentTime > expiryTime && !hasModalBeenShown) {
            setIsTokenExpired(true);
            localStorage.setItem("has_modal_shown", "true");
          } else if (currentTime <= expiryTime) {
            localStorage.removeItem("has_modal_shown");
          }
        } else {
          setIsTokenExpired(true);
          localStorage.setItem("has_modal_shown", "true");
        }
      }
    };

    if (isAuthenticated && user?.expiry_time) {
      localStorage.setItem("expiry_time", user.expiry_time);
      localStorage.removeItem("has_modal_shown");
    }

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, pathname, user]);

  const handleModalClose = () => {
    setIsTokenExpired(false);
    localStorage.removeItem("token");
    localStorage.removeItem("expiry_time");
    router.push("/login");
  };

  return (
    <SessionExpiredModal open={isTokenExpired} onClose={handleModalClose} />
  );
}
