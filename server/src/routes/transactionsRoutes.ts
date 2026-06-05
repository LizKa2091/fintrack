import { Router } from 'express'
import { transactionsController } from '@/controllers/transactionsController.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', protect, transactionsController.getTransactions)
router.post('/', protect, transactionsController.createTransaction)
router.delete('/:id', transactionsController.deleteTransaction)

export const transactionsRouter = router