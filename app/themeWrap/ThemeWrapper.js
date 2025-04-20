"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ThemeWrapper() {
  const { themeMode = "System" } = useSelector((state) => state?.reduxState);
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(
      themeMode === "Light" || pathname.includes("sign-up")
        ? "light-theme"
        : "dark-theme"
    );
  }, [themeMode, pathname]);

  return null;
}
