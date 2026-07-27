import {
  MapPin,
  Mountain,
  Landmark,
  Wheat,
  Users,
  GraduationCap,
  Store,
  Camera,
  ArrowRight,
} from 'lucide-react'
import Reveal, { RevealItem } from '../components/motion/Reveal'

const fiturDesa = [
  {
    icon: MapPin,
    title: 'Lokasi',
    description:
      'Berada di Kapanewon Gedangsari, Kabupaten Gunungkidul — mudah dijangkau dengan titik orientasi Balai Desa Ngalang.',
    href: '#lokasi',
  },
  {
    icon: Mountain,
    title: 'Alam',
    description:
      'Dikelilingi perbukitan karst khas Gunungkidul dan hamparan lahan pertanian yang tenang dan asri.',
    href: '#galeri',
  },
  {
    icon: Landmark,
    title: 'Budaya',
    description:
      'Tradisi tahunan seperti Rasulan dan Nyadran masih dijaga sebagai wujud syukur dan kebersamaan warga.',
    href: '#acara',
  },
  {
    icon: Wheat,
    title: 'Pertanian',
    description:
      'Sebagian besar warga bermata pencaharian sebagai petani dan peternak, menopang ekonomi rumah tangga dusun.',
    href: '#tentang-dusun',
  },
  {
    icon: Users,
    title: 'Komunitas',
    description:
      'Semangat gotong royong tinggi — dari kerja bakti lingkungan hingga kegiatan bersama lintas RT dan generasi.',
    href: '#acara',
  },
  {
    icon: GraduationCap,
    title: 'Pendidikan',
    description:
      'Fasilitas pendidikan dasar tersedia di sekitar dusun untuk mendukung tumbuh kembang generasi muda.',
    href: '#tentang-dusun',
  },
  {
    icon: Store,
    title: 'UMKM',
    description:
      'Usaha kuliner, kerajinan, hingga jasa milik warga terus tumbuh dan bisa dijelajahi langsung di portal ini.',
    href: '#umkm',
  },
  {
    icon: Camera,
    title: 'Wisata',
    description:
      'Panorama alam dan kekayaan budaya menjadikan Ngalang berpotensi sebagai tujuan wisata berbasis komunitas.',
    href: '#galeri',
  },
]

export default function SectionFiturDesa() {
  return (
    <section className="fitur-section">
      <Reveal className="section-header">
        <span className="section-kicker">Jelajahi Desa</span>
        <h2>Delapan Wajah Dusun Ngalang</h2>
        <p>
          Setiap sisi kehidupan dusun — dari alam hingga ekonomi warga — dirangkum
          dalam kartu berikut. Klik untuk menjelajah lebih dalam.
        </p>
      </Reveal>

      <Reveal className="fitur-grid" y={20}>
        {fiturDesa.map((fitur, index) => {
          const Icon = fitur.icon
          return (
            <RevealItem key={fitur.title} delay={Math.min(index, 6) * 0.05} className="fitur-card-wrap">
              <a href={fitur.href} className="fitur-card">
                <span className="fitur-card-glow" aria-hidden="true"></span>
                <span className="fitur-card-icon">
                  <Icon size={24} strokeWidth={2} />
                </span>
                <h3>{fitur.title}</h3>
                <p>{fitur.description}</p>
                <span className="fitur-card-link">
                  Baca Selengkapnya <ArrowRight size={14} />
                </span>
              </a>
            </RevealItem>
          )
        })}
      </Reveal>
    </section>
  )
}
