import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from '@/config/db.js'
import { transactionsRouter } from '@/routes/transactionsRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/transactions', transactionsRouter)

app.get('/api/health', (req, res) => {
   res.json({ status: 'ok', message: 'Server is running smoothly' })
})

connectDB().then(() => {
   app.listen(PORT, () => {
      console.log(`[server]: Server is running at http://localhost:${PORT}`)
   })
})