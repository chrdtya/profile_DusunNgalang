# 📱 Dusun Ngalang - Portal Informasi Dusun + CMS

Website resmi Dusun Ngalang dengan fitur **CMS terintegrasi** untuk manage konten (UMKM, Acara, Berita, Galeri) tanpa perlu developer.

## ✨ Fitur Utama

### 🌐 Website
- ✅ Responsive & mobile-friendly
- ✅ Info tentang Dusun
- ✅ Direktori UMKM lokal
- ✅ Calendar acara & tradisi
- ✅ Berita & artikel
- ✅ Galeri foto
- ✅ Peta lokasi

### 📊 Admin Panel CMS
- ✅ Manage UMKM (Tambah/Edit/Hapus)
- ✅ Manage Acara & Event
- ✅ Publish Berita & Artikel
- ✅ Upload Galeri Foto
- ✅ Edit Deskripsi Dusun
- ✅ Auto-sync data ke Sanity Cloud
- ✅ Terlindungi dengan password

### 🏗️ Stack Teknologi
- **Frontend:** React 19 + Vite
- **CMS:** Sanity (Headless CMS)
- **Hosting:** Vercel (Gratis)
- **Database:** Sanity Cloud (Gratis)
- **Images:** Sanity Asset Storage (Gratis)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- GitHub account
- Sanity account (gratis)
- Vercel account (gratis)

### Setup Lokal (5 menit)

```bash
# 1. Clone repo
git clone <repo-url>
cd profile_DusunNgalang

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan Sanity Project ID dan token

# 4. Start dev server
npm run dev

# 5. Akses website
# Website: http://localhost:5173
# Admin Panel: http://localhost:5173/#admin
```

### Setup Sanity Project

1. Buka https://sanity.io dan daftar (gratis)
2. Buat project baru: "Dusun Ngalang CMS"
3. Pilih dataset: "production"
4. Copy **Project ID** dan save
5. Generate **Auth Token** dengan permission "Editor"
6. Update `.env.local` dengan credentials

### Deploy ke Vercel

```bash
# 1. Push ke GitHub
git add .
git commit -m "Add CMS features"
git push origin main

# 2. Di Vercel Dashboard
# - Connect GitHub repository
# - Select project
# - Add Environment Variables (dari .env.local)
# - Deploy

# 3. Website live!
# https://dusun-ngalang-xxx.vercel.app
# https://dusun-ngalang-xxx.vercel.app/#admin
```

Lihat **QUICK_START.md** untuk setup 5 menit atau **CMS_SETUP_GUIDE.md** untuk guide lengkap.

## 📁 Struktur Project

```
profile_DusunNgalang/
├── src/
│   ├── components/
│   │   ├── AdminPanel.jsx              # Main admin UI
│   │   ├── SanityImageUpload.jsx       # Image upload handler
│   │   └── admin/
│   │       ├── UmkmManager.jsx         # Manage UMKM
│   │       ├── AcaraManager.jsx        # Manage Acara
│   │       ├── BeritaManager.jsx       # Manage Berita
│   │       ├── GaleriManager.jsx       # Manage Galeri
│   │       └── TentangManager.jsx      # Manage Tentang Dusun
│   ├── sections/
│   │   ├── SectionTentang.jsx
│   │   ├── SectionUmkm.jsx
│   │   ├── SectionAcara.jsx
│   │   ├── SectionBerita.jsx
│   │   ├── SectionGaleri.jsx
│   │   └── SectionLokasi.jsx
│   ├── lib/
│   │   └── sanityClient.js             # Sanity API client + query functions
│   ├── styles/
│   │   ├── App.css
│   │   └── AdminPanel.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── sanity/
│   ├── schemas/                        # Content type definitions
│   │   ├── umkm.js
│   │   ├── acara.js
│   │   ├── berita.js
│   │   ├── galeri.js
│   │   └── tentangDusun.js
│   ├── schemaTypes.js                  # Schema exports
│   └── sanity.config.js                # Sanity config
├── public/
│   └── (static assets)
├── .env.example                        # Environment template
├── .env.local                          # Your secrets (don't commit)
├── .gitignore
├── QUICK_START.md                      # 5-minute setup guide
├── CMS_SETUP_GUIDE.md                  # Detailed setup guide
├── package.json
├── vite.config.js
└── README.md (this file)
```

## 🎯 Menggunakan Admin Panel

### Login
1. Buka http://localhost:5173/#admin atau https://your-domain.com/#admin
2. Masukkan password (dari VITE_ADMIN_PASSWORD)
3. Klik "Login"

### Manage UMKM
- **Tambah:** Click "+ Tambah UMKM"
- **Edit:** Click "✏️ Edit" pada UMKM
- **Hapus:** Click "🗑️ Hapus" dan confirm
- **Upload Foto:** Click "📤 Pilih Gambar"

### Manage Acara
- Set tanggal event
- Pilih kategori (Tradisi, Sosial, Nasional, etc)
- Tambah detail kegiatan (satu per baris)
- Save

### Manage Berita
- Tulis judul & konten
- Auto-set tanggal publikasi
- Upload thumbnail
- Input nama penulis

### Manage Galeri
- Upload foto
- Tambah judul & deskripsi
- Grid view otomatis

### Manage Tentang Dusun
- Edit deskripsi tentang dusun
- Organize information dalam items

## 🔒 Keamanan

### Best Practices
- ✅ Set admin password yang kuat (15+ karakter)
- ✅ Jangan share .env.local atau token
- ✅ Rotate auth token berkala
- ✅ Jangan commit secrets ke GitHub
- ✅ Use HTTPS di production (automatic dengan Vercel)
- ✅ Monitor Sanity API usage

### Environment Variables
```env
# Jangan expose di frontend (public)
VITE_SANITY_TOKEN=xxx       # ⚠️ Hati-hati!

# Safe untuk public
VITE_SANITY_PROJECT_ID=xxx  # ✅ OK
VITE_SANITY_DATASET=xxx     # ✅ OK
```

## 📊 Cost Breakdown (Gratis untuk MVP!)

| Service | Tier | Cost | Details |
|---------|------|------|---------|
| Vercel | Hobby | 🆓 | Unlimited deployments, auto-scaling |
| Sanity | Free | 🆓 | 1M API queries/month, unlimited assets |
| Domain | - | $0-5/yr | Optional (dapat subdomain gratis) |
| **Total** | **MVP** | **🆓** | **100% Gratis** |

Upgrade ke tier berbayar jika traffic meningkat.

## 🧪 Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build untuk production
npm run build

# Preview build lokal
npm run preview

# Run linter
npm run lint

# (Optional) Start Sanity Studio
npm run sanity:dev
```

### Tech Stack Details
- **React 19** - Latest React with new features
- **Vite** - Lightning fast build tool
- **Sanity** - Headless CMS with real-time API
- **ESLint** - Code quality

## 🚨 Troubleshooting

### Admin Panel tidak bisa diakses
```
❌ "Cannot find AdminPanel component"
✅ Pastikan imports di App.jsx sudah benar
```

### Images tidak tampil di admin
```
❌ "Asset not found"
✅ Check Sanity dashboard → Assets
✅ Verify auth token punya permission "Editor"
```

### Build error
```
❌ "Module not found"
✅ npm install --legacy-peer-deps
✅ Clear node_modules: rm -rf node_modules && npm install --legacy-peer-deps
```

### Data tidak sync
```
❌ "API call failed"
✅ Check VITE_SANITY_PROJECT_ID dan VITE_SANITY_TOKEN
✅ Verify network connection
✅ Check Sanity dashboard status
```

## 📱 Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile: ✅ All modern browsers

## 📚 Documentation

- [QUICK_START.md](./QUICK_START.md) - Setup cepat 5 menit
- [CMS_SETUP_GUIDE.md](./CMS_SETUP_GUIDE.md) - Panduan detail lengkap
- [Sanity Docs](https://www.sanity.io/docs) - CMS documentation
- [Vercel Docs](https://vercel.com/docs) - Hosting documentation
- [React Docs](https://react.dev) - Framework documentation

## 🤝 Contributing

Untuk berkontribusi:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Project ini dibuat untuk komunitas Dusun Ngalang.

## 📞 Support & Contact

- 📧 Email: info@dusunngalang.id
- 📍 Lokasi: Dusun Ngalang, Gedangsari, Gunungkidul, DIY
- 🌐 Website: https://dusunngalang.id (when deployed)

## 🙏 Credits

- Built with React + Sanity CMS
- Hosted on Vercel
- Design inspired by community needs
- For Dusun Ngalang community development

---

## 🎉 Ready to Go!

1. ✅ Clone repo
2. ✅ Setup environment
3. ✅ npm install --legacy-peer-deps
4. ✅ npm run dev
5. ✅ Go to http://localhost:5173/#admin
6. ✅ Start managing content!

**Untuk setup detail, baca QUICK_START.md**

---

Made with ❤️ for Dusun Ngalang Community
