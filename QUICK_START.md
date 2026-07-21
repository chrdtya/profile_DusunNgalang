# 🚀 Dusun Ngalang CMS - Quick Start Guide

Panduan cepat untuk mulai menggunakan CMS Dusun Ngalang.

## ⚡ 5 Menit Setup

### 1️⃣ Setup Sanity Project (2 menit)

```bash
# 1. Buka https://sanity.io dan buat project gratis
# 2. Copy Project ID (simpan)
# 3. Generate Auth Token (copy dan simpan aman)
```

### 2️⃣ Konfigurasi Environment (1 menit)

Edit file `.env.local` di root project:

```env
VITE_SANITY_PROJECT_ID=your_project_id_from_sanity
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-15
VITE_SANITY_TOKEN=your_auth_token_from_sanity
VITE_ADMIN_PASSWORD=pilih_password_anda
```

### 3️⃣ Start Dev Server (2 menit)

```bash
npm run dev
```

### 4️⃣ Akses Admin Panel

1. Buka browser: http://localhost:5173
2. Klik menu "🔐 Admin" atau buka: http://localhost:5173/#admin
3. Login dengan password yang Anda set
4. Mulai manage konten! 🎉

---

## 📊 Fitur Admin Panel

### 📖 Tentang
Kelola deskripsi tentang Dusun Ngalang dengan beberapa poin

### 🏪 UMKM
Tambah/edit UMKM lokal:
- Nama & kategori
- Deskripsi
- Alamat & kontak
- Upload foto produk

### 📅 Acara
Kelola event dan kegiatan:
- Judul & tanggal
- Kategori (Tradisi, Sosial, Nasional, dll)
- Lokasi
- List kegiatan detail

### 📰 Berita
Tulis artikel & berita:
- Judul & konten
- Upload thumbnail
- Auto metadata tanggal & penulis

### 🖼️ Galeri
Upload & kelola foto galeri:
- Judul foto
- Deskripsi (opsional)
- Grid view yang cantik

---

## 🌐 Deploy ke Vercel (Gratis!)

### Step 1: Push ke GitHub

```bash
git add .
git commit -m "Add CMS"
git push origin main
```

### Step 2: Deploy

1. Buka https://vercel.com
2. Sign in dengan GitHub
3. Click "Add New Project"
4. Pilih repo `profile_DusunNgalang`
5. Tambah environment variables (sama seperti .env.local)
6. Click "Deploy" ✅

### Step 3: Access Live

```
https://dusun-ngalang-xxx.vercel.app
https://dusun-ngalang-xxx.vercel.app/#admin
```

---

## 📚 Struktur File CMS

```
project/
├── src/
│   ├── components/
│   │   ├── AdminPanel.jsx          ← Main admin UI
│   │   ├── SanityImageUpload.jsx   ← Upload handler
│   │   └── admin/
│   │       ├── UmkmManager.jsx
│   │       ├── AcaraManager.jsx
│   │       ├── BeritaManager.jsx
│   │       ├── GaleriManager.jsx
│   │       └── TentangManager.jsx
│   ├── lib/
│   │   └── sanityClient.js         ← Sanity API client
│   └── styles/
│       └── AdminPanel.css
├── sanity/
│   ├── schemas/                     ← Content schemas
│   │   ├── umkm.js
│   │   ├── acara.js
│   │   ├── berita.js
│   │   ├── galeri.js
│   │   └── tentangDusun.js
│   └── sanity.config.js
├── .env.local                       ← Konfigurasi (jangan commit)
└── CMS_SETUP_GUIDE.md              ← Detailed guide
```

---

## 🔧 Troubleshooting Cepat

| Error | Solusi |
|-------|--------|
| "Project ID not found" | Set VITE_SANITY_PROJECT_ID di .env.local |
| "Token invalid" | Generate token baru dari Sanity dashboard |
| Images tidak muncul | Verify asset uploaded, check network tab |
| Admin page blank | Check browser console, verify token exists |

---

## 💡 Tips Berguna

✅ Admin panel terlindungi dengan password  
✅ Semua data auto-sync ke Sanity cloud  
✅ Images auto-optimize & compress  
✅ Support unlimited revisions/undo  
✅ Gratis untuk 1 juta queries/month (free tier Sanity)  

---

## 🎯 Next Steps

- [ ] Setup Sanity project
- [ ] Set environment variables
- [ ] Test admin panel lokal
- [ ] Deploy ke Vercel
- [ ] Share admin URL dengan team
- [ ] Mulai manage konten! 🚀

---

## 📞 Need Help?

- Baca **CMS_SETUP_GUIDE.md** untuk detail lengkap
- Sanity Docs: https://www.sanity.io/docs
- Vercel Docs: https://vercel.com/docs

---

**Happy Content Management! 🎉**
