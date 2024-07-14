import { configureStore } from "@reduxjs/toolkit";
import chatListTypeReducer from "./slices/chatListType";

const store = configureStore({
    reducer: {
        chatListType: chatListTypeReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;