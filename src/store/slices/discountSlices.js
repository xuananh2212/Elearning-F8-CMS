import { createSlice } from "@reduxjs/toolkit";
import {
     requestGetDiscounts,
     requestAddDiscounts,
     requestUpdateDiscounts,
     requestDeleteDiscounts,
     requestDeleteManyDiscount
} from "@/store/middlewares/discount.middewares";
const initialState = {
     loading: false,
     discounts: [],
     validateDiscounts: null,
}

export const discountSlices = createSlice(
     {
          name: 'discounts',
          initialState,
          reducers: {
               resetValidateDiscounts: (state, action) => {
                    state.validateDiscounts = null
               },
          },
          extraReducers: (builder) => {
               const listRequests = [
                    requestGetDiscounts,
                    requestDeleteDiscounts,
                    requestDeleteManyDiscount
               ]
               listRequests.forEach((resquest) => {
                    builder.addCase(resquest.pending, (state) => {
                         state.loading = true;
                    });
                    builder.addCase(resquest.rejected, (state) => {
                         state.loading = false;
                    });
               });
               const listRequestCreateUpdate = [requestAddDiscounts, requestUpdateDiscounts];
               listRequestCreateUpdate.forEach((resquest) => {
                    builder.addCase(resquest.pending, (state) => {
                         state.loading = true;
                    });
                    builder.addCase(resquest.rejected, (state, action) => {
                         state.loading = false;
                         state.validateDiscounts = action.payload?.errors;
                    });
               });
               builder.addCase(requestGetDiscounts.fulfilled, (state, action) => {
                    state.discounts = action.payload.discounts;
                    state.loading = false;
               });
               builder.addCase(requestAddDiscounts.fulfilled, (state, action) => {
                    state.discounts = [...state.discounts, action.payload.discount];
                    state.loading = false;
               });
               builder.addCase(requestUpdateDiscounts.fulfilled, (state, action) => {
                    state.discounts = state.discounts.map((discount) => discount.id === action.payload.discount.id ? action.payload.discount : discount)
                    state.loading = false;
               });
               builder.addCase(requestDeleteDiscounts.fulfilled, (state, action) => {
                    state.discounts = state.discounts.filter(discount => discount.id !== action.payload.discountId);
                    state.loading = false;
               });
               builder.addCase(requestDeleteManyDiscount.fulfilled, (state, action) => {
                    state.discounts = state.discounts.filter((discount) => !action.payload.discountIds.includes(discount.id));
                    state.loading = false;
               });
          }
     }
);
export default discountSlices.reducer;