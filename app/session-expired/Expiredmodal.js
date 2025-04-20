"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function SessionExpiredModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Session Expired</DialogTitle>
      <DialogContent>
        <Typography>Session expired. Please login again.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
