import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Confirmation() {
  const { state } = useLocation()
  const name = state?.name || 'Guest'
  const venue = state?.venue || 'your selected venue'
  const date = state?.date || ''

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-24 text-center">

        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-5xl">✅</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Thank You, {name}!
        </h1>

        <p className="text-gray-500 text-lg mb-6">
          Your booking request for <span className="font-semibold text-amber-600">{venue}</span>
          {date && <span> on <span className="font-semibold text-gray-700">{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></span>} has been received.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mb-10 text-left">
          <h2 className="text-lg font-bold text-gray-800 mb-4">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div>
                <p className="font-medium text-gray-700">Confirmation email sent</p>
                <p className="text-sm text-gray-500">Check your inbox for a confirmation of your request</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div>
                <p className="font-medium text-gray-700">Our team reviews your request</p>
                <p className="text-sm text-gray-500">We check availability and prepare a proposal for you</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div>
                <p className="font-medium text-gray-700">We contact you within 24 hours</p>
                <p className="text-sm text-gray-500">Our events team will call or email you to confirm details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-semibold transition">
            Back to Home
          </Link>
          <a href="https://wa.link/1pd16b" target="_blank"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
            💬 Chat on WhatsApp
          </a>
        </div>

        <p className="text-gray-400 text-sm">
          Need immediate assistance? Call us at{' '}
          <a href="tel:+919538213100" className="text-amber-600 font-medium">+91 95382 13100</a>
        </p>

      </div>

      <Footer />
    </div>
  )
}

export default Confirmation