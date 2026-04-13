import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  uid: null,
  email: null,
  role: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.uid = action.payload.uid
      state.email = action.payload.email
      state.role = action.payload.role
    },
    logout: (state) => {
      state.uid = null
      state.email = null
      state.role = null
    },
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer