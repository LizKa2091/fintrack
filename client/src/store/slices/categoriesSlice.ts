import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from '../../api/axiosInstance.js'

export interface Category {
   id: string
   name: string
   type: 'income' | 'expense'
}

interface CategoriesState {
   items: Category[]
   isLoading: boolean
   error: string | null
}

interface BackendErrorResponse {
   error?: string
}

const initialState: CategoriesState = {
   items: [],
   isLoading: false,
   error: null,
}

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, thunkAPI) => {
   try {
      const response = await api.get('/categories')
      return response.data
   } catch (error) {
      const err = error as AxiosError<BackendErrorResponse>
      return thunkAPI.rejectWithValue(err.response?.data?.error || 'Не удалось загрузить категории')
   }
})

export const createCategoryThunk = createAsyncThunk(
   'categories/create',
   async (categoryData: Omit<Category, 'id'>, thunkAPI) => {
      try {
         const response = await api.post('/categories', categoryData)
         return response.data
      } catch (error) {
         const err = error as AxiosError<BackendErrorResponse>
         return thunkAPI.rejectWithValue(
            err.response?.data?.error || 'Не удалось создать категорию'
         )
      }
   }
)

const categoriesSlice = createSlice({
   name: 'categories',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchCategories.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
            state.isLoading = false
            state.items = action.payload
         })
         .addCase(fetchCategories.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload as string
         })

         .addCase(createCategoryThunk.fulfilled, (state, action: PayloadAction<Category>) => {
            state.items.push(action.payload)
         })
   },
})

export const categoriesReducer = categoriesSlice.reducer
