import { ChevronLeft, ChevronRight } from 'lucide-react'
import Modal from './Modal'

export default function Lightbox({ items, index, onClose, onNavigate }) {
  const open = index !== null && index !== undefined
  const item = open ? items[index] : null

  const goPrev = () => onNavigate((index - 1 + items.length) % items.length)
  const goNext = () => onNavigate((index + 1) % items.length)

  return (
    <Modal open={open} onClose={onClose} labelledBy="lightbox-caption">
      {item && (
        <div className="lightbox-body">
          <button
            className="lightbox-nav lightbox-prev"
            onClick={goPrev}
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft size={22} />
          </button>
          <img src={item.src} alt={item.caption} className="lightbox-image" />
          <button
            className="lightbox-nav lightbox-next"
            onClick={goNext}
            aria-label="Foto berikutnya"
          >
            <ChevronRight size={22} />
          </button>
          {item.caption && (
            <p id="lightbox-caption" className="lightbox-caption">
              {item.caption}
            </p>
          )}
        </div>
      )}
    </Modal>
  )
}
