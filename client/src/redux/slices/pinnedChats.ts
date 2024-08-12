import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Chat from "../../types/chat.types";

interface PinnedChatsState {
    pinnedChats: Chat[] | null;
}

const initialState: PinnedChatsState = {
    pinnedChats: null,
};

export const pinnedChatsSlice = createSlice({
    name: "pinnedChats",
    initialState,
    reducers: {
        setPinnedChats: (state, action: PayloadAction<Chat[] | null>) => {
            state.pinnedChats = action.payload;
        },
    },
});

export const { setPinnedChats } = pinnedChatsSlice.actions;
export default pinnedChatsSlice.reducer;
