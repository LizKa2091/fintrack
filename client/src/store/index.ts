import { configureStore } from '@reduxjs/toolkit'
import { transactionsReducer } from './slices/transactionsSlice'
import authReducer from './slices/authSlice.ts'

export const store = configureStore({
   reducer: {
      transactions: transactionsReducer,
      auth: authReducer,
   },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
