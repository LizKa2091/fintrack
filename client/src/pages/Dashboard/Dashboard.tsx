import { useAppSelector } from '@/store/hooks'
import styles from './Dashboard.module.scss'

export const Dashboard = () => {
   const { items: transactions } = useAppSelector((state) => state.transactions)

   const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

   const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

   return (
      <div className={styles.wrapper}>
         <h1>Панель управления</h1>
         <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', flex: 1 }}>
               <h3>Доходы</h3>
               <p style={{ color: 'var(--success-color)', fontSize: '24px', fontWeight: 'bold' }}>
                  +{totalIncome} ₽
               </p>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', flex: 1 }}>
               <h3>Расходы</h3>
               <p style={{ color: 'var(--error-color)', fontSize: '24px', fontWeight: 'bold' }}>
                  -{totalExpense} ₽
               </p>
            </div>
         </div>
         <h2>Последние операции:</h2>
         <ul>
            {transactions.map((t) => (
               <li key={t.id} style={{ margin: '8px 0' }}>
                  {t.title} — <strong>{t.amount} ₽</strong> ({t.category})
               </li>
            ))}
         </ul>
      </div>
   )
}
