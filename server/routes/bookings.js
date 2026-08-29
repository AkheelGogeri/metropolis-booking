import express from 'express'
import prisma from '../lib/prisma.js'
import requireAdmin from '../middleware/requireAdmin.js'

const router = express.Router()

const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Cancelled']
const PAYMENT_STATUSES = ['Unpaid', 'AdvancePaid', 'Paid', 'Refunded']

// Fields an admin may update on an existing booking.
const PATCHABLE_FIELDS = [
  'firstName', 'lastName', 'phone', 'email',
  'eventCategory', 'companyName', 'designation', 'gstNumber', 'projector',
  'bookingType', 'venueId', 'date', 'startTime', 'endTime', 'guests',
  'foodPreference', 'biryaniChoice', 'plates', 'teaCoffee', 'decoration', 'setupStyle',
  'message', 'status', 'paymentStatus', 'totalAmount',
]

router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {}
    const { firstName, lastName, phone, venueId, date, guests } = body

    if (!firstName || !phone || !venueId || !date || !guests) {
      return res.status(400).json({ error: 'firstName, phone, venueId, date and guests are required' })
    }

    const venue = await prisma.venue.findUnique({ where: { id: Number(venueId) } })
    if (!venue) {
      return res.status(400).json({ error: 'Unknown venueId' })
    }

    const booking = await prisma.booking.create({
      data: {
        firstName,
        lastName: lastName || '',
        phone,
        email: body.email || null,
        eventCategory: body.eventCategory || null,
        companyName: body.companyName || null,
        designation: body.designation || null,
        gstNumber: body.gstNumber || null,
        projector: body.projector || null,
        bookingType: body.bookingType || null,
        venueId: venue.id,
        date: new Date(date),
        startTime: body.startTime || null,
        endTime: body.endTime || null,
        guests: Number(guests),
        foodPreference: body.foodPreference || null,
        biryaniChoice: body.biryaniChoice || null,
        plates: body.plates ? Number(body.plates) : null,
        teaCoffee: body.teaCoffee || null,
        decoration: body.decoration || null,
        setupStyle: body.setupStyle || null,
        message: body.message || null,
        status: body.status && BOOKING_STATUSES.includes(body.status) ? body.status : 'Pending',
        paymentStatus: body.paymentStatus && PAYMENT_STATUSES.includes(body.paymentStatus) ? body.paymentStatus : 'Unpaid',
        totalAmount: body.totalAmount ? Number(body.totalAmount) : 0,
        manualEntry: Boolean(body.manualEntry),
      },
      include: { venue: true },
    })

    res.status(201).json(booking)
  } catch (err) {
    next(err)
  }
})

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { status, venueId } = req.query
    const where = {}
    if (status && BOOKING_STATUSES.includes(status)) where.status = status
    if (venueId) where.venueId = Number(venueId)

    const bookings = await prisma.booking.findMany({
      where,
      include: { venue: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(bookings)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const body = req.body || {}

    if (body.status && !BOOKING_STATUSES.includes(body.status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    if (body.paymentStatus && !PAYMENT_STATUSES.includes(body.paymentStatus)) {
      return res.status(400).json({ error: 'Invalid paymentStatus' })
    }

    const data = {}
    for (const field of PATCHABLE_FIELDS) {
      if (body[field] === undefined) continue
      if (field === 'date') data.date = new Date(body.date)
      else if (field === 'venueId' || field === 'guests' || field === 'plates' || field === 'totalAmount') {
        data[field] = body[field] === null ? null : Number(body[field])
      } else {
        data[field] = body[field]
      }
    }

    const booking = await prisma.booking.update({
      where: { id },
      data,
      include: { venue: true },
    })
    res.json(booking)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Booking not found' })
    }
    next(err)
  }
})

export default router
