import { Dispatch } from "redux";
import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";
import {
  getProductFailure,
  getProductStart,
  getProductSuccess,
  deleteProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  updateProductFailure,
  updateProductStart,
  updateProductSuccess,
  addProductFailure,
  addProductStart,
  addProductSuccess,
} from "./productRedux";

interface User {
  username: string;
  password: string;
}

interface Product {
  _id: string; // Make _id consistent
  title: string;
  desc: string;
  img: string;
  price: number;
  inStock: boolean;
}

// Login
export const login = async (dispatch: Dispatch, user: User) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

// Get Products
export const getProducts = async (dispatch: Dispatch) => {
  dispatch(getProductStart());
  try {
    const res = await publicRequest.get("/products");
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    dispatch(getProductFailure());
  }
};

// Delete Product
export const deleteProduct = async (id: string, dispatch: Dispatch) => {
  dispatch(deleteProductStart());
  try {
    // const res = await userRequest.delete(`/products/${id}`);
    dispatch(deleteProductSuccess(id));
  } catch (err) {
    dispatch(deleteProductFailure());
  }
};

// Update Product
export const updateProduct = async (
  id: string,
  product: Product,
  dispatch: Dispatch
) => {
  dispatch(updateProductStart());
  try {
    // Perform update logic here
    dispatch(updateProductSuccess({ id, product }));
  } catch (err) {
    dispatch(updateProductFailure());
  }
};

// Add Product
export const addProduct = async (product: Product, dispatch: Dispatch) => {
  dispatch(addProductStart());
  try {
    const res = await userRequest.post(`/products`, product);
    dispatch(addProductSuccess(res.data));
  } catch (err) {
    dispatch(addProductFailure());
  }
};
