import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTransactions, selectExpensesByCategory } from '@/store/slices/transactionsSlice'
import { ExpensesChart } from './components/ExpensesChart'
import styles from './Dashboard.module.scss'

export const Dashboard = () => {
   const dispatch = useAppDispatch()

   const { items: transactions, isLoading } = useAppSelector((state) => state.transactions)
   const categoriesData = useAppSelector(selectExpensesByCategory)

   useEffect(() => {
      dispatch(fetchTransactions({ page: 1, limit: 20 }))
   }, [dispatch])

   const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

   const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

   const recentTransactions = transactions.slice(0, 5)

   if (isLoading) {
      return (
         <div
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

         <div
            style={{ background: '#fff', padding: '24px', borderRadius: '8px', margin: '24px 0' }}
         >
            <h2>Статистика расходов по категориям</h2>
            {categoriesData.length === 0 ? (
               <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                  Нет данных для анализа расходов.
               </p>
            ) : (
               <div
                  style={{
                     display: 'flex',
                     flexDirection: 'row',
                     flexWrap: 'wrap',
                     gap: '40px',
                     marginTop: '20px',
                     alignItems: 'center',
                  }}
               >
                  <div style={{ flex: '1 1 300px' }}>
                     <ExpensesChart data={categoriesData} />
                  </div>

                  <div
                     style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        flex: '1 1 400px',
                     }}
                  >
                     {categoriesData.map((item) => (
                        <div key={item.category}>
                           <div
                              style={{
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 marginBottom: '6px',
                                 fontSize: '14px',
                              }}
                           >
                              <span>
                                 <strong>{item.category}</strong> — {item.percentage}%
                              </span>
                              <span style={{ color: 'var(--text-muted)' }}>
                                 {item.amount.toLocaleString()} ₽
                              </span>
                           </div>
                           <div
                              style={{
                                 width: '100%',
                                 height: '10px',
                                 backgroundColor: '#eef2f5',
                                 borderRadius: '5px',
                                 overflow: 'hidden',
                              }}
                           >
                              <div
                                 style={{
                                    width: `${item.percentage}%`,
                                    height: '100%',
                                    backgroundColor: '#0070f3',
                                    transition: 'width 0.3s ease',
                                 }}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>

         <h2>Последние операции:</h2>
         {recentTransactions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Операций пока нет.</p>
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
                           ({t.category?.name || 'Без категории'})
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
