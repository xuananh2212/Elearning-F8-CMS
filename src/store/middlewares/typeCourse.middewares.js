import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "@/utils/http";
import { endPointApi } from "@/helper/endPointApi";
const { TYPE_COURSES } = endPointApi;
export const requestGetAllTypeCourse = createAsyncThunk('type-course/getAll', async (props) => {
     const res = await request.get(TYPE_COURSES);
     return res.data;
})
