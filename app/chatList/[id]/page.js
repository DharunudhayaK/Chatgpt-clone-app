"use client";

import { CustomTooltip } from "@/app/utils/custom-tooltip/CustomTooltip";
import {
  Box,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { PiCopy } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import { v4 as uuidv4 } from "uuid";
import { BsArrowDownShort, BsFillArrowUpCircleFill } from "react-icons/bs";
import {
  CustomParagraph,
  formatTime,
  Loader,
} from "@/app/utils/component-util";
import { useSelector } from "react-redux";
import { axiosGet, axiosPost } from "@/app/utils/axiosutils/axiosOperation";
import { TypeAnimation } from "react-type-animation";
import { showErrorToast } from "@/app/utils/toast-container/toastify";

const initialState = {
  answerCopy: {},
  chatRoute: [],
  search: "",
  isHovered: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "answerCpy":
      return {
        ...state,
        answerCopy: {
          ...state?.answerCopy,
          [action.payload[0]]: action.payload[1],
        },
      };
    case "routeID":
      return {
        ...state,
        chatRoute: action.payload,
      };
    case "search":
      return {
        ...state,
        search: action.payload,
      };
    case "hover":
      return {
        ...state,
        isHovered: action.payload,
      };
    case "copy":
      return {
        ...state,
        isCopied: action.payload,
      };
    default:
      break;
  }
}

const ChatRoute = () => {
  const { id } = useParams();
  const {
    token,
    user,
    themeMode = "System",
    sidebarToggle,
    bodyZindex,
  } = useSelector((state) => state?.reduxState);
  const router = useRouter();
  // 303030;
  const scrollRef = useRef(null);
  const [chatData, setChatData] = useState({});
  const [state, dispatchEvent] = useReducer(reducer, initialState);
  const [iconLoader, setIconLoader] = useState(false);
  const [showFloatButton, setShowFloatButton] = useState(false);
  const lastScrollTop = useRef(0);

  const onCopy = () => {
    dispatchEvent({ type: "copy", payload: true });
    setTimeout(() => {
      dispatchEvent({ type: "copy", payload: false });
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatData]);

  async function searchQuestion() {
    const copyVal = state?.search.trim();
    setIconLoader((currBoolean) => !currBoolean);
    try {
      const parameterData = {
        message: copyVal,
      };
      if (!id) {
        const chatId = uuidv4();
        parameterData["chatId"] = chatId;
      } else {
        parameterData["chatId"] = id;
      }
      const apiURL = "/api/chats";
      const response = await axiosPost(apiURL, { ...parameterData }, token);

      if (response?.data?.message) {
        router.push(`/chatList/${parameterData?.chatId}`);
      }
      setIconLoader((currBoolean) => !currBoolean);
      dispatchEvent({ type: "search", payload: "" });
      reFetchChatData(parameterData?.chatId, false, Boolean("newResponse"));
    } catch (error) {
      const { message = "" } = error?.response?.data || {};
      setIconLoader((currBoolean) => !currBoolean);
      throw new Error(message);
    } finally {
      setChatData((oldState) => ({
        ...(oldState ?? {}),
        loading: false,
      }));
    }
  }

  const fetchChatHistory = async (id) => {
    try {
      const apiURL = `/api/getChatData?id=${id}`;
      const response = await axiosGet(apiURL, token);
      return response?.data?.message;
    } catch (err) {
      throw new Error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (id) {
      reFetchChatData(id, true, Boolean(null));
    }
  }, [id]);

  const reFetchChatData = useCallback(async (id, boolean, latest) => {
    setChatData((oldState) => {
      const temp = { ...oldState };
      temp["loading"] = boolean;
      return temp;
    });

    try {
      const resp = await fetchChatHistory(id);
      setChatData((oldState) => ({
        ...(oldState ?? {}),
        loading: false,
        data: resp ?? [],
        iconBoolean: false,
        latest,
      }));
    } catch (err) {
      router.replace("/chatList");
      showErrorToast(err.toString());
      setChatData((oldState) => ({
        ...(oldState ?? {}),
        loading: false,
        error: err?.message ?? "Server Error",
        iconBoolean: false,
      }));
    }
  }, []);

  const onCopyAnswer = (index) => {
    dispatchEvent({ type: "answerCpy", payload: [index, true] });
    setTimeout(() => {
      dispatchEvent({ type: "answerCpy", payload: [index, false] });
    }, 1500);
  };

  const onSearch = (e) => {
    const { name, value } = e.target;
    dispatchEvent({ type: "search", payload: value });
  };

  useEffect(() => {
    const scrollContainer = scrollRef?.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollTop = scrollContainer.scrollTop;
      const maxScrollTop =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;

      const isScrollingUp = currentScrollTop < lastScrollTop.current;
      const isAtBottom = currentScrollTop >= maxScrollTop - 10; // more strict

      if (isScrollingUp) {
        setShowFloatButton(true);
      } else if (isAtBottom) {
        setShowFloatButton(false);
      }

      lastScrollTop.current = currentScrollTop;
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="!w-full !relative !h-full">
      <div
        className="!h-[calc(100vh-155px)] !overflow-auto !w-[100%] !py-1"
        ref={scrollRef}
      >
        <div
          className={`${
            !sidebarToggle
              ? "mobile-sm:!px-4 mobile-lg2:!px-0 !w-[100%] mobile-lg:!w-[90%] tablet-sm2:!w-[82%] tablet-md:!w-[70%] tablet-lg:!w-[58%]"
              : "!w-[100%] mobile-lg:!px-5 tablet-sm:!w-[85%] tablet-md:!w-[80%] tablet-lg:!w-[62%]"
          } !mx-auto`}
        >
          {chatData?.loading ? (
            <div className="!h-[calc(100vh-220px)] !w-full flex items-center justify-center">
              <Loader
                color={themeMode === "Light" ? "#2e2e2e" : "#ECECEC"}
                size={"35"}
              />
            </div>
          ) : (
            id &&
            chatData?.data?.streams?.map((chat, index) => (
              <div key={chat?._id} className="!flex !flex-col !gap-[20px] mt-5">
                <div
                  className="!flex !flex-col !w-full !h-full !items-end !gap-[2px]"
                  onMouseEnter={() => {
                    const id = chat?._id;
                    dispatchEvent({ type: "hover", payload: { [id]: true } });
                  }}
                  onMouseLeave={() => {
                    const id = chat?._id;
                    dispatchEvent({ type: "hover", payload: { [id]: false } });
                  }}
                >
                  <div
                    className={`${
                      themeMode === "Light" ? "!bg-[#F4F4F4]" : "!bg-[#303030]"
                    } !py-3 !px-4 !rounded-[20px] !max-w-[60%] !break-words`}
                  >
                    <p
                      className={`!whitespace-normal break-words !text-start ${
                        themeMode === "Light" && "!text-[#2e2e2e]"
                      }`}
                    >
                      {chat?.input}
                    </p>
                  </div>
                  <div
                    className={`flex gap-[4px] ${
                      state?.isHovered?.[chat?._id]
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <CustomParagraph themeMode={themeMode}>
                      {formatTime(chat?.time_stamp)}
                    </CustomParagraph>
                    <CopyToClipboard text={chat?.input} onCopy={onCopy}>
                      <ListItemButton
                        dense
                        sx={{
                          borderRadius: "6px",
                          "&:hover": {
                            backgroundColor:
                              themeMode === "Light" ? "#f0f0f0" : "#373737",
                          },
                          px: "4.5px !important",
                          py: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: "auto" }}>
                          <CustomTooltip
                            title={
                              !state?.isCopied ? "Copy question" : "Copied"
                            }
                            placement={"bottom"}
                            arrow
                          >
                            {state?.isCopied ? (
                              <TiTick
                                size={15}
                                color={
                                  themeMode === "Light" ? "#5D5D5D" : "#bababa"
                                }
                              />
                            ) : (
                              <PiCopy
                                size={15}
                                color={
                                  themeMode === "Light" ? "#5D5D5D" : "#bababa"
                                }
                              />
                            )}
                          </CustomTooltip>
                        </ListItemIcon>
                      </ListItemButton>
                    </CopyToClipboard>
                  </div>
                </div>

                {/* ----------------->> Chat Answer section <<-------------------  */}
                <div className="!text-start !w-[100%] !flex !flex-col !gap-[0px]">
                  <div className="rounded-lg text-start max-w-full w-full">
                    {chat?.modelSolution &&
                      formatChatResponse(
                        chat.modelSolution,
                        chatData?.latest,
                        chatData?.data?.streams?.length,
                        index,
                        themeMode
                      )}
                  </div>

                  <Box
                    component={"div"}
                    sx={{
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <CustomParagraph themeMode={themeMode}>
                      {formatTime(chat?.time_stamp)}
                    </CustomParagraph>
                    <CopyToClipboard
                      text={chat?.modelSolution}
                      onCopy={() => onCopyAnswer(index)}
                    >
                      <ListItemButton
                        dense
                        sx={{
                          borderRadius: "6px",
                          "&:hover": {
                            backgroundColor:
                              themeMode === "Light" ? "#f0f0f0" : "#373737",
                          },
                          px: "4.5px !important",
                          py: "4px",
                          maxWidth: 26,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: "auto" }}>
                          <CustomTooltip
                            title={
                              !state?.["answerCopy"]?.[index]
                                ? "Copy"
                                : "Copied"
                            }
                            placement={"bottom"}
                            arrow
                          >
                            {state?.["answerCopy"]?.[index] ? (
                              <TiTick
                                size={15}
                                color={
                                  themeMode === "Light" ? "#5D5D5D" : "#bababa"
                                }
                              />
                            ) : (
                              <PiCopy
                                size={15}
                                color={
                                  themeMode === "Light" ? "#5D5D5D" : "#bababa"
                                }
                              />
                            )}
                          </CustomTooltip>
                        </ListItemIcon>
                      </ListItemButton>
                    </CopyToClipboard>
                  </Box>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div
        className={`!w-full px-4 ${
          themeMode === "Light" ? "!text-black" : "!text-white"
        }  !flex !items-center !place-content-center !absolute ${
          !id ? "!flex-col !top-[23%] !gap-5" : "!flex-row !top-[75%]"
        }`}
      >
        {!id && <p className="text-[28px] font-bold ">What can I help with?</p>}
        <TextField
          variant="outlined"
          placeholder="Ask anything"
          multiline
          rows={2}
          onChange={onSearch}
          value={state?.search}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              state?.search.trim()?.length
            ) {
              e.preventDefault();
              searchQuestion();
            }
          }}
          InputProps={{
            sx: {
              fontSize: 1,
            },
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  position: "absolute",
                  bottom: 12,
                  right: 10,
                  pointerEvents: Boolean(chatData?.loading) ? "none" : "cursor",
                  cursor:
                    Boolean(chatData?.loading) || !Boolean(state?.search)
                      ? "auto"
                      : "pointer",
                }}
              >
                <CustomTooltip
                  placement={"top"}
                  title={"Tap your question"}
                  arrow
                >
                  {iconLoader ? (
                    <Loader
                      color={themeMode === "Light" ? "#2e2e2e" : "#ECECEC"}
                      size={"35"}
                    />
                  ) : (
                    <BsFillArrowUpCircleFill
                      size={!id ? 35 : 30}
                      color={
                        !Boolean(state?.search) || Boolean(chatData?.loading)
                          ? themeMode === "Light"
                            ? "#bdbdbd"
                            : "#424242"
                          : themeMode === "Light"
                          ? "#000000"
                          : "white"
                      }
                      className={`text-[10px] ${
                        !Boolean(state?.search) || Boolean(chatData?.loading)
                          ? "hover:!text-[#424242]"
                          : themeMode === "Light"
                          ? "hover:!text-[#424242]"
                          : "hover:!text-[#dedede]"
                      } `}
                      onClick={searchQuestion}
                    />
                  )}
                </CustomTooltip>
              </InputAdornment>
            ),
          }}
          className={`${
            !sidebarToggle
              ? "!w-[100%] mobile-lg:!w-[96%] tablet-sm2:!w-[82%] tablet-md:!w-[70%] tablet-lg:!w-[59%]"
              : "!w-[100%] tablet-md:!w-[80%] tablet-lg:!w-[62%]"
          } !relative !bottom-2`}
          sx={{
            "& .MuiInputBase-root": {
              position: "relative",
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: themeMode === "Light" ? "#fff" : "#2f2f2f",
              borderRadius: "26px",
              border: themeMode === "Light" ? "none" : "0.01px solid #585858",
              fontSize: "15px",
              paddingY: id ? "15px !important" : "24px",
              boxShadow:
                themeMode === "Light"
                  ? "0px 0px 10px rgba(0, 0, 0, 0.1)"
                  : "none",
              "& textarea": {
                color: themeMode === "Light" ? "#2e2e2e" : "#ffffff !important",
                lineHeight: "1.1 !important",
                minHeight: "25px !important",
                letterSpacing: 0.5,
              },
              "& fieldset": {
                borderColor: themeMode === "Light" ? "" : "#2f2f2f !important",
                borderWidth:
                  themeMode === "Light"
                    ? "0.4px !important"
                    : "0.9px !important",
              },
              "&:hover fieldset": {
                borderColor:
                  themeMode === "Light" ? "#cbcbcb" : "#2f2f2f !important",
              },
              "&.Mui-focused": {
                backgroundColor:
                  themeMode === "Light" ? "#fff" : "#2f2f2f !important",
              },
              "&.Mui-focused textarea": {
                backgroundColor:
                  themeMode === "Light" ? "#fff" : "#2f2f2f !important",
              },
              "&.Mui-focused fieldset": {
                borderColor: themeMode === "Light" ? "#aaa" : "#5a5a5a",
                borderWidth: "0.6px",
              },
            },
            zIndex: bodyZindex ? 9999 : 999,
          }}
        />
      </div>
      <div
        className={`!absolute ${
          showFloatButton ? "visible" : "hidden"
        } !bottom-[152px] !left-[50%] !-translate-x-1/2 ${
          bodyZindex ? "!z-[9999]" : "!z-[999]"
        }`}
        style={{ pointerEvents: "auto" }}
      >
        <BsArrowDownShort
          size={31}
          color={themeMode === "Light" ? "#000000" : "#fff"}
          className={`!cursor-pointer border-[1px] border-solid  ${
            themeMode === "Light"
              ? "bg-white border-[#e6e6e6]"
              : "!bg-[#212121] border-[#484848]"
          } rounded-full`}
          onClick={() => {
            const el = scrollRef.current;
            el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
};

export default ChatRoute;

const formatChatResponse = (
  text,
  latestDataBoolean,
  len,
  currIndex,
  themeMode
) => {
  const lines = text.split("\n");

  const formatted = [];
  let codeBlock = false;
  let codeLines = [];

  let currentListType = null;
  let listItems = [];

  const flushList = (index) => {
    if (listItems.length > 0) {
      const ListTag = currentListType === "ul" ? "ul" : "ol";
      formatted.push(
        <ListTag
          key={`list-${index}`}
          className={`${
            currentListType === "ul" ? "list-disc" : "list-decimal"
          } ml-6 mb-2 ${
            themeMode === "Light" ? "!text-[#2e2e2e]" : "!text-gray-300"
          } space-y-1`}
        >
          {listItems}
        </ListTag>
      );
      listItems = [];
      currentListType = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushList(index);
      codeBlock = !codeBlock;
      if (!codeBlock) {
        formatted.push(
          <CodeBlock
            code={codeLines.join("\n")}
            index={index}
            key={`codeblock-${index}`}
            totalLength={lines?.length}
            themeMode={themeMode}
          />
        );
        codeLines = [];
      }
      return;
    }

    if (codeBlock) {
      codeLines.push(line);
      return;
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      flushList(index);
      const level = trimmed.match(/^#{1,6}/)[0].length;
      const Tag = `h${Math.min(level + 2, 6)}`;
      formatted.push(
        <Tag
          key={index}
          className={`${
            themeMode === "Light" ? "!text-[#2e2e2e]" : "!text-white"
          } font-semibold mb-2 mt-4`}
        >
          {trimmed.replace(/^#{1,6}\s/, "")}
        </Tag>
      );
      return;
    }

    if (/^\-\s+/.test(trimmed)) {
      if (currentListType && currentListType !== "ul") flushList(index);
      currentListType = "ul";
      listItems.push(<li key={index}>{trimmed.replace(/^\-\s+/, "")}</li>);
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      if (currentListType && currentListType !== "ol") flushList(index);
      currentListType = "ol";
      listItems.push(<li key={index}>{trimmed.replace(/^\d+\.\s+/, "")}</li>);
      return;
    }

    flushList(index);

    if (/\*\*(.*?)\*\*/.test(trimmed)) {
      formatted.push(
        <p
          key={index}
          className={`${
            themeMode === "Light" ? "!text-[#2e2e2e]" : "!text-gray-200"
          } mb-0`}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: trimmed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
            }}
          />
        </p>
      );
      return;
    }

    if (/`([^`]+)`/.test(trimmed)) {
      const parts = trimmed.split(/(`[^`]+`)/g);
      formatted.push(
        <p
          key={index}
          className={`${
            themeMode === "Light" ? "!text-[#2e2e2e]" : "!text-gray-300"
          }  mb-2`}
        >
          {parts.map((part, idx) =>
            part.startsWith("`") && part.endsWith("`") ? (
              <code
                key={idx}
                className={`${
                  themeMode === "Light"
                    ? "!text-blue-600 !bg-[#F4F4F4]"
                    : "text-yellow-300 !bg-[#161616]"
                }  font-mono px-1 py-1 rounded`}
              >
                {part.slice(1, -1)}
              </code>
            ) : (
              <span key={idx}>{part}</span>
            )
          )}
        </p>
      );
      return;
    }

    if (trimmed !== "") {
      formatted.push(
        <p
          key={index}
          className={`${
            themeMode === "Light" ? "!text-[#2e2e2e]" : "!text-gray-300"
          } leading-relaxed`}
        >
          {trimmed}
        </p>
      );
    }
  });

  flushList(lines.length);

  const formattedText = formatted[0]?.props?.children || "";

  // FINAL RETURN SECTION
  return latestDataBoolean && len - 1 === currIndex ? (
    <TypeAnimation
      sequence={[formattedText]}
      wrapper="div"
      cursor={false}
      omitDeletionAnimation={true}
      className={`${
        themeMode === "Light" ? "!text-[#2e2e2e]" : "!text-white"
      } `}
    />
  ) : (
    <>{formatted}</>
  );
};

const CodeBlock = ({ code, index, totalLength, themeMode }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`font-mono text-sm ${
        totalLength - 1 !== index ? "mb-7" : "mb-0"
      } mt-7 border ${
        themeMode === "Light" ? "!border-[#c0c0c0]" : "!border-[#3a3a3a]"
      }  rounded-[6px]`}
    >
      <div
        className={`flex justify-end z-10 ${
          themeMode === "Light" ? "!bg-[#fff]" : "!bg-[#373737]"
        } py-[4px] px-[6px] rounded-tl-[5px] rounded-tr-[5px]`}
      >
        <CopyToClipboard text={code} onCopy={onCopy}>
          <ListItemIcon sx={{ cursor: "pointer" }}>
            <CustomTooltip
              title={!copied ? "Copy" : ""}
              placement={"top"}
              arrow
            >
              <Stack direction={"row"} spacing={0.5}>
                <Box
                  component={"div"}
                  sx={{
                    placeContent: "center",
                  }}
                >
                  {copied ? (
                    <TiTick
                      size={15}
                      color={themeMode === "Light" ? "#5D5D5D" : "#F3F3F3"}
                    />
                  ) : (
                    <PiCopy
                      size={14}
                      color={themeMode === "Light" ? "#5D5D5D" : "#F3F3F3"}
                    />
                  )}
                </Box>
                <Typography
                  component={"span"}
                  variant="span"
                  sx={{
                    color: themeMode === "Light" ? "#5D5D5D" : "#F3F3F3",
                    fontSize: "12px",
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </Typography>
              </Stack>
            </CustomTooltip>
          </ListItemIcon>
        </CopyToClipboard>
      </div>

      {/* Actual code content */}
      <div
        className={`!px-5 !py-3  ${
          themeMode === "Light"
            ? "!bg-[#F4F4F4] !text-blue-600"
            : "!bg-[#161616] !text-yellow-400 "
        } !overflow-x-auto rounded-bl-[5px] rounded-br-[5px]`}
      >
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
