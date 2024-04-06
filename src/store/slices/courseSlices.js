import { createSlice } from "@reduxjs/toolkit";
import { requestGetAllCourse, requestAddCourse, requestUpdateCourse, requestDeleteCourse, requestDeleteManyCourse } from "../middlewares/course.middewares";
const initialState = {
     loading: false,
     courses: [],
     topicDetail: null,
     validateCourse: null,
}

export const courseSlices = createSlice({
     name: 'courses',
     initialState,
     reducers: {
          resetValidateCourse: (state, action) => {
               state.validateCourse = null;
          },

     },
     extraReducers: (builder) => {
          const listRequests = [
               requestGetAllCourse, requestDeleteCourse,
               requestDeleteManyCourse
          ]
          listRequests.forEach((request) => {
               builder.addCase(request.pending, (state, action) => {
                    state.loading = true;
               });
               builder.addCase(request.rejected, (state, action) => {
                    state.loading = false;
               });
          });
          const listCUDRequest = [requestAddCourse, requestUpdateCourse];
          listCUDRequest.forEach((request) => {
               builder.addCase(request.pending, (state, action) => {
                    state.loading = true;
               });
               builder.addCase(request.rejected, (state, action) => {
                    state.validateCourse = action.payload?.errors;
                    state.loading = false;
               });
          });
          builder.addCase(requestGetAllCourse.fulfilled, (state, action) => {
               state.courses = action.payload.courses;
               state.loading = false;
          });
          builder.addCase(requestAddCourse.fulfilled, (state, action) => {
               state.courses = [...state.courses, action.payload.course];
               state.loading = false;
          });
          builder.addCase(requestUpdateCourse.fulfilled, (state, action) => {
               state.courses = state.courses.map((course) => course?.id === action.payload.course?.id ? action.payload.course : course);
               state.loading = false;
          });
          builder.addCase(requestDeleteCourse.fulfilled, (state, action) => {
               state.courses = state.courses.filter((course) => course?.id !== action.payload.courseId);
               state.loading = false;
          });
          builder.addCase(requestDeleteManyCourse.fulfilled, (state, action) => {
               state.courses = state.courses.filter((course) => !action.payload?.courseIds.includes(course.id));
               state.loading = false;
          });
     }
})
export default courseSlices.reducer;