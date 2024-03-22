import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPointApi } from "@/helper/endPointApi";
import { request, config } from "@/utils/http";
const { LOGIN, API_TOKEN, LOGOUT, RESGITER } = endPointApi;
export const requestLogin = createAsyncThunk('auth/login', async (props, { rejectWithValue }) => {
     try {
          const res = await request.post(`${LOGIN}`, props);
          return res.data;
     } catch (e) {
          return rejectWithValue(e?.response?.data);

     }
});
export const requestResgiter = createAsyncThunk('auth/resgiter', async (props, { rejectWithValue }) => {
     try {
          const res = await request.post(`${RESGITER}`, props);
          return res.data;
     } catch (err) {
          return rejectWithValue(err?.response?.data);
     }

});
export const requestToken = createAsyncThunk('auth/token', async (props) => {
     const res = await request.post(`${API_TOKEN}`, null, config(props));
     return res.data;
});
export const requestLogOut = createAsyncThunk('auth/LogOut', async (props) => {
     const res = await request.get(`${LOGOUT}`, config(props));
     return res.data;
});
