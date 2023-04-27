import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AddCircle from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import { grey } from "@mui/material/colors";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchDefault = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  backgroundColor: grey[300],

  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3), 
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const AppbarComponent = ({
  title,
  isSearchRequired,
  isAddButtonRequired,
  setSearchContent,
  onAddEvent,
}) => {
  title ??= "";
  isSearchRequired ??= false;
  isAddButtonRequired ??= false;
  setSearchContent ??= (v) => {};
  onAddEvent ??= () => {};

  return (
    <>
      {(isSearchRequired || isAddButtonRequired) && (
        <Box sx={{ p: 0 }}>
          <AppBar
            position="static"
            elevation={0}
            color={`${isAddButtonRequired == false ? "default" : "primary"}`}
          >
            <Toolbar>
              {isSearchRequired && isAddButtonRequired && (
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder={`Search ${title}`}
                    id={`Search_${title}`}
                    inputProps={{ "aria-label": "search" }}
                    onChange={(e) => setSearchContent(e.target.value)}
                  />
                </Search>
              )}
              {isSearchRequired && isAddButtonRequired == false && (
                <SearchDefault>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder={`Search ${title}`}
                    id={`Search_${title}`}
                    inputProps={{ "aria-label": "search" }}
                    onChange={(e) => setSearchContent(e.target.value)}
                  />
                </SearchDefault>
              )}
              <Box sx={{ flexGrow: 1 }} />
              {isAddButtonRequired && (
                <>
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    <Button
                      color="inherit"
                      id={`Add_${title}`}
                      onClick={() => onAddEvent()}
                    >
                      {" "}
                      <i className="fa fa-plus-circle me-2 mb-1"></i>{" "}
                      {`Add ${title}`}
                    </Button>
                  </Box>
                  <Box sx={{ display: { xs: "flex", md: "none" } }}>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-label="account of current user"
                      aria-haspopup="true"
                      onClick={() => onAddEvent()}
                      color="inherit"
                    >
                      <AddCircle />
                    </IconButton>
                  </Box>
                </>
              )}
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </>
  );
};
export default AppbarComponent;
