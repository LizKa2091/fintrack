import { Router } from 'express'
import { transactionsController } from '@/controllers/transactionsController.js'

const router = Router()

router.get('/', transactionsController.getTransactions)
router.post('/', transactionsController.createTransaction)
router.delete('/:id', transactionsController.deleteTransaction)

export const transactionsRouter = router