import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPointApi } from "@/helper/endPointApi";
const { CATEGORIES } = endPointApi;
export const requestGetCategories = createAsyncThunk('getAll/categories', async () => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${CATEGORIES}`, {
          method: 'GET',
          headers: {
               'Content-Type': 'application/json'
          }
     });
     const data = await res.json();
     return data;
});
export const requestAddCategory = createAsyncThunk('add/categories', async (props) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${CATEGORIES}`, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(props)
     });
     const data = await res.json();
     return data;
});
export const requestDeleteCategory = createAsyncThunk('delete/categories', async (id) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${CATEGORIES}/${id}`, {
          method: 'DELETE',
          headers: {
               'Content-Type': 'application/json'
          }
     });
     const data = await res.json();
     return data;
});