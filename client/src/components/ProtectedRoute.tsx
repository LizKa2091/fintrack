import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import { useAppDispatch } from '@/store/hooks'
import { fetchTransactions } from '@/store/slices/transactionsSlice'

interface ProtectedRouteProps {
   children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
   const { token } = useSelector((state: RootState) => state.auth)

   const dispatch = useAppDispatch()

   useEffect(() => {
      dispatch(fetchTransactions())
   }, [dispatch])

   if (!token) {
      return <Navigate to='/auth' replace />
   }

   return <>{children}</>
}
