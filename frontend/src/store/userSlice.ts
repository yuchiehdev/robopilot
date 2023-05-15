import { createSlice } from '@reduxjs/toolkit';

type activeTab = {
  page: string;
  tab: string;
};

type UserState = {
  name: string;
  role: string;
  permission: 'Guest' | 'Engineer' | 'Site Vender' | 'Developer';
  isSignIn: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: boolean;
  showRightSidebar: boolean;
  activeTab: activeTab[];
};

export const initialUserState: UserState = {
  name: '',
  role: '',
  permission: 'Guest',
  isSignIn: false,
  theme: 'light',
  toggleSidebar: true,
  showRightSidebar: false,
  activeTab: [
    {
      page: 'event',
      tab: '1',
    },
  ],
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    changeTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state, action) => {
      state.toggleSidebar = action.payload;
    },
    toggleRightSidebar: (state) => {
      state.showRightSidebar = !state.showRightSidebar;
    },
    hideRightSidebar: (state) => {
      state.showRightSidebar = false;
    },
    setUserRole: (state, action) => {
      state.name = action.payload.name || '';
      state.permission = action.payload.permission || 'Guest';
    },
    setPermission: (state, action) => {
      state.permission = action.payload;
    },
    setUserName: (state, action) => {
      state.name = action.payload;
    },
    setSignInStatus: (state, action) => {
      state.isSignIn = action.payload;
    },
    signOut: (state) => {
      state.name = '';
      state.isSignIn = false;
      state.permission = 'Guest';
      localStorage.removeItem('JWToken');
      localStorage.removeItem('RefreshToken');
      localStorage.removeItem('SessionExpiration');
    },
    setActiveTab: (state, action) => {
      const { page, tab } = action.payload;
      const index = state.activeTab.findIndex((item) => item.page === page);
      if (index === -1) {
        state.activeTab.push({ page, tab });
      } else {
        state.activeTab[index].tab = tab;
      }
    },
  },
});

export const userAction = userSlice.actions;
export default userSlice.reducer;
