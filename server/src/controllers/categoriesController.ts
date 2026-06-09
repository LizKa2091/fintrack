import { Request, Response } from 'express'
import { categoriesService } from '../services/categoriesService.js'

export const categoriesController = {
   getCategories: async (req: Request, res: Response) => {
      try {
         const userId = (req as any).user?.userId
         const categories = await categoriesService.getAll(userId)
         res.json(categories)
      } catch (error) {
         res.status(500).json({ error: 'Ошибка при получении категорий' })
      }
   },

   createCategory: async (req: Request, res: Response) => {
      try {
         const userId = (req as any).user?.userId
         const { name, type } = req.body

         if (!name || !type) {
            return res.status(400).json({ error: 'Имя и тип категории обязательны' })
         }

         const newCategory = await categoriesService.create({
            name: name.trim(),
            type,
            userId
         })
         res.status(201).json(newCategory)
      } catch (error) {
         res.status(500).json({ error: 'Ошибка при создании категории (возможно, она уже существует)' })
      }
   }
}