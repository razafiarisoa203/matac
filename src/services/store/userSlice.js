import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  cin: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      console.log(action.payload)
      state.token = action.payload.token;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
    },
    setGlobalCIN(state,action) {
        state.cin = action.payload.cin
        console.log(action)
    },
  },
});

export const { setUser, clearUser,setGlobalCIN } = userSlice.actions;
export default userSlice.reducer;