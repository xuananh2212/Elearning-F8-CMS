import { createAsyncThunk } from "@reduxjs/toolkit";
import { endPointApi } from "@/helper/endPointApi";
const { USERS } = endPointApi;
export const requestGetUsers = createAsyncThunk('users/getAll', async () => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${USERS}`, {
          method: 'GET',
          headers: {
               'Content-Type': 'application/json'
          }
     });
     const data = await res.json();
     return data;
});
export const requestEditUser = createAsyncThunk('users/edit-user', async (props) => {
     const { id } = props;
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${USERS}/${id}`, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(props)
     });
     const data = await res.json();
     return data;
});
export const requestDeleteUser = createAsyncThunk('users/delete-user', async (id) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${USERS}/${id}`, {
          method: 'DELETE',
          headers: {
               'Content-Type': 'application/json'
          }
     });
     const data = await res.json();
     return data;
});
export const requestDeleteManyUser = createAsyncThunk('users/delete-many-user', async (props) => {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API}/${USERS}/delete-many-user`, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(props)
     });
     const data = await res.json();
     return data;
});