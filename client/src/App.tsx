import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { Transactions } from '@/pages/Transactions/Transactions'
import { Auth } from '@/pages/Auth/Auth'

const router = createBrowserRouter([
   {
      path: '/',
      element: <Layout />,
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
   return <RouterProvider router={router} />
}
