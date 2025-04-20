import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiUserCheck, FiX } from "react-icons/fi";
import { CustomDeleteButton } from "../utils/component-util";
import { TbSettings } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout, updateThemeMode, zIndexUp } from "../redux/slices/stateSlice";
import { axiosPatch } from "../utils/axiosutils/axiosOperation";
import {
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdSettingsSystemDaydream,
} from "react-icons/md";

const THEME_OPTIONS = (themeMode) => {
  return [
    {
      value: "System",
      icon: (
        <MdSettingsSystemDaydream
          size={17}
          className="!mr-2"
          color={themeMode === "Light" ? "#5D5D5D" : "#F9F9F9"}
        />
      ),
    },
    {
      value: "Dark",
      icon: (
        <MdOutlineDarkMode
          size={17}
          className="!mr-2"
          color={themeMode === "Light" ? "#5D5D5D" : "#F9F9F9"}
        />
      ),
    },
    {
      value: "Light",
      icon: (
        <MdOutlineLightMode
          size={17}
          className="!mr-2"
          color={themeMode === "Light" ? "#5D5D5D" : "#F9F9F9"}
        />
      ),
    },
  ];
};
const settingsData = (themeMode) => {
  return [
    {
      icon: (
        <TbSettings
          size={17}
          className="!mr-2"
          color={themeMode === "Light" ? "#5D5D5D" : "#F9F9F9"}
        />
      ),
      title: "General",
    },
    {
      icon: (
        <FiUserCheck
          size={17}
          className="!mr-2"
          color={themeMode === "Light" ? "#5D5D5D" : "#F9F9F9"}
        />
      ),
      title: "Profile",
    },
    {
      icon: (
        <IoIosInformationCircleOutline
          size={17}
          className="!mr-2"
          color={themeMode === "Light" ? "#5D5D5D" : "#F9F9F9"}
        />
      ),
      title: "About",
    },
  ];
};

const Settings = ({
  open,
  onClose,
  setIsDeleteDialogOpened,
  ...remainingProps
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { themeMode = "System", token } = useSelector(
    (state) => state?.reduxState
  );

  const [selectList, setSelectList] = useState("General");

  const onSelectList = (str) => {
    setSelectList(str);
  };

  useEffect(() => {
    setSelectList("General");
  }, [open]);

  async function toggleTheme(val) {
    try {
      const patchResp = await axiosPatch(
        "/api/chats",
        { toggleTheme: val },
        remainingProps?.userToken
      );
      const { message = "" } = patchResp?.data || {};
      dispatch(updateThemeMode(message));
    } catch (err) {
      console.log("--------------->> Error <<----------------", err.toString());
    }
  }

  const deleteAllChats = () => {
    setIsDeleteDialogOpened((prev) => !prev);
    onClose();
    dispatch(zIndexUp(false));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            zIndex: 999,
            backgroundColor: themeMode === "Light" ? "rgba(0, 0, 0, 0.3)" : "",
          },
        },
        paper: {
          sx: {
            backgroundColor: themeMode === "Light" ? "#f9f9f9" : "#373737",
            color: "#fff",
            borderRadius: 4,
            minWidth: 620,
            zIndex: 1000,
            boxShadow:
              themeMode === "Light" ? "" : "0px 0px 30px rgba(0, 0, 0, 0.7)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: themeMode === "Light" ? "#2e2e2e" : "#F9F9F9",
          fontWeight: 500,
          py: "13px !important",
          fontWeight: 500,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        Settings
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
          <FiX size={15} />
        </IconButton>
      </DialogTitle>
      <Divider
        sx={{ borderColor: themeMode === "Light" ? "#c0c0c0" : "#4a4a4a" }}
      />
      <DialogContent sx={{ paddingX: "9px !important" }}>
        <Box
          component={"div"}
          sx={{
            display: "flex",
            gap: 0,
            width: "100%",
            minHeight: 250,
          }}
        >
          <Box
            component={"div"}
            sx={{
              width: "25%",
            }}
          >
            <List
              sx={{
                paddingY: "0px !important",
                paddingRight: "14px",
              }}
            >
              {settingsData(themeMode).map((string, index) => (
                <Box
                  component={"div"}
                  onClick={() => onSelectList(string?.title)}
                  key={index}
                >
                  <ListItem
                    disablePadding
                    sx={{
                      background:
                        string?.title === selectList
                          ? themeMode === "Light"
                            ? "#e3e3e3 !important"
                            : "#4d4d4d !important"
                          : "",
                      borderRadius: "6.5px",
                      px: "10px",
                      cursor: "pointer",
                      marginTop: index !== 0 ? "5px" : "",
                      py: "3px",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      {string?.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          component={"span"}
                          variant="span"
                          className={`!text-[14px] ${
                            themeMode === "Light"
                              ? "!text-[#323232]"
                              : "!text-[#ECECEC]"
                          } `}
                        >
                          {string?.title}
                        </Typography>
                      }
                      sx={{ fontSize: "1px !important" }}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Box>
          {selectList === "General" ? (
            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                width: "75%",
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography
                  component={"span"}
                  variant="span"
                  sx={{
                    fontSize: "14px",
                    color: themeMode === "Light" ? "#323232" : "#F9F9F9",
                    mt: 0.5,
                  }}
                >
                  Theme
                </Typography>
                <FormControl sx={{ m: 0, minWidth: 100 }}>
                  <Select
                    value={themeMode}
                    onChange={(event) => {
                      toggleTheme(event.target.value);
                    }}
                    displayEmpty
                    sx={{
                      borderRadius: 3,
                      color:
                        themeMode === "Light" ? "#323232 !important" : "#fff",
                      minHeight: "20px !important",
                      px: 1,
                      "& .MuiSelect-select": {
                        padding: "5px 9px",
                        ":hover": {
                          bgcolor:
                            themeMode === "Light" ? "#e3e3e3" : "#4d4d4d",
                        },
                      },
                      "& .MuiSelect-icon": {
                        color: themeMode === "Light" ? "#323232" : "#fff",
                      },
                      "& fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused": {
                        bgcolor: themeMode === "Light" ? "" : "#373737",
                      },
                      fontSize: "13px",
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor:
                            themeMode === "Light"
                              ? "#fff !important"
                              : "#2b2b2b",
                          color:
                            themeMode === "Light"
                              ? "#f0f0f0 !important"
                              : "#fff",
                          borderRadius: 2,
                          padding: 1,
                        },
                      },
                      MenuListProps: {
                        dense: true,
                        sx: {
                          py: 0,
                        },
                      },
                    }}
                  >
                    {THEME_OPTIONS(themeMode).map((option) => (
                      <MenuItem
                        key={option?.value}
                        value={option?.value}
                        sx={{
                          px: 1,
                          py: 0.5,
                          minHeight: "32px",
                          "&:hover": {
                            bgcolor:
                              themeMode === "Light"
                                ? "#f6f6f6 !important"
                                : "#373737",
                          },
                          "&.Mui-selected": {
                            bgcolor:
                              themeMode === "Light" ? "#f0f0f0" : "#373737",
                          },
                          "&.Mui-selected:hover": {
                            bgcolor:
                              themeMode === "Light" ? "#FFFFFF" : "#373737",
                          },
                          fontSize: "12.5px",
                          width: "100%",
                          borderRadius: 2,
                          mt: 0.5,
                          color:
                            themeMode === "Light"
                              ? "#323232 !important"
                              : "#fff",
                        }}
                      >
                        <Box
                          component={"div"}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          {option?.icon}
                          {option?.value}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Divider
                sx={{
                  borderColor: themeMode === "Light" ? "#c0c0c0" : "#4a4a4a",
                }}
              />
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography
                  component={"span"}
                  variant="span"
                  sx={{
                    fontSize: "14px",
                    color: themeMode === "Light" ? "#323232" : "#F9F9F9",
                    mt: 0.5,
                  }}
                >
                  Delete all chats
                </Typography>
                <CustomDeleteButton onClick={deleteAllChats}>
                  Delete all
                </CustomDeleteButton>
              </Stack>
              <Divider
                sx={{
                  borderColor: themeMode === "Light" ? "#c0c0c0" : "#4a4a4a",
                }}
              />
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography
                  component={"span"}
                  variant="span"
                  sx={{
                    fontSize: "14px",
                    color: themeMode === "Light" ? "#323232" : "#F9F9F9",
                    mt: 0.5,
                  }}
                >
                  Device Logout
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    color: themeMode === "Light" ? "#2e2e2e" : "#fff",
                    borderColor: "#777",
                    backgroundColor: "transparent",
                    textTransform: "none",
                    borderRadius: "999px",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor:
                        themeMode === "Light" ? "#f0f0f0" : "#4e4e4e",
                      borderColor: "#777",
                    },
                  }}
                  onClick={() => {
                    router.replace("/sign-in");
                    dispatch(logout());
                    onClose();
                  }}
                >
                  Log out
                </Button>
              </Stack>
            </Box>
          ) : selectList === "About" ? (
            <Box
              component={"div"}
              sx={{
                display: "flex",
                gap: 2,
                width: "75%",
                flexDirection: "column",
              }}
            >
              {["Terms of use", "Privacy Policy"].map((str, index) => (
                <Box
                  component={"div"}
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Typography
                      component={"span"}
                      variant="span"
                      sx={{
                        fontSize: "14px",
                        color: themeMode === "Light" ? "#323232" : "#F9F9F9",
                        mt: 0.5,
                      }}
                    >
                      {str}
                    </Typography>
                    <Button
                      variant="outlined"
                      sx={{
                        color: themeMode === "Light" ? "#2e2e2e" : "#fff",
                        borderColor: "#777",
                        backgroundColor: "transparent",
                        textTransform: "none",
                        borderRadius: "999px",
                        fontWeight: 500,
                        "&:hover": {
                          backgroundColor:
                            themeMode === "Light" ? "#f0f0f0" : "#4e4e4e",
                          borderColor: "#777",
                        },
                      }}
                    >
                      View
                    </Button>
                  </Stack>
                  {index !== 1 ? (
                    <Divider
                      sx={{
                        borderColor:
                          themeMode === "Light" ? "#c0c0c0" : "#4a4a4a",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            ""
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
