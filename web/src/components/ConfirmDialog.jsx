import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";

export default function ConfirmDialog({
  open, title, body, confirmLabel = "Delete", busy = false, onConfirm, onClose,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={busy}>
          {busy ? "Deleting…" : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
