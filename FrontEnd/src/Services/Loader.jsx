import { Backdrop, CircularProgress } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  count: 0,
};
export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    start: (state) => {
      state.count += 1;
    },
    stop: (state) => {
      if (state.count > 0) state.count -= 1;
    },
  },
});
export const { start, stop } = loaderSlice.actions;
export default loaderSlice.reducer;

export const Loader = () => {
  const count = useSelector((state) => state.loader.count);
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={count > 0}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
