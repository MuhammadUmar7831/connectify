import { configureStore } from "@reduxjs/toolkit";
import chatListTypeReducer from "./slices/chatListType";
import successReducer from "./slices/success";
import errorReducer from "./slices/error";
import userReducer from "./slices/user";
import allChatsReducer from "./slices/allChats";
import personalChatsReducer from "./slices/personalChats";
import groupChatsReducer from "./slices/groupChats";
import pinnedChatsReducer from "./slices/pinnedChats";
import archiveChatsReducer from "./slices/archiveChats";

const store = configureStore({
    reducer: {
        chatListType: chatListTypeReducer,
        success: successReducer,
        error: errorReducer,
        user: userReducer,
        allChats: allChatsReducer,
        personalChats: personalChatsReducer,
        groupChats: groupChatsReducer,
        pinnedChats: pinnedChatsReducer,
        archiveChats: archiveChatsReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;