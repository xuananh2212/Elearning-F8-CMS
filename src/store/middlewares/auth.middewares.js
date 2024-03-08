import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPointApi } from "@/helper/endPointApi";
const { login } = endPointApi;
export const requestLogin = createAsyncThunk('auth/login', async (props) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${login}`, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(props)

     });
     const data = await res.json();
     return data;
})