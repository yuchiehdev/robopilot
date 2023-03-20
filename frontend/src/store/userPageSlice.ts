import { createSlice } from '@reduxjs/toolkit';

type InitialUserPage = {
  activeTab: string;
};

export const initialUserPage: InitialUserPage = {
  activeTab: '1',
};

const userPageSlice = createSlice({
  name: 'dashboard',
  initialState: initialUserPage,
  reducers: {
    handleTabChange: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { handleTabChange } = userPageSlice.actions;
export default userPageSlice.reducer;
