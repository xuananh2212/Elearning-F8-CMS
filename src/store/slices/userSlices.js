import { createSlice } from "@reduxjs/toolkit";
import {
     requestLogin, requestToken,
     requestLogOut, requestResgiter
} from "@/store/middlewares/auth.middewares";
import {
     requestGetUsers, requestEditUser,
     requestDeleteUser, requestDeleteManyUser
} from "../middlewares/user.middwares";
const initialState = {
     userInfo: null,
     users: [],
     loading: false,
     validateUser: null,
     validateLogin: null,
     accessToken: null,
     refreshToken: null
}
export const userSlices = createSlice({
     name: 'users',
     initialState,
     reducers: {
          resetValidateUser: (state, action) => {
               state.validateUser = null
          },
          resetValidateLogin: (state, action) => {
               state.validateLogin = null
          }
     },
     extraReducers: (builder) => {
          const listResquests =
               [
                    requestLogin, requestToken,
                    requestLogOut, requestGetUsers,
                    requestEditUser, requestDeleteUser,
                    requestDeleteManyUser, requestResgiter
               ];
          listResquests.forEach((resquest) => {
               builder.addCase(resquest.pending, (state) => {
                    state.loading = true;
               });
          });
          builder.addCase(requestResgiter.rejected, (state, action) => {
               state.validateUser = action.payload?.errors;
               state.loading = false;
          });
          builder.addCase(requestLogin.rejected, (state, action) => {
               state.validateLogin = action.payload?.errors;
               state.loading = false;
          });
          builder.addCase(requestLogOut.rejected, (state, action) => {
               state.loading = false;
          });
          builder.addCase(requestEditUser.rejected, (state, action) => {
               state.validateUser = action.payload?.errors;
               state.loading = false;
          });
          builder.addCase(requestLogin.fulfilled, (state, action) => {
               state.userInfo = action.payload.user;
               state.accessToken = action.payload.access_token;
               state.refreshToken = action.payload.refresh_token;
               state.loading = false;
          });
          builder.addCase(requestToken.fulfilled, (state, action) => {
               state.userInfo = action.payload.user;
               state.loading = false;
          });
          builder.addCase(requestLogOut.fulfilled, (state, action) => {
               state.userInfo = null;
               state.accessToken = null;
               state.refreshToken = null;
               state.loading = false;
          });
          builder.addCase(requestGetUsers.fulfilled, (state, action) => {
               state.users = action.payload.users;
               state.loading = false;
          });
          builder.addCase(requestEditUser.fulfilled, (state, action) => {
               state.users = state.users.map((user) => user.id === action?.payload?.user?.id ? action.payload.user : user);
               state.loading = false;
          });
          builder.addCase(requestDeleteUser.fulfilled, (state, action) => {
               state.users = state.users.filter(({ id }) => id !== action.payload.userId);
               state.loading = false;
          });
          builder.addCase(requestDeleteManyUser.fulfilled, (state, action) => {
               state.users = state.users.filter(({ id }) => !action.payload?.userIds.includes(id));
               state.loading = false;
          });
          builder.addCase(requestResgiter.fulfilled, (state, action) => {
               state.users = [...state.users, action.payload.user];
               state.loading = false;
          });
     }
});

export default userSlices.reducer;