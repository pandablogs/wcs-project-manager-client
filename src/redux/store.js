import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import projectManagerReducer from './slices/projectManagerSlice'
export const store = configureStore({
    reducer: {
        user: userReducer,
        project_manager: projectManagerReducer,
    },
});

export default store;
