import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import bookingsData from '../data/bookings'

function AdminCalendar() {
  const navigate = useNavigate()
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn')
    if (!isLoggedIn) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn')
    navigate('/admin/login')
  }

  const statusColors = {
    Pending: '#f59e0b',
    Confirmed: '#16a34a',
    Cancelled: '#ef4444',
  }

  const events = bookingsData.map(b => ({
    id: b.id,
    title: `${b.venue} — ${b.firstName} ${b.lastName}`,
    date: b.date,
    backgroundColor: statusColors[b.status],
    borderColor: statusColors[b.status],
    extendedProps: { ...b }
  }))

  const handleEventClick = (info) => {
    setSelectedBooking(info.event.extendedProps)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://hotelmetropolishubli.in/wp-content/uploads/2022/03/metropolis-hotel-logo-1-Phone-Custom-Custom-1.png"
            alt="Logo" className="h-10 object-contain" />
          <h1 className="text-lg font-bold text-gray-800">Booking Calendar</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard"
            className="text-gray-600 hover:text-amber-600 font-medium text-sm">
            📋 Table View
          </Link>
          <Link to="/admin/new-booking"
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Add Manual Booking
          </Link>
          <button onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 text-sm font-medium">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Legend */}
        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            <span className="text-sm text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              height="auto"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
            />
          </div>

          {/* Selected Booking Detail */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
            {selectedBooking ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Booking Details</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium`}
                    style={{
                      backgroundColor: statusColors[selectedBooking.status] + '20',
                      color: statusColors[selectedBooking.status]
                    }}>
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400">Customer</p>
                    <p className="font-medium text-gray-800">{selectedBooking.firstName} {selectedBooking.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="font-medium text-gray-800">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Event Type</p>
                    <p className="font-medium text-gray-800">{selectedBooking.eventType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Venue</p>
                    <p className="font-medium text-gray-800">{selectedBooking.venue}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Time</p>
                    <p className="font-medium text-gray-800">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Guests</p>
                    <p className="font-medium text-gray-800">{selectedBooking.guests}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Food Preference</p>
                    <p className="font-medium text-gray-800">{selectedBooking.foodPreference}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Payment Status</p>
                    <p className="font-medium text-gray-800">{selectedBooking.paymentStatus}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <p>Click on a booking in the calendar to view details</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminCalendar