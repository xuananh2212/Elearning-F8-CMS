import { configureStore } from "@reduxjs/toolkit";
import userReducer from '@/store/slices/userSlices';
import categoriesReducer from '@/store/slices/categorySlices';
export const store = configureStore({
     reducer: {
          user: userReducer,
          category: categoriesReducer
     }
})