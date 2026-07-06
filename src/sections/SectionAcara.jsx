import { daftarAcara } from '../data/siteData'

export default function SectionAcara() {
  return (
    <section className="acara-section" id="acara">
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <h2>Acara Mendatang</h2>
        <p>Jangan lewatkan acara dan kegiatan menarik di Dusun Ngalang</p>
      </div>

      <div className="acara-grid">
        {daftarAcara.map((acara) => (
          <article key={acara.judul} className="acara-event-card">
            <div className="acara-event-header">
              <span className="acara-badge">{acara.kategori}</span>
              <span className="acara-icon" aria-hidden="true">📅</span>
            </div>
            <h3>{acara.judul}</h3>
            <div className="acara-meta">
              <span>📅 {acara.tanggal}</span>
              <span>📍 {acara.lokasi}</span>
            </div>
            <p className="acara-desc">{acara.deskripsi}</p>
            <details className="acara-details">
              <summary>Lihat kegiatan →</summary>
              <ul>
                {acara.kegiatan.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </section>
  )
}
