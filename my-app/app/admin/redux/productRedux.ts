import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Product interface
interface Product {
  _id: string;
  title: string;
  desc: string;
  img: string;
  price: number;
  inStock: boolean;
}

// Define the initial state type
interface ProductState {
  products: Product[];
  isFetching: boolean;
  error: boolean;
}

// Initial state
const initialState: ProductState = {
  products: [],
  isFetching: false,
  error: false,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // GET ALL
    getProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getProductSuccess: (state, action: PayloadAction<Product[]>) => {
      state.isFetching = false;
      state.products = action.payload;
    },
    getProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    // DELETE
    deleteProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteProductSuccess: (state, action: PayloadAction<string>) => {
      state.isFetching = false;
      const index = state.products.findIndex(
        (item) => item._id === action.payload
      );
      if (index !== -1) state.products.splice(index, 1);
    },
    deleteProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    // UPDATE
    updateProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateProductSuccess: (
      state,
      action: PayloadAction<{ id: string; product: Product }>
    ) => {
      state.isFetching = false;
      const index = state.products.findIndex(
        (item) => item._id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload.product;
      }
    },
    updateProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    // ADD
    addProductStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    addProductSuccess: (state, action: PayloadAction<Product>) => {
      state.isFetching = false;
      state.products.push(action.payload);
    },
    addProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

// Export actions
export const {
  getProductStart,
  getProductSuccess,
  getProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  addProductStart,
  addProductSuccess,
  addProductFailure,
} = productSlice.actions;

// Export reducer
export default productSlice.reducer;
