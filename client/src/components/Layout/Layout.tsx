import { Link, Outlet } from 'react-router-dom'
import styles from './Layout.module.scss'

export const Layout = () => {
   return (
      <div className={styles.layout}>
         <aside className={styles.sidebar}>
            <h3>FinTrack</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <Link to='/'>Главная</Link>
               <Link to='/transactions'>Транзакции</Link>
               <Link to='/auth'>Выйти</Link>
            </nav>
         </aside>
         <main className={styles.content}>
            <Outlet />
         </main>
      </div>
   )
}
