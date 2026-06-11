import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from '../../api/axiosInstance.js'

export interface Transaction {
   id: string
   title: string
   amount: number
   type: 'income' | 'expense'
   date: string
   categoryId: string
   category: {
      id: string
      name: string
      type: 'income' | 'expense'
   }
}

interface TransactionsState {
   items: Transaction[]
   isLoading: boolean
   error: string | null
   currentPage: number
   hasMore: boolean
   total: number
}

interface BackendErrorResponse {
   error?: string
}

const initialState: TransactionsState = {
   items: [],
   isLoading: false,
   error: null,
   currentPage: 1,
   hasMore: false,
   total: 0,
}

export const fetchTransactions = createAsyncThunk(
   'transactions/fetchAll',
   async (params: { page: number; limit: number } | undefined, thunkAPI) => {
      try {
         const page = params?.page || 1
         const limit = params?.limit || 10

         const response = await api.get(`/transactions?page=${page}&limit=${limit}`)
         return response.data
      } catch (error) {
         const err = error as AxiosError<BackendErrorResponse>
         return thunkAPI.rejectWithValue(
            err.response?.data?.error || 'Не удалось загрузить транзакции'
         )
      }
   }
)

export const createTransactionThunk = createAsyncThunk(
   'transactions/create',
   async (
      transactionData: {
         title: string
         amount: number
         type: 'income' | 'expense'
         categoryId: string
      },
      thunkAPI
   ) => {
      try {
         const response = await api.post('/transactions', transactionData)
         return response.data
      } catch (error) {
         const err = error as AxiosError<BackendErrorResponse>
         return thunkAPI.rejectWithValue(
            err.response?.data?.error || 'Не удалось добавить транзакцию'
         )
      }
   }
)

export const deleteTransactionThunk = createAsyncThunk(
   'transactions/delete',
   async (id: string, thunkAPI) => {
      try {
         await api.delete(`/transactions/${id}`)
         return id
      } catch (error) {
         const err = error as AxiosError<BackendErrorResponse>
         return thunkAPI.rejectWithValue(
            err.response?.data?.error || 'Не удалось удалить транзакцию'
         )
      }
   }
)

const transactionsSlice = createSlice({
   name: 'transactions',
   initialState,
   reducers: {
      resetPagination: (state) => {
         state.items = []
         state.currentPage = 1
         state.hasMore = false
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchTransactions.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(fetchTransactions.fulfilled, (state, action) => {
            state.isLoading = false

            const { items, total, page, hasMore } = action.payload

            if (page === 1) {
               state.items = items
            } else {
               state.items = [...state.items, ...items]
            }

            state.total = total
            state.currentPage = page
            state.hasMore = hasMore
         })
         .addCase(fetchTransactions.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload as string
         })

         .addCase(createTransactionThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
            state.items.unshift(action.payload)
            state.total += 1
         })

         .addCase(deleteTransactionThunk.fulfilled, (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((t) => t.id !== action.payload)
            state.total -= 1
         })
   },
})

export const { resetPagination } = transactionsSlice.actions
export const transactionsReducer = transactionsSlice.reducer

export const selectExpensesByCategory = (state: { transactions: TransactionsState }) => {
   const transactions = state.transactions.items
   const expenses = transactions.filter((t) => t.type === 'expense')
   const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)

   const categoriesMap: Record<string, number> = {}
   expenses.forEach((t) => {
      if (t.category && !categoriesMap[t.category.name]) {
         categoriesMap[t.category.name] = 0
      }
      if (t.category) {
         categoriesMap[t.category.name] += t.amount
      }
   })

   return Object.entries(categoriesMap)
      .map(([category, amount]) => ({
         category,
         amount,
         percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
}
