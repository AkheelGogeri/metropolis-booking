import { Link } from 'react-router-dom'
import venues from '../data/venues'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Home() {
  const banquetHalls = venues.filter(v => v.type === "Banquet Hall")
  const meetingRooms = venues.filter(v => v.type === "Meeting Room")

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[90vh] flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('https://hotelmetropolishubli.in/wp-content/uploads/2021/09/METROPOLIS-WEDDING-HALLS-1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-white px-4">
          <p className="text-amber-400 font-medium tracking-widest uppercase text-sm mb-3">
            Hotel Metropolis Hubli
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Book Your Perfect <br /> Event Space
          </h1>
          <p className="text-gray-200 text-lg mb-8 max-w-xl mx-auto">
            From intimate boardroom meetings to grand wedding celebrations — we have the perfect venue for every occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/venues"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Explore Venues
            </Link>
            <Link to="/booking"
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition">
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-amber-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold">25+</p>
            <p className="text-amber-100 text-sm mt-1">Years of Experience</p>
          </div>
          <div>
            <p className="text-3xl font-bold">300</p>
            <p className="text-amber-100 text-sm mt-1">Guest Capacity</p>
          </div>
          <div>
            <p className="text-3xl font-bold">5</p>
            <p className="text-amber-100 text-sm mt-1">Event Venues</p>
          </div>
          <div>
            <p className="text-3xl font-bold">1000+</p>
            <p className="text-amber-100 text-sm mt-1">Events Hosted</p>
          </div>
        </div>
      </div>

      {/* Banquet Halls Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-amber-600 font-medium uppercase tracking-widest text-sm">Our Venues</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">Banquet Halls</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Elegant spaces for weddings, receptions, and grand celebrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {banquetHalls.map(venue => (
            <div key={venue.id} className="rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-amber-600 text-white text-xs px-3 py-1 rounded-full">
                  {venue.type}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800">{venue.name}</h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{venue.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-xs text-gray-400">Capacity</p>
                    <p className="font-semibold text-gray-700">Up to {venue.capacity} guests</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Starting from</p>
                    <p className="font-semibold text-amber-600">₹{venue.price.toLocaleString()}</p>
                  </div>
                </div>
                <Link to={`/booking?venue=${venue.name}`}
                  className="block text-center mt-5 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium transition">
                  Check Availability
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Rooms Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-medium uppercase tracking-widest text-sm">Corporate</p>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">Meeting Rooms</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Professional spaces for meetings, conferences and corporate events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {meetingRooms.map(venue => (
              <div key={venue.id} className="rounded-xl overflow-hidden shadow-lg bg-white border border-gray-100 hover:shadow-xl transition">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
                    {venue.type}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800">{venue.name}</h3>
                  <p className="text-gray-500 text-sm mt-2">{venue.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs text-gray-400">Capacity</p>
                      <p className="font-semibold text-gray-700">Up to {venue.capacity} people</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="font-semibold text-amber-600">₹{venue.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <Link to={`/booking?venue=${venue.name}`}
                    className="block text-center mt-5 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white py-2 rounded-lg font-medium transition">
                    Check Availability
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-amber-600 font-medium uppercase tracking-widest text-sm">What We Offer</p>
        <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-12">Facilities & Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "❄️", label: "Air Conditioning" },
            { icon: "🅿️", label: "Ample Parking" },
            { icon: "🍽️", label: "In-house Catering" },
            { icon: "🔊", label: "Sound System" },
            { icon: "📽️", label: "Projector & Screen" },
            { icon: "📶", label: "High Speed WiFi" },
            { icon: "💐", label: "Decoration Support" },
            { icon: "👨‍💼", label: "Dedicated Host" },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 hover:bg-amber-50 transition">
              <p className="text-4xl mb-3">{item.icon}</p>
              <p className="text-gray-700 font-medium text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Event?</h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Contact us today and our team will help you create an unforgettable experience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/booking"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            Book a Venue
          </Link>
          <a href="https://wa.link/1pd16b" target="_blank"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            WhatsApp Us
          </a>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home