import { endPointApi } from "@/helper/endPointApi";
import { request } from "@/utils/http";
import { createAsyncThunk } from "@reduxjs/toolkit";
const { COURSES } = endPointApi;
export const requestGetAllCourse = createAsyncThunk(
  "course/getAll",
  async () => {
    const res = await request.get(COURSES);
    return res.data;
  }
);
export const requestGetAllCourseByTeacher = createAsyncThunk(
  "course/getAllByTeacher",
  async (id) => {
    const res = await request.get(`course/v1/courses/by-teacher/${id}`);
    return res.data;
  }
);
export const requestAddCourse = createAsyncThunk(
  "course/addCourse",
  async (props, { rejectWithValue }) => {
    try {
      const res = await request.post(COURSES, props);
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  }
);
export const requestUpdateCourse = createAsyncThunk(
  "course/updateCourse",
  async (props, { rejectWithValue }) => {
    try {
      const { id } = props;
      const res = await request.post(`${COURSES}/${id}`, props);
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  }
);
export const requestDeleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async (id) => {
    const res = await request.delete(`${COURSES}/${id}`);
    return res.data;
  }
);
export const requestDeleteManyCourse = createAsyncThunk(
  "course/deleteManyCourse",
  async (props) => {
    const res = await request.post(`${COURSES}/delete/many-course`, props);
    return res.data;
  }
);
