import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SIGN_IN, AUTH } from '../data/fetchUrl';

type UserState = {
  name: string;
  role: string;
  isSignIn: boolean;
  errorMsg: string;
  theme: 'light' | 'dark';
  toggleSidebar: boolean;
  showRightSidebar: boolean;
};

export const initialUserState: UserState = {
  name: '',
  role: '',
  isSignIn: false,
  errorMsg: '',
  theme: 'light',
  toggleSidebar: false,
  showRightSidebar: false,
};

// Action: sign-in
export const signIn = createAsyncThunk(
  'user/signIn',
  async (
    input: { data: { username: string; password: string }; mode: string },
    thunkAPI,
  ) => {
    try {
      const response = await fetch(`${SIGN_IN}${input.mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input.data),
      });
      const result = await response.json();
      return { status: response.status, result };
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

// Action: auth
export const auth = createAsyncThunk('user/auth', async (_, thunkAPI) => {
  try {
    const response: Response = await fetch(AUTH, {
      headers: {
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('JWToken') || '',
      },
    });
    const result = await response.json();
    return { status: response.status, result };
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

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
    signOut: (state) => {
      state.name = '';
      state.role = '';
      state.isSignIn = false;
      state.errorMsg = '';
      sessionStorage.removeItem('JWToken');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.name = action.payload.result.name || '';
        state.role = action.payload.result.title || '';
        state.isSignIn = true;
        sessionStorage.setItem('JWToken', action.payload.result.access_token);
      } else {
        state.errorMsg = action.payload.result.message;
      }
    });

    builder.addCase(auth.fulfilled, (state, action) => {
      if (action.payload.status === 200) {
        state.isSignIn = true;
      } else {
        state.isSignIn = false;
      }
    });
  },
});

export const userAction = userSlice.actions;
export default userSlice.reducer;
