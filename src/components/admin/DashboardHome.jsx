import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import {
  getDaftarUmkm,
  getDaftarAcara,
  getDaftarBerita,
  getGaleri,
  getTentangDusun,
} from '../../lib/sanityClient'

const typeMeta = {
  umkm: { label: 'UMKM', getTitle: (d) => d.name },
  acara: { label: 'Acara', getTitle: (d) => d.judul },
  berita: { label: 'Berita', getTitle: (d) => d.judul },
  galeri: { label: 'Galeri', getTitle: (d) => d.title },
  tentang: { label: 'Tentang', getTitle: (d) => d.title },
}

export default function DashboardHome({ onNavigate }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ umkm: [], acara: [], berita: [], galeri: [], tentang: [] })

  useEffect(() => {
    let mounted = true
    Promise.all([
      getDaftarUmkm().catch(() => []),
      getDaftarAcara().catch(() => []),
      getDaftarBerita().catch(() => []),
      getGaleri().catch(() => []),
      getTentangDusun().catch(() => []),
    ]).then(([umkm, acara, berita, galeri, tentang]) => {
      if (!mounted) return
      setData({ umkm: umkm || [], acara: acara || [], berita: berita || [], galeri: galeri || [], tentang: tentang || [] })
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const stats = [
    { key: 'umkm', label: 'Jumlah UMKM', count: data.umkm.length },
    { key: 'acara', label: 'Jumlah Acara', count: data.acara.length },
    { key: 'berita', label: 'Jumlah Berita', count: data.berita.length },
    { key: 'galeri', label: 'Jumlah Foto Galeri', count: data.galeri.length },
  ]

  const chartData = Object.entries(
    data.umkm.reduce((acc, item) => {
      const cat = item.category || 'Lainnya'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {})
  ).map(([category, jumlah]) => ({ category, jumlah }))

  const activity = Object.entries(data)
    .flatMap(([type, items]) =>
      items
        .filter((item) => item._id && item._createdAt)
        .map((item) => ({
          type,
          title: typeMeta[type].getTitle(item) || '(tanpa judul)',
          createdAt: item._createdAt,
          updatedAt: item._updatedAt,
        }))
    )
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)

  if (loading) {
    return (
      <div className="dashboard-skeleton">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-card"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="dashboard-home">
      <div className="dashboard-stats">
        {stats.map((stat) => (
          <button
            key={stat.key}
            className="stat-card"
            onClick={() => onNavigate(stat.key)}
          >
            <div>
              <strong>{stat.count}</strong>
              <span>{stat.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h3>Distribusi UMKM per Kategori</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--admin-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid var(--admin-border)',
                    background: 'var(--admin-card-bg)',
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="jumlah" fill="var(--admin-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="dashboard-empty">Belum ada data UMKM untuk ditampilkan.</p>
          )}
        </div>

        <div className="dashboard-panel">
          <h3>Aktivitas Terbaru</h3>
          {activity.length > 0 ? (
            <ul className="activity-feed">
              {activity.map((entry, i) => {
                const isUpdate =
                  entry.updatedAt && entry.createdAt && entry.updatedAt !== entry.createdAt
                return (
                  <li key={i}>
                    <span className={`activity-dot activity-${entry.type}`}></span>
                    <div>
                      <p>
                        <strong>{typeMeta[entry.type].label}</strong> "{entry.title}"{' '}
                        {isUpdate ? 'diperbarui' : 'ditambahkan'}
                      </p>
                      <span>{formatRelative(entry.updatedAt || entry.createdAt)}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="dashboard-empty">Belum ada aktivitas tercatat.</p>
          )}
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>Aksi Cepat</h3>
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => onNavigate('umkm')}>
            Tambah UMKM
          </button>
          <button className="quick-action-btn" onClick={() => onNavigate('acara')}>
            Tambah Acara
          </button>
          <button className="quick-action-btn" onClick={() => onNavigate('berita')}>
            Tambah Berita
          </button>
          <button className="quick-action-btn" onClick={() => onNavigate('galeri')}>
            Tambah Foto
          </button>
        </div>
      </div>
    </div>
  )
}

function formatRelative(dateStr) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 1) return 'Baru saja'
  if (diffMin < 60) return `${diffMin} menit lalu`
  const diffHour = Math.round(diffMin / 60)
  if (diffHour < 24) return `${diffHour} jam lalu`
  const diffDay = Math.round(diffHour / 24)
  if (diffDay < 30) return `${diffDay} hari lalu`
  return date.toLocaleDateString('id-ID')
}
