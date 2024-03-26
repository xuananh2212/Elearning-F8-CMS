import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPointApi } from "@/helper/endPointApi";
const { USERS } = endPointApi;
import { request } from "@/utils/http";
export const requestGetUsers = createAsyncThunk('users/getAll', async () => {
     const res = await request.get(`${USERS}`);
     return res.data;
});
export const requestEditUser = createAsyncThunk('users/edit-user', async (props, { rejectWithValue }) => {
     try {
          const { id } = props;
          const res = await request.post(`${USERS}/${id}`, props);
          return res.data;
     } catch (e) {
          return rejectWithValue(e?.response?.data);
     }
});
export const requestDeleteUser = createAsyncThunk('users/delete-user', async (id) => {
     const res = await request.delete(`${process.env.NEXT_PUBLIC_API}/${USERS}/${id}`);
     return res.data;
});
export const requestDeleteManyUser = createAsyncThunk('users/delete-many-user', async (props) => {
     const res = await request.post(`${process.env.NEXT_PUBLIC_API}/${USERS}/delete/many-user`, props);
     return res.data;
});