import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

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

const initialState: TransactionsState = {
   items: [
      {
         id: '1',
         title: 'Зарплата',
         amount: 150000,
         type: 'income',
         category: 'Работа',
         date: '2026-06-01',
      },
      {
         id: '2',
         title: 'Продукты',
         amount: 4500,
         type: 'expense',
         category: 'Еда',
         date: '2026-06-02',
      },
   ],
   isLoading: false,
   error: null,
}

const transactionsSlice = createSlice({
   name: 'transactions',
   initialState,
   reducers: {
      addTransaction: (state, action: PayloadAction<Transaction>) => {
         state.items.unshift(action.payload)
      },
      deleteTransaction: (state, action: PayloadAction<string>) => {
         state.items = state.items.filter((item) => item.id !== action.payload)
      },
   },
})

export const { addTransaction, deleteTransaction } = transactionsSlice.actions
export const transactionsReducer = transactionsSlice.reducer
