import { useState } from 'react'
import { Landmark, Wheat, Users, Store, Camera } from 'lucide-react'
import Reveal from '../components/motion/Reveal'
import { useSanityData } from '../hooks/useSanityData'
import { getDaftarUmkm, getDaftarAcara } from '../lib/sanityClient'
import { daftarUmkm, daftarAcara, profilDesaStats } from '../data/siteData'

const CENTER = { x: 200, y: 200 }

export default function SectionOverview() {
  const umkmList = useSanityData(getDaftarUmkm, daftarUmkm)
  const acaraList = useSanityData(getDaftarAcara, daftarAcara)
  const penduduk = profilDesaStats.find((s) => s.label === 'Jumlah Penduduk')

  const nodes = [
    { key: 'budaya', label: 'Budaya', icon: Landmark, x: 200, y: 50, stat: `${acaraList.length}+ tradisi & acara` },
    { key: 'penduduk', label: 'Penduduk', icon: Users, x: 342.65, y: 153.65, stat: `${penduduk?.value ?? '—'} jiwa` },
    { key: 'umkm', label: 'UMKM', icon: Store, x: 288.2, y: 321.35, stat: `${umkmList.length}+ usaha warga` },
    { key: 'pertanian', label: 'Pertanian', icon: Wheat, x: 111.8, y: 321.35, stat: 'Mayoritas mata pencaharian' },
    { key: 'wisata', label: 'Wisata', icon: Camera, x: 57.35, y: 153.65, stat: 'Alam & budaya lokal' },
  ]

  const [hovered, setHovered] = useState(null)

  return (
    <section className="overview-section">
      <Reveal className="section-header">
        <span className="section-kicker">Ikhtisar Desa</span>
        <h2>Ikhtisar Interaktif Dusun Ngalang</h2>
        <p>Arahkan kursor ke setiap kategori untuk melihat keterhubungannya dengan dusun.</p>
      </Reveal>

      <Reveal className="overview-layout" y={20}>
        <ul className="overview-list">
          {nodes.map((node) => {
            const Icon = node.icon
            const active = hovered === node.key
            return (
              <li key={node.key}>
                <button
                  type="button"
                  className={`overview-list-item${active ? ' active' : ''}`}
                  onMouseEnter={() => setHovered(node.key)}
                  onFocus={() => setHovered(node.key)}
                  onMouseLeave={() => setHovered(null)}
                  onBlur={() => setHovered(null)}
                >
                  <span className="overview-list-icon">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <span>
                    <strong>{node.label}</strong>
                    <em>{node.stat}</em>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="overview-diagram">
          <svg viewBox="0 0 400 400" className="overview-svg">
            {nodes.map((node) => (
              <line
                key={node.key}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={node.x}
                y2={node.y}
                className={`overview-line${hovered === node.key ? ' active' : ''}`}
              />
            ))}
            <circle cx={CENTER.x} cy={CENTER.y} r="46" className="overview-hub" />
            <text x={CENTER.x} y={CENTER.y - 4} textAnchor="middle" className="overview-hub-text">
              Padukuhan
            </text>
            <text x={CENTER.x} y={CENTER.y + 16} textAnchor="middle" className="overview-hub-text">
              Ngalang
            </text>

            {nodes.map((node) => (
              <g
                key={node.key}
                transform={`translate(${node.x}, ${node.y})`}
                className={`overview-node${hovered === node.key ? ' active' : ''}`}
                onMouseEnter={() => setHovered(node.key)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle r="30" className="overview-node-circle" />
              </g>
            ))}
          </svg>
          {nodes.map((node) => {
            const Icon = node.icon
            return (
              <div
                key={node.key}
                className={`overview-node-icon${hovered === node.key ? ' active' : ''}`}
                style={{ left: `${(node.x / 400) * 100}%`, top: `${(node.y / 400) * 100}%` }}
              >
                <Icon size={18} strokeWidth={2.2} />
              </div>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}
