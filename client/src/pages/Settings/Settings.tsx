import React, { useState } from 'react'
import api from '@/api/axiosInstance.js'
import styles from './Settings.module.scss'
import axios from 'axios'

export const Settings = () => {
   const [username, setUsername] = useState('')
   const [currentPassword, setCurrentPassword] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')

   const [isLoading, setIsLoading] = useState(false)
   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

   const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault()
      setMessage(null)

      if (newPassword && newPassword !== confirmPassword) {
         setMessage({ type: 'error', text: 'Новые пароли не совпадают' })
         return
      }

      setIsLoading(true)

      try {
         const response = await api.put('/auth/settings/profile', {
            username: username.trim() || undefined,
            currentPassword: currentPassword || undefined,
            newPassword: newPassword || undefined,
         })

         setMessage({ type: 'success', text: response.data.message || 'Данные успешно обновлены!' })

         setCurrentPassword('')
         setNewPassword('')
         setConfirmPassword('')
      } catch (error: unknown) {
         let errorText = 'Не удалось обновить профиль'

         if (axios.isAxiosError(error)) {
            errorText = error.response?.data?.error || error.message || errorText
         } else if (error instanceof Error) {
            errorText = error.message
         }

         setMessage({ type: 'error', text: errorText })
      } finally {
         setIsLoading(false)
      }
   }

   return (
      <div className={styles.container}>
         <h1>Настройки профиля</h1>

         <div className={styles.card}>
            {message && (
               <div className={`${styles.alert} ${styles[message.type]}`}>{message.text}</div>
            )}

            <form onSubmit={handleUpdateProfile} className={styles.form}>
               <section className={styles.section}>
                  <h3>Личные данные</h3>
                  <div className={styles.inputGroup}>
                     <label>Новое имя пользователя</label>
                     <input
                        type='text'
                        placeholder='Введите новое имя'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                     />
                  </div>
               </section>

               <hr className={styles.divider} />

               <section className={styles.section}>
                  <h3>Безопасность (Смена пароля)</h3>
                  <p className={styles.hint}>
                     Заполните эти поля, только если хотите изменить текущий пароль.
                  </p>
                  <div className={styles.inputGroup}>
                     <label>Текущий пароль</label>
                     <input
                        type='password'
                        placeholder='••••••••'
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required={!!newPassword}
                     />
                  </div>

                  <div className={styles.inputGroup}>
                     <label>Новый пароль</label>
                     <input
                        type='password'
                        placeholder='Минимум 6 символов'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                     />
                  </div>

                  <div className={styles.inputGroup}>
                     <label>Подтвердите новый пароль</label>
                     <input
                        type='password'
                        placeholder='••••••••'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={!!newPassword}
                     />
                  </div>
               </section>

               <button type='submit' className={styles.saveBtn} disabled={isLoading}>
                  {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
               </button>
            </form>
         </div>
      </div>
   )
}
