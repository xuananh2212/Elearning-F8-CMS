import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPointApi } from "@/helper/endPointApi";
import { request } from "@/utils/http";
const { CATEGORIES } = endPointApi;
export const requestGetCategories = createAsyncThunk('categories/getAll', async () => {
     const res = await request.get(`${CATEGORIES}`);
     return res.data;
});
export const requestAddCategory = createAsyncThunk('categories/add', async (props, { rejectWithValue }) => {
     try {
          const res = await request.post(`${CATEGORIES}`, props);
          return res.data;
     } catch (e) {
          return rejectWithValue(e?.response?.data);
     }
});
export const requestDeleteCategory = createAsyncThunk('categories/delete', async (id) => {
     const res = await request.delete(`${CATEGORIES}/${id}`);
     return res.data;
});
export const requestDeleteManyCategory = createAsyncThunk('categories/delete-many', async (props) => {
     const res = await request.post(`${CATEGORIES}/delete-many-category`, props);
     return res.data;
});
export const requestUpdateCategory = createAsyncThunk('categories/update', async (props, { rejectWithValue }) => {
     try {
          const { id } = props;
          const res = await request.post(`${CATEGORIES}/${id}`, props);
          return res.data;
     } catch (e) {
          return rejectWithValue(e?.response?.data);
     }
});
export const requestCategoriesTreeData = createAsyncThunk('categories/get-parent-categories', async () => {
     const res = await request.get(`${CATEGORIES}/parent-categories`);
     return res.data;
});