import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Venues from './pages/Venues'
import Booking from './pages/Booking'
import Confirmation from './pages/Confirmation'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminCalendar from './pages/AdminCalendar'
import AdminNewBooking from './pages/AdminNewBooking'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/calendar" element={<AdminCalendar />} />
        <Route path="/admin/new-booking" element={<AdminNewBooking />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App