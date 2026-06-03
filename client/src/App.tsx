import styles from './App.module.scss'
import { type FC } from 'react'

const App: FC = () => {
   return (
      <div className={styles.container}>
         <header className={styles.header}>
            <h1>
               FinTrack
            </h1>
            <p>Сервис для учёта личных финансов</p>
         </header>

         <main className={styles.dashboardMock}>
            <h2>Добро пожаловать в панель управления</h2>
         </main>
      </div>
   )
}

export default App
