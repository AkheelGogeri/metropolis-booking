import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="bg-gray-900 text-white py-16 text-center">
        <p className="text-amber-400 uppercase tracking-widest text-sm font-medium mb-2">
          Get In Touch
        </p>
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-gray-400 mt-3 max-w-lg mx-auto">
          We'd love to hear from you — reach out via any of the channels below
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Phone */}
          <a href="tel:+918364266666"
            className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md transition hover:border-amber-200">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-500 text-sm">+91 836 4266 666</p>
            <p className="text-gray-500 text-sm">+91 95382 13100</p>
            <p className="text-amber-600 text-xs mt-3 font-medium">Tap to call</p>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/919538213100" target="_blank"
            className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md transition hover:border-green-200">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="font-bold text-gray-800 mb-2">WhatsApp</h3>
            <p className="text-gray-500 text-sm">+91 95382 13100</p>
            <p className="text-gray-500 text-sm">Available 9AM - 10PM</p>
            <p className="text-green-600 text-xs mt-3 font-medium">Tap to chat</p>
          </a>

          {/* Email */}
          <a href="mailto:info@hotelmetropolishubli.com"
            className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md transition hover:border-amber-200">
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-500 text-sm">info@hotelmetropolishubli.com</p>
            <p className="text-gray-500 text-sm">Reply within 24 hours</p>
            <p className="text-amber-600 text-xs mt-3 font-medium">Tap to email</p>
          </a>

        </div>

        {/* Address */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center mb-12">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="font-bold text-gray-800 mb-2">Visit Us</h3>
          <p className="text-gray-500">Koppikar Road, Hubli - 580 020</p>
          <p className="text-gray-500">Karnataka, India</p>
          <a href="https://maps.google.com/?q=Hotel+Metropolis+Hubli"
            target="_blank"
            className="inline-block mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
            Open in Google Maps
          </a>
        </div>

        {/* Book a venue CTA */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Book a Venue?</h3>
          <p className="text-gray-400 text-sm mb-6">
            Fill in our booking form and we'll get back to you within 24 hours
          </p>
          <a href="/booking"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            Book a Venue
          </a>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default Contact