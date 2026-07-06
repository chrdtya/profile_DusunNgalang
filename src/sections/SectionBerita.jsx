import { daftarBerita } from '../data/siteData'

export default function SectionBerita() {
  return (
    <section className="berita-section" id="berita">
      <div className="section-header">
        <h2>Berita Dusun</h2>
        <p>
          Update kegiatan masyarakat, program desa, serta informasi terbaru
          untuk warga dan pengunjung Dusun Ngalang.
        </p>
      </div>
      <div className="berita-grid">
        {daftarBerita.map((item) => (
          <article key={item.title} className="berita-card">
            <p className="berita-date">{item.date}</p>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
            <a href="#" className="service-link">
              Baca selengkapnya
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
