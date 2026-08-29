import express from 'express'
import prisma from '../lib/prisma.js'
import requireAdmin from '../middleware/requireAdmin.js'

const router = express.Router()

const PATCHABLE_FIELDS = [
  'name', 'type', 'capacity', 'ac', 'price', 'image',
  'description', 'timings', 'facilities', 'setupStyles',
]

router.get('/', async (req, res, next) => {
  try {
    const venues = await prisma.venue.findMany({ orderBy: { id: 'asc' } })
    res.json(venues)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const body = req.body || {}

    const data = {}
    for (const field of PATCHABLE_FIELDS) {
      if (body[field] === undefined) continue
      if (field === 'capacity' || field === 'price') data[field] = Number(body[field])
      else data[field] = body[field]
    }

    const venue = await prisma.venue.update({ where: { id }, data })
    res.json(venue)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Venue not found' })
    }
    next(err)
  }
})

export default router
