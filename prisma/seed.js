import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Mirrors the original frontend/src/data/venues.js content at the time the backend was built.
const venues = [
  {
    name: 'Board Room',
    type: 'MeetingRoom',
    capacity: 18,
    ac: true,
    price: 5000,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    facilities: ['AC', 'Projector', 'Whiteboard', 'WiFi', 'TV Screen'],
    description: 'Professional meeting space ideal for corporate meetings, interviews and small conferences.',
    timings: '8:00 AM - 8:00 PM',
    setupStyles: ['U Shape', 'Theater', 'Classroom', 'Cluster', 'Round Table', 'Other'],
  },
  {
    name: 'Central Court',
    type: 'MeetingRoom',
    capacity: 35,
    ac: true,
    price: 8000,
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800',
    facilities: ['AC', 'Projector', 'Whiteboard', 'WiFi', 'Sound System'],
    description: 'Spacious meeting room for mid-size corporate gatherings, training sessions and presentations.',
    timings: '8:00 AM - 8:00 PM',
    setupStyles: ['U Shape', 'Theater', 'Classroom', 'Cluster', 'Round Table', 'Other'],
  },
  {
    name: 'East Court',
    type: 'BanquetHall',
    capacity: 50,
    ac: false,
    price: 20000,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    facilities: ['Parking', 'Catering', 'Sound System', 'Decorations'],
    description: 'Classic banquet hall for intimate gatherings, ceremonies and celebrations.',
    timings: '6:00 AM - 11:00 PM',
    setupStyles: ['U Shape', 'Theater', 'Cluster', 'Round Table', 'Classroom', 'Other'],
  },
  {
    name: 'West Court',
    type: 'BanquetHall',
    capacity: 50,
    ac: true,
    price: 25000,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    facilities: ['AC', 'Parking', 'Catering', 'Sound System', 'Decorations'],
    description: 'Air-conditioned banquet hall perfect for corporate events, small receptions and celebrations.',
    timings: '6:00 AM - 11:00 PM',
    setupStyles: ['U Shape', 'Theater', 'Cluster', 'Round Table', 'Classroom', 'Other'],
  },
  {
    name: 'New West Court',
    type: 'BanquetHall',
    capacity: 200,
    ac: true,
    price: 50000,
    image: null,
    facilities: ['AC', 'Parking', 'Catering', 'Sound System', 'Projector', 'Decorations'],
    description: 'Grand air-conditioned hall for large weddings, receptions and corporate events up to 200 guests.',
    timings: '6:00 AM - 11:00 PM',
    setupStyles: ['U Shape', 'Theater', 'Cluster', 'Round Table', 'Classroom', 'Other'],
  },
  {
    name: 'New East Court',
    type: 'BanquetHall',
    capacity: 200,
    ac: true,
    price: 50000,
    image: null,
    facilities: ['AC', 'Parking', 'Catering', 'Sound System', 'Projector', 'Decorations'],
    description: 'Premium air-conditioned banquet hall for grand weddings, exhibitions and large corporate events.',
    timings: '6:00 AM - 11:00 PM',
    setupStyles: ['U Shape', 'Theater', 'Cluster', 'Round Table', 'Classroom', 'Other'],
  },
]

async function main() {
  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { name: venue.name },
      update: {},
      create: venue,
    })
  }

  await prisma.pricing.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      vegPrice: 750,
      nonVegChickenPrice: 950,
      nonVegMuttonPrice: 1100,
      mixChickenPrice: 1300,
      mixMuttonPrice: 1450,
      hallGstPercent: 18,
      foodGstPercent: 5,
    },
  })

  await prisma.paymentSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      upiId: 'hotelmetropolishubli@upi',
      payeeName: 'Hotel Metropolis Hubli',
      advanceAmount: 5000,
    },
  })

  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@hotelmetropolishubli.com'
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'admin123'
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      mustChangePassword: true,
    },
  })

  console.log('Seed complete.')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
