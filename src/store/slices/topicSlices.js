import { createSlice } from "@reduxjs/toolkit";
import { requestUpdateSortTopic } from "../middlewares/topic.middeware";
const initialState = {
     loading: false,
     topicDetail: null,
     validateTopic: null,
}
export const topicSlices = createSlice(
     {
          name: 'topics',
          initialState,
          reducers: {
               resetValidateDiscounts: (state, action) => {
                    state.validateTopic = null
               },
               setTopicDetail: (state, action) => {
                    state.topicDetail = action.payload;
               }
          },
          extraReducers: (builder) => {
               const listRequests = [
                    requestUpdateSortTopic
               ]
               listRequests.forEach((request) => {
                    builder.addCase(request.pending, (state, action) => {
                         state.loading = true;
                    });
                    builder.addCase(request.rejected, (state, action) => {
                         state.loading = false;
                    });
               });
               builder.addCase(requestUpdateSortTopic.fulfilled, (state, action) => {
                    state.loading = false;
                    state.topicDetail = action.payload.topics.sort((a, b) => a.sort - b.sort);
               })

          }

     }
)

export default topicSlices.reducer;