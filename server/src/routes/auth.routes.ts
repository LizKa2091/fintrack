import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { settingsController } from '../controllers/settingsController.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/settings/profile', protect, settingsController.updateProfile)

export default router