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
