import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { upload } from '@vercel/blob/client'
import { apiGet, apiPatch, getToken, clearToken } from '../api/client'

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

function VenueCard({ venue, onSaved }) {
  const [price, setPrice] = useState(venue.price)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(venue.image)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      let image = venue.image
      if (file) {
        const compressed = await compressImage(file)
        const blob = await upload(`venues/${venue.id}-${compressed.name}`, compressed, {
          access: 'public',
          handleUploadUrl: '/api/venue-image-upload',
          clientPayload: JSON.stringify({ token: getToken() }),
        })
        image = blob.url
      }
      await apiPatch(`/venues/${venue.id}`, { price: Number(price), image })
      setSaved(true)
      setFile(null)
      onSaved()
    } catch (err) {
      setError(err.message || 'Failed to save venue')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-5">
      <div className="sm:w-48 shrink-0">
        <div className="h-32 w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt={venue.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-xs">No photo yet</span>
          )}
        </div>
        <label className="mt-2 block text-xs font-medium text-amber-600 cursor-pointer">
          Choose photo
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://hotelmetropolishubli.in/wp-content/uploads/2022/03/metropolis-hotel-logo-1-Phone-Custom-Custom-1.png"
            alt="Logo" className="h-10 object-contain" />
          <h1 className="text-lg font-bold text-gray-800">Settings</h1>
        </div>
        <Link to="/admin/dashboard" className="text-gray-500 hover:text-amber-600 text-sm font-medium">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">
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
      </div>
    </div>
  )
}

export default AdminSettings
