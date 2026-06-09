import { Router } from 'express'
import { categoriesController } from '../controllers/categoriesController.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.use(protect)

router.get('/', categoriesController.getCategories)
router.post('/', categoriesController.createCategory)

export default router