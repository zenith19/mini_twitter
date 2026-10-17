import { useState } from "react";
import { IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// The "…" menu shown on your own posts and comments. The API has supported
// update and destroy from the start; nothing in the UI reached them.
export default function OwnerMenu({ onEdit, onDelete, label = "Post actions" }) {
  const [anchor, setAnchor] = useState(null);

  const open = (event) => {
    // These sit inside a card that is itself a link.
    event.preventDefault();
    event.stopPropagation();
    setAnchor(event.currentTarget);
  };

  const close = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    setAnchor(null);
  };

  const choose = (handler) => (event) => {
    close(event);
    handler();
  };

  return (
    <>
      <IconButton size="small" onClick={open} aria-label={label}>
        <MoreHorizIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        {onEdit && (
          <MenuItem onClick={choose(onEdit)}>
            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
            Edit
          </MenuItem>
        )}
        <MenuItem onClick={choose(onDelete)} sx={{ color: "error.main" }}>
          <ListItemIcon><DeleteOutlineIcon fontSize="small" color="error" /></ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
