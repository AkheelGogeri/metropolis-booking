import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import bookingsData from '../data/bookings'

function AdminDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState(bookingsData)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterVenue, setFilterVenue] = useState('All')

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

  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b))
  }

  const filteredBookings = bookings.filter(b => {
    const statusMatch = filterStatus === 'All' || b.status === filterStatus
    const venueMatch = filterVenue === 'All' || b.venue === filterVenue
    return statusMatch && venueMatch
  })

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  }

  const statusColor = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://hotelmetropolishubli.in/wp-content/uploads/2022/03/metropolis-hotel-logo-1-Phone-Custom-Custom-1.png"
            alt="Logo" className="h-10 object-contain" />
          <h1 className="text-lg font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin/calendar"
            className="text-gray-600 hover:text-amber-600 font-medium text-sm">
            📅 Calendar View
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Confirmed</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm">Cancelled</p>
            <p className="text-3xl font-bold text-red-500 mt-1">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select value={filterVenue} onChange={(e) => setFilterVenue(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="All">All Venues</option>
            <option>East Court</option>
            <option>West Court</option>
            <option>Central Court</option>
            <option>Board Room 1</option>
            <option>Board Room 2</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Event</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Venue</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Guests</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Payment</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{b.firstName} {b.lastName}</p>
                      <p className="text-gray-400 text-xs">{b.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{b.eventType}</td>
                    <td className="px-4 py-3 text-gray-600">{b.venue}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{b.guests}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${b.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {b.status !== 'Confirmed' && (
                          <button onClick={() => updateStatus(b.id, 'Confirmed')}
                            className="text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-medium">
                            Confirm
                          </button>
                        )}
                        {b.status !== 'Cancelled' && (
                          <button onClick={() => updateStatus(b.id, 'Cancelled')}
                            className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-xs font-medium">
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <p className="text-center text-gray-400 py-12">No bookings found</p>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard