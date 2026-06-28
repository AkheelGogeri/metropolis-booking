import { Link } from 'react-router-dom'
import venues from '../data/venues'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Venues() {
  const banquetHalls = venues.filter(v => v.type === "Banquet Hall")
  const meetingRooms = venues.filter(v => v.type === "Meeting Room")

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gray-900 text-white py-16 text-center">
        <p className="text-amber-400 uppercase tracking-widest text-sm font-medium mb-2">
          Hotel Metropolis Hubli
        </p>
        <h1 className="text-4xl font-bold">Our Venues</h1>
        <p className="text-gray-400 mt-3 max-w-lg mx-auto">
          Choose from our range of banquet halls and meeting rooms for any occasion
        </p>
      </div>

      {/* Banquet Halls */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-1 w-10 bg-amber-600 rounded"></div>
          <h2 className="text-2xl font-bold text-gray-800">Banquet Halls</h2>
        </div>

        <div className="space-y-10">
          {banquetHalls.map((venue, index) => (
            <div key={venue.id}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 bg-gray-50 rounded-2xl overflow-hidden shadow-md`}>
              <div className="md:w-1/2 h-72 md:h-auto overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4">
                  {venue.type}
                </span>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{venue.name}</h3>
                <p className="text-gray-500 mb-6">{venue.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Capacity</p>
                    <p className="font-bold text-gray-800">Up to {venue.capacity} guests</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Starting from</p>
                    <p className="font-bold text-amber-600">₹{venue.price.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Timings</p>
                    <p className="font-bold text-gray-800">{venue.timings}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-400">Setup Styles</p>
                    <p className="font-bold text-gray-800">{venue.setupStyles.length} options</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Facilities:</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.facilities.map((f, i) => (
                      <span key={i} className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                <Link to={`/booking?venue=${venue.name}`}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-center py-3 rounded-lg font-semibold transition">
                  Book {venue.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Rooms */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-1 w-10 bg-amber-600 rounded"></div>
            <h2 className="text-2xl font-bold text-gray-800">Meeting Rooms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {meetingRooms.map(venue => (
              <div key={venue.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                <div className="h-52 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6">
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {venue.type}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-3 mb-2">{venue.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{venue.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">Capacity</p>
                      <p className="font-bold text-gray-800">Up to {venue.capacity} people</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="font-bold text-amber-600">₹{venue.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {venue.facilities.map((f, i) => (
                      <span key={i} className="bg-gray-50 border border-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                        ✓ {f}
                      </span>
                    ))}
                  </div>

                  <Link to={`/booking?venue=${venue.name}`}
                    className="block text-center border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white py-2 rounded-lg font-semibold transition">
                    Book {venue.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Venues