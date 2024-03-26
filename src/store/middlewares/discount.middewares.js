import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPointApi } from "@/helper/endPointApi";
import { request } from "@/utils/http";
const { DISCOUNTS } = endPointApi;
export const requestGetDiscounts = createAsyncThunk('discounts/getAll', async () => {
     const res = await request.get(`${DISCOUNTS}`);
     return res.data;
});
export const requestAddDiscounts = createAsyncThunk('discounts/add', async (props, { rejectWithValue }) => {
     try {
          const res = await request.post(`${DISCOUNTS}`, props);
          return res.data;
     } catch (e) {
          return rejectWithValue(e?.response?.data)
     }
});
export const requestUpdateDiscounts = createAsyncThunk('discounts/update', async (props, { rejectWithValue }) => {
     try {
          const { id } = props;
          const res = await request.post(`${DISCOUNTS}/${id}`, props);
          return res.data;
     } catch (e) {
          return rejectWithValue(e?.response?.data)
     }
});
export const requestDeleteDiscounts = createAsyncThunk('discounts/delete', async (id) => {
     const res = await request.delete(`${DISCOUNTS}/${id}`);
     return res.data;
});
export const requestDeleteManyDiscount = createAsyncThunk('discounts/delete-many', async (props) => {
     const res = await request.post(`${DISCOUNTS}/delete/many-discount`, props);
     return res.data;
});