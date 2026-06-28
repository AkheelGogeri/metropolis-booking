import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Venues from './pages/Venues'
import Booking from './pages/Booking'
import Confirmation from './pages/Confirmation'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App