import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import { loginUser, registerUser, clearError } from '../../store/slices/authSlice.js'

export const Auth = () => {
   const dispatch = useDispatch<AppDispatch>()
   const navigate = useNavigate()

   const { isLoading, error, token } = useSelector((state: RootState) => state.auth)

   const [isLoginMode, setIsLoginMode] = useState(true)
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [name, setName] = useState('')

   const [successMessage, setSuccessMessage] = useState(false)

   useEffect(() => {
      if (token) {
         navigate('/')
      }
   }, [token, navigate])

   const switchModeHandler = () => {
      setIsLoginMode((prev) => !prev)
      setSuccessMessage(false)
      dispatch(clearError())
   }

   const submitHandler = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!email || !password) return

      if (isLoginMode) {
         dispatch(loginUser({ email, password }))
      } else {
         const resultAction = await dispatch(registerUser({ email, password, name }))

         if (registerUser.fulfilled.match(resultAction)) {
            setSuccessMessage(true)
            setIsLoginMode(true)
            setPassword('')
         }
      }
   }

   return (
      <div
         style={{
            maxWidth: '400px',
            margin: '40px auto',
            padding: '24px',
            border: '1px solid #ccc',
            borderRadius: '8px',
         }}
      >
         <h1>{isLoginMode ? 'Вход в систему' : 'Регистрация'}</h1>

         {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

         {successMessage && (
            <p
               style={{
                  color: 'green',
                  backgroundColor: '#e6f4ea',
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '16px',
               }}
            >
               Вы успешно зарегистрировались! Используйте свои данные для входа.
            </p>
         )}

         <form
            onSubmit={submitHandler}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
         >
            {!isLoginMode && (
               <input
                  type='text'
                  placeholder='Имя (необязательно)'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: '8px', fontSize: '16px' }}
               />
            )}

            <input
               type='email'
               placeholder='Email'
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               style={{ padding: '8px', fontSize: '16px' }}
            />

            <input
               type='password'
               placeholder='Пароль'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               style={{ padding: '8px', fontSize: '16px' }}
            />

            <button
               type='submit'
               disabled={isLoading}
               style={{
                  padding: '10px',
                  backgroundColor: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
               }}
            >
               {isLoading ? 'Загрузка...' : isLoginMode ? 'Войти' : 'Создать аккаунт'}
            </button>
         </form>

         <p style={{ marginTop: '16px', textAlign: 'center' }}>
            {isLoginMode ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'}
            <span
               onClick={switchModeHandler}
               style={{
                  color: '#0070f3',
                  cursor: 'pointer',
                  marginLeft: '5px',
                  textDecoration: 'underline',
               }}
            >
               {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
            </span>
         </p>
      </div>
   )
}
