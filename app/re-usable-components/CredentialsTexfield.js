"use client";

import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const styledField = (isError) => {
  return {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: isError ? "#D00E17" : "rgba(0, 0, 0, 0.23)",
        borderRadius: "7px",
      },
      "&:hover fieldset": {
        borderColor: isError ? "#D00E17" : "rgba(0, 0, 0, 0.23)",
      },
      "&.Mui-focused fieldset": {
        borderColor: isError ? "#D00E17" : "#10a37f",
      },
    },
    "& .MuiInputLabel-root": {
      color: isError ? "#D00E17" : "rgba(0, 0, 0, 0.6)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: isError ? "#D00E17" : "#10a37f",
    },
    borderRadius: 10,
  };
};

const Emailtextfield = (props) => {
  return (
    <TextField
      id="outlined-basic"
      variant="outlined"
      required
      {...props}
      sx={{ ...styledField(props?.error) }}
    />
  );
};

const Passwordtextfield = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const onShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      id="outlined-password-input"
      {...props}
      type={showPassword ? "text" : "password"}
      sx={{ ...styledField(props?.error) }}
      required
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={onShowPassword}
              onMouseDown={onMouseDownPassword}
              edge="end"
            >
              {showPassword ? (
                <MdOutlineVisibilityOff />
              ) : (
                <MdOutlineVisibility />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

const Logbutton = ({ children, onClick, ...rest }) => {
  return (
    <Button
      variant="contained"
      {...rest}
      onClick={onClick}
      sx={{
        bgcolor: "#10A37F",
        textTransform: "capitalize",
        padding: 1.44,
        fontSize: "16px",
        boxShadow: "none",
        borderRadius: 1.4,
      }}
    >
      {children}
    </Button>
  );
};

export { Emailtextfield, Passwordtextfield, Logbutton };
