import { daftarGaleri } from '../data/siteData'

export default function SectionGaleri() {
  return (
    <section className="galeri-section" id="galeri">
      <div className="section-header">
        <h2>Galeri Dusun Ngalang</h2>
        <p>
          Dokumentasi suasana alam, aktivitas warga, dan momen budaya yang
          merepresentasikan kehidupan desa.
        </p>
      </div>
      <div className="gallery-grid">
        {daftarGaleri.map((item) => (
          <figure key={item.caption} className="gallery-item">
            <img src={item.image} alt={item.caption} loading="lazy" />
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
