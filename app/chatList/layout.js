"use client";

import React, { useReducer, useState } from "react";
import {
  Avatar,
  Box,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import Sidenav from "../Sidebar";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiLogOut } from "react-icons/fi";
import { logout, toggleSidebar, zIndexUp } from "../redux/slices/stateSlice";
import { CustomMenuList } from "../utils/component-util";
import { TiTick } from "react-icons/ti";
import { PiCopy } from "react-icons/pi";
import CopyToClipboard from "react-copy-to-clipboard";
import { CustomTooltip } from "../utils/custom-tooltip/CustomTooltip";
import { TbLayoutSidebarRightCollapse, TbSettings } from "react-icons/tb";
import Settings from "../headers/Settings";
import { DeleteDialog } from "../re-usable-components/deleteComponent";
import { axiosDelete } from "../utils/axiosutils/axiosOperation";
import { MdWorkspacePremium } from "react-icons/md";
import { BsPlugin } from "react-icons/bs";
import { showSuccessToast } from "../utils/toast-container/toastify";
import { BiMenuAltLeft } from "react-icons/bi";

const initialState = {
  answerCopy: {},
  chatRoute: [],
  anchorEl: false,
  textCopy: false,
  isSettingsOpen: false,
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
    case "anchor":
      return {
        ...state,
        anchorEl: action.payload,
      };
    case "copy":
      return {
        ...state,
        textCopy: action.payload,
      };
    case "Settings":
      return {
        ...state,
        isSettingsOpen: action.payload,
      };
    default:
      break;
  }
}

export default function ChatListLayout({ children }) {
  const {
    token,
    user,
    themeMode = "System",
    sidebarToggle,
    ...remainingState
  } = useSelector((state) => state?.reduxState);
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const [state, dispatchEvent] = useReducer(reducer, initialState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false);

  const onOpenMenu = (event) => {
    dispatch(zIndexUp(false));
    dispatchEvent({ type: "anchor", payload: event.currentTarget });
  };

  const onMenuListEvent = (e) => {
    const clickedValue = e.target.getAttribute("data-value");
    if (clickedValue === "Logout") {
      router.replace("/sign-in");
      dispatch(logout());
    } else if (clickedValue === "Settings") {
      dispatch(zIndexUp(false));
      dispatchEvent({ type: "Settings", payload: true });
      dispatchEvent({ type: "anchor", payload: null });
    }
  };

  function onCopy() {
    dispatchEvent({ type: "copy", payload: true });
    setTimeout(() => {
      dispatchEvent({ type: "copy", payload: false });
    }, 1500);
    showSuccessToast("Copied your User ID to clipboard");
  }

  async function deleteAllChatAPI() {
    try {
      const deleteResp = await axiosDelete("/api/chats", token);
      router.push("/chatList");
      window.location.reload();
      onClose();
    } catch (err) {
      console.log("--------------->> Error <<----------------", err.toString());
    }
  }

  return (
    <div
      className={`text-[#FFFF] ${
        themeMode === "Light" ? "!bg-[#ffffff]" : "!bg-[#212121]"
      }  !h-screen !w-screen !flex !overflow-hidden`}
    >
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[0px] bg-black/45 z-[999] tablet-sm:hidden transition-all duration-300 ease-in-out"
          onClick={() => {
            setIsSidebarOpen(false);
            dispatch(toggleSidebar());
          }}
        />
      )}

      <div
        className={`bg-[#212121] transition-all duration-500 ease-out
    ${
      isSidebarOpen
        ? "!w-[70%] mobile-lg:!w-[58%] mobile-lg2:!w-[45%] tablet-sm2:!w-[37%] tablet-sm:!w-[32%] tablet-md:!w-[28%] tablet-lg:!w-[21%] opacity-100 !z-[9999]"
        : "!w-0 !opacity-0 !pointer-events-none !z-auto"
    }
    !fixed !top-0 !left-0 !h-full tablet-sm:!static tablet-sm:!h-auto tablet-sm:!z-auto
  `}
      >
        <Sidenav
          userEmail={user?.email}
          dispatchEvent={dispatchEvent}
          state={state}
          toggleSidebar={() => {
            setIsSidebarOpen((currBoolean) => !currBoolean);
            dispatch(toggleSidebar());
          }}
          dispatch={dispatch}
        />
      </div>

      <section
        className={`!h-full !transition-all !duration-500 !ease-out !relative
      ${
        isSidebarOpen
          ? "!w-[100%] tablet-sm:!w-[68%] tablet-md:!w-[72%] tablet-lg:!w-[79%] !z-0"
          : "!w-full !z-10"
      }
    `}
      >
        <div
          className={`!px-4 !py-2 !transition-all duration-300 !flex !justify-between
          ${id ? "!border-b-[0.8px]" : ""}  !border-solid ${
            themeMode === "Light"
              ? "!border-b-[#ededed]"
              : "!border-b-[#292929]"
          } `}
        >
          {!isSidebarOpen ? (
            <div className="!hidden tablet-sm:!block">
              <List className="!flex !justify-between !w-[100%] !py-0 !px-[2px]">
                <ListItem
                  key="sidebar"
                  disablePadding
                  sx={{
                    flex: "0 0 6.7%",
                    gap: 1,
                  }}
                >
                  <CustomTooltip title="Open sidebar" placement="bottom" arrow>
                    <ListItemButton
                      className={`!rounded-[5px] tablet-sm:!flex !justify-center !h-[35px] !w-[0px] !min-w-0 ${
                        themeMode === "Light"
                          ? "hover:!bg-[#f0f0f0]"
                          : "hover:!bg-[#373737]"
                      } !py-[3px]`}
                      onClick={() => {
                        setIsSidebarOpen((currBoolean) => !currBoolean);
                        dispatch(toggleSidebar());
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "auto" }}>
                        <TbLayoutSidebarRightCollapse
                          color={themeMode === "Light" ? "#5D5D5D" : "#ECECEC"}
                          size={25}
                        />
                      </ListItemIcon>
                    </ListItemButton>
                  </CustomTooltip>
                  <CustomTooltip title="New chat" placement="bottom" arrow>
                    <ListItemButton
                      onClick={() => router.push("/chatList")}
                      className={`!rounded-[5px] tablet-sm:!flex !justify-center !h-[35px] !w-[0px] !min-w-0 ${
                        themeMode === "Light"
                          ? "hover:!bg-[#f0f0f0]"
                          : "hover:!bg-[#373737]"
                      } !py-[3px]`}
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
            </div>
          ) : (
            ""
          )}
          <div
            className="!h-full !place-content-center"
            onClick={() => setIsSidebarOpen((currBoolean) => !currBoolean)}
          >
            <BiMenuAltLeft
              size={25}
              className={`${
                !remainingState?.sidebarToggle
                  ? "!block tablet-sm:!hidden"
                  : "!block"
              }`}
            />
          </div>
          <Box
            component={"div"}
            sx={{
              ":hover": {
                background: themeMode === "Light" ? "#f0f0f0" : "#373737",
                borderRadius: "6px",
              },
              px: 1.3,
              py: 0.3,
            }}
          >
            <Typography
              variant="h6"
              component={"span"}
              sx={{
                borderRadius: "30px",
                letterSpacing: 0.5,
                fontWeight: 500,
                fontSize: "18px",
                color: themeMode === "Light" ? "#5D5D5D" : "#F3F3F3",
              }}
            >
              ChatGPT
            </Typography>
          </Box>
          <Box
            component={"div"}
            sx={{
              ":hover": {
                background: themeMode === "Light" ? "#d5d5d5" : "#555555",
                borderRadius: themeMode === "Light" ? "48%" : "49%",
              },
              p: "2.2px",
            }}
          >
            <Avatar
              sx={{
                bgcolor: deepOrange[400],
                textTransform: "uppercase",
                fontSize: 12,
                width: 30,
                height: 30,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: deepOrange[600],
                },
              }}
              onClick={onOpenMenu}
            >
              {user?.email?.charAt(0) + user?.email?.charAt(1)}
            </Avatar>
          </Box>
          <Menu
            anchorEl={state?.anchorEl}
            open={Boolean(state?.anchorEl)}
            onClose={() => dispatchEvent({ type: "anchor", payload: null })}
            onClick={onMenuListEvent}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            slotProps={{
              paper: {
                sx: {
                  padding: 1,
                  backgroundColor:
                    themeMode === "Light" ? "#FFFFFF" : "#373737",
                  borderRadius: "14px",
                  minWidth: 150,
                  mt: "1px",
                  zIndex: 999,
                  py: 0,
                },
              },
            }}
          >
            <CustomMenuList data-value={user?.email} themeMode={themeMode}>
              <CopyToClipboard text={user?.email} onCopy={onCopy}>
                <Stack direction={"row"} spacing={1}>
                  <Box>
                    {state?.textCopy ? (
                      <TiTick
                        size={16}
                        color={themeMode === "Light" ? "#5D5D5D" : "#FFFFFF"}
                      />
                    ) : (
                      <PiCopy
                        size={16}
                        color={themeMode === "Light" ? "#5D5D5D" : "#FFFFFF"}
                      />
                    )}
                  </Box>
                  <Typography
                    component={"span"}
                    variant="span"
                    sx={{
                      color: themeMode === "Light" ? "#5D5D5D" : "#F3F3F3",
                    }}
                  >
                    {"User Email"}
                  </Typography>
                </Stack>
              </CopyToClipboard>
            </CustomMenuList>

            <CustomMenuList data-value="Settings" themeMode={themeMode}>
              <TbSettings
                size={18}
                className="!mr-2"
                color={themeMode === "Light" ? "#5D5D5D" : "#FFFFFF"}
              />
              Settings
            </CustomMenuList>

            <Divider
              sx={{
                borderColor: themeMode === "Light" ? "#c0c0c0" : "#4a4a4a",
              }}
            />

            <CustomMenuList data-value="Upgrade-plan" themeMode={themeMode}>
              <MdWorkspacePremium
                size={18}
                className="!mr-2"
                color={themeMode === "Light" ? "#5D5D5D" : "#FFFFFF"}
              />
              Upgrade Plan
            </CustomMenuList>

            <CustomMenuList data-value="extension-plan" themeMode={themeMode}>
              <BsPlugin
                size={18}
                className="!mr-2"
                color={themeMode === "Light" ? "#5D5D5D" : "#FFFFFF"}
              />
              Get Search Extension
            </CustomMenuList>

            <Divider
              sx={{
                borderColor: themeMode === "Light" ? "#c0c0c0" : "#4a4a4a",
              }}
            />

            <CustomMenuList data-value="Logout" themeMode={themeMode}>
              <FiLogOut
                size={16}
                className="!mr-2"
                color={themeMode === "Light" ? "#5D5D5D" : "#FFFFFF"}
              />
              Logout
            </CustomMenuList>
          </Menu>
        </div>
        {children}
      </section>
      <Settings
        open={state?.isSettingsOpen}
        onClose={() => {
          dispatchEvent({ type: "Settings", payload: false });
        }}
        userToken={token}
        setIsDeleteDialogOpened={setIsDeleteDialogOpened}
        isDeleteDialogOpened={isDeleteDialogOpened}
      />
      <DeleteDialog
        open={isDeleteDialogOpened}
        onClose={() => {
          dispatch(zIndexUp(true));
          setIsDeleteDialogOpened((prevBoolean) => !prevBoolean);
        }}
        onDelete={() => {
          deleteAllChatAPI();
          dispatch(zIndexUp(true));
          setIsDeleteDialogOpened((prevBoolean) => !prevBoolean);
        }}
        themeMode={themeMode}
        title={"Clear your chat history - are you sure?"}
        buttonText={"Confirm deletion"}
      >
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
            All chats have been successfully deleted from the database.
          </Typography>
        </DialogContent>
      </DeleteDialog>
    </div>
  );
}
