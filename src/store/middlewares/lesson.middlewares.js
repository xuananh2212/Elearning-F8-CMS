import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "@/utils/http";
import { endPointApi } from "@/helper/endPointApi";
const { LESSONS } = endPointApi;
"sort/between-different-topics"
export const requestUpdateSortLesson = createAsyncThunk('lesson/update-sort', async (props) => {
     const res = await request.post(`${LESSONS}/sort/many`, props);
     return res.data;
})
export const requestUpdateSortLessonDifferentTopic = createAsyncThunk('lesson/update-sort-different-topic', async (props) => {
     const res = await request.post(`${LESSONS}/sort/between-different-topics`, props);
     return res.data;
})