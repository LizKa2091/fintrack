import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTransactions } from '@/store/slices/transactionsSlice'
import styles from './Dashboard.module.scss'

export const Dashboard = () => {
   const dispatch = useAppDispatch()

   // 1. Забираем не только элементы, но и флаг загрузки
   const { items: transactions, isLoading } = useAppSelector((state) => state.transactions)

   useEffect(() => {
      dispatch(fetchTransactions())
   }, [dispatch])

   // Считаем доходы и расходы
   const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

   const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

   // 2. Берем только 5 самых свежих транзакций для вывода на главную
   const recentTransactions = transactions.slice(0, 5)

   // 3. Если данные еще грузятся — показываем красивый экран загрузки
   if (isLoading) {
      return (
         <div
            className={styles.loadingWrapper}
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               height: '50vh',
            }}
         >
            <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>
               Загрузка финансовых данных...
            </p>
         </div>
      )
   }

   return (
      <div className={styles.wrapper}>
         <h1>Панель управления</h1>

         <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', flex: 1 }}>
               <h3>Доходы</h3>
               <p style={{ color: 'var(--success-color)', fontSize: '24px', fontWeight: 'bold' }}>
                  +{totalIncome.toLocaleString()} ₽
               </p>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', flex: 1 }}>
               <h3>Расходы</h3>
               <p style={{ color: 'var(--error-color)', fontSize: '24px', fontWeight: 'bold' }}>
                  -{totalExpense.toLocaleString()} ₽
               </p>
            </div>
         </div>

         <h2>Последние операции:</h2>
         {recentTransactions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>
               Операций пока нет. Перейдите во вкладку транзакций, чтобы добавить первую!
            </p>
         ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
               {recentTransactions.map((t) => (
                  <li
                     key={t.id}
                     style={{
                        background: '#fff',
                        padding: '12px 16px',
                        borderRadius: '6px',
                        margin: '8px 0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                     }}
                  >
                     <div>
                        <span style={{ fontWeight: 500 }}>{t.title}</span>
                        <span
                           style={{
                              color: 'var(--text-muted)',
                              fontSize: '14px',
                              marginLeft: '10px',
                           }}
                        >
                           ({t.category})
                        </span>
                     </div>
                     <strong
                        style={{
                           color:
                              t.type === 'income' ? 'var(--success-color)' : 'var(--error-color)',
                        }}
                     >
                        {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()} ₽
                     </strong>
                  </li>
               ))}
            </ul>
         )}
      </div>
   )
}
