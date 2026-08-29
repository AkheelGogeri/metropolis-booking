import express from 'express'
import prisma from '../lib/prisma.js'
import requireAdmin from '../middleware/requireAdmin.js'

const router = express.Router()

const FIELDS = [
  'vegPrice', 'nonVegChickenPrice', 'nonVegMuttonPrice',
  'mixChickenPrice', 'mixMuttonPrice', 'hallGstPercent', 'foodGstPercent',
]

router.get('/', async (req, res, next) => {
  try {
    const pricing = await prisma.pricing.findUnique({ where: { id: 1 } })
    if (!pricing) {
      return res.status(404).json({ error: 'Pricing not configured' })
    }
    res.json(pricing)
  } catch (err) {
    next(err)
  }
})

router.patch('/', requireAdmin, async (req, res, next) => {
  try {
    const body = req.body || {}
    const data = {}
    for (const field of FIELDS) {
      if (body[field] === undefined) continue
      data[field] = Number(body[field])
    }

    const pricing = await prisma.pricing.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, vegPrice: 0, nonVegChickenPrice: 0, nonVegMuttonPrice: 0, mixChickenPrice: 0, mixMuttonPrice: 0, hallGstPercent: 0, foodGstPercent: 0, ...data },
    })
    res.json(pricing)
  } catch (err) {
    next(err)
  }
})

export default router
