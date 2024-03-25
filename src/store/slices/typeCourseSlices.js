import { createSlice } from "@reduxjs/toolkit";
import { requestGetAllTypeCourse } from "../middlewares/typeCourse.middewares";
const initialState = {
     loading: false,
     typeCourses: []
}

export const typeCourseSlices = createSlice({
     name: 'typeCourses',
     initialState,
     reducers: {
     },
     extraReducers: (builder) => {
          const listRequests = [
               requestGetAllTypeCourse
          ];
          listRequests.forEach((request) => {
               builder.addCase(request.pending, (state) => {
                    state.loading = true;
               });
               builder.addCase(request.rejected, (state) => {
                    state.loading = false;
               });
          });
          builder.addCase(requestGetAllTypeCourse.fulfilled, (state, action) => {
               state.typeCourses = action.payload.typeCourses;
               state.loading = false;
          })
     }
});
export default typeCourseSlices.reducer;