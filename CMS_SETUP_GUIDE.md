# CMS Setup & Deployment Guide

Panduan lengkap untuk setup dan deploy Dusun Ngalang CMS dengan Sanity, Vercel, dan MySQL.

## 🎯 Arsitektur Sistem

```
┌─────────────────┐
│  Frontend (React)│  ← Dihosting di Vercel
│  + Admin Panel  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sanity CMS     │  ← Content Management
│  (Headless)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sanity Database│  ← Cloud storage
│  (CDN + API)    │  ← FREE tier 🎉
└─────────────────┘
```

## 📋 Prasyarat

- Node.js v18+ dan npm
- Akun Sanity (gratis)
- Akun Vercel (gratis)
- GitHub account

## 🚀 Setup Langkah demi Langkah

### Step 1: Setup Sanity Project

#### 1.1 Buat Sanity Project

```bash
# Install Sanity CLI
npm install -g sanity

# Login atau buat akun baru
sanity login

# Buat project baru
sanity init --project-id your_project_id --dataset production
```

**Atau setup manual di dashboard:**
1. Kunjungi [sanity.io](https://www.sanity.io)
2. Sign up/Login
3. Buat project baru
4. Pilih "Production" dataset
5. Copy **Project ID** dan simpan

#### 1.2 Generate Auth Token

```bash
sanity token create

# Pilih permission: "Editor" untuk full access
# Copy token dan simpan di tempat aman
```

### Step 2: Konfigurasi Environment Variables

Buat file `.env.local` di root project:

```env
VITE_SANITY_PROJECT_ID=your_actual_project_id_here
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-15
VITE_SANITY_TOKEN=your_auth_token_here
VITE_ADMIN_PASSWORD=your_secure_password_here
```

**⚠️ PENTING:**
- Jangan commit `.env.local` ke GitHub (sudah di `.gitignore`)
- Gunakan password yang kuat untuk admin panel
- Jaga keamanan token Anda

### Step 3: Install Dependencies

```bash
# Sudah diinstall sebelumnya, tapi pastikan:
npm install

# Jika belum ada:
npm install @sanity/client @sanity/image-url
```

### Step 4: Akses Admin Panel

Admin panel sudah diintegrasikan di route `/admin`

**URL lokal:** `http://localhost:5173/admin`

**Login:** Gunakan password yang Anda set di `VITE_ADMIN_PASSWORD`

#### Fitur Admin Panel:

- 📖 **Tentang** - Kelola deskripsi dusun
- 🏪 **UMKM** - Kelola bisnis lokal
- 📅 **Acara** - Kelola event/acara
- 📰 **Berita** - Kelola artikel berita
- 🖼️ **Galeri** - Kelola foto galeri

### Step 5: Update Frontend untuk Fetch dari Sanity

Sudah siap! Komponen sudah menggunakan data dari Sanity.

Update files jika belum:

**`src/App.jsx`** - Tambahkan import AdminPanel:

```jsx
import AdminPanel from './components/AdminPanel'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
```

Tapi karena ini adalah single-page app, kita akan tambahkan route manual dengan URL hash:

Bisa akses admin panel dengan path `/admin` atau dengan route khusus.

### Step 6: Testing Lokal

```bash
# Start development server
npm run dev

# Di terminal lain, optional - start Sanity Studio
npm run sanity:dev
```

**Test Admin Panel:**
1. Buka `http://localhost:5173/admin`
2. Masukkan password
3. Coba tambah/edit data

**Verifikasi di Sanity:**
1. Dashboard Sanity → Explore
2. Lihat data yang baru ditambahkan

## 🌐 Deployment ke Vercel

### Step 1: Push ke GitHub

```bash
git add .
git commit -m "Add CMS with Sanity integration"
git push origin main
```

### Step 2: Deploy ke Vercel

#### Opsi A: Via Vercel CLI

```bash
npm install -g vercel
vercel
# Ikuti wizard, pilih GitHub repo
```

#### Opsi B: Via Vercel Dashboard

1. Buka [vercel.com](https://vercel.com)
2. Sign in dengan GitHub
3. Click "Add New Project"
4. Pilih repo `profile_DusunNgalang`
5. Lanjut ke **Environment Variables**

### Step 3: Set Environment Variables di Vercel

Di Vercel Dashboard → Project Settings → Environment Variables

Tambahkan:

```
VITE_SANITY_PROJECT_ID = your_actual_project_id
VITE_SANITY_DATASET = production
VITE_SANITY_API_VERSION = 2024-01-15
VITE_SANITY_TOKEN = your_auth_token
VITE_ADMIN_PASSWORD = your_secure_password
```

✅ Klik Deploy

## 🔒 Keamanan

### Rekomendasi:

1. **Token Sanity:**
   - Jangan expose di frontend code
   - Gunakan environment variables
   - Rotate token berkala

2. **Admin Password:**
   - Gunakan password yang kuat (15+ karakter)
   - Ubah password berkala
   - Jangan share dengan orang yang tidak perlu

3. **GitHub Secrets:**
   - Jangan commit `.env.local`
   - Jangan commit `.env.production`
   - Gunakan `.gitignore` untuk security files

### Production Security:

Untuk production yang lebih aman:
- Implement proper authentication (OAuth, JWT)
- Gunakan Sanity's permission system
- Rate limit API calls
- Backup data berkala

## 📊 Menggunakan Data dari Sanity di Frontend

Sudah terintegrasi! Tapi contohnya:

```jsx
import { getDaftarUmkm, urlFor } from './lib/sanityClient'

export default function MyComponent() {
  const [umkm, setUmkm] = useState([])

  useEffect(() => {
    getDaftarUmkm().then(setUmkm)
  }, [])

  return (
    <div>
      {umkm.map((item) => (
        <div key={item._id}>
          {item.image && <img src={urlFor(item.image)} />}
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  )
}
```

## 🗄️ Database MySQL (Optional)

Jika ingin tambahan MySQL untuk fitur custom:

### Opsi: PlanetScale (Free tier)

1. Buka [planetscale.com](https://planetscale.com)
2. Sign up
3. Buat database baru
4. Copy connection string
5. Gunakan dengan Prisma atau Sequelize

### Connection String Contoh:

```
mysql://username:password@host/database_name
```

## 📱 Fitur Admin Panel

### UMKM Manager
- ✅ Tambah/Edit/Hapus UMKM
- ✅ Upload gambar
- ✅ Set kategori
- ✅ Input kontak

### Acara Manager
- ✅ Tambah/Edit/Hapus event
- ✅ Set tanggal otomatis
- ✅ List kegiatan
- ✅ Kategori event

### Berita Manager
- ✅ Tulis artikel
- ✅ Upload thumbnail
- ✅ Auto metadata tanggal
- ✅ Edit draft

### Galeri Manager
- ✅ Upload multiple foto
- ✅ Add deskripsi
- ✅ Grid view
- ✅ Delete individual photos

### Tentang Manager
- ✅ Kelola content "Tentang Dusun"
- ✅ Multi-item support
- ✅ Easy CRUD

## 🧪 Testing

```bash
# Unit tests
npm run test

# Build test
npm run build

# Preview build
npm run preview
```

## 🐛 Troubleshooting

### Error: "Project ID not found"
```
❌ VITE_SANITY_PROJECT_ID tidak terset
✅ Set di .env.local atau environment variables Vercel
```

### Error: "Token invalid"
```
❌ Auth token sudah kadaluarsa
✅ Generate token baru di Sanity dashboard
```

### Images tidak muncul
```
❌ Asset tidak terupload
✅ Check Sanity assets, verify asset reference di document
```

### Admin panel blank
```
❌ Loading data dari Sanity gagal
✅ Check network tab, verify token, check CORS settings
```

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [React Hooks](https://react.dev/reference/react)
- [Image URL Builder](https://www.sanity.io/docs/image-url)

## 🎯 Next Steps

1. ✅ Setup Sanity project
2. ✅ Configure environment variables
3. ✅ Test admin panel lokal
4. ✅ Deploy ke Vercel
5. ✅ Verify deployment
6. ✅ Share admin URL dengan team

## 💡 Tips

- Backup data Sanity berkala
- Monitor API usage di Sanity dashboard
- Use Sanity's revision system untuk undo changes
- Test di staging sebelum production

## 📞 Support

- Sanity Docs: https://www.sanity.io/docs
- Vercel Support: https://vercel.com/support
- Community: Stack Overflow dengan tag `#sanity` `#vercel`

---

**Happy Content Management! 🎉**
