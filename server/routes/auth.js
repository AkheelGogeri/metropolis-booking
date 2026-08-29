import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'
import requireAdmin from '../middleware/requireAdmin.js'

const router = express.Router()

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } })
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, mustChangePassword: admin.mustChangePassword })
  } catch (err) {
    next(err)
  }
})

router.post('/change-password', requireAdmin, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {}
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' })
    }

    const admin = await prisma.adminUser.findUnique({ where: { id: req.admin.id } })
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    const valid = await bcrypt.compare(currentPassword, admin.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash, mustChangePassword: false },
    })

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router
