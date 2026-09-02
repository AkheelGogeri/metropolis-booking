import { useState, useEffect, useRef } from 'react'

const SLIDE_INTERVAL_MS = 4000

function Lightbox({ images, index, onClose, onNavigate }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [index, images.length, onClose, onNavigate])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4"
      onClick={onClose}>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-amber-400 transition">
        ×
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + images.length) % images.length) }}
          aria-label="Previous photo"
          className="absolute left-2 sm:left-6 text-white text-4xl leading-none hover:text-amber-400 transition px-2">
          ‹
        </button>
      )}

      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-full object-contain rounded-lg" />

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % images.length) }}
          aria-label="Next photo"
          className="absolute right-2 sm:right-6 text-white text-4xl leading-none hover:text-amber-400 transition px-2">
          ›
        </button>
      )}
    </div>
  )
}

function VenueGallery({ images, alt, className = 'w-full h-full' }) {
  const list = Array.isArray(images) ? images.filter(Boolean) : []
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (list.length < 2) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % list.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [list.length])

  if (list.length === 0) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-400 text-sm">No photo yet</span>
      </div>
    )
  }

  return (
    <>
      <div className={`${className} relative overflow-hidden group cursor-zoom-in`}
        onClick={() => setLightboxOpen(true)}>
        <img
          src={list[index]}
          alt={alt}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />

        {list.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + list.length) % list.length) }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none transition">
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % list.length) }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-7 h-7 rounded-full flex items-center justify-center text-lg leading-none transition">
              ›
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i) }}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition ${i === index ? 'bg-white w-4' : 'bg-white/60'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={list}
          index={index}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setIndex} />
      )}
    </>
  )
}

export default VenueGallery
