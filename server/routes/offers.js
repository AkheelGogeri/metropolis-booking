import express from 'express'
import prisma from '../lib/prisma.js'
import requireAdmin from '../middleware/requireAdmin.js'

const router = express.Router()

const DISCOUNT_TYPES = ['Percent', 'Flat']

router.get('/', async (req, res, next) => {
  try {
    const offers = await prisma.offer.findMany({ orderBy: { validFrom: 'desc' } })
    res.json(offers)
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { title, description, discountType, value, validFrom, validTo } = req.body || {}
    if (!title || !discountType || value === undefined || !validFrom || !validTo) {
      return res.status(400).json({ error: 'title, discountType, value, validFrom and validTo are required' })
    }
    if (!DISCOUNT_TYPES.includes(discountType)) {
      return res.status(400).json({ error: 'Invalid discountType' })
    }

    const offer = await prisma.offer.create({
      data: {
        title,
        description: description || '',
        discountType,
        value: Number(value),
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        active: req.body.active === undefined ? true : Boolean(req.body.active),
      },
    })
    res.status(201).json(offer)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const body = req.body || {}

    if (body.discountType && !DISCOUNT_TYPES.includes(body.discountType)) {
      return res.status(400).json({ error: 'Invalid discountType' })
    }

    const data = {}
    if (body.title !== undefined) data.title = body.title
    if (body.description !== undefined) data.description = body.description
    if (body.discountType !== undefined) data.discountType = body.discountType
    if (body.value !== undefined) data.value = Number(body.value)
    if (body.validFrom !== undefined) data.validFrom = new Date(body.validFrom)
    if (body.validTo !== undefined) data.validTo = new Date(body.validTo)
    if (body.active !== undefined) data.active = Boolean(body.active)

    const offer = await prisma.offer.update({ where: { id }, data })
    res.json(offer)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Offer not found' })
    }
    next(err)
  }
})

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    await prisma.offer.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Offer not found' })
    }
    next(err)
  }
})

export default router
