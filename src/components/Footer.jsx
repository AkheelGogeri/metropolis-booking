function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <img
            src="https://hotelmetropolishubli.in/wp-content/uploads/2022/03/metropolis-hotel-logo-1-Phone-Custom-Custom-1.png"
            alt="Hotel Metropolis"
            className="h-12 object-contain mb-4"
          />
          <p className="text-sm text-gray-400">
            Comfort, Care & Cuisine is what we believe in. Since 1998, Hotel Metropolis has been Hubli's premier destination for events and hospitality.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-amber-500 transition">Home</a></li>
            <li><a href="/venues" className="hover:text-amber-500 transition">Venues</a></li>
            <li><a href="/booking" className="hover:text-amber-500 transition">Book a Venue</a></li>
            <li><a href="https://hotelmetropolishubli.in/dining/" className="hover:text-amber-500 transition" target="_blank">Dining</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>📍 Koppikar Road, Hubli - 580 020, Karnataka</li>
            <li>📞 <a href="tel:+918364266666" className="hover:text-amber-500">+91 836 4266 666</a></li>
            <li>📱 <a href="tel:+919538213100" className="hover:text-amber-500">+91 95382 13100</a></li>
            <li>✉️ <a href="mailto:info@hotelmetropolishubli.com" className="hover:text-amber-500">info@hotelmetropolishubli.com</a></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        © 2024 Hotel Metropolis Hubli. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer