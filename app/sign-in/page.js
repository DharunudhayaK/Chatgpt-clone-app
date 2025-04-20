"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logpage from "../re-usable-components/logins";
import { usePublicRouteGuard } from "../routerAuthenticate/usePublicRouteGuard";
import { Box } from "@mui/material";
import { Loader } from "../utils/component-util";

const Login = () => {
  const router = useRouter();
  const allowed = usePublicRouteGuard();
  const [isMounted, setIsMounted] = useState(false);

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
      welcomeMsg={"Welcome back"}
      isAccount={"Don't have an account?"}
      navigateInfo={{
        url: "/sign-up",
        label: "Sign up",
      }}
      router={router}
      isMounted={isMounted}
    />
  );
};

export default Login;
