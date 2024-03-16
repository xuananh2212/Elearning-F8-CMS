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
     accessToken: null,
     refreshToken: null
}
const userSlices = createSlice({
     name: 'users',
     initialState,
     reducers: {
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
               builder.addCase(resquest.rejected, (state) => {
                    state.loading = true;
               });
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
               if (action.payload.status === 200) {
                    state.users = action.payload.users;
               }
               state.loading = false;
          });
          builder.addCase(requestEditUser.fulfilled, (state, action) => {
               if (action.payload.status === 200) {
                    state.users = state.users.map((user) => user.id === action?.payload?.user?.id ? action.payload.user : user);
               }
               state.loading = false;
          });
          builder.addCase(requestDeleteUser.fulfilled, (state, action) => {
               if (action.payload.status === 200) {
                    state.users = state.users.filter(({ id }) => id !== action.payload.userId);
               }
               state.loading = false;
          });
          builder.addCase(requestDeleteManyUser.fulfilled, (state, action) => {
               if (action.payload.status === 200) {
                    state.users = state.users.filter(({ id }) => !action.payload?.userIds.includes(id));
               }
               state.loading = false;
          });
          builder.addCase(requestResgiter.fulfilled, (state, action) => {
               if (action.payload.status === 201) {
                    state.users = [...state.users, action.payload.user];
               }
               state.loading = false;
          });
     }
});

export default userSlices.reducer;