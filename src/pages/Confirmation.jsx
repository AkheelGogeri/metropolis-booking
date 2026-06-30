import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Confirmation() {
  const { state } = useLocation()
  const name = state?.name || 'Guest'
  const venue = state?.venue || 'your selected venue'
  const date = state?.date || ''

  // Replace with the hotel's actual UPI ID later
  const upiId = "hotelmetropolishubli@upi"
  const advanceAmount = 5000

  const upiLink = `upi://pay?pa=${upiId}&pn=Hotel Metropolis Hubli&am=${advanceAmount}&cu=INR`
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-24 text-center">

        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-5xl">✅</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Thank You, {name}!
        </h1>

        <p className="text-gray-500 text-lg mb-10">
          Your booking request for <span className="font-semibold text-amber-600">{venue}</span>
          {date && <span> on <span className="font-semibold text-gray-700">{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></span>} has been received.
        </p>

        {/* UPI Payment Box */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-8 mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Secure Your Booking</h2>
          <p className="text-gray-600 text-sm mb-6">
            Pay an advance of <span className="font-bold text-amber-600">₹{advanceAmount.toLocaleString()}</span> to confirm your venue
          </p>

          <div className="bg-white inline-block p-4 rounded-xl shadow-md mb-4">
            <img src={qrImageUrl} alt="UPI QR Code" className="w-56 h-56 mx-auto" />
          </div>

          <p className="text-sm text-gray-500 mb-1">Scan with any UPI app</p>
          <p className="text-sm font-semibold text-gray-700 mb-6">{upiId}</p>

          <div className="bg-white border border-amber-200 rounded-xl p-4 text-left">
            <p className="text-sm font-semibold text-gray-700 mb-2">After payment:</p>
            <p className="text-sm text-gray-600">
              📲 Send your payment screenshot on WhatsApp to{' '}
              <a href="https://wa.link/1pd16b" target="_blank" className="text-amber-600 font-semibold">
                +91 95382 13100
              </a>{' '}
              to confirm your booking instantly
            </p>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-10 text-left">
          <h2 className="text-lg font-bold text-gray-800 mb-4">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</div>
              <div>
                <p className="font-medium text-gray-700">Pay the advance via UPI</p>
                <p className="text-sm text-gray-500">Scan the QR code above and complete payment</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</div>
              <div>
                <p className="font-medium text-gray-700">Send screenshot on WhatsApp</p>
                <p className="text-sm text-gray-500">Our team verifies your payment instantly</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</div>
              <div>
                <p className="font-medium text-gray-700">Booking confirmed</p>
                <p className="text-sm text-gray-500">You'll receive a confirmation email with all details</p>
              </div>
            </div>
          </div>
        </div>

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