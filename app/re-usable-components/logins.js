"use client";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Emailtextfield,
  Logbutton,
  Passwordtextfield,
} from "../re-usable-components/CredentialsTexfield";
import { onNavigate } from "../re-usable-components/navigate";
import { validateEmail, validatePassword } from "../utils/regexutil";
import { IoIosAlert, IoIosInformationCircleOutline } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import microsoftImg from "@/public/assets/images/microsoft.svg";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/stateSlice";
import { Loader } from "../utils/component-util";

const Logpage = ({
  welcomeMsg,
  isAccount,
  navigateInfo,
  router,
  isMounted,
}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState({
    value: "",
    isValid: true,
  });
  const [password, setPassword] = useState({
    value: "",
    isValid: true,
  });
  const [buttonLoader, setButtonLoader] = useState(false);
  const [showError, setShowError] = useState("");

  const OPTHERSIGNINPLATFORMS = [
    {
      icon: <FcGoogle />,
      label: "Continue with Google",
    },
    {
      icon: <Image src={microsoftImg} alt="microsoft-img" width={22.5} />,
      label: "Continue with Microsoft Account",
    },
    {
      icon: <FaApple />,
      label: "Continue with Apple",
    },
    {
      icon: <FiPhone />,
      label: "Continue with phone",
    },
  ];

  const creatingUser = async () => {
    setShowError("");
    const updatedEmail = validateEmail(email.value);
    const updatedPassword = validatePassword(password.value);
    setEmail(updatedEmail);
    setPassword(updatedPassword);

    if (!updatedEmail.value.length || !updatedPassword.value.length) {
      if (!updatedEmail.value.length) setEmail({ value: "", isValid: false });
      if (!updatedPassword.value.length)
        setPassword({ value: "", isValid: false });
      setShowError("Email and Password fields are required!.");
      return;
    }

    if (!updatedEmail.isValid || !updatedPassword.isValid) {
      setShowError("Invalid email or password");
      return;
    }

    if (welcomeMsg === "Welcome back") {
      await onLogin(updatedEmail, updatedPassword);
    } else {
      await onSignup(updatedEmail, updatedPassword);
    }
  };

  async function onLogin(updatedEmail, updatedPassword) {
    try {
      setButtonLoader(true);
      const response = await axios.post("/api/login", {
        email: updatedEmail.value,
        password: updatedPassword.value,
      });

      const { user = {}, token = "" } = response?.data || {};

      router.replace("/chatList");

      dispatch(
        setCredentials({
          token,
          user,
          loggedin: true,
        })
      );

      setShowError("");
    } catch (error) {
      setShowError(error.toString() ?? "Server Error");
    } finally {
      setButtonLoader(false);
    }
  }

  async function onSignup(updatedEmail, updatedPassword) {
    try {
      setButtonLoader(true);
      const response = await axios.post("/api/sign-up", {
        email: updatedEmail?.value ?? "",
        password: updatedPassword?.value ?? "",
      });

      setEmail({ value: "", isValid: true });
      setPassword({ value: "", isValid: true });
      setShowError("");
    } catch (error) {
      setShowError(error.toString() ?? "Server Error");
    } finally {
      setButtonLoader(false);
    }
  }

  const onEmail = (e) => {
    const { value } = e.target;
    const updatedEmail = validateEmail(value);
    setEmail(updatedEmail);
  };

  const onPassword = (value) => {
    const updatedPassword = validatePassword(value);
    setPassword(updatedPassword);
  };

  const onEnter = (event) => {
    if (event.key === "Enter" && email.isValid && password.isValid) {
      creatingUser();
    }
  };

  return (
    <div className="!h-[100vh] bg-white !w-full !text-black !p-0">
      <Box component={"div"} className="!h-full !overflow-auto flex flex-col">
        <Typography
          variant="h5"
          component={"span"}
          className="!tracking-[0.2px] !hidden tablet-sm:!visible !text-[black] !font-bold tablet-sm:!flex !text-[20px] !justify-start !absolute !p-5"
        >
          ChatGPT
        </Typography>
        <Box
          component={"div"}
          className="text-center !h-full !flex !flex-col !pt-[30px] mobile-lg:!pt-[100px] mobile-sm:!justify-between mobile-lg:!justify-normal"
        >
          <Box
            component={"div"}
            className="flex flex-col gap-5 !w-[93%] mobile-lg:!w-[77%] mobile-lg2:!w-[64%] tablet-sm2:!w-[55%] tablet-md:!w-[40%] tablet-lg:!w-[26.5%] laptop-sm:!w-[26%] laptop-md:!w-[22%] laptop-xl:!w-[20%] desktop-sm:!w-[19%] mx-auto"
          >
            <Typography
              variant="h5"
              component={"span"}
              className="!tracking-[0.2px] !text-[black] !font-bold !visible tablet-sm:!hidden !text-[20px]"
            >
              ChatGPT
            </Typography>
            <Box component={"div"}>
              <Typography
                component={"h3"}
                variant="body"
                className="font-[500] text-[#000000] text-[31px]"
              >
                {welcomeMsg}
              </Typography>
              <Box
                component={"div"}
                className={`bg-red-600 text-white font-semibold py-2 tracking-wide capitalize text-[13px] rounded-md leading-7 ${
                  showError ? "block" : "hidden"
                }`}
              >
                {showError}
              </Box>
            </Box>
            <Stack direction={"column"} spacing={2} component={"div"}>
              <Stack direction={"column"} spacing={0.1}>
                <Emailtextfield
                  label="Email address"
                  autoFocus
                  onChange={onEmail}
                  value={email?.value}
                  error={!email.isValid}
                  onKeyDown={onEnter}
                  autoComplete="new-email"
                />
                {!email.isValid ? (
                  <div className="flex items-center gap-1">
                    <IoIosAlert color="red" size={16} />
                    <Typography
                      component={"span"}
                      variant="span"
                      className="text-[11px] !text-[#D00E17]"
                      color="#DOOE17"
                    >
                      {email.value.length === 0
                        ? "Email is required."
                        : "Invalid email format."}
                    </Typography>
                  </div>
                ) : (
                  ""
                )}
              </Stack>
              <Stack direction={"column"} spacing={0}>
                <Passwordtextfield
                  label="Password"
                  value={password.value}
                  onChange={(e) => onPassword(e.target.value)}
                  error={!password.isValid}
                  autoComplete="new-password"
                  onKeyDown={onEnter}
                />
                {!password.isValid ? (
                  <div className="flex items-center gap-1">
                    <Tooltip
                      title={
                        <div className="flex flex-col gap-1">
                          {[
                            "Password must be at least 8 characters.",
                            "Include uppercase, lowercase, numbers, symbols.",
                            "Password must include special characters.",
                            "Use a mix of letters and numbers.",
                            "Ensure password is not easily guessable.",
                          ].map((ele, ind) => (
                            <li key={ind}>{ele}</li>
                          ))}
                        </div>
                      }
                      arrow
                      placement="left"
                    >
                      <IoIosAlert
                        color="red"
                        size={16}
                        className="!cursor-pointer"
                      />
                    </Tooltip>

                    <Typography
                      component={"span"}
                      variant="span"
                      className="text-[11px] !text-[#D00E17]"
                      color="#DOOE17"
                    >
                      {password.value.length === 0
                        ? "Password is required"
                        : "Valid Password need."}
                    </Typography>
                  </div>
                ) : (
                  ""
                )}
              </Stack>
            </Stack>
            <Logbutton
              onClick={creatingUser}
              startIcon={
                buttonLoader ? <Loader color="#fff" size={28} /> : null
              }
            >
              {buttonLoader ? "" : "Continue"}
            </Logbutton>
            <Stack
              direction={"row"}
              spacing={1}
              component={"div"}
              justifyContent={"center"}
            >
              <Typography
                component={"p"}
                variant="span"
                sx={{
                  fontSize: "14px",
                  color: "#2D333A",
                }}
              >
                {isAccount}
              </Typography>
              <Typography
                component={"p"}
                variant="span"
                sx={{
                  fontSize: "14px",
                  color: "#10A37F",
                  cursor: "pointer",
                }}
                onClick={() => onNavigate(navigateInfo?.url, router, isMounted)}
              >
                {navigateInfo?.label ?? ""}
              </Typography>
            </Stack>
            <Box component={"div"} className="flex flex-col gap-4 text-left">
              <Divider
                sx={{
                  fontSize: "12px",
                }}
              >
                OR
              </Divider>
              <Box className="flex flex-col gap-2 text-left">
                {OPTHERSIGNINPLATFORMS?.map((loopingObject, index) => (
                  <Button
                    variant="outlined"
                    startIcon={loopingObject?.icon}
                    key={index}
                    sx={{
                      textTransform: "none",
                      float: "left",
                      textAlign: "left",
                      border: "1px solid lightgray",
                      color: "#2D333A",
                      fontSize: "15px",
                      letterSpacing: 0.5,
                      gap: 0,
                      placeContent: "flex-start",
                    }}
                    size="large"
                  >
                    {loopingObject?.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              mt: 8,
              pb: 2,
            }}
          >
            <Typography
              component={"p"}
              variant="span"
              className="text-[#10A37F] text-[14px] cursor-pointer"
            >
              Terms of Use
            </Typography>
            <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{
                height: "14px",
                margin: "0 3px",
                fontWeight: "bold",
                mt: 0.5,
              }}
            />
            <Typography
              component={"p"}
              variant="span"
              className="text-[#10A37F] text-[14px] cursor-pointer"
            >
              Privacy Policy
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Logpage;
