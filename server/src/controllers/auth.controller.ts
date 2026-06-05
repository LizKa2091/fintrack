import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'

export const register = async (req: Request, res: Response): Promise<void> => {
   try {
      const { email, password, name } = req.body

      if (!email || !password) {
         res.status(400).json({ message: 'Email and password are required' })
         return
      }

      const candidate = await prisma.user.findUnique({ where: { email } })
      if (candidate) {
         res.status(400).json({ message: 'User with this email already exists' })
         return
      }

      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)

      const newUser = await prisma.user.create({
         data: {
            email,
            passwordHash,
            name,
         },
      })

      res.status(201).json({ message: 'User registered successfully', userId: newUser.id })
   } 
   catch (error) {
      console.error('[Registration Error]:', error)
      res.status(500).json({ message: 'Server error during registration' })
   }
}

export const login = async (req: Request, res: Response): Promise<void> => {
   try {
      const { email, password } = req.body

      if (!email || !password) {
         res.status(400).json({ message: 'Email and password are required' })
         return
      }

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
         res.status(400).json({ message: 'Invalid email or password' })
         return
      }

      const isPasswordMatch = await bcrypt.compare(password, user.passwordHash)
      if (!isPasswordMatch) {
         res.status(400).json({ message: 'Invalid email or password' })
         return
      }

      const token = jwt.sign(
         { userId: user.id, email: user.email },
         process.env.JWT_SECRET || 'fallback_secret',
         { expiresIn: '24h' }
      )

      res.status(200).json({
         token,
         user: {
         id: user.id,
         email: user.email,
         name: user.name,
         },
      })
   } 
   catch (error) {
      console.error('[Login Error]:', error)
      res.status(500).json({ message: 'Server error during login' })
   }
}