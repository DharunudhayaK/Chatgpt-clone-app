import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
} from "@mui/material";
import { CustomDeleteButton } from "../utils/component-util";

export const DeleteDialog = ({
  open,
  onClose,
  onDelete,
  themeMode,
  children,
  title,
  buttonText,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            zIndex: 999,
            backgroundColor: themeMode === "Light" ? "rgba(0, 0, 0, 0.3)" : "", // rgba(0, 0, 0, 0.7)
          },
        },
        paper: {
          sx: {
            backgroundColor: themeMode === "Light" ? "#f9f9f9" : "#373737",
            color: "#fff",
            borderRadius: 4,
            minWidth: 420,
            zIndex: 1000,
            boxShadow:
              themeMode === "Light" ? "" : "0px 0px 30px rgba(0, 0, 0, 0.7)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: themeMode === "Light" ? "#2e2e2e" : "#fff",
          fontWeight: 500,
        }}
      >
        {title}
      </DialogTitle>
      <Divider
        sx={{ borderColor: themeMode === "Light" ? "#c0c0c0" : "#4a4a4a" }}
      />
      {children}

      <DialogActions sx={{ justifyContent: "flex-end", paddingTop: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: themeMode === "Light" ? "#2e2e2e" : "#fff",
            border: "0.2px solid #555",
            textTransform: "none",
            borderRadius: "999px",
            "&:hover": {
              backgroundColor: themeMode === "Light" ? "#f0f0f0" : "#4e4e4e",
              borderColor: "#777",
              boxShadow: "none",
            },
            boxShadow: "none",
          }}
        >
          Cancel
        </Button>
        <CustomDeleteButton onClick={onDelete}>{buttonText}</CustomDeleteButton>
      </DialogActions>
    </Dialog>
  );
};
