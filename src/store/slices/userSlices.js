import { createSlice } from "@reduxjs/toolkit";
import { requestLogin } from "@/store/middlewares/auth.middewares";
const initialState = {
     userInfo: null,
     loading: false,
     accessToken: null,
     refreshToken: null
}
const userSlice = createSlice({
     name: 'users',
     initialState,
     reducers: {
     },
     extraReducers: (builder) => {
          const listResquests = [requestLogin];
          listResquests.forEach((resquest) => {
               console.log(requestLogin);
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
          })

     }
});

export default userSlice.reducer;