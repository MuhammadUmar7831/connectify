import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Chat from "../../types/chat.types";

interface GroupChatsState {
    groupChats: Chat[] | null;
}

const initialState: GroupChatsState = {
    groupChats: null,
};

export const groupChatsSlice = createSlice({
    name: "groupChats",
    initialState,
    reducers: {
        setGroupChats: (state, action: PayloadAction<Chat[]>) => {
            state.groupChats = action.payload;
        },
    },
});

export const { setGroupChats } = groupChatsSlice.actions;
export default groupChatsSlice.reducer;
