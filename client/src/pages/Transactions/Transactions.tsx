import { useState, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
   createTransactionThunk,
   deleteTransactionThunk,
   fetchTransactions,
} from '@/store/slices/transactionsSlice'
import { fetchCategories, createCategoryThunk } from '@/store/slices/categoriesSlice'
import { getCurrencySign } from '@/utils/currencySign.js'
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

   const userCurrency = useAppSelector((state) => state.auth.user?.currency || 'RUB')

   const [title, setTitle] = useState('')
   const [amount, setAmount] = useState('')
   const [type, setType] = useState<'income' | 'expense'>('expense')
   const [categoryId, setCategoryId] = useState('')

   const [newCategoryName, setNewCategoryName] = useState('')
   const [categoryType, setCategoryType] = useState<'income' | 'expense'>('expense')

   const [searchQuery, setSearchQuery] = useState('')
   const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all')

   useEffect(() => {
      dispatch(fetchTransactions({ page: 1, limit: 10 }))
      dispatch(fetchCategories())
   }, [dispatch])

   const filteredCategories = useMemo(() => {
      console.log(type)
      return categories.filter((c) => c.type === type)
   }, [categories, type])

   const activeCategoryId = categoryId || (filteredCategories[0]?.id ?? '')

   const handleTypeChange = (newType: 'income' | 'expense') => {
      setType(newType)
      setCategoryId('')
   }

   const handleLoadMore = () => {
      if (isLoading || !hasMore) return
      dispatch(fetchTransactions({ page: currentPage + 1, limit: 10 }))
   }

   const displayedTransactions = useMemo(() => {
      return transactions.filter((t) => {
         const matchesTab = activeTab === 'all' || t.type === activeTab

         const matchesSearch =
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase())

         return matchesTab && matchesSearch
      })
   }, [transactions, activeTab, searchQuery])

   const handleTransactionSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || !amount || Number(amount) <= 0 || !activeCategoryId) {
         alert('Пожалуйста, заполните все поля и выберите категорию')
         return
      }

      dispatch(
         createTransactionThunk({
            title: title.trim(),
            amount: Number(amount),
            type,
            categoryId: activeCategoryId,
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
                     <label>Сумма ({getCurrencySign(userCurrency)})</label>
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
                     <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                        <button
                           type='button'
                           onClick={() => handleTypeChange('expense')}
                           style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '6px',
                              border: '1px solid #ccc',
                              backgroundColor: type === 'expense' ? '#ff4d4f' : '#fff',
                              color: type === 'expense' ? '#fff' : '#333',
                              fontWeight: type === 'expense' ? 'bold' : 'normal',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                           }}
                        >
                           Расход
                        </button>
                        <button
                           type='button'
                           onClick={() => handleTypeChange('income')}
                           style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '6px',
                              border: '1px solid #ccc',
                              backgroundColor: type === 'income' ? '#4caf50' : '#fff',
                              color: type === 'income' ? '#fff' : '#333',
                              fontWeight: type === 'income' ? 'bold' : 'normal',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                           }}
                        >
                           Доход
                        </button>
                     </div>
                  </div>

                  <div className={styles.inputGroup}>
                     <label>Категория</label>
                     <select
                        value={activeCategoryId}
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

                  <button type='submit' className={styles.submitBtn} disabled={!categoryId}>
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
            <div className={styles.filterBar}>
               <input
                  type='text'
                  className={styles.searchInput}
                  placeholder='Поиск по названию или категории...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />

               <div className={styles.tabs}>
                  <button
                     className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTab : ''}`}
                     onClick={() => setActiveTab('all')}
                  >
                     Все
                  </button>
                  <button
                     className={`${styles.tabBtn} ${activeTab === 'income' ? styles.activeTab : ''}`}
                     onClick={() => setActiveTab('income')}
                  >
                     Доходы
                  </button>
                  <button
                     className={`${styles.tabBtn} ${activeTab === 'expense' ? styles.activeTab : ''}`}
                     onClick={() => setActiveTab('expense')}
                  >
                     Расходы
                  </button>
               </div>
            </div>

            {displayedTransactions.length === 0 ? (
               <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>
                  Ничего не найдено по заданным фильтрам.
               </p>
            ) : (
               <>
                  <div className={styles.listWrapper}>
                     {displayedTransactions.map((t) => (
                        <div key={t.id} className={`${styles.card} ${styles[t.type]}`}>
                           <div className={styles.cardInfo}>
                              <h4>{t.title}</h4>
                              <span>
                                 {t.category?.name || 'Без категории'} • {t.date?.split('T')[0]}
                              </span>
                           </div>
                           <div className={styles.cardRight}>
                              <span className={`${styles.amount} ${styles[t.type]}`}>
                                 {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()}{' '}
                                 {getCurrencySign(userCurrency)}
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
