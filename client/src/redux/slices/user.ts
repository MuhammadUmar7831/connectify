import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/user.type";

interface UserState {
    user: null | User
}

const initialState: UserState = {
    user: null
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    }
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;