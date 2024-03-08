import { configureStore } from "@reduxjs/toolkit";
import userReducer from '@/store/slices/userSlices';
export const store = configureStore({
     reducer: {
          user: userReducer
     }
})