import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    stats: {
        totalAdmins: 0,
        amountInvested: 0,
    },
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
            state.stats = { totalAdmins: 0, amountInvested: 0 };
        },
    },
});

export const { setUser, setStats, clearUser } = userSlice.actions;
export default userSlice.reducer;
