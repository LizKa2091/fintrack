import { Link, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import styles from './Layout.module.scss'

export const Layout = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const handleLogout = () => {
      dispatch(logout())
      navigate('/auth')
   }

   return (
      <div className={styles.layout}>
         <aside className={styles.sidebar}>
            <h3>FinTrack</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <Link to='/'>Главная</Link>
               <Link to='/transactions'>Транзакции</Link>
               <Link to='/settings'>Настройки</Link>
               <span
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  style={{ color: 'red', cursor: 'pointer', marginTop: '16px' }}
               >
                  Выйти
               </span>
            </nav>
         </aside>
         <main className={styles.content}>
            <Outlet />
         </main>
      </div>
   )
}
