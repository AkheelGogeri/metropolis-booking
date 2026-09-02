import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { upload } from '@vercel/blob/client'
import { apiGet, apiPatch, apiPost, getToken, clearToken } from '../api/client'

const typeLabel = { BanquetHall: 'Banquet Hall', MeetingRoom: 'Meeting Room' }

// Downscales + re-encodes as JPEG in the browser before upload, so a multi-MB
// phone photo doesn't ship to visitors as-is — keeps the public site fast.
function compressImage(file, { maxDimension = 1920, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Image compression failed'))
          resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image file'))
    }
    img.src = url
  })
}

const MAX_PHOTOS = 6

function VenueCard({ venue, onSaved }) {
  const [price, setPrice] = useState(venue.price)
  // Each slot is either { type: 'existing', url } or { type: 'pending', file, previewUrl }
  const [slots, setSlots] = useState(
    (Array.isArray(venue.images) ? venue.images : []).map((url) => ({ type: 'existing', url }))
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleFilesChange = (e) => {
    const selected = [...(e.target.files || [])]
    if (selected.length === 0) return
    const room = MAX_PHOTOS - slots.length
    const toAdd = selected.slice(0, room).map((file) => ({
      type: 'pending',
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setSlots([...slots, ...toAdd])
    setSaved(false)
    e.target.value = ''
  }

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const images = []
      for (const slot of slots) {
        if (slot.type === 'existing') {
          images.push(slot.url)
          continue
        }
        const compressed = await compressImage(slot.file)
        const blob = await upload(`venues/${venue.id}-${compressed.name}`, compressed, {
          access: 'public',
          handleUploadUrl: '/api/venue-image-upload',
          clientPayload: JSON.stringify({ token: getToken() }),
        })
        images.push(blob.url)
      }
      await apiPatch(`/venues/${venue.id}`, { price: Number(price), images })
      setSlots(images.map((url) => ({ type: 'existing', url })))
      setSaved(true)
      onSaved()
    } catch (err) {
      setError(err.message || 'Failed to save venue')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-5">
      <div className="sm:w-56 shrink-0">
        {slots.length === 0 ? (
          <div className="h-32 w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No photos yet</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot, i) => (
              <div key={i} className="relative h-16 rounded-lg overflow-hidden bg-gray-100 group">
                <img
                  src={slot.type === 'existing' ? slot.url : slot.previewUrl}
                  alt={`${venue.name} ${i + 1}`}
                  className="w-full h-full object-cover" />
                <button
                  onClick={() => removeSlot(i)}
                  aria-label="Remove photo"
                  className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-600 text-white w-4 h-4 rounded-full text-xs leading-none flex items-center justify-center">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {slots.length < MAX_PHOTOS && (
          <label className="mt-2 block text-xs font-medium text-amber-600 cursor-pointer">
            + Add photo{slots.length > 0 ? 's' : ''}
            <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="hidden" />
          </label>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-800">{venue.name}</p>
            <p className="text-xs text-gray-400">{typeLabel[venue.type] || venue.type} · up to {venue.capacity}</p>
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Price (₹)</label>
          <input type="number" min="0" value={price}
            onChange={(e) => { setPrice(e.target.value); setSaved(false) }}
            className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        {saved && !error && <p className="text-green-600 text-xs mt-2">Saved</p>}

        <button onClick={handleSave} disabled={saving}
          className="mt-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function AdminSettings() {
  const navigate = useNavigate()
  const [venues, setVenues] = useState([])
  const [payment, setPayment] = useState({ upiId: '', payeeName: '', advanceAmount: '' })
  const [paymentSaving, setPaymentSaving] = useState(false)
  const [paymentSaved, setPaymentSaved] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [loadError, setLoadError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const loadVenues = () => apiGet('/venues').then(setVenues)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn')
    if (!isLoggedIn) {
      navigate('/admin/login')
      return
    }
    Promise.all([loadVenues(), apiGet('/settings/payment').then(setPayment)])
      .catch((err) => {
        setLoadError(err.message || 'Failed to load settings')
        if (err.message?.includes('Invalid or expired token') || err.message?.includes('Missing or invalid')) {
          localStorage.removeItem('isAdminLoggedIn')
          clearToken()
          navigate('/admin/login')
        }
      })
  }, [navigate])

  const handlePaymentSave = async (e) => {
    e.preventDefault()
    setPaymentSaving(true)
    setPaymentError('')
    setPaymentSaved(false)
    try {
      const updated = await apiPatch('/settings/payment', {
        upiId: payment.upiId,
        payeeName: payment.payeeName,
        advanceAmount: Number(payment.advanceAmount),
      })
      setPayment(updated)
      setPaymentSaved(true)
    } catch (err) {
      setPaymentError(err.message || 'Failed to save payment settings')
    } finally {
      setPaymentSaving(false)
    }
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSaved(false)

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match')
      return
    }

    setPasswordSaving(true)
    try {
      await apiPost('/auth/change-password', { currentPassword, newPassword })
      setPasswordSaved(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password')
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="https://hotelmetropolishubli.in/wp-content/uploads/2022/03/metropolis-hotel-logo-1-Phone-Custom-Custom-1.png"
            alt="Logo" className="h-9 sm:h-10 object-contain shrink-0" />
          <h1 className="text-base sm:text-lg font-bold text-gray-800">Settings</h1>
        </div>
        <Link to="/admin/dashboard" className="text-gray-500 hover:text-amber-600 text-sm font-medium">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {loadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {loadError}
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Venue Photos & Pricing</h2>
          <div className="space-y-4">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} onSaved={loadVenues} />
            ))}
            {venues.length === 0 && !loadError && (
              <p className="text-gray-400 text-sm">Loading venues...</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Settings</h2>
          <form onSubmit={handlePaymentSave} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">UPI ID</label>
              <input type="text" value={payment.upiId}
                onChange={(e) => { setPayment({ ...payment, upiId: e.target.value }); setPaymentSaved(false) }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Payee Name</label>
              <input type="text" value={payment.payeeName}
                onChange={(e) => { setPayment({ ...payment, payeeName: e.target.value }); setPaymentSaved(false) }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Advance Amount (₹)</label>
              <input type="number" min="0" value={payment.advanceAmount}
                onChange={(e) => { setPayment({ ...payment, advanceAmount: e.target.value }); setPaymentSaved(false) }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            {paymentError && <p className="text-red-500 text-xs">{paymentError}</p>}
            {paymentSaved && !paymentError && <p className="text-green-600 text-xs">Saved</p>}

            <button type="submit" disabled={paymentSaving}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              {paymentSaving ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Security</h2>
          <form onSubmit={handlePasswordSave} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Current Password</label>
              <input type="password" required value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setPasswordSaved(false) }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
              <input type="password" required value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordSaved(false) }}
                placeholder="At least 8 characters"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Confirm New Password</label>
              <input type="password" required value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordSaved(false) }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
            {passwordSaved && !passwordError && <p className="text-green-600 text-xs">Password changed</p>}

            <button type="submit" disabled={passwordSaving}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              {passwordSaving ? 'Saving...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
