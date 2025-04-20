"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import chatgpt_log from "../public/assets/images/chat-logo.jpg";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TypeAnimation } from "react-type-animation";
import { onNavigate } from "./re-usable-components/navigate";
import { useSelector } from "react-redux";
import { Loader, ScreenSizeTracker } from "./utils/component-util";

const buttonCustomStyles = {
  textTransform: "none",
  fontSize: 11,
  background: "#0066DE",
  borderRadius: "35px",
  letterSpacing: "0.6px",
  fontWeight: 600,
  paddingY: 1,
  ":hover": {
    background: "#0d47bf",
  },
};

export default function Home() {
  const { isLoggedin, ...remainingState } = useSelector(
    (state) => state?.reduxState
  );
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { height, width } = ScreenSizeTracker();

  useEffect(() => {
    if (isLoggedin) {
      router.replace("/chatList");
    } else {
      setIsMounted(true);
    }
  }, [isLoggedin]);

  if (!isMounted) {
    return (
      <Box className="!h-screen !w-full !flex !items-center !justify-center !bg-[#373737]">
        <Loader color="#fafafa" size="50" />
      </Box>
    );
  }

  return (
    <Box
      component={"div"}
      className={`!h-[calc(100vh-0px)] !w-full !flex !overflow-hidden mobile-sm:!bg-[#00002e] tablet-sm2:!bg-none`}
    >
      <Box
        component={"div"}
        className="!bg-[#00002e] py-3 px-5 !h-[100vh] !flex !flex-col !justify-between mobile-sm:!hidden tablet-sm:!block tablet-sm:!w-[50%] tablet-md:!w-[50%] tablet-lg:!w-[60%]"
      >
        <Typography
          variant="span"
          component={"span"}
          className="!tracking-[1px] !text-[#D292FF] font-bold flex justify-start"
        >
          ChatGPT
        </Typography>
        <div className="!h-full !place-content-center">
          <TypeAnimation
            sequence={[
              "Brainstorm names for an orange cat we're adopting from the shelter",
              1000,
              "Energy is having to browse your tech data",
              1000,
              "Improve my post for hiring a store associate",
              1000,
              "Plan a trip to see the northern lights in Norway",
              1000,
              "Write a text that goes with a kitten gif for a friend having a rough day",
              1000,
              "Summarize this article as a table of pros and cons",
              1000,
              "Summarize this article into three key points​",
              1000,
              "Recommend a dishto impress a date who's a picky eater",
              1000,
              "Help me debug why the linked list appears empty after I've reversed it",
              1000,
              "Help me debug a Python script automating daily reports",
              1000,
              "Suggest fun activities for a team-building day with remote employees",
              1000,
              "Give me ideas for a customer loyalty program in a small bookstore",
              1000,
              "Write a text that goes with a kitten gif for a friend having a rough day",
              1000,
              "Help me pick an outfit that will look good on camera",
              1000,
              "Draft an email requesting a deadline extension for my project",
              1000,
              "Give me ideas for what to do with my kids' art",
              1000,
              "Write a thank-you note to our babysitter for the last-minute help",
            ]}
            wrapper="span"
            cursor={true}
            className="type-animation tablet-md:!text-[1.7em] tablet-lg:!text-[1.5em] inline-block !text-[#D292FF] !font-[600] !opacity-100 transition-opacity duration-500 ease-in-out"
            repeat={Infinity}
            omitDeletionAnimation={true}
          />
        </div>
        {/* <Box></Box> */}
      </Box>
      <Box
        component={"div"}
        className="!bg-black !py-6 !px-5 !w-[100%] tablet-sm:!w-[50%] !h-full tablet-md:!w-[50%] tablet-lg:!w-[40%] !rounded-none tablet-sm2:!rounded-t-[40px] tablet-sm:!rounded-none"
      >
        <Box
          component={"div"}
          sx={{
            textAlign: "center",
            placeContent: "center",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box>
            <Typography
              variant="span"
              component={"span"}
              className="!tracking-[1px] !text-[#fff] !font-bold !flex !justify-start !visible tablet-sm:!hidden"
            >
              ChatGPT
            </Typography>
          </Box>
          <Box
            component={"div"}
            className="!flex !flex-col gap-3 tablet-sm2:!gap-1 !mb-6"
          >
            <Typography
              component={"span"}
              variant="span"
              className="text-[#FFFF] !tracking-wide font-bold !text-[18px] tablet-sm2:!text-[20px] tablet-sm:!text-[25px] tablet-lg:!text-[22px]"
            >
              Get started
            </Typography>
            <Stack
              direction={width < 620 ? "column" : "row"}
              spacing={1}
              marginX={"auto"}
              className="!w-[90%] mobile-md:!w-[80%] tablet-sm2:!w-[66%] tablet-md:!w-[80%] tablet-lg:!w-[68%] laptop-md:!w-[50%] laptop-lg:!w-[40%]"
            >
              <Button
                variant="contained"
                sx={{
                  ...buttonCustomStyles,
                }}
                fullWidth
                onClick={() => {
                  onNavigate("/sign-in", router, isMounted);
                }}
                className={"!text-[16px] tablet-lg:!text-[11px]"}
              >
                Log in
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{ ...buttonCustomStyles }}
                className={"!text-[16px] tablet-lg:!text-[11px]"}
              >
                Sign up
              </Button>
            </Stack>
            <Typography
              className="!text-white !tracking-wide !w-[35%] mobile-md:!w-[25%] tablet-lg:!w-[15%] !mt-2 !normal-case !font-[600] !text-[13px] tablet-lg:!text-[12px] hover:bg-gray-900 p-[6px] hover:tablet-md:!w-[110px] hover:tablet-lg:!w-[90px] hover:mx-auto hover:!rounded-[100px] hover:cursor-pointer"
              variant="span"
              component={"span"}
              sx={{
                marginX: "auto",
                borderRadius: "30px",
                ":hover": {
                  background: "#of172a",
                },
              }}
            >
              Try it first
            </Typography>
          </Box>
          <Box
            component={"div"}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Image
                src={chatgpt_log}
                alt="chatgpt-logo"
                color="#FFFFF"
                height={width < 1150 ? 30 : 25}
                width={width < 1150 ? 30 : 25}
              />
            </Box>
            <Stack
              direction={"row"}
              spacing={1}
              sx={{
                placeContent: "center",
              }}
            >
              {["Terms of use", "|", "Privacy policy"].map((str, index) => (
                <Typography
                  key={index}
                  component={"span"}
                  variant="span"
                  className="!text-[12px] tablet-lg:!text-[9px]"
                  sx={{
                    textDecoration: str !== "|" ? "underline" : "",
                    color: "#9B9B9B",
                    cursor: str !== "|" ? "pointer" : "",
                  }}
                >
                  {str}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
