import { createSlice } from "@reduxjs/toolkit";
import { requestLogin, requestToken, requestLogOut } from "@/store/middlewares/auth.middewares";
const initialState = {
     userInfo: null,
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
          const listResquests = [requestLogin, requestToken, requestLogOut];
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

     }
});

export default userSlices.reducer;