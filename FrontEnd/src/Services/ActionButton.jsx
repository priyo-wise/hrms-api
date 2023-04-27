import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PublishIcon from "@mui/icons-material/Publish";
const ActionButton = ({ IconName, ...rest }) => {
  IconName ??= "Edit";
  const danger = "#C62E2E";
  const primary = "#1976D2";
  const view = "#01A047";
  const publish = "#F75800";
  return (
    <>
      {IconName == "Publish" ? (
        <IconButton size="small" {...rest} style={{ color: publish }}>
          <PublishIcon fontSize="small" />
        </IconButton>
      ) : IconName == "View" ? (
        <IconButton size="small" {...rest} style={{ color: view }}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ) : (
        <IconButton
          size="small"
          {...rest}
          style={{ color: `${IconName == "Edit" ? primary : danger}` }}
        >
          {IconName == "Edit" ? (
            <EditIcon fontSize="small" />
          ) : (
            <DeleteIcon fontSize="small" />
          )}
        </IconButton>
      )}
    </>
  );
};

export default ActionButton;
