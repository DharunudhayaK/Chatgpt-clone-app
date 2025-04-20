import { Tooltip } from "@mui/material";

export const CustomTooltip = ({ children, message, ...rest }) => {
  return (
    <Tooltip
      {...rest}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "#000000 !important",
            color: "#ffffff !important",
            fontSize: "14px !important",
            borderRadius: "8px !important",
            border: "1px solid #3a3a3a",
          },
        },
        arrow: {
          sx: {
            color: "#000000 !important",
            "&::before": {
              border: "1px solid #3a3a3a",
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};
