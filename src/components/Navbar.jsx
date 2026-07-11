import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <img
            src="https://hotelmetropolishubli.in/wp-content/uploads/2022/03/metropolis-hotel-logo-1-Phone-Custom-Custom-1.png"
            alt="Hotel Metropolis"
            className="h-12 object-contain"
          />
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-amber-600 font-medium transition">
            Home
          </Link>
          <Link to="/venues" className="text-gray-700 hover:text-amber-600 font-medium transition">
            Venues
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-amber-600 font-medium transition">
            Contact
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <Link to="/contact"
            className="text-gray-700 font-medium text-sm">
            Contact
          </Link>
          <a href="tel:+919538213100"
            className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            📞 Call
          </a>
        </div>

      </div>
    </nav>
  )
}

export default Navbar