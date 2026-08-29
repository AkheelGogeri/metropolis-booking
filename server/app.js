import express from 'express'
import cors from 'cors'

import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import bookingsRoutes from './routes/bookings.js'
import venuesRoutes from './routes/venues.js'
import pricingRoutes from './routes/pricing.js'
import offersRoutes from './routes/offers.js'
import settingsPaymentRoutes from './routes/settingsPayment.js'

const app = express()

// Frontend and API share an origin on Vercel, so this is a fallback for local
// dev setups that hit the API from a different port, not a hard requirement.
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
}))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/venues', venuesRoutes)
app.use('/api/pricing', pricingRoutes)
app.use('/api/offers', offersRoutes)
app.use('/api/settings/payment', settingsPaymentRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
