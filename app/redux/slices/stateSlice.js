import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: {},
  isLoggedin: true,
  themeMode: "System",
  sidebarToggle: true,
  bodyZindex: true,
};

const statePersist = createSlice({
  name: "reduxState",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedin = action.payload.loggedin;
    },
    logout: (state) => {
      state.token = null;
      state.user = {};
      state.isLoggedin = false;
    },
    updateThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    toggleSidebar: (state, action) => {
      state.sidebarToggle = !state.sidebarToggle;
    },
    zIndexUp: (state, action) => {
      state.bodyZindex = action.payload;
    },
  },
});

export const {
  setCredentials,
  logout,
  updateThemeMode,
  toggleSidebar,
  zIndexUp,
} = statePersist.actions;
export default statePersist.reducer;
