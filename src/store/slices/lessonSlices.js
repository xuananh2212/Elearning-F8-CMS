import { createSlice } from "@reduxjs/toolkit";
import { requestUpdateSortLesson, requestUpdateSortLessonDifferentTopic } from "../middlewares/lesson.middlewares";
const initialState = {
     loading: false,
     validatelesson: null,
}
export const lessonSlices = createSlice(
     {
          name: 'lessons',
          initialState,
          reducers: {
               resetValidateDiscounts: (state, action) => {
                    state.validatelesson = null
               },
               setlessonDetail: (state, action) => {
                    state.lessonDetail = action.payload;
               }
          },
          extraReducers: (builder) => {
               const listRequests = [
                    requestUpdateSortLesson, requestUpdateSortLessonDifferentTopic
               ]
               listRequests.forEach((request) => {
                    builder.addCase(request.pending, (state, action) => {
                         state.loading = true;
                    });
                    builder.addCase(request.rejected, (state, action) => {
                         state.loading = false;
                    });
               });
               builder.addCase(requestUpdateSortLesson.fulfilled, (state, action) => {
                    state.loading = false;
               })
               builder.addCase(requestUpdateSortLessonDifferentTopic.fulfilled, (state, action) => {
                    state.loading = false;
               })

          }

     }
)

export default lessonSlices.reducer;