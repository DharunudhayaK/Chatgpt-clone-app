"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Logpage from "../re-usable-components/logins";
import { usePublicRouteGuard } from "../routerAuthenticate/usePublicRouteGuard";
import { Loader } from "../utils/component-util";
import { Box } from "@mui/material";

const Signup = () => {
  const allowed = usePublicRouteGuard();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!allowed) {
    return (
      <Box
        className="!h-screen !w-full !flex !items-center !justify-center !bg-[#373737]"
        component={"div"}
      >
        <Loader color="#fff" size={50} />
      </Box>
    );
  }

  return (
    <Logpage
      welcomeMsg={"Create your account"}
      isAccount={"Already have an account?"}
      navigateInfo={{
        url: "/sign-in",
        label: "Sign in",
      }}
      router={router}
      isMounted={isMounted}
    />
  );
};

export default Signup;
