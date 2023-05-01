import React, { forwardRef, useImperativeHandle } from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SnackbarComponent = forwardRef(({ confirmMessage }, ref) => {
  const [open, setOpen] = React.useState(false);
  confirmMessage ??= "Action performed successfully";
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  useImperativeHandle(ref, () => ({
    setOpenSnackBar: () => {
      setOpen(true);
    },
  }));
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
        vertical="top"
        horizontal="right"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={confirmMessage}
        action={action}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </>
  );
});

export default SnackbarComponent;
