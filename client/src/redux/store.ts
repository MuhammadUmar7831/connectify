import { configureStore } from "@reduxjs/toolkit";
import chatListTypeReducer from "./slices/chatListType";
import successReducer from "./slices/success";
import errorReducer from "./slices/error";
import userReducer from "./slices/user";

const store = configureStore({
    reducer: {
        chatListType: chatListTypeReducer,
        success: successReducer,
        error: errorReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;