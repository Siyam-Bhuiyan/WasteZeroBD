import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the User interface
interface User {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  isAdmin: boolean; // Add the isAdmin property
}


// Define the initial state type
interface UserState {
  currentUser: User | null;
  isFetching: boolean;
  error: boolean;
}

// Initial state
const initialState: UserState = {
  currentUser: null,
  isFetching: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
      state.error = false; // Reset error state on new login attempt
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
