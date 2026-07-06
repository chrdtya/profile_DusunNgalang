import { daftarUmkm } from '../data/siteData'

export default function SectionUmkm() {
  return (
    <section className="umkm-section" id="umkm">
      <div className="section-header" style={{ marginBottom: '30px' }}>
        <h2>UMKM Dusun Ngalang</h2>
        <p>
          Kenali dan dukung usaha UMKM milik warga
          Dusun Ngalang.
        </p>
      </div>
      <div className="umkm-grid">
        {daftarUmkm.map((item) => (
          <article key={item.name} className="umkm-card">
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="umkm-image"
            />
            <div className="umkm-body">
              <div className="umkm-head">
                <h3>{item.name}</h3>
                <p className="umkm-category">{item.category}</p>
              </div>
              <p>{item.description}</p>
              <p className="umkm-meta">📍 {item.address}</p>
              <a className="umkm-button" href="#">
                Hubungi
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
