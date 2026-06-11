import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from '../../api/axiosInstance.js'

interface User {
   id: string
   email: string
   name?: string
   currency: string
}

interface AuthState {
   user: User | null
   token: string | null
   isLoading: boolean
   error: string | null
}

interface BackendErrorResponse {
   message?: string
}

const initialState: AuthState = {
   user: null,
   token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
   isLoading: false,
   error: null,
}

export const loginUser = createAsyncThunk(
   'auth/login',
   async (credentials: { email: string; password: string }, thunkAPI) => {
      try {
         const response = await api.post('/auth/login', credentials)
         localStorage.setItem('token', response.data.token)
         return response.data
      } catch (error) {
         const err = error as AxiosError<BackendErrorResponse>
         return thunkAPI.rejectWithValue(
            err.response?.data?.message || 'Ошибка при входе в аккаунт'
         )
      }
   }
)

export const registerUser = createAsyncThunk(
   'auth/register',
   async (userData: { email: string; password: string; name?: string }, thunkAPI) => {
      try {
         const response = await api.post('/auth/register', userData)
         return response.data
      } catch (error) {
         const err = error as AxiosError<BackendErrorResponse>
         return thunkAPI.rejectWithValue(err.response?.data?.message || 'Ошибка при регистрации')
      }
   }
)

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
   try {
      const token = localStorage.getItem('token')
      if (!token) return thunkAPI.rejectWithValue('No token found')

      const response = await api.get('/auth/me')

      return { user: response.data.user, token }
   } catch (error) {
      const err = error as AxiosError<BackendErrorResponse>
      localStorage.removeItem('token')
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Session expired')
   }
})

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
         .addCase(checkAuth.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(
            checkAuth.fulfilled,
            (state, action: PayloadAction<{ user: User; token: string }>) => {
               state.isLoading = false
               state.user = action.payload.user
               state.token = action.payload.token
            }
         )
         .addCase(checkAuth.rejected, (state) => {
            state.isLoading = false
            state.user = null
            state.token = null
         })
   },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
