import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Venues from './pages/Venues'
import Booking from './pages/Booking'
import Confirmation from './pages/Confirmation'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminChangePassword from './pages/AdminChangePassword'
import AdminDashboard from './pages/AdminDashboard'
import AdminCalendar from './pages/AdminCalendar'
import AdminNewBooking from './pages/AdminNewBooking'
import AdminSettings from './pages/AdminSettings'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/change-password" element={<AdminChangePassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/calendar" element={<AdminCalendar />} />
        <Route path="/admin/new-booking" element={<AdminNewBooking />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App