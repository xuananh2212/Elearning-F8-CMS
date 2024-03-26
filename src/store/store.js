import { configureStore } from "@reduxjs/toolkit";
import userReducer from '@/store/slices/userSlices';
import categoriesReducer from '@/store/slices/categorySlices';
import coursesReducer from '@/store/slices/courseSlices';
import typeCourseReducer from '@/store/slices/typeCourseSlices';
import discountReducer from '@/store/slices/discountSlices';
export const store = configureStore({
     reducer: {
          user: userReducer,
          category: categoriesReducer,
          course: coursesReducer,
          typeCourse: typeCourseReducer,
          discount: discountReducer
     }
})