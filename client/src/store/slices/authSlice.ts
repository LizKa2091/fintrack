import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import api from '../../api/axiosInstance.js'

interface User {
   id: string
   email: string
   name?: string
}

interface AuthState {
   user: User | null
   token: string | null
   isLoading: boolean
   error: string | null
}

const initialState: AuthState = {
   user: null,
   token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
   isLoading: false,
   error: null,
}

export const loginUser = createAsyncThunk(
   'auth/login',
   async (credentials: { email: string; password: Required<string> }, thunkAPI) => {
      try {
         const response = await api.post('/auth/login', credentials)

         localStorage.setItem('token', response.data.token)
         return response.data
      } catch (error: any) {
         return thunkAPI.rejectWithValue(
            error.response?.data?.message || 'Ошибка при входе в аккаунт'
         )
      }
   }
)

export const registerUser = createAsyncThunk(
   'auth/register',
   async (userData: { email: string; password: Required<string>; name?: string }, thunkAPI) => {
      try {
         const response = await api.post('/auth/register', userData)
         return response.data
      } catch (error: any) {
         return thunkAPI.rejectWithValue(error.response?.data?.message || 'Ошибка при регистрации')
      }
   }
)

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      logout: (state) => {
         localStorage.removeItem('token')
         state.user = null
         state.token = null
         state.error = null
      },
      clearError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(
            loginUser.fulfilled,
            (state, action: PayloadAction<{ user: User; token: string }>) => {
               state.isLoading = false
               state.user = action.payload.user
               state.token = action.payload.token
            }
         )
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload as string
         })
         .addCase(registerUser.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(registerUser.fulfilled, (state) => {
            state.isLoading = false
         })
         .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload as string
         })
   },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
