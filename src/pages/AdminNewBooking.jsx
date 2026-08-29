import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiGet, apiPost } from '../api/client'

function AdminNewBooking() {
  const navigate = useNavigate()
  const [venues, setVenues] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    eventCategory: '',
    companyName: '',
    bookingPersonName: '',
    designation: '',
    gstNumber: '',
    projector: '',
    bookingType: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    guests: '',
    foodPreference: '',
    biryaniChoice: '',
    plates: '',
    teaCoffee: '',
    decoration: '',
    setupStyle: '',
    paymentStatus: 'Unpaid',
    message: '',
    phone: '',
    email: ''
  })

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn')
    if (!isLoggedIn) navigate('/admin/login')
  }, [navigate])

  useEffect(() => {
    apiGet('/venues')
      .then(setVenues)
      .catch(() => setVenues([]))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const isBusiness = form.eventCategory === 'Business Event'
  const isHallFood = form.bookingType === 'Hall + Food'

  const getPlatePrice = () => {
    if (form.foodPreference === 'Veg') return 750
    if (form.foodPreference === 'Non Veg') return form.biryaniChoice === 'Mutton Biryani' ? 1100 : 950
    if (form.foodPreference === 'Mix') return form.biryaniChoice === 'Mutton Biryani' ? 1450 : 1300
    return 0
  }

  const calculatePricing = () => {
    const selectedVenue = venues.find(v => String(v.id) === String(form.venue))
    const hallPrice = selectedVenue?.price || 0
    if (form.bookingType === 'Hall Only') {
      const hallGST = hallPrice * 0.18
      return { total: hallPrice + hallGST }
    }
    if (form.bookingType === 'Hall + Food') {
      const plates = parseInt(form.plates) || 0
      const foodCharge = plates * getPlatePrice()
      const foodGST = foodCharge * 0.05
      return { total: foodCharge + foodGST }
    }
    return null
  }

  const calculateHours = () => {
    if (!form.startTime || !form.endTime) return null
    const [sh, sm] = form.startTime.split(':').map(Number)
    const [eh, em] = form.endTime.split(':').map(Number)
    let diff = (eh * 60 + em) - (sh * 60 + sm)
    if (diff < 0) diff += 24 * 60
    return (diff / 60).toFixed(1)
  }

  const pricing = calculatePricing()
  const hours = calculateHours()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiPost('/bookings', {
        firstName: form.bookingPersonName?.split(' ')[0] || 'Guest',
        lastName: form.bookingPersonName?.split(' ').slice(1).join(' '),
        phone: form.phone,
        email: form.email,
        eventCategory: form.eventCategory,
        companyName: form.companyName,
        designation: form.designation,
        gstNumber: form.gstNumber,
        projector: form.projector,
        bookingType: form.bookingType,
        venueId: Number(form.venue),
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        guests: form.guests,
        foodPreference: form.foodPreference,
        biryaniChoice: form.biryaniChoice,
        plates: form.plates,
        teaCoffee: form.teaCoffee,
        decoration: form.decoration,
        setupStyle: form.setupStyle,
        message: form.message,
        status: 'Confirmed',
        paymentStatus: form.paymentStatus,
        totalAmount: pricing ? Math.round(pricing.total) : 0,
        manualEntry: true,
      })
      alert('Booking added successfully!')
      navigate('/admin/dashboard')
    } catch (err) {
      alert(err.message || 'Failed to add booking')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://hotelmetropolishubli.in/wp-content/uploads/2022/03/metropolis-hotel-logo-1-Phone-Custom-Custom-1.png"
            alt="Logo" className="h-10 object-contain" />
          <h1 className="text-lg font-bold text-gray-800">Add Manual Booking</h1>
        </div>
        <Link to="/admin/dashboard" className="text-gray-500 hover:text-amber-600 text-sm font-medium">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-700">📞 Use this form to add bookings received over phone calls or walk-ins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Price Summary */}
          <div className="md:col-span-1 space-y-4">
            {hours && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Duration</p>
                <p className="text-2xl font-bold text-gray-800">{hours} hours</p>
              </div>
            )}
            {pricing && (
              <div className="bg-white border-2 border-amber-300 rounded-xl p-5">
                <p className="text-xs text-amber-600 font-semibold uppercase mb-3">Price Summary</p>
                <div className="space-y-2 text-sm">
                  {form.bookingType === 'Hall Only' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hall Charge</span>
                        <span>₹{(venues.find(v => String(v.id) === String(form.venue))?.price || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST (18%)</span>
                        <span>₹{((venues.find(v => String(v.id) === String(form.venue))?.price || 0) * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </>
                  )}
                  {form.bookingType === 'Hall + Food' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hall</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{form.plates || 0} × ₹{getPlatePrice()}</span>
                        <span>₹{((parseInt(form.plates) || 0) * getPlatePrice()).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST (5%)</span>
                        <span>₹{(((parseInt(form.plates) || 0) * getPlatePrice()) * 0.05).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">₹{pricing.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">

              {/* Event Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Category *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Business Event', 'Leisure Event'].map(cat => (
                    <button type="button" key={cat}
                      onClick={() => setForm({ ...form, eventCategory: cat })}
                      className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition ${form.eventCategory === cat ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                      {cat === 'Business Event' ? '💼 Business Event' : '🎉 Leisure Event'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Fields */}
              {isBusiness && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Corporate Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input type="text" name="companyName" value={form.companyName} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                      <input type="text" name="designation" value={form.designation} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                      <input type="text" name="gstNumber" value={form.gstNumber} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Projector & Screen?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Yes', 'No'].map(opt => (
                        <button type="button" key={opt}
                          onClick={() => setForm({ ...form, projector: opt })}
                          className={`py-2 px-4 rounded-lg border-2 font-medium text-sm transition ${form.projector === opt ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                          {opt === 'Yes' ? '📽️ Yes' : '❌ No'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="bookingPersonName" required value={form.bookingPersonName} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                  <input type="number" name="guests" required value={form.guests} onChange={handleChange} min="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Venue *</label>
                <select name="venue" required value={form.venue} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Select Venue --</option>
                  <optgroup label="Banquet Halls">
                    {venues.filter(v => v.type === "BanquetHall").map(v => (
                      <option key={v.id} value={v.id}>{v.name} — {v.ac ? 'AC' : 'Non-AC'} — up to {v.capacity} guests</option>
                    ))}
                  </optgroup>
                  <optgroup label="Meeting Rooms">
                    {venues.filter(v => v.type === "MeetingRoom").map(v => (
                      <option key={v.id} value={v.id}>{v.name} — AC — up to {v.capacity} people</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" name="date" required value={form.date} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input type="time" name="startTime" required value={form.startTime} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input type="time" name="endTime" required value={form.endTime} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
              {hours && <p className="text-sm text-amber-600 font-medium -mt-3">Duration: {hours} hours</p>}

              {/* Booking Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Hall Only', 'Hall + Food'].map(type => (
                    <button type="button" key={type}
                      onClick={() => setForm({ ...form, bookingType: type, foodPreference: '', biryaniChoice: '', plates: '' })}
                      className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition ${form.bookingType === type ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                      {type === 'Hall Only' ? '🏛️ Hall Only' : '🍽️ Hall + Food (Hall FREE)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Selection */}
              {isHallFood && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Food Selection</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: '🥦 Veg', value: 'Veg', price: '₹750/plate' },
                      { label: '🍗 Non Veg', value: 'Non Veg', price: 'from ₹950/plate' },
                      { label: '🍽️ Mix', value: 'Mix', price: 'from ₹1,300/plate' },
                    ].map(opt => (
                      <button type="button" key={opt.value}
                        onClick={() => setForm({ ...form, foodPreference: opt.value, biryaniChoice: '' })}
                        className={`py-2 px-3 rounded-xl border-2 text-xs transition text-center ${form.foodPreference === opt.value ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-gray-400 mt-1">{opt.price}</p>
                      </button>
                    ))}
                  </div>

                  {(form.foodPreference === 'Non Veg' || form.foodPreference === 'Mix') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Biryani Choice</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: '🍗 Chicken Biryani', value: 'Chicken Biryani', price: form.foodPreference === 'Mix' ? '₹1,300/plate' : '₹950/plate' },
                          { label: '🐑 Mutton Biryani', value: 'Mutton Biryani', price: form.foodPreference === 'Mix' ? '₹1,450/plate' : '₹1,100/plate' },
                        ].map(opt => (
                          <button type="button" key={opt.value}
                            onClick={() => setForm({ ...form, biryaniChoice: opt.value })}
                            className={`py-2 px-3 rounded-xl border-2 text-xs transition text-center ${form.biryaniChoice === opt.value ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                            <p className="font-medium">{opt.label}</p>
                            <p className="text-gray-400 mt-1">{opt.price}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {form.foodPreference && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Plates *</label>
                      <input type="number" name="plates" value={form.plates} onChange={handleChange} min="1"
                        placeholder="Enter number of plates"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                  )}
                </div>
              )}

              {/* Tea Coffee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tea / Coffee Required?</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No'].map(opt => (
                    <button type="button" key={opt}
                      onClick={() => setForm({ ...form, teaCoffee: opt })}
                      className={`py-2 px-4 rounded-lg border-2 font-medium text-sm transition ${form.teaCoffee === opt ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                      {opt === 'Yes' ? '☕ Yes' : '❌ No'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Setup Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Setup Style</label>
                <select name="setupStyle" value={form.setupStyle} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Select --</option>
                  <option>U Shape</option>
                  <option>Theater</option>
                  <option>Cluster</option>
                  <option>Round Table</option>
                  <option>Classroom</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Decoration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Decoration Required?</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No'].map(opt => (
                    <button type="button" key={opt}
                      onClick={() => setForm({ ...form, decoration: opt })}
                      className={`py-2 px-4 rounded-lg border-2 font-medium text-sm transition ${form.decoration === opt ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                      {opt === 'Yes' ? '🎊 Yes' : '❌ No'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status *</label>
                <select name="paymentStatus" required value={form.paymentStatus} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="Unpaid">Unpaid</option>
                  <option value="AdvancePaid">Advance Paid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="Any special requirements..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 rounded-lg font-semibold transition">
                {submitting ? 'Adding...' : 'Add Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNewBooking