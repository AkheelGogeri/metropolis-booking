import express from 'express'
import prisma from '../lib/prisma.js'
import requireAdmin from '../middleware/requireAdmin.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const settings = await prisma.paymentSettings.findUnique({ where: { id: 1 } })
    if (!settings) {
      return res.status(404).json({ error: 'Payment settings not configured' })
    }
    res.json(settings)
  } catch (err) {
    next(err)
  }
})

router.patch('/', requireAdmin, async (req, res, next) => {
  try {
    const body = req.body || {}

    if (body.upiId !== undefined && !String(body.upiId).trim()) {
      return res.status(400).json({ error: 'UPI ID cannot be empty' })
    }
    if (body.advanceAmount !== undefined && !(Number(body.advanceAmount) > 0)) {
      return res.status(400).json({ error: 'Advance amount must be greater than 0' })
    }

    const data = {}
    if (body.upiId !== undefined) data.upiId = body.upiId
    if (body.payeeName !== undefined) data.payeeName = body.payeeName
    if (body.advanceAmount !== undefined) data.advanceAmount = Number(body.advanceAmount)

    const settings = await prisma.paymentSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, upiId: '', payeeName: '', advanceAmount: 0, ...data },
    })
    res.json(settings)
  } catch (err) {
    next(err)
  }
})

export default router
