"use client";

import {
  Box,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CustomTooltip } from "./utils/custom-tooltip/CustomTooltip";
import { TbLayoutSidebarLeftCollapse, TbMessages } from "react-icons/tb";
import { FiEdit, FiSearch, FiX } from "react-icons/fi";
import Image from "next/image";
import {
  MdOutlineDeleteOutline,
  MdOutlineEdit,
  MdSettingsInputSvideo,
} from "react-icons/md";
import chatgptLogo from "../public/assets/images/chat-logo.jpg";
import whiteChatgptLogo from "../public/assets/images/whitechatgpt.png";
import { useParams, usePathname, useRouter } from "next/navigation";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { red } from "@mui/material/colors";
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
} from "./utils/axiosutils/axiosOperation";
import { useSelector } from "react-redux";
import {
  CustomMenuList,
  Loader,
  processTime,
  ScreenSizeTracker,
} from "./utils/component-util";
import { debounce } from "lodash";
import { DeleteDialog } from "./re-usable-components/deleteComponent";
import { zIndexUp } from "./redux/slices/stateSlice";
import { BiMenuAltLeft } from "react-icons/bi";
import { getError } from "./utils/catchError/getError";

const Sidenav = ({
  userEmail,
  dispatchEvent,
  state,
  toggleSidebar,
  dispatch,
}) => {
  const {
    token,
    user,
    themeMode = "System",
  } = useSelector((state) => state?.reduxState);
  const [hovered, setHovered] = useState({});
  const [openList, setOpenList] = useState({});
  const [chatDelete, setChatDelete] = useState({});
  const [sidebarLoader, setSidebarLoader] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [inputString, setInputString] = useState("");
  const [isRenamingId, setIsRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const { width } = ScreenSizeTracker();
  const router = useRouter();
  const { id = "" } = useParams();
  const pathname = usePathname();

  const onRouteNavigation = (id) => {
    const newPath = `/chatList/${id}`;
    if (pathname !== newPath) {
      router.push(newPath);
    }
  };

  function createNewChat() {
    if (id) {
      router.push(`/chatList`);
    }
  }

  async function fetchChatIDs() {
    try {
      const response = await axiosGet(`/api/getChatID`, token);
      return response?.data?.message ?? [];
    } catch (err) {
      const errMsg = getError(err);
      console.log(errMsg);
    }
  }

  async function getChatIDs(isBool) {
    setSidebarLoader((prevBoolean) => !prevBoolean);
    try {
      const resp = await fetchChatIDs();
      dispatchEvent({
        type: "routeID",
        payload: categorizeData(resp?.[0]?.chatId),
      });
      if (isBool) {
        if (isBool - 1 !== 0) {
          router.push(`/chatList/${resp?.[0]?.chatId?.[0]?.routeId}`);
        } else {
          router.push("/chatList");
        }
      }
      setSidebarLoader((prevBoolean) => !prevBoolean);
    } catch (err) {
      const errMsg = getError(err);
      setSidebarLoader((prevBoolean) => !prevBoolean);
      console.error("---------------------", err);
    }
  }

  useEffect(() => {
    getChatIDs();
  }, [userEmail]);

  useEffect(() => {
    if (id) {
      getChatIDs();
    }
  }, [id]);

  const openActionList = (event, routeID) => {
    event.stopPropagation();
    setOpenList((currState) => {
      const temp = { ...currState };
      temp["anchorEl"] = event.currentTarget;
      temp["routeID"] = routeID;
      return temp;
    });
  };

  async function deleteChat(id) {
    try {
      const apiURL = `/api/getChatID?id=${id}`;
      await axiosDelete(apiURL, token);
      getChatIDs(Object.values(state?.chatRoute ?? {})?.[0]?.length);
    } catch (err) {
      const errMsg = getError(err);
      console.log(
        "-------------- Error in Chat Delete -------------",
        err.message
      );
    }
  }

  function openSearchModalChats() {
    dispatch(zIndexUp(false));
    setIsSearch((currBool) => !currBool);
  }

  const slicedChat = useMemo(() => {
    const formatArray = [];
    const entries = Object.entries(state?.chatRoute || {});

    for (const [key, value] of entries) {
      if (formatArray.length >= 10) break;
      formatArray.push([key, value?.slice(0, 5)]);
    }

    return formatArray;
  }, [state?.chatRoute]);

  useEffect(() => {
    const findText = Object.values(state?.chatRoute ?? {})
      .flat(1)
      .find((ele) => ele?.routeId === id);
    document.title = `ChatGPT | ${
      findText ? findText?.chatSubTitle?.slice(0, 30) : "New Chat"
    }`;
  }, [id, state?.chatRoute]);

  const renameRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (renameRef.current && !renameRef.current.contains(event.target)) {
        setIsRenamingId(null);
      }
    }

    if (isRenamingId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRenamingId]);

  useEffect(() => {
    if (isRenamingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenamingId]);

  async function renameSubTitle(params) {
    try {
      await axiosPatch("/api/getChatID", params, token);
      getChatIDs();
    } catch (err) {
      const errMsg = getError(err);
      console.log(err.toString());
    }
  }

  return (
    <main
      className={`!min-h-screen ${
        themeMode === "Light" ? "!bg-[#f9f9f9]" : "!bg-[#171717]"
      }  !pl-2 !flex !flex-col !justify-between !w-full`}
    >
      <section>
        <List
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            paddingY: "6px",
            paddingX: "9px !important",
          }}
        >
          <ListItem
            key="sidebar"
            disablePadding
            sx={{
              flex: "0 0 12%",
            }}
          >
            <CustomTooltip title="Close sidebar" placement="right" arrow>
              <ListItemButton
                dense
                sx={{
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor:
                      themeMode === "Light" ? "#f0f0f0" : "#373737",
                  },
                  px: "4px !important",
                }}
                onClick={toggleSidebar}
              >
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  {width > 768 ? (
                    <TbLayoutSidebarLeftCollapse
                      color={themeMode === "Light" ? "#5D5D5D" : "#ECECEC"}
                      size={25}
                    />
                  ) : (
                    <BiMenuAltLeft
                      size={25}
                      color={themeMode === "Light" ? "#5D5D5D" : "#ECECEC"}
                    />
                  )}
                </ListItemIcon>
              </ListItemButton>
            </CustomTooltip>
          </ListItem>

          <ListItem key="controls" disablePadding sx={{ flex: "0 0 27%" }}>
            <CustomTooltip title="Search chats" placement="bottom" arrow>
              <ListItemButton
                dense
                sx={{
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor:
                      themeMode === "Light" ? "#f0f0f0" : "#373737",
                  },
                  px: "5px !important",
                }}
                onClick={openSearchModalChats}
              >
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  <FiSearch
                    color={themeMode === "Light" ? "#5D5D5D" : "#ECECEC"}
                    size={23}
                  />
                </ListItemIcon>
              </ListItemButton>
            </CustomTooltip>

            <CustomTooltip title="New chat" placement="bottom" arrow>
              <ListItemButton
                dense
                onClick={createNewChat}
                sx={{
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor:
                      themeMode === "Light" ? "#f0f0f0" : "#373737",
                  },
                  px: "7px !important",
                  py: "5px",
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  <FiEdit
                    color={themeMode === "Light" ? "#5D5D5D" : "#ECECEC"}
                    size={21}
                  />
                </ListItemIcon>
              </ListItemButton>
            </CustomTooltip>
          </ListItem>
        </List>

        <div className="!h-[calc(100vh-102px)] !overflow-y-auto !mt-[5px] !flex !flex-col !gap-5">
          <List
            sx={{
              paddingY: "2px !important",
              paddingLeft: "8px",
              paddingRight: "14px",
            }}
          >
            <ListItem key={"value"} disablePadding>
              <CustomTooltip title="New chat" placement="right" arrow>
                <ListItemButton
                  role={undefined}
                  onClick={createNewChat}
                  dense
                  sx={{
                    paddingLeft: "5px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: themeMode !== "Light" && "#242424",
                    },
                    paddingY: "7.5px !important",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <Box
                      sx={{
                        background: "red",
                        p: themeMode === "Light" ? "3px" : "0px",
                        borderRadius: "50%",
                        backgroundColor:
                          themeMode === "Light" ? "#fff" : "#d5d5d5",
                      }}
                    >
                      <Image
                        src={
                          themeMode === "Light" ? whiteChatgptLogo : chatgptLogo
                        }
                        alt="chatgpt-img"
                        width={themeMode === "Light" ? 19 : 21}
                        className={`!rounded-[50%] !border-[1.8px] border-solid ${
                          themeMode === "Light"
                            ? "!py-[0.5px] !px-[0.5px] !bg-white"
                            : "border-gray-500"
                        }`}
                      />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    id={"labelId"}
                    className={`${
                      themeMode === "Light"
                        ? "!text-[#5D5D5D]"
                        : "!text-[#ECECEC]"
                    } !text-[13px]`}
                    primary="ChatGPT"
                    sx={{ margin: 0, fontSize: "14px !important" }}
                  />
                </ListItemButton>
              </CustomTooltip>
            </ListItem>
          </List>
          <div>
            {sidebarLoader ? (
              <Box
                className="!h-full !w-full !flex !items-center !justify-center"
                component={"div"}
              >
                <Loader
                  color={themeMode === "Light" ? "#2e2e2e" : "#fafafa"}
                  size="35"
                />
              </Box>
            ) : Object.keys(state?.chatRoute ?? {})?.length ? (
              Object.entries(state?.chatRoute ?? {})?.map(
                ([routeKey, routeValue], index) => (
                  <Box
                    component="div"
                    key={routeKey}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      rowGap: "6px",
                      marginBottom: 4,
                    }}
                  >
                    <Typography
                      component="span"
                      variant="span"
                      sx={{
                        px: 2,
                        fontSize: "12px",
                        color: themeMode === "Light" ? "#000000" : "#ECECEC",
                      }}
                    >
                      {routeKey ?? ""}
                    </Typography>

                    <Box component="div" key={index + 10}>
                      {routeValue?.map((nestedData, insideIndex) => {
                        const hoverKey = `${index}_${insideIndex}`;
                        return (
                          <Box
                            key={nestedData?.routeId}
                            onMouseEnter={() =>
                              setHovered((prev) => ({
                                ...prev,
                                [hoverKey]: true,
                              }))
                            }
                            onMouseLeave={() =>
                              setHovered((prev) => {
                                const updated = { ...prev };
                                delete updated[hoverKey];
                                return updated;
                              })
                            }
                          >
                            <List
                              sx={{
                                paddingY: "1px !important",
                                paddingLeft: "8px",
                                paddingRight: "14px",
                              }}
                            >
                              <ListItem disablePadding>
                                <ListItemButton
                                  disableRipple={
                                    openList?.routeID === nestedData?.routeId
                                  }
                                  disableTouchRipple={
                                    openList?.routeID === nestedData?.routeId
                                  }
                                  sx={{
                                    paddingLeft: "10px",
                                    borderRadius: "8px",
                                    paddingY: "7px !important",
                                    backgroundColor:
                                      nestedData?.routeId === id
                                        ? openList?.routeID ===
                                          nestedData?.routeId
                                          ? themeMode === "Light"
                                            ? "#e3e3e3 !important"
                                            : "#242424 !important"
                                          : themeMode === "Light"
                                          ? "#e3e3e3 !important"
                                          : "#303030 !important"
                                        : "transparent !important",
                                    "&:hover": {
                                      backgroundColor:
                                        themeMode === "Light"
                                          ? "#f0f0f0 !important"
                                          : "#242424 !important",
                                    },
                                    "&.Mui-focused": {
                                      backgroundColor: "transparent !important",
                                    },
                                    "&.Mui-selected": {
                                      backgroundColor: "transparent !important",
                                    },
                                    "&.Mui-selected:hover": {
                                      backgroundColor: "transparent !important",
                                    },
                                    "&:active": {
                                      backgroundColor: "transparent !important",
                                    },
                                  }}
                                >
                                  {isRenamingId === nestedData?.routeId ? (
                                    <div ref={renameRef}>
                                      <TextField
                                        variant="standard"
                                        value={renameValue}
                                        autoFocus
                                        inputRef={inputRef}
                                        onChange={(e) =>
                                          setRenameValue(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            if (renameValue.trim() !== "") {
                                              renameSubTitle({
                                                chatSubTitle: renameValue,
                                                routeId: nestedData?.routeId,
                                              });
                                              setRenameValue("");
                                              setIsRenamingId(null);
                                            }
                                          }
                                        }}
                                        InputProps={{
                                          sx: {
                                            fontSize: "14px",
                                            color:
                                              themeMode === "Light"
                                                ? "black"
                                                : "#ECECEC",
                                          },
                                        }}
                                        sx={{
                                          borderRadius: "5px",
                                          px: 1,
                                          backgroundColor:
                                            themeMode === "Light"
                                              ? ""
                                              : "#242424",
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <ListItemText
                                      primary={nestedData?.chatSubTitle ?? ""}
                                      sx={{
                                        margin: 0,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "clip",
                                        zIndex: 999,
                                      }}
                                      onClick={(e) => {
                                        if (
                                          openList?.routeID ===
                                          nestedData?.routeId
                                        ) {
                                          e.stopPropagation();
                                          return;
                                        }
                                        onRouteNavigation(nestedData?.routeId);
                                      }}
                                      slotProps={{
                                        primary: {
                                          sx: {
                                            fontSize: "14px",
                                            color:
                                              themeMode === "Light"
                                                ? "#2e2e2e"
                                                : "#ECECEC",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "clip",
                                            backgroundColor:
                                              nestedData?.routeId !==
                                                openList?.routeID &&
                                              "transaparent",
                                          },
                                        },
                                      }}
                                    />
                                  )}

                                  <IconButton
                                    edge="end"
                                    size="small"
                                    sx={{
                                      color:
                                        themeMode === "Light"
                                          ? "#707070"
                                          : "#ccc",
                                      "&:hover": {
                                        backgroundColor: "transparent",
                                        color:
                                          themeMode === "Light" && "#505050",
                                      },
                                      display: hovered[hoverKey]
                                        ? "block"
                                        : "none",
                                      padding: 0,
                                      zIndex: 1000,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openActionList(e, nestedData?.routeId);
                                    }}
                                  >
                                    <PiDotsThreeOutlineFill size={17} />
                                  </IconButton>
                                  <Menu
                                    anchorEl={openList?.anchorEl}
                                    open={
                                      openList?.routeID === nestedData?.routeId
                                    }
                                    onClose={() => setOpenList({})}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "right",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "right",
                                    }}
                                    slotProps={{
                                      paper: {
                                        sx: {
                                          padding: 1,
                                          backgroundColor:
                                            themeMode === "Light"
                                              ? "#FFFFF"
                                              : "#373737",
                                          borderRadius: "9px",
                                          minWidth: 100,
                                          mt: 1,
                                          zIndex: 999,
                                          border:
                                            themeMode === "Light" &&
                                            "0.7px solid #e2e2e2",
                                        },
                                      },
                                    }}
                                  >
                                    <CustomMenuList
                                      onClick={() => {
                                        setIsRenamingId(nestedData?.routeId);
                                        setRenameValue(
                                          nestedData?.chatSubTitle
                                        );
                                        setOpenList({});
                                      }}
                                      themeMode={themeMode}
                                    >
                                      <MdOutlineEdit
                                        size={18}
                                        className="!mr-[5px]"
                                      />
                                      Rename
                                    </CustomMenuList>
                                    <MenuItem
                                      sx={{
                                        fontSize: "14px",
                                        justifyContent: "flex-start",
                                        color: red[500],
                                        borderRadius: "5px",
                                        "&:hover": {
                                          backgroundColor:
                                            themeMode === "Light"
                                              ? "#f0f0f0"
                                              : "#4A4A4A",
                                        },
                                        width: "100%",
                                        lineHeight: 1.1,
                                        minHeight: "auto",
                                        py: 1.5,
                                        pl: 2,
                                      }}
                                      onClick={() => {
                                        setChatDelete({
                                          open: true,
                                          chatId: nestedData?.routeId,
                                          chatSubTitle:
                                            nestedData?.chatSubTitle,
                                        });
                                        setOpenList({});
                                      }}
                                    >
                                      <MdOutlineDeleteOutline
                                        size={20}
                                        className="!mr-[7px]"
                                      />
                                      Delete
                                    </MenuItem>
                                  </Menu>
                                </ListItemButton>
                              </ListItem>
                            </List>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      <List
        sx={{
          paddingY: "5px",
          paddingLeft: "8px",
          paddingRight: "15px",
        }}
      >
        <ListItem key={"value"} disablePadding>
          <ListItemButton
            role={undefined}
            dense
            sx={{
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: themeMode === "Light" ? "#e3e3e3" : "#242424",
              },
              paddingY: "5px",
              mr: 1.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 30 }}>
              <MdSettingsInputSvideo
                size={21}
                className={`!rounded-[50%] border-[1.8px] border-solid border-gray-500 ${
                  themeMode === "Light" ? "!text-[#2e2e2e]" : "!text-[#FFFFFF]"
                }`}
              />
            </ListItemIcon>
            <ListItemText
              id={"labelId"}
              className="!text-[#ECECEC] !text-[13px]"
              primary={
                <div className="flex flex-col gap-[1px]">
                  <Typography
                    component={"span"}
                    variant="span"
                    className={`!text-[10px] !font-semibold ${
                      themeMode === "Light"
                        ? "!text-[#2e2e2e]"
                        : "!text-[#FFFFFF]"
                    } `}
                  >
                    Upgrade Plan
                  </Typography>
                  <Typography
                    component={"span"}
                    variant="span"
                    className={`!text-[10px] !font-[500] ${
                      themeMode === "Light"
                        ? "!text-[#8F8F8F]"
                        : "!text-[#9B9B9B]"
                    }`}
                  >
                    More access to the best models
                  </Typography>
                </div>
              }
              sx={{ margin: 0, fontSize: "14px !important" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <DeleteDialog
        open={chatDelete?.open}
        onClose={() => setChatDelete({})}
        onDelete={() => {
          deleteChat(chatDelete?.chatId);
          setChatDelete({});
        }}
        themeMode={themeMode}
        title={"Delete chat?"}
        buttonText={"Delete"}
      >
        <DialogContent>
          <Typography
            variant="body2"
            sx={{ color: themeMode === "Light" ? "#2e2e2e" : "#ccc" }}
          >
            This will delete
            <strong
              style={{ color: themeMode === "Light" ? "#2e2e2e" : "#fff" }}
            >
              {" " + chatDelete?.chatSubTitle}
            </strong>
            .
          </Typography>
          <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
            All data associated with this chat ID will be permanently deleted
            from the database.
          </Typography>
        </DialogContent>
      </DeleteDialog>
      <SearchDialog
        open={isSearch}
        onClose={() => {
          setInputString("");
          setIsSearch((currBool) => !currBool);
        }}
        slicedChat={slicedChat}
        token={token}
        setInputString={setInputString}
        inputString={inputString}
        router={router}
        sidebarLoader={sidebarLoader}
        themeMode={themeMode}
      />
    </main>
  );
};

export default Sidenav;

const categorizeData = (data) => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const last7Days = new Date(startOfToday);
  last7Days.setDate(last7Days.getDate() - 7);
  const last30Days = new Date(startOfToday);
  last30Days.setDate(last30Days.getDate() - 30);
  const last3Months = new Date(startOfToday);
  last3Months.setMonth(last3Months.getMonth() - 3);
  const last6Months = new Date(startOfToday);
  last6Months.setMonth(last6Months.getMonth() - 6);
  const last1Year = new Date(startOfToday);
  last1Year.setFullYear(last1Year.getFullYear() - 1);

  const result = {
    Today: [],
    Yesterday: [],
    "Last 7 days": [],
    "Previous 30 days": [],
    "Previous 3 Months": [],
    "Previous 6 Months": [],
    "Last 1 Year": [],
  };

  data?.forEach((item) => {
    const timestamp = new Date(item.time_stamp);

    if (timestamp >= startOfToday) {
      result.Today.push(item);
    } else if (timestamp >= startOfYesterday && timestamp < startOfToday) {
      result.Yesterday.push(item);
    } else if (timestamp >= last7Days && timestamp < startOfYesterday) {
      result["Last 7 days"].push(item);
    } else if (timestamp >= last30Days && timestamp < last7Days) {
      result["Previous 30 days"].push(item);
    } else if (timestamp >= last3Months && timestamp < last30Days) {
      result["Previous 3 Months"].push(item);
    } else if (timestamp >= last6Months && timestamp < last3Months) {
      result["Previous 6 Months"].push(item);
    } else {
      result["Last 1 Year"].push(item);
    }
  });

  const filteredResult = Object.entries(result).reduce((acc, [key, value]) => {
    if (value?.length > 0) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return filteredResult;
};

const SearchDialog = ({
  open,
  onClose,
  slicedChat,
  token,
  inputString,
  setInputString,
  router,
  sidebarLoader,
  themeMode,
}) => {
  const searchInputRef = useRef(null);
  const [searchQueryResult, setSearchQueryResult] = useState({
    initialRes: true,
    data: [],
  });
  const [hovered, setHovered] = useState({});

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  }, [open]);

  async function fetchQueryResult(value) {
    setSearchQueryResult((oldData) => ({
      ...(oldData ?? {}),
      initialRes: false,
      loader: true,
    }));

    try {
      const apiResp = await axiosPost(
        "/api/getChatID",
        { inputQuery: value },
        token
      );
      const { message = [] } = apiResp?.data || {};
      setSearchQueryResult((oldState) => ({
        ...(oldState ?? {}),
        initialRes: false,
        data: message,
        loader: false,
      }));
    } catch (err) {
      const errMsg = getError(err);
      console.log("err", err.toString());
    }
  }

  const onSearch = debounce((event) => {
    const { value } = event.target;
    setInputString(value);
    fetchQueryResult(value);
  }, 500);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      slotProps={{
        backdrop: {
          sx: {
            zIndex: 999,
            backgroundColor: themeMode === "Light" ? "rgba(0, 0, 0, 0.3)" : "",
          },
        },
        paper: {
          sx: {
            display: "flex",
            flexDirection: "column",
            backgroundColor: themeMode === "Light" ? "#FFFFFF" : "#373737",
            color: "#fff",
            borderRadius: 4,
            minWidth: 670,
            zIndex: 1000,
            boxShadow:
              themeMode === "Light" ? "" : "0px 0px 30px rgba(0,0,0,0.7)",
            backgroundColor: themeMode === "Light" ? "#f9f9f9" : "#373737",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#fff",
          fontWeight: 500,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "10px",
          py: "15px !important",
        }}
      >
        <TextField
          id="search-chats"
          variant="standard"
          placeholder="Search chats..."
          inputRef={searchInputRef}
          onChange={onSearch}
          autoFocus
          sx={{
            input: { color: themeMode === "Light" ? "#2e2e2e" : "#fff" },
            width: "100%",
            "& .MuiInput-underline:before": {
              borderBottom: "none !important",
            },
            "& .MuiInput-underline:after": {
              borderBottom: "none !important",
            },
            "& .MuiInput-underline:hover": {
              borderBottom: "none !important",
            },
          }}
        />
        <IconButton
          onClick={onClose}
          sx={{
            color: themeMode === "Light" ? "#2e2e2e" : "#fff",
            padding: "6px",
            ":hover": {
              background:
                themeMode === "Light" ? "#e3e3e3 !important" : "#4f4f4f",
            },
          }}
        >
          <FiX size={20} />
        </IconButton>
      </DialogTitle>
      <Divider
        sx={{ borderColor: themeMode === "Light" ? "#c0c0c0" : "#4a4a4a" }}
      />

      {sidebarLoader ? (
        <DialogContent
          sx={{
            px: 1.25,
            py: "10px !important",
          }}
        >
          <Box
            component={"div"}
            sx={{
              overflowY: "auto",
              minHeight: "300px",
            }}
            className="!flex !justify-center"
          >
            <Loader
              color={themeMode === "Light" ? "#2e2e2e" : "#fafafa"}
              size="40"
            />
          </Box>
        </DialogContent>
      ) : searchQueryResult?.initialRes || !inputString?.length ? (
        <DialogContent
          sx={{
            px: 1.25,
            py: "10px !important",
          }}
        >
          <Box
            component={"div"}
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              minHeight: "300px",
            }}
          >
            <List sx={{ py: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    router.push("/chatList");
                    onClose();
                  }}
                  dense
                  sx={{
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor:
                        themeMode === "Light"
                          ? "#e3e3e3 !important"
                          : "#4f4f4f",
                    },
                    py: "11px",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <FiEdit
                      color={themeMode === "Light" ? "#5D5D5D" : "#ECECEC"}
                      size={17.5}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="New chat"
                    className={`${
                      themeMode === "Light"
                        ? "!text-[#323232]"
                        : "!text-[#ECECEC]"
                    } !text-[13px]`}
                    sx={{ m: 0, fontSize: "14px !important" }}
                  />
                </ListItemButton>
              </ListItem>
            </List>

            <div className="!mt-2">
              {slicedChat.map(([chatTime, chatData], index) => (
                <List key={index} disablePadding sx={{ py: 0, my: 0, mt: 1.5 }}>
                  <Typography
                    sx={{
                      color: themeMode === "Light" ? "#5D5D5D" : "#ECECEC",
                      fontSize: "12px",
                      marginBottom: 1,
                      paddingLeft: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {chatTime}
                  </Typography>

                  {chatData?.map(({ routeId = "", chatSubTitle = "" }) => (
                    <ListItem key={routeId} disablePadding sx={{ py: 0 }}>
                      <ListItemButton
                        dense
                        onClick={() => {
                          router.push(`/chatList/${routeId}`);
                          onClose();
                        }}
                        sx={{
                          borderRadius: "8px",
                          "&:hover": {
                            backgroundColor:
                              themeMode === "Light"
                                ? "#e3e3e3 !important"
                                : "#4f4f4f",
                          },
                          py: "11px",
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <TbMessages
                            color={
                              themeMode === "Light" ? "#5D5D5D" : "#ECECEC"
                            }
                            size={17.5}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={chatSubTitle}
                          className={`${
                            themeMode === "Light"
                              ? "!text-[#323232]"
                              : "!text-[#ECECEC]"
                          } !text-[13px]`}
                          sx={{ m: 0, fontSize: "14px !important" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ))}
            </div>
          </Box>
        </DialogContent>
      ) : (
        <DialogContent
          sx={{
            px: 1.25,
            py: "10px !important",
          }}
        >
          <div className="!mt-2 !max-h-[300px] !overflow-y-auto !min-h-[300px]">
            <List disablePadding sx={{ py: 0, my: 0 }}>
              {searchQueryResult?.loader ? (
                <Stack direction={"column"}>
                  {Array(slicedChat?.length + 4)
                    .fill(0)
                    .map((ele, index) => (
                      <CardHeader
                        key={index}
                        sx={{
                          paddingY: "13px !important",
                        }}
                        avatar={
                          <Skeleton
                            animation="wave"
                            variant="circular"
                            width={17}
                            height={17}
                            sx={{
                              backgroundColor:
                                themeMode === "Light" ? "#cbcbcb" : "#4f4f4f",
                              "&::after": {
                                backgroundImage: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)`,
                              },
                            }}
                          />
                        }
                        title={
                          <Skeleton
                            animation="wave"
                            height={15}
                            width="30%"
                            sx={{
                              backgroundColor:
                                themeMode === "Light" ? "#cbcbcb" : "#4f4f4f",
                              marginBottom: 1,
                              "&::after": {
                                backgroundImage: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)`,
                              },
                            }}
                          />
                        }
                        subheader={
                          <Skeleton
                            animation="wave"
                            height={15}
                            width="50%"
                            sx={{
                              backgroundColor:
                                themeMode === "Light" ? "#cbcbcb" : "#4f4f4f",
                              "&::after": {
                                backgroundImage: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)`,
                              },
                            }}
                          />
                        }
                      />
                    ))}
                </Stack>
              ) : !searchQueryResult?.data?.length ? (
                <Stack direction={"row"} spacing={2} paddingX={2}>
                  <div className="!h-full !place-content-center !flex !justify-center !text-center">
                    <FiSearch
                      color="#B4B4B4"
                      size={17}
                      className="!text-center mt-[2.4px]"
                    />
                  </div>
                  <Typography
                    component={"span"}
                    variant="span"
                    sx={{
                      color: "#B4B4B4",
                      fontSize: "14px",
                    }}
                  >
                    No results
                  </Typography>
                </Stack>
              ) : (
                searchQueryResult?.data?.map(
                  (
                    {
                      chatSubTitle = "",
                      routeId = "",
                      time_stamp = 0,
                      slightSolution = "",
                    },
                    index
                  ) => (
                    <ListItem
                      key={index + 10}
                      disablePadding
                      sx={{ py: 0 }}
                      onMouseEnter={() =>
                        setHovered((prev) => ({
                          ...prev,
                          [routeId]: true,
                        }))
                      }
                      onMouseLeave={() =>
                        setHovered((prev) => {
                          const updated = { ...prev };
                          delete updated[routeId];
                          return updated;
                        })
                      }
                    >
                      <ListItemButton
                        dense
                        sx={{
                          borderRadius: "8px",
                          "&:hover": {
                            backgroundColor:
                              themeMode === "Light"
                                ? "#e3e3e3 !important"
                                : "#4f4f4f",
                          },
                          py: "5px",
                        }}
                        onClick={() => {
                          router.push(`/chatList/${routeId}`);
                          onClose();
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <TbMessages
                            color={
                              themeMode === "Light" ? "#5D5D5D" : "#ECECEC"
                            }
                            size={17.5}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              component={"div"}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 2,
                              }}
                            >
                              <Stack direction={"column"} spacing={0.2}>
                                <Typography
                                  component="p"
                                  variant="body2"
                                  sx={{
                                    fontSize: "14px",
                                    color:
                                      themeMode === "Light"
                                        ? "#323232"
                                        : "#E3E3E3",
                                    fontWeight: 500,
                                  }}
                                >
                                  {chatSubTitle ?? ""}
                                </Typography>
                                <Typography
                                  component="p"
                                  variant="span"
                                  sx={{
                                    fontSize: "11px",
                                    color:
                                      themeMode === "Light"
                                        ? "#323232"
                                        : "#E3E3E3",
                                    fontWeight: 300,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "530px",
                                    position: "relative",
                                    zIndex: hovered[routeId] ? 0 : 2,
                                  }}
                                >
                                  {slightSolution ?? ""}
                                </Typography>
                              </Stack>
                              <Typography
                                component="p"
                                variant="span"
                                sx={{
                                  textAlign: "center",
                                  mt: 1.6,
                                  display: hovered[routeId] ? "block" : "none",
                                  position: "relative",
                                  zIndex: 3,
                                  fontSize: "10px",
                                }}
                              >
                                {processTime(time_stamp)}
                              </Typography>
                            </Box>
                          }
                          className={`${
                            themeMode === "Light"
                              ? "!text-[#323232]"
                              : "!text-[#ECECEC]"
                          } !text-[13px]`}
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                )
              )}
            </List>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
