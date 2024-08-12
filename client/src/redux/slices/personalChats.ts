import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Chat from "../../types/chat.types";

interface PersonalChatsState {
    personalChats: Chat[] | null;
}

const initialState: PersonalChatsState = {
    personalChats: null,
};

export const personalChatsSlice = createSlice({
    name: "personalChats",
    initialState,
    reducers: {
        setPersonalChats: (state, action: PayloadAction<Chat[] | null>) => {
            state.personalChats = action.payload;
        },
    },
});

export const { setPersonalChats } = personalChatsSlice.actions;
export default personalChatsSlice.reducer;
