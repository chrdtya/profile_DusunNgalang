import { tentangDusun } from '../data/siteData'

export default function SectionTentang() {
  return (
    <section className="services" id="tentang-dusun">
      <div className="section-header">
        <h2>Tentang Dusun Ngalang</h2>
        <p>
          Gambaran singkat mengenai lokasi, lingkungan alam, mata pencaharian,
          serta tradisi warga Dusun Ngalang.
        </p>
      </div>
      <ul>
        {tentangDusun.map((item) => (
          <li key={item.title} className="service-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href="#" className="service-link">
              Pelajari lebih lanjut
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
