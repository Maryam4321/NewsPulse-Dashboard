import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { register, login, logout, fetchSession, fetchUserData } from '../../api/authAPI';
import { setTopics } from './topicsSlice';
import { setArticlesBySavedTopics } from './articlesSlice';
import { resetToDefaultSettings } from './settingsSlice';

const initialState = {
    "data": null,
    "session": null,
    "error": null,
    "loading": false    
};

// Async thunks
export const logUserIn = createAsyncThunk(
    'session/login',
    async (credentials, thunkAPI) => {
        try {
            thunkAPI.dispatch(setTopics([])); // TO DO - fetch default topics from database instead of hardcoding them
            thunkAPI.dispatch(setArticlesBySavedTopics({}));
            const { email, password } = credentials;
            const response = await login(email, password);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    });

export const registerUser = createAsyncThunk(
    'session/register',
    async (credentials, thunkAPI) => {
        try {
            thunkAPI.dispatch(setTopics([]));
            thunkAPI.dispatch(setArticlesBySavedTopics({}));
            const { email, password, first_name, last_name } = credentials;
            const response = await register(email, password, first_name, last_name);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    });

export const logUserOut = createAsyncThunk(
    'session/logout',
    async (_, thunkAPI) => {
        try {
            await logout();
            thunkAPI.dispatch(setTopics([]));
            thunkAPI.dispatch(setArticlesBySavedTopics({}));
            thunkAPI.dispatch(resetToDefaultSettings());
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    });

export const fetchSessionThunk = createAsyncThunk(
    'session/fetchSession',
    async (_, thunkAPI) => {
        try {
            const data = await fetchSession();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    });

export const fetchUserDataThunk = createAsyncThunk(
    'session/fetchUserData',
    async (_, thunkAPI) => {
        try {
            const data = await fetchUserData();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    });

// Slice
const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setSession(state, action) {
            state.session = action.payload;
        },
        setData(state, action) {
            state.data = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logUserIn.fulfilled, (state, action) => {
            state.session = action.payload;
            state.data = action.payload.user;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(logUserIn.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(logUserIn.rejected, (state, action) => {
            state.error = action.payload.error;
            state.loading = false;
        });

        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.session = action.payload;
            state.data = action.payload.user;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(registerUser.rejected, (state, action) => {
            state.error = action.payload.error;
            state.loading = false;
        });

        builder.addCase(logUserOut.fulfilled, (state) => {
            state.session = null;
            state.data = null;
            state.loading = false;
            state.error = null;
        });

        builder.addCase(logUserOut.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(logUserOut.rejected, (state, action) => {
            state.session = null;
            state.error = action.payload.error;
            state.loading = false;
        });

        builder.addCase(fetchSessionThunk.fulfilled, (state, action) => {
            if (!action.payload.session) {
                state.loading = false;
                state.error = null;
                return;
            }
            state.session = action.payload.session;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(fetchSessionThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchSessionThunk.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(fetchUserDataThunk.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchUserDataThunk.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchUserDataThunk.rejected, (state, action) => {
            state.loading = false;
        });
    }
});

const { actions, reducer } = sessionSlice;
export const { setSession, setData, setError } = actions;
export default reducer;

