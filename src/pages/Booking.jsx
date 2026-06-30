import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import venues from '../data/venues'

function Booking() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    eventType: '',
    companyName: '',
    bookingPersonName: '',
    designation: '',
    gstNumber: '',
    venue: searchParams.get('venue') || '',
    date: '',
    startTime: '',
    endTime: '',
    guests: '',
    foodPreference: '',
    teaCoffee: '',
    teaCoffeeRounds: '',
    setupStyle: '',
    decoration: '',
    message: ''
  })

  const isCorporate = form.eventType === 'Corporate Event'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const selectedVenue = venues.find(v => v.name === form.venue)

  // Calculate hours of usage
  const calculateHours = () => {
    if (!form.startTime || !form.endTime) return null
    const [sh, sm] = form.startTime.split(':').map(Number)
    const [eh, em] = form.endTime.split(':').map(Number)
    let diff = (eh * 60 + em) - (sh * 60 + sm)
    if (diff < 0) diff += 24 * 60
    return (diff / 60).toFixed(1)
  }

  const hours = calculateHours()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const templateParams = {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      eventType: form.eventType,
      companyName: form.companyName,
      bookingPersonName: form.bookingPersonName,
      designation: form.designation,
      gstNumber: form.gstNumber,
      venue: form.venue,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      hours: hours,
      guests: form.guests,
      foodPreference: form.foodPreference,
      teaCoffee: form.teaCoffee,
      teaCoffeeRounds: form.teaCoffeeRounds,
      setupStyle: form.setupStyle,
      decoration: form.decoration,
      message: form.message,
      to_email: form.email,
    }

    try {
      await emailjs.send(
        'service_mnsa4js',
        'template_39gwbzh',
         templateParams,
        'K0Ns7b9laDwm90uzk'
        )
      navigate('/confirmation', {
        state: {
          name: form.firstName,
          venue: form.venue,
          date: form.date,
          guests: form.guests
        }
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
        <p className="text-amber-400 uppercase tracking-widest text-sm font-medium mb-2">
          Get In Touch
        </p>
        <h1 className="text-4xl font-bold">Book a Venue</h1>
        <p className="text-gray-400 mt-3 max-w-lg mx-auto">
          Fill in your details and our team will contact you within 24 hours
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Left — Contact Info */}
          <div className="md:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-medium text-gray-700">Address</p>
                    <p className="text-gray-500 text-sm">Koppikar Road, Hubli - 580 020, Karnataka</p>
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
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="font-medium text-gray-700">Email</p>
                    <p className="text-gray-500 text-sm">info@hotelmetropolishubli.com</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedVenue && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="text-xs text-amber-600 font-semibold uppercase mb-2">Selected Venue</p>
                <img src={selectedVenue.image} alt={selectedVenue.name}
                  className="w-full h-32 object-cover rounded-lg mb-3" />
                <h3 className="font-bold text-gray-800">{selectedVenue.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Capacity: up to {selectedVenue.capacity} guests</p>
                <p className="text-sm text-amber-600 font-semibold mt-1">
                  From ₹{selectedVenue.price.toLocaleString()}
                </p>
              </div>
            )}

            {hours && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Duration of Usage</p>
                <p className="text-2xl font-bold text-gray-800">{hours} hours</p>
              </div>
            )}

            <a href="https://wa.link/1pd16b" target="_blank"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition">
              <span>💬</span> Chat on WhatsApp
            </a>
          </div>

          {/* Right — Booking Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input type="text" name="firstName" required value={form.firstName}
                    onChange={handleChange} placeholder="John"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input type="text" name="lastName" required value={form.lastName}
                    onChange={handleChange} placeholder="Doe"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" required value={form.phone}
                    onChange={handleChange} placeholder="+91 98765 43210"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" name="email" required value={form.email}
                    onChange={handleChange} placeholder="john@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
                <select name="eventType" required value={form.eventType} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Select Event Type --</option>
                  <option>Wedding</option>
                  <option>Reception</option>
                  <option>Birthday Party</option>
                  <option>Corporate Event</option>
                  <option>Conference</option>
                  <option>Product Launch</option>
                  <option>Exhibition</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Corporate Event Extra Fields */}
              {isCorporate && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                  <p className="text-sm font-semibold text-gray-700">Corporate Booking Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                      <input type="text" name="companyName" required={isCorporate} value={form.companyName}
                        onChange={handleChange} placeholder="ABC Pvt Ltd"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Booking Person Name *</label>
                      <input type="text" name="bookingPersonName" required={isCorporate} value={form.bookingPersonName}
                        onChange={handleChange} placeholder="Contact person"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                      <input type="text" name="designation" value={form.designation}
                        onChange={handleChange} placeholder="HR Manager"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                      <input type="text" name="gstNumber" value={form.gstNumber}
                        onChange={handleChange} placeholder="22AAAAA0000A1Z5"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Venue *</label>
                <select name="venue" required value={form.venue} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Select a Venue --</option>
                  <optgroup label="Banquet Halls">
                    {venues.filter(v => v.type === "Banquet Hall").map(v => (
                      <option key={v.id} value={v.name}>{v.name} — up to {v.capacity} guests</option>
                    ))}
                  </optgroup>
                  <optgroup label="Meeting Rooms">
                    {venues.filter(v => v.type === "Meeting Room").map(v => (
                      <option key={v.id} value={v.name}>{v.name} — up to {v.capacity} people</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                <input type="date" name="date" required value={form.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              {/* Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input type="time" name="startTime" required value={form.startTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input type="time" name="endTime" required value={form.endTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
              {hours && (
                <p className="text-sm text-amber-600 font-medium -mt-4">
                  Total duration: {hours} hours
                </p>
              )}

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                <input type="number" name="guests" required value={form.guests}
                  onChange={handleChange} placeholder="100"
                  min="1" max="300"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>

              {/* Food Preference + Setup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Preference *</label>
                  <select name="foodPreference" required value={form.foodPreference} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">-- Select --</option>
                    <option>Veg</option>
                    <option>Non Veg</option>
                    <option>Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Setup Style *</label>
                  <select name="setupStyle" required value={form.setupStyle} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">-- Select --</option>
                    <option>Dining</option>
                    <option>Reception</option>
                    <option>Theater</option>
                    <option>U Shape</option>
                    <option>Classroom</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              {/* Tea Coffee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tea/Coffee Required *</label>
                  <select name="teaCoffee" required value={form.teaCoffee} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">-- Select --</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                {form.teaCoffee === 'Yes' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rounds</label>
                    <select name="teaCoffeeRounds" value={form.teaCoffeeRounds} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      <option value="">-- Select --</option>
                      <option>1 Round</option>
                      <option>2 Rounds</option>
                      <option>3 Rounds</option>
                      <option>Unlimited</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Decoration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Decoration Required</label>
                <select name="decoration" value={form.decoration} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">-- Select --</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
                {form.decoration === 'Yes' && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⓘ Decoration charges apply separately — our team will share a custom quote
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  rows={4} placeholder="Tell us more about your event, special requirements..."
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