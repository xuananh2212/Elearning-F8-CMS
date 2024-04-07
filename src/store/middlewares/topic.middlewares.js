import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "@/utils/http";
import { endPointApi } from "@/helper/endPointApi";
const { TOPICS } = endPointApi;

export const requestUpdateSortTopic = createAsyncThunk('topic/update-sort', async (props) => {
     const res = await request.post(`${TOPICS}/sort/many`, props);
     return res.data;
})