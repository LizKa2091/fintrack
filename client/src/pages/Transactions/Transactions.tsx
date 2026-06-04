import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
   addTransaction,
   deleteTransaction,
   type Transaction,
} from '@/store/slices/transactionsSlice'
import styles from './Transactions.module.scss'

export const Transactions = () => {
   const dispatch = useAppDispatch()
   const { items: transactions } = useAppSelector((state) => state.transactions)

   const [title, setTitle] = useState('')
   const [amount, setAmount] = useState('')
   const [type, setType] = useState<'income' | 'expense'>('expense')
   const [category, setCategory] = useState('Продукты')

   const handleSubmit = (e) => {
      e.preventDefault()

      if (!title.trim() || !amount || Number(amount) <= 0) return

      const newTransaction: Transaction = {
         id: crypto.randomUUID(),
         title: title.trim(),
         amount: Number(amount),
         type,
         category,
         date: new Date().toISOString().split('T')[0],
      }

      dispatch(addTransaction(newTransaction))

      setTitle('')
      setAmount('')
   }

   return (
      <div className={styles.container}>
         <section className={styles.panel}>
            <h2>Новая операция</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
               <div className={styles.inputGroup}>
                  <label>Название</label>
                  <input
                     type='text'
                     placeholder='Например, Обед в кафе'
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     required
                  />
               </div>

               <div className={styles.inputGroup}>
                  <label>Сумма (₽)</label>
                  <input
                     type='number'
                     placeholder='0'
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     required
                  />
               </div>

               <div className={styles.inputGroup}>
                  <label>Тип операции</label>
                  <select
                     value={type}
                     onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                  >
                     <option value='expense'>Расход</option>
                     <option value='income'>Доход</option>
                  </select>
               </div>

               <div className={styles.inputGroup}>
                  <label>Категория</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                     {type === 'expense' ? (
                        <>
                           <option value='Продукты'>Продукты</option>
                           <option value='Кафе и рестораны'>Кафе и рестораны</option>
                           <option value='Транспорт'>Транспорт</option>
                           <option value='Развлечения'>Развлечения</option>
                        </>
                     ) : (
                        <>
                           <option value='Работа'>Работа</option>
                           <option value='Фриланс'>Фриланс</option>
                           <option value='Подарки'>Подарки</option>
                        </>
                     )}
                  </select>
               </div>

               <button type='submit' className={styles.submitBtn}>
                  Добавить
               </button>
            </form>
         </section>

         <section className={styles.history}>
            <h2>История операций ({transactions.length})</h2>
            {transactions.length === 0 ? (
               <p style={{ color: 'var(--text-muted)' }}>Операций пока нет. Добавьте первую!</p>
            ) : (
               transactions.map((t) => (
                  <div key={t.id} className={`${styles.card} ${styles[t.type]}`}>
                     <div className={styles.cardInfo}>
                        <h4>{t.title}</h4>
                        <span>
                           {t.category} • {t.date}
                        </span>
                     </div>
                     <div className={styles.cardRight}>
                        <span className={`${styles.amount} ${styles[t.type]}`}>
                           {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()} ₽
                        </span>
                        <button
                           className={styles.deleteBtn}
                           onClick={() => dispatch(deleteTransaction(t.id))}
                           title='Удалить транзакцию'
                        >
                           x
                        </button>
                     </div>
                  </div>
               ))
            )}
         </section>
      </div>
   )
}
