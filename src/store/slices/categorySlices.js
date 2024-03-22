import { createSlice } from "@reduxjs/toolkit";
import {
     requestGetCategories, requestAddCategory,
     requestDeleteCategory, requestUpdateCategory,
     requestDeleteManyCategory, requestCategoriesTreeData
} from "../middlewares/category.middewares";
const initialState = {
     loading: false,
     categories: [],
     validateCategory: null,
     categoriesTreeData: []
}

export const categorySlices = createSlice({
     name: 'categories',
     initialState,
     reducers: {
          resetValidateCategory: (state, action) => {
               state.validateCategory = null;
          }

     },
     extraReducers: (builder) => {
          const listRequests =
               [
                    requestGetCategories,
                    requestCategoriesTreeData
               ];
          listRequests.forEach((resquest) => {
               builder.addCase(resquest.pending, (state) => {
                    state.loading = true;
               });
               builder.addCase(resquest.rejected, (state) => {
                    state.loading = false;
               });
          });
          const listRequestCUD =
               [
                    requestAddCategory,
                    requestDeleteCategory,
                    requestUpdateCategory,
                    requestDeleteManyCategory
               ]
          listRequestCUD.forEach((resquest) => {
               builder.addCase(resquest.pending, (state) => {
                    state.loading = true;
               });
               builder.addCase(resquest.rejected, (state, action) => {
                    state.validateCategory = action.payload?.errors;
                    state.loading = false;
               });
          });
          builder.addCase(requestGetCategories.fulfilled, (state, action) => {
               state.categories = action.payload.categories;
               state.loading = false;
          });
          builder.addCase(requestAddCategory.fulfilled, (state, action) => {
               state.categories = [...state.categories, action.payload.category];
               state.loading = false;
          });
          builder.addCase(requestDeleteCategory.fulfilled, (state, action) => {
               state.categories = state.categories.filter((category) => category.id !== action.payload.id);
               if (action.payload.childs && action.payload.childs.length) {
                    state.categories = state.categories.map(category => {
                         const categoryFind = action.payload.childs.find(({ id }) => id === category.id);
                         if (categoryFind) {
                              return categoryFind
                         }
                         return category
                    })
               }
               state.loading = false;
          });
          builder.addCase(requestUpdateCategory.fulfilled, (state, action) => {
               state.categories = state.categories.map(category => category.id === action.payload.category?.id ? action.payload.category : category);
               state.loading = false;
          });
          builder.addCase(requestDeleteManyCategory.fulfilled, (state, action) => {
               state.categories = state.categories.filter(category => !action.payload.categoryIds.includes(category?.id));
               if (action.payload.childs && action.payload.childs.length) {
                    state.categories = state.categories.map(category => {
                         const categoryFind = action.payload.childs.find(({ id }) => id === category.id);
                         if (categoryFind) {
                              return categoryFind
                         }
                         return category
                    })
               }

               state.loading = false;
          });
          builder.addCase(requestCategoriesTreeData.fulfilled, (state, action) => {
               state.categoriesTreeData = action.payload.categories;
               state.loading = false;
          });
     }
})
export default categorySlices.reducer;