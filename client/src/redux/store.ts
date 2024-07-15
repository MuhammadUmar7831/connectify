import { configureStore } from "@reduxjs/toolkit";
import chatListTypeReducer from "./slices/chatListType";
import successReducer from "./slices/success";
import errorReducer from "./slices/error";

const store = configureStore({
    reducer: {
        chatListType: chatListTypeReducer,
        success: successReducer,
        error: errorReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;