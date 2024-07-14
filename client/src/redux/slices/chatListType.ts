import { createSlice } from "@reduxjs/toolkit";

export const chatListTypeSlice = createSlice({
    name: "chatListType",
    initialState: {
        chatListType: 'All'
    },
    reducers: {
        setChatListTypeSlice: (state, action) => {
            state.chatListType = action.payload;
        }
    }
})

export const { setChatListTypeSlice } = chatListTypeSlice.actions;
export default chatListTypeSlice.reducer;