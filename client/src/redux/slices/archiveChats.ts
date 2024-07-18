import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Chat from "../../types/chat.types";

interface ArchiveChatsState {
    archiveChats: Chat[] | null;
}

const initialState: ArchiveChatsState = {
    archiveChats: null,
};

export const archiveChatsSlice = createSlice({
    name: "archiveChats",
    initialState,
    reducers: {
        setArchiveChats: (state, action: PayloadAction<Chat[]>) => {
            state.archiveChats = action.payload;
        },
    },
});

export const { setArchiveChats } = archiveChatsSlice.actions;
export default archiveChatsSlice.reducer;
