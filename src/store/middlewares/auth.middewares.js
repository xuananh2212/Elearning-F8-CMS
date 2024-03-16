import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPointApi } from "@/helper/endPointApi";
const { LOGIN, API_TOKEN, LOGOUT, RESGITER } = endPointApi;
export const requestLogin = createAsyncThunk('auth/login', async (props) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${LOGIN}`, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(props)

     });
     const data = await res.json();
     return data;
});
export const requestResgiter = createAsyncThunk('auth/resgiter', async (props) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${RESGITER}`, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(props)

     });
     const data = await res.json();
     return data;
});
export const requestToken = createAsyncThunk('auth/token', async (props) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${API_TOKEN}`, {
          method: 'POST',
          headers: {
               "Authorization": `Bearer${props}`
          }
     });
     const data = await res.json();
     return data;
});
export const requestLogOut = createAsyncThunk('auth/LogOut', async (props) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${LOGOUT}`, {
          method: 'GET',
          headers: {
               "Authorization": `Bearer${props}`
          }
     });
     const data = await res.json();
     return data;
});
