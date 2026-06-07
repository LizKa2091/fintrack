import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import api from '../../api/axiosInstance.js'

export interface Transaction {
   id: string
   title: string
   amount: number
   type: 'income' | 'expense'
   category: string
   date: string
}

interface TransactionsState {
   items: Transaction[]
   isLoading: boolean
   error: string | null
}

interface BackendErrorResponse {
   error?: string
}

const initialState: TransactionsState = {
   items: [],
   isLoading: false,
   error: null,
}

export const fetchTransactions = createAsyncThunk('transactions/fetchAll', async (_, thunkAPI) => {
   try {
      const response = await api.get('/transactions')
      return response.data
   } catch (error) {
      const err = error as AxiosError<BackendErrorResponse>
      return thunkAPI.rejectWithValue(
         err.response?.data?.error || 'Не удалось загрузить транзакции'
      )
   }
})

export const createTransactionThunk = createAsyncThunk(
   'transactions/create',
   async (transactionData: Omit<Transaction, 'id' | 'date'>, thunkAPI) => {
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
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchTransactions.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
            state.isLoading = false
            state.items = action.payload
         })
         .addCase(fetchTransactions.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.payload as string
         })

         .addCase(createTransactionThunk.fulfilled, (state, action: PayloadAction<Transaction>) => {
            state.items.unshift(action.payload)
         })
         .addCase(deleteTransactionThunk.fulfilled, (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload)
         })
   },
})

export const selectExpensesByCategory = (state: { transactions: TransactionsState }) => {
   const transactions = state.transactions.items
   const expenses = transactions.filter((t) => t.type === 'expense')
   const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)

   const categoriesMap: Record<string, number> = {}
   expenses.forEach((t) => {
      if (!categoriesMap[t.category]) {
         categoriesMap[t.category] = 0
      }
      categoriesMap[t.category] += t.amount
   })

   return Object.entries(categoriesMap)
      .map(([category, amount]) => ({
         category,
         amount,
         percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
}

export const transactionsReducer = transactionsSlice.reducer
