import { createSlice } from "@reduxjs/toolkit";
import { requestGetCategories, requestAddCategory, requestDeleteCategory } from "../middlewares/category.middewares";
const initialState = {
     loading: false,
     categories: []
}

const categorySlices = createSlice({
     name: 'categories',
     initialState,
     reducers: {

     },
     extraReducers: (builder) => {
          const listResquests = [requestGetCategories, requestAddCategory, requestDeleteCategory];
          listResquests.forEach((resquest) => {
               builder.addCase(resquest.pending, (state) => {
                    state.loading = true;
               });
               builder.addCase(resquest.rejected, (state) => {
                    state.loading = true;
               });
          });
          builder.addCase(requestGetCategories.fulfilled, (state, action) => {
               state.categories = action.payload.categories;
               state.loading = false;
          });
          builder.addCase(requestAddCategory.fulfilled, (state, action) => {
               if (action.payload.status === 201) {
                    state.categories = [...state.categories, action.payload.category];
               }
               state.loading = false;
          });
          builder.addCase(requestDeleteCategory.fulfilled, (state, action) => {
               if (action.payload.status === 200) {
                    state.categories = state.categories.filter((category) => category.id !== action.payload.id);
               }
               state.loading = false;
          });
     }
})
export default categorySlices.reducer;