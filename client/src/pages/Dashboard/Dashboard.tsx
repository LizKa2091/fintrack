import styles from './Dashboard.module.scss'

export const Dashboard = () => {
   return (
      <div className={styles.wrapper}>
         <h1>Панель управления</h1>
         <p>Тут будут графики доходов и расходов.</p>
      </div>
   )
}
