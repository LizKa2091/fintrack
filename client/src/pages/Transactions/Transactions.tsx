import { useState, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
   createTransactionThunk,
   deleteTransactionThunk,
   fetchTransactions,
} from '@/store/slices/transactionsSlice'
import { fetchCategories, createCategoryThunk } from '@/store/slices/categoriesSlice'
import styles from './Transactions.module.scss'

export const Transactions = () => {
   const dispatch = useAppDispatch()

   const {
      items: transactions,
      isLoading,
      currentPage,
      hasMore,
      total,
   } = useAppSelector((state) => state.transactions)
   const { items: categories } = useAppSelector((state) => state.categories)

   const [title, setTitle] = useState('')
   const [amount, setAmount] = useState('')
   const [type, setType] = useState<'income' | 'expense'>('expense')
   const [categoryId, setCategoryId] = useState('')

   const [newCategoryName, setNewCategoryName] = useState('')
   const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense')

   useEffect(() => {
      dispatch(fetchTransactions({ page: 1, limit: 10 }))
      dispatch(fetchCategories())
   }, [dispatch])

   const filteredCategories = useMemo(() => {
      return categories.filter((c) => c.type === type)
   }, [categories, type])

   const currentCategoryId = categoryId || (filteredCategories[0]?.id ?? '')

   const handleTypeChange = (newType: 'income' | 'expense') => {
      setType(newType)
      const nextCategories = categories.filter((c) => c.type === newType)
      setCategoryId(nextCategories[0]?.id ?? '')
   }

   const handleLoadMore = () => {
      if (isLoading || !hasMore) return
      dispatch(fetchTransactions({ page: currentPage + 1, limit: 10 }))
   }

   const handleTransactionSubmit = (e: React.FormEvent) => {
      e.preventDefault()

      if (!title.trim() || !amount || Number(amount) <= 0 || !currentCategoryId) {
         alert('Пожалуйста, заполните все поля и выберите категорию')
         return
      }

      dispatch(
         createTransactionThunk({
            title: title.trim(),
            amount: Number(amount),
            type,
            categoryId: currentCategoryId,
         })
      )

      setTitle('')
      setAmount('')
   }

   const handleCategorySubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newCategoryName.trim()) return

      const resultAction = await dispatch(
         createCategoryThunk({
            name: newCategoryName.trim(),
            type: categoryType,
         })
      )

      if (createCategoryThunk.fulfilled.match(resultAction)) {
         const createdCategory = resultAction.payload
         if (createdCategory.type === type) {
            setCategoryId(createdCategory.id)
         }
      }

      setNewCategoryName('')
   }

   return (
      <div className={styles.container}>
         <div className={styles.leftColumn}>
            <section className={styles.panel}>
               <h2>Новая операция</h2>
               <form className={styles.form} onSubmit={handleTransactionSubmit}>
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
                        onChange={(e) => handleTypeChange(e.target.value as 'income' | 'expense')}
                     >
                        <option value='expense'>Расход</option>
                        <option value='income'>Доход</option>
                     </select>
                  </div>

                  <div className={styles.inputGroup}>
                     <label>Категория</label>
                     <select
                        value={currentCategoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                     >
                        {filteredCategories.length === 0 ? (
                           <option value='' disabled>
                              Сначала создайте категорию
                           </option>
                        ) : (
                           filteredCategories.map((c) => (
                              <option key={c.id} value={c.id}>
                                 {c.name}
                              </option>
                           ))
                        )}
                     </select>
                  </div>

                  <button type='submit' className={styles.submitBtn} disabled={!currentCategoryId}>
                     Добавить операцию
                  </button>
               </form>
            </section>

            <section className={styles.panel} style={{ marginTop: '20px' }}>
               <h2>Управление категориями</h2>
               <form className={styles.form} onSubmit={handleCategorySubmit}>
                  <div className={styles.inputGroup}>
                     <label>Название категории</label>
                     <input
                        type='text'
                        placeholder='Например, Подписки, Такси'
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                     />
                  </div>
                  <div className={styles.inputGroup}>
                     <label>Тип категории</label>
                     <select
                        value={categoryType}
                        onChange={(e) => setCategoryType(e.target.value as 'income' | 'expense')}
                     >
                        <option value='expense'>Для расходов</option>
                        <option value='income'>Для доходов</option>
                     </select>
                  </div>
                  <button
                     type='submit'
                     className={styles.submitBtn}
                     style={{ background: '#4caf50' }}
                  >
                     Создать категорию
                  </button>
               </form>
            </section>
         </div>

         <section className={styles.history}>
            <h2>
               История операций ({transactions.length} из {total})
            </h2>
            {transactions.length === 0 ? (
               <p style={{ color: 'var(--text-muted)' }}>Операций пока нет. Добавьте первую!</p>
            ) : (
               <>
                  <div className={styles.listWrapper}>
                     {transactions.map((t) => (
                        <div key={t.id} className={`${styles.card} ${styles[t.type]}`}>
                           <div className={styles.cardInfo}>
                              <h4>{t.title}</h4>
                              <span>
                                 {t.category?.name || 'Без категории'} • {t.date?.split('T')[0]}
                              </span>
                           </div>
                           <div className={styles.cardRight}>
                              <span className={`${styles.amount} ${styles[t.type]}`}>
                                 {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()} ₽
                              </span>
                              <button
                                 className={styles.deleteBtn}
                                 onClick={() => dispatch(deleteTransactionThunk(t.id))}
                                 title='Удалить транзакцию'
                              >
                                 x
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>

                  {hasMore && (
                     <button
                        className={styles.loadMoreBtn}
                        onClick={handleLoadMore}
                        disabled={isLoading}
                     >
                        {isLoading ? 'Загрузка...' : 'Показать еще'}
                     </button>
                  )}
               </>
            )}
         </section>
      </div>
   )
}
