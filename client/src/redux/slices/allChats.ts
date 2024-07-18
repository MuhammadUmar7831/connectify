import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Chat from "../../types/chat.types";

interface AllChatsState {
    allChats: Chat[] | null;
}

const initialState: AllChatsState = {
    allChats: null,
};

export const allChatsSlice = createSlice({
    name: "allChats",
    initialState,
    reducers: {
        setAllChats: (state, action: PayloadAction<Chat[]>) => {
            state.allChats = action.payload;
        },
    },
});

export const { setAllChats } = allChatsSlice.actions;
export default allChatsSlice.reducer;
