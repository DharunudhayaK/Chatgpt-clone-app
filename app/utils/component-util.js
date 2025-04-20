import { Button, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

const formatTime = (timestamp) => {
  const date = new Date(Number(timestamp));

  const day = date.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];

  const getDaySuffix = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const suffix = getDaySuffix(day);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedHours = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";

  return `${month} ${day}${suffix} ${formattedHours}:${minutes} ${ampm}`;
};

const processTime = (time_Stamp) => {
  const inputDate = new Date(time_Stamp);
  const now = new Date();

  const input = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffInTime = today.getTime() - input.getTime();
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else {
    const options = { day: "2-digit", month: "short" };
    return inputDate.toLocaleDateString("en-GB", options);
  }
};

const CustomParagraph = ({ children, ...rest }) => {
  return (
    <Box
      component={"div"}
      sx={{
        placeContent: "center",
      }}
    >
      <Typography
        component={"span"}
        variant="span"
        sx={{
          fontSize: "10px",
          color: rest?.themeMode === "Light" ? "#5D5D5D" : "#bababa",
          fontWeight: rest?.themeMode === "Light" && "500",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
};

const Loader = (props) => {
  const { color, size } = props;
  return (
    <RotatingLines
      strokeColor={color}
      strokeWidth="3"
      animationDuration="0.75"
      width={size}
      visible={true}
    />
  );
};

const CustomMenuList = ({ children, themeMode, ...rest }) => {
  return (
    <MenuItem
      {...rest}
      sx={{
        fontSize: "12.5px",
        py: 1.3,
        pl: 2,
        minHeight: "auto",
        lineHeight: 1.1,
        justifyContent: "flex-start",
        color: themeMode === "Light" ? "#2e2e2e" : "#FFFFFF",
        borderRadius: "5px",
        "&:hover": {
          backgroundColor: themeMode === "Light" ? "#f0f0f0" : "#4A4A4A",
        },
        width: "100%",
      }}
    >
      {children}
    </MenuItem>
  );
};

const CustomDeleteButton = ({ children, ...rest }) => {
  return (
    <Button
      onClick={rest?.onClick}
      variant="contained"
      color="error"
      sx={{
        textTransform: "none",
        px: 2,
        borderRadius: "999px",
        fontWeight: 500,
        "&:hover": {
          backgroundColor: "#b71c1c",
          boxShadow: "none",
        },
        boxShadow: "none",
      }}
    >
      {children}
    </Button>
  );
};

const ScreenSizeTracker = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [screenSize]);

  return screenSize;
};

export {
  processTime,
  CustomParagraph,
  Loader,
  CustomMenuList,
  formatTime,
  CustomDeleteButton,
  ScreenSizeTracker,
};
