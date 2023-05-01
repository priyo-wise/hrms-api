import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
//import counterReducer from '../redux/counter';
import loaderReducer from "./Loader";

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    auth: authSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
//export const RootState = ReturnType<typeof store.getState>()
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
//export const AppDispatch = typeof store.dispatch;
