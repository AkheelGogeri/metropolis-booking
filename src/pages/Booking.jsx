import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { apiGet, apiPost } from '../api/client'

function Booking() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [venues, setVenues] = useState([])
  const [form, setForm] = useState({
    eventCategory: '',
    companyName: '',
    bookingPersonName: '',
    designation: '',
    gstNumber: '',
    projector: '',
    bookingType: '',
    venue: searchParams.get('venue') || '',
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
    message: '',
    phone: '',
    email: ''
  })

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
  const selectedVenue = venues.find(v => String(v.id) === String(form.venue))

  const calculateHours = () => {
    if (!form.startTime || !form.endTime) return null
    const [sh, sm] = form.startTime.split(':').map(Number)
    const [eh, em] = form.endTime.split(':').map(Number)
    let diff = (eh * 60 + em) - (sh * 60 + sm)
    if (diff < 0) diff += 24 * 60
    return (diff / 60).toFixed(1)
  }

  const getPlatePrice = () => {
    if (form.foodPreference === 'Veg') return 750
    if (form.foodPreference === 'Non Veg') return form.biryaniChoice === 'Mutton Biryani' ? 1100 : 950
    if (form.foodPreference === 'Mix') return form.biryaniChoice === 'Mutton Biryani' ? 1450 : 1300
    return 0
  }

  const calculatePricing = () => {
    const plates = parseInt(form.plates) || 0
    const platePrice = getPlatePrice()
    const hallPrice = selectedVenue?.price || 0

    if (form.bookingType === 'Hall Only') {
      const hallGST = hallPrice * 0.18
      return { hallCharge: hallPrice, foodCharge: 0, hallGST, foodGST: 0, total: hallPrice + hallGST }
    }
    if (form.bookingType === 'Hall + Food') {
      const foodCharge = plates * platePrice
      const foodGST = foodCharge * 0.05
      return { hallCharge: 0, foodCharge, hallGST: 0, foodGST, total: foodCharge + foodGST }
    }
    return null
  }

  const pricing = calculatePricing()
  const hours = calculateHours()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const [firstName, ...restName] = (form.bookingPersonName || '').trim().split(/\s+/)

    const templateParams = {
      eventCategory: form.eventCategory,
      eventType: form.eventCategory,
      companyName: form.companyName,
      bookingPersonName: form.bookingPersonName,
      firstName: firstName || 'Guest',
      lastName: restName.join(' '),
      designation: form.designation,
      gstNumber: form.gstNumber,
      projector: form.projector,
      bookingType: form.bookingType,
      venue: selectedVenue?.name || form.venue,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      hours: hours,
      guests: form.guests,
      foodPreference: form.foodPreference,
      biryaniChoice: form.biryaniChoice,
      plates: form.plates,
      teaCoffee: form.teaCoffee,
      decoration: form.decoration,
      setupStyle: form.setupStyle,
      message: form.message,
      phone: form.phone,
      email: form.email,
      to_email: form.email,
      totalAmount: pricing ? `₹${pricing.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : 'TBD',
    }
    try {
      await emailjs.send('service_mnsa4js', 'template_39gwbzh', templateParams, 'K0Ns7b9laDwm90uzk')

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
          totalAmount: pricing ? Math.round(pricing.total) : 0,
        })
      } catch (dbError) {
        // The email notification already went out — don't block the customer
        // on a database hiccup, just surface it for us to notice in logs.
        console.error('Booking API error:', dbError)
      }

      navigate('/confirmation', {
        state: { name: form.bookingPersonName, venue: selectedVenue?.name || form.venue, date: form.date, pricing }
      })
    } catch (error) {
      console.error('Email error:', error)
      alert('Something went wrong. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-gray-900 text-white py-16 text-center">
        <p className="text-amber-400 uppercase tracking-widest text-sm font-medium mb-2">Reservations</p>
        <h1 className="text-4xl font-bold">Book a Venue</h1>
        <p className="text-gray-400 mt-3 max-w-lg mx-auto">Fill in your details and our team will contact you within 24 hours</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Left Panel */}
          <div className="md:col-span-1 space-y-6 order-2 md:order-1">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p className="text-gray-500 text-sm">Koppikar Road, Hubli - 580 020</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <p className="text-gray-500 text-sm">+91 836 4266 666</p>
                  <p className="text-gray-500 text-sm">+91 95382 13100</p>
                </div>
              </div>
            </div>

            {selectedVenue && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="text-xs text-amber-600 font-semibold uppercase mb-2">Selected Venue</p>
                <h3 className="font-bold text-gray-800">{selectedVenue.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedVenue.ac ? '❄️ AC' : '🌀 Non-AC'} · Up to {selectedVenue.capacity} guests</p>
              </div>
            )}

            {hours && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Duration</p>
                <p className="text-2xl font-bold text-gray-800">{hours} hours</p>
              </div>
            )}
            <a href="https://wa.me/919538213100" target="_blank"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition">
              💬 Chat on WhatsApp
            </a>
            {pricing && (
              <div className="bg-white border-2 border-amber-300 rounded-xl p-5">
                <p className="text-xs text-amber-600 font-semibold uppercase mb-3">Price Summary</p>
                <div className="space-y-2 text-sm">
                  {form.bookingType === 'Hall Only' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hall Charge</span>
                        <span className="font-medium">₹{pricing.hallCharge.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST (18%)</span>
                        <span className="font-medium">₹{pricing.hallGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </>
                  )}
                  {form.bookingType === 'Hall + Food' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hall Charge</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{form.plates || 0} plates × ₹{getPlatePrice()}</span>
                        <span className="font-medium">₹{pricing.foodCharge.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST (5%)</span>
                        <span className="font-medium">₹{pricing.foodGST.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-amber-600">₹{pricing.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — Form */}
          <div className="md:col-span-2 order-1 md:order-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Event Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Category *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Business Event', 'Leisure Event'].map(cat => (
                    <button type="button" key={cat}
                      onClick={() => setForm({ ...form, eventCategory: cat })}
                      className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition ${form.eventCategory === cat ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-amber-300'}`}>
                      {cat === 'Business Event' ? '💼 Business Event' : '🎉 Leisure Event'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Fields */}
              {isBusiness && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Corporate Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                      <input type="text" name="companyName" value={form.companyName} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
                      <input type="text" name="bookingPersonName" value={form.bookingPersonName} onChange={handleChange}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Projector & Screen Required?</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBusiness ? 'Contact Person Name *' : 'Full Name *'}</label>
                  <input type="text" name="bookingPersonName" required value={form.bookingPersonName} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                  <input type="number" name="guests" required value={form.guests} onChange={handleChange} min="1" max="300"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Venue *</label>
                <select name="venue" required value={form.venue} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Select a Venue --</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                  <input type="date" name="date" required value={form.date} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
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
              {hours && <p className="text-sm text-amber-600 font-medium -mt-4">Total duration: {hours} hours</p>}

              {/* Booking Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Hall Only', 'Hall + Food'].map(type => (
                    <button type="button" key={type}
                      onClick={() => setForm({ ...form, bookingType: type, foodPreference: '', biryaniChoice: '', plates: '' })}
                      className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition ${form.bookingType === type ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:border-amber-300'}`}>
                      {type === 'Hall Only' ? '🏛️ Hall Only' : '🍽️ Hall + Food (Hall FREE)'}
                    </button>
                  ))}
                </div>
                {form.bookingType === 'Hall Only' && <p className="text-xs text-gray-500 mt-2">18% GST applicable on hall charges</p>}
                {form.bookingType === 'Hall + Food' && <p className="text-xs text-green-600 mt-2">✓ Hall is FREE when you order food</p>}
              </div>

              {/* Food Selection */}
              {isHallFood && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-5">
                  <p className="text-sm font-semibold text-gray-700">Food Selection</p>

                  {/* Menu Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Menu Type *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: '🥦 Veg', value: 'Veg', price: '₹750/plate' },
                        { label: '🍗 Non Veg', value: 'Non Veg', price: 'from ₹950/plate' },
                        { label: '🍽️ Mix', value: 'Mix', price: 'from ₹1,300/plate' },
                      ].map(opt => (
                        <button type="button" key={opt.value}
                          onClick={() => setForm({ ...form, foodPreference: opt.value, biryaniChoice: '' })}
                          className={`py-2 px-3 rounded-xl border-2 font-medium text-xs transition text-center ${form.foodPreference === opt.value ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                          <p>{opt.label}</p>
                          <p className="text-gray-400 mt-1">{opt.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Veg Menu */}
                  {form.foodPreference === 'Veg' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-green-700 mb-3">🥦 Veg Menu Includes — ₹750 per plate</p>
                      <div className="flex flex-wrap gap-2">
                        {['Welcome Drink', 'Veg Soup', 'Veg Starter', 'Veg Gravy', 'Paneer Gravy', '2 Types of Roti', 'Rice & Daal', 'Veg Biryani', 'Raita & Papad', 'Pickle', 'Ice Cream', 'Water Bottle 500ml'].map(item => (
                          <span key={item} className="bg-white border border-green-300 text-green-800 text-xs px-3 py-1 rounded-full">✓ {item}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Non Veg Menu */}
                  {form.foodPreference === 'Non Veg' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-orange-700 mb-3">🍗 Non Veg Menu Includes — from ₹950 per plate</p>
                      <div className="flex flex-wrap gap-2">
                        {['Welcome Drink', 'Veg Soup', 'Veg Starter', 'Veg Gravy', 'Chicken Gravy', '2 Types of Roti', 'Rice & Daal', 'Chicken Biryani / Mutton Biryani', 'Raita & Papad', 'Pickle', 'Ice Cream', 'Water Bottle 500ml'].map(item => (
                          <span key={item} className="bg-white border border-orange-300 text-orange-800 text-xs px-3 py-1 rounded-full">✓ {item}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mix Menu */}
                  {form.foodPreference === 'Mix' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <p className="text-sm font-semibold text-purple-700 mb-3">🍽️ Mix Menu Includes — from ₹1,300 per plate</p>
                      <div className="flex flex-wrap gap-2">
                        {['Welcome Drink', 'Veg Soup', 'Chicken Soup', 'Veg Starter', 'Chicken Starter', 'Veg Gravy', 'Chicken Gravy', '2 Types of Roti', 'Veg Biryani', 'Chicken Biryani / Mutton Biryani', 'Raita & Papad', 'Pickle', 'Water Bottle 500ml'].map(item => (
                          <span key={item} className="bg-white border border-purple-300 text-purple-800 text-xs px-3 py-1 rounded-full">✓ {item}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Biryani Choice for Non Veg */}
                  {form.foodPreference === 'Non Veg' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Biryani Choice *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: '🍗 Chicken Biryani', value: 'Chicken Biryani', price: '₹950/plate' },
                          { label: '🐑 Mutton Biryani', value: 'Mutton Biryani', price: '₹1,100/plate' },
                        ].map(opt => (
                          <button type="button" key={opt.value}
                            onClick={() => setForm({ ...form, biryaniChoice: opt.value })}
                            className={`py-2 px-3 rounded-xl border-2 font-medium text-xs transition text-center ${form.biryaniChoice === opt.value ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                            <p>{opt.label}</p>
                            <p className="text-gray-400 mt-1">{opt.price}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Biryani Choice for Mix */}
                  {form.foodPreference === 'Mix' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Biryani Choice *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: '🍗 Chicken Biryani', value: 'Chicken Biryani', price: '₹1,300/plate' },
                          { label: '🐑 Mutton Biryani', value: 'Mutton Biryani', price: '₹1,450/plate' },
                        ].map(opt => (
                          <button type="button" key={opt.value}
                            onClick={() => setForm({ ...form, biryaniChoice: opt.value })}
                            className={`py-2 px-3 rounded-xl border-2 font-medium text-xs transition text-center ${form.biryaniChoice === opt.value ? 'border-amber-600 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600'}`}>
                            <p>{opt.label}</p>
                            <p className="text-gray-400 mt-1">{opt.price}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Number of Plates */}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Setup Style *</label>
                <select name="setupStyle" required value={form.setupStyle} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Select Setup Style --</option>
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
                {form.decoration === 'Yes' && (
                  <p className="text-xs text-amber-600 mt-2">ⓘ Decoration charges quoted separately by our team</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="Any special requirements or requests..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-4 rounded-xl font-bold text-lg transition">
                {loading ? 'Sending...' : 'Submit Booking Request'}
              </button>

              <p className="text-center text-gray-400 text-sm">
                Our team will contact you within 24 hours to confirm your booking
              </p>

            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Booking