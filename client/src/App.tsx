import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { Transactions } from '@/pages/Transactions/Transactions'
import { Auth } from '@/pages/Auth/Auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from './store'
import { useEffect } from 'react'
import { checkAuth } from './store/slices/authSlice'

const router = createBrowserRouter([
   {
      path: '/',
      element: (
         <ProtectedRoute>
            <Layout />
         </ProtectedRoute>
      ),
      children: [
         {
            index: true,
            element: <Dashboard />,
         },
         {
            path: 'transactions',
            element: <Transactions />,
         },
      ],
   },
   {
      path: '/auth',
      element: <Auth />,
   },
])

export const App = () => {
   const dispatch = useDispatch<AppDispatch>()

   useEffect(() => {
      dispatch(checkAuth())
   }, [dispatch])

   return <RouterProvider router={router} />
}
