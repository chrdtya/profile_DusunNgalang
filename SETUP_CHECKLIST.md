# 🎯 CMS Setup Checklist - Dusun Ngalang

Gunakan checklist ini untuk memastikan semuanya tersetup dengan benar.

## ✅ Phase 1: Pre-Setup (Before Installation)

- [ ] Baca README.md untuk overview
- [ ] Baca QUICK_START.md untuk preview
- [ ] Siapkan Sanity account (gratis: https://sanity.io)
- [ ] Siapkan Vercel account (gratis: https://vercel.com)
- [ ] Siapkan GitHub account & git installed locally
- [ ] Node.js v18+ terinstall (`node --version`)
- [ ] npm terinstall (`npm --version`)

## ✅ Phase 2: Sanity Project Setup (5 menit)

- [ ] Sign up di https://sanity.io
- [ ] Create project baru: "Dusun Ngalang CMS"
- [ ] Select dataset: "production"
- [ ] **Copy & save Project ID** di note/password manager
- [ ] Generate Auth Token:
  - [ ] Click "Manage" atau go to project dashboard
  - [ ] Click "API" → "Tokens"
  - [ ] Create new token dengan permission "Editor"
  - [ ] **Copy & save token** di note/password manager
  - [ ] **JANGAN share token atau commit ke GitHub!**

## ✅ Phase 3: Local Setup (10 menit)

- [ ] Clone/download project ke local
- [ ] `cd profile_DusunNgalang`
- [ ] Create `.env.local` file di root (copy dari `.env.example`)
- [ ] Edit `.env.local` dengan credentials:
  ```env
  VITE_SANITY_PROJECT_ID=your_project_id_from_above
  VITE_SANITY_DATASET=production
  VITE_SANITY_API_VERSION=2024-01-15
  VITE_SANITY_TOKEN=your_auth_token_from_above
  VITE_ADMIN_PASSWORD=your_strong_password_here
  ```
- [ ] Save `.env.local`
- [ ] Verify `.env.local` di `.gitignore` (shouldn't be committed)
- [ ] Run: `npm install --legacy-peer-deps`
- [ ] Wait untuk dependencies terinstall (~3-5 menit)
- [ ] Verify install: `npm list | grep sanity`

## ✅ Phase 4: Local Testing (15 menit)

- [ ] Run: `npm run dev`
- [ ] Wait untuk server start ("Local: http://localhost:5173")
- [ ] Open: http://localhost:5173 di browser
- [ ] Check website loads & looks good
- [ ] Click "🔐 Admin" menu atau go to http://localhost:5173/#admin
- [ ] Enter admin password (dari VITE_ADMIN_PASSWORD)
- [ ] Click "Login"
- [ ] Verify admin panel loads (should see tabs: Tentang, UMKM, Acara, Berita, Galeri)

### Test Each Manager:

#### Tentang Manager
- [ ] Click "Tentang" tab
- [ ] Click "+ Tambah Item"
- [ ] Fill in: Title & Description
- [ ] Click "💾 Simpan"
- [ ] Verify item appears in list
- [ ] Try Edit (pencil icon)
- [ ] Try Delete (trash icon)

#### UMKM Manager
- [ ] Click "UMKM" tab
- [ ] Click "+ Tambah UMKM"
- [ ] Fill in: Name, Category, Description, Address, Phone
- [ ] Click "📤 Pilih Gambar" (test upload)
- [ ] Select test image from computer
- [ ] Verify image preview shows
- [ ] Click "💾 Simpan UMKM"
- [ ] Verify UMKM appears in grid
- [ ] Try Edit & Delete

#### Acara Manager
- [ ] Click "Acara" tab
- [ ] Click "+ Tambah Acara"
- [ ] Fill in: Judul, Kategori, Tanggal, Lokasi, Deskripsi
- [ ] Add kegiatan (one per line)
- [ ] Click "💾 Simpan Acara"
- [ ] Verify appears in list
- [ ] Try Edit & Delete

#### Berita Manager
- [ ] Click "Berita" tab
- [ ] Click "+ Tambah Berita"
- [ ] Fill in: Judul, Konten
- [ ] Tanggal auto-fills (check)
- [ ] Upload thumbnail image
- [ ] Enter Penulis name
- [ ] Click "💾 Simpan Berita"
- [ ] Verify appears in list

#### Galeri Manager
- [ ] Click "Galeri" tab
- [ ] Click "+ Tambah Foto"
- [ ] Upload image
- [ ] Enter Judul Foto
- [ ] Enter Deskripsi (optional)
- [ ] Click "💾 Simpan Foto"
- [ ] Verify appears in grid
- [ ] Hover on image (should see overlay)
- [ ] Try delete

### Back to Website
- [ ] Logout from admin (click "Logout")
- [ ] You should back to website
- [ ] Check semua data yang dibuat tadi ter-fetch di website
  - [ ] UMKM section menampilkan UMKM baru
  - [ ] Acara section menampilkan event baru
  - [ ] Berita section menampilkan berita baru
  - [ ] Galeri menampilkan foto baru
  - [ ] Tentang section menampilkan info baru

### No Errors?
- [ ] Open browser console (F12)
- [ ] Check for red error messages
- [ ] If errors, screenshot & debug

## ✅ Phase 5: Verify Sanity Sync

- [ ] Go to https://sanity.io dashboard
- [ ] Select "Dusun Ngalang CMS" project
- [ ] Click "Explore" atau "Content"
- [ ] Verify all data from admin panel appears:
  - [ ] tentangDusun collection has items
  - [ ] umkm collection has items
  - [ ] acara collection has items
  - [ ] berita collection has items
  - [ ] galeri collection has items

## ✅ Phase 6: GitHub Push

- [ ] Go back to terminal
- [ ] Stop dev server (Ctrl+C)
- [ ] Run: `git status` (check what changed)
- [ ] Verify `.env.local` **NOT** in changes (should be ignored)
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Add Sanity CMS integration"`
- [ ] Run: `git push origin main` (push to GitHub)
- [ ] Verify on GitHub (new files visible, no .env.local)

## ✅ Phase 7: Vercel Deployment (15 menit)

- [ ] Go to https://vercel.com
- [ ] Sign in dengan GitHub (or create account)
- [ ] Click "Add New" → "Project"
- [ ] Search & select "profile_DusunNgalang"
- [ ] Click "Import"
- [ ] In configuration page:
  - [ ] Project Name: `dusun-ngalang`
  - [ ] Framework: React/Vite (auto-detected) ✅
  - [ ] Don't change build settings
- [ ] Scroll to "Environment Variables"
- [ ] Add these 5 variables (copy dari .env.local):
  - [ ] `VITE_SANITY_PROJECT_ID`
  - [ ] `VITE_SANITY_DATASET`
  - [ ] `VITE_SANITY_API_VERSION`
  - [ ] `VITE_SANITY_TOKEN`
  - [ ] `VITE_ADMIN_PASSWORD`
- [ ] Click "Deploy"
- [ ] Wait untuk build & deployment (5-10 menit)
- [ ] See "Congratulations! Your site is live" message

## ✅ Phase 8: Verify Live Deployment

- [ ] Get production URL dari Vercel (e.g., https://dusun-ngalang-xxx.vercel.app)
- [ ] Open URL di browser
- [ ] Website should load (sama seperti lokal)
- [ ] Click "🔐 Admin"
- [ ] Enter password
- [ ] Verify admin panel works
- [ ] Try create/edit/delete satu item
- [ ] Verify changes sync ke Sanity
- [ ] Check website homepage updated dengan data baru
- [ ] Try on mobile (responsive check)

## ✅ Phase 9: Production Setup

- [ ] Add custom domain (optional):
  - [ ] Vercel → Settings → Domains
  - [ ] Add your domain
  - [ ] Update DNS records
  - [ ] Wait untuk verification (1-24 jam)
- [ ] Setup analytics (optional):
  - [ ] Vercel → Analytics (sudah built-in)
  - [ ] Sanity → Usage dashboard
- [ ] Setup monitoring (optional):
  - [ ] Check Sanity usage regularly
  - [ ] Monitor Vercel deployments
- [ ] Backup strategy:
  - [ ] Sanity auto-backups
  - [ ] Export data periodically

## ✅ Phase 10: Team Handoff

- [ ] Document admin password securely
- [ ] Share admin URL dengan team
- [ ] Share this checklist dengan team
- [ ] Train 1-2 people di tim untuk manage content
- [ ] Create content calendar / publishing schedule
- [ ] Setup regular backup routine

## ✅ Phase 11: First Content Creation

- [ ] [ Create 3-5 UMKM entries
- [ ] [ Add upcoming events
- [ ] [ Publish first batch of news
- [ ] [ Upload gallery photos
- [ ] [ Update "Tentang Dusun" section
- [ ] [ Review all sections on live site
- [ ] [ Get feedback dari masyarakat

## 📋 Troubleshooting Checklist

### Admin Panel tidak bisa diakses lokal
- [ ] Verify npm run dev sedang jalan
- [ ] Check terminal untuk error messages
- [ ] Try: refresh browser (Ctrl+R)
- [ ] Try: hard refresh (Ctrl+Shift+R)
- [ ] Check console (F12) untuk JavaScript errors

### Images tidak upload
- [ ] Check internet connection
- [ ] Verify auth token valid (di Sanity dashboard)
- [ ] Try smaller image file (< 5MB)
- [ ] Check browser console untuk error

### Data tidak muncul di website
- [ ] Verify di Sanity dashboard (Explore tab)
- [ ] Refresh browser
- [ ] Check network tab (F12) untuk API errors
- [ ] Verify VITE_SANITY_PROJECT_ID benar

### Deployment failed
- [ ] Check Vercel deployment logs
- [ ] Verify environment variables added
- [ ] Try redeploy dari Vercel dashboard
- [ ] Check .env.local format (no spaces, correct names)

### Admin password tidak bekerja
- [ ] Check VITE_ADMIN_PASSWORD di environment
- [ ] Try clear browser cache
- [ ] Verify password di .env.local (case-sensitive)
- [ ] Check untuk typos

## 🎯 Success Criteria

Deployment **SUCCESSFUL** jika:

- ✅ Website accessible di production URL
- ✅ Admin panel accessible & login works
- ✅ Can create/edit/delete content di admin
- ✅ Changes appear on live website
- ✅ Images upload & display correctly
- ✅ No console errors
- ✅ Mobile responsive works
- ✅ Performance acceptable (< 3 sec load)
- ✅ Data persists after refresh
- ✅ Team can manage content

## 📞 Support

Jika stuck:

1. Check dokumentasi:
   - README.md
   - QUICK_START.md
   - CMS_SETUP_GUIDE.md
   - DEPLOYMENT.md

2. Common issues:
   - Sanity docs: https://www.sanity.io/docs
   - Vercel docs: https://vercel.com/docs
   - React docs: https://react.dev

3. Ask community:
   - Stack Overflow (tag: `#sanity`, `#vercel`)
   - GitHub Issues
   - Sanity Community

---

## 🎉 Checklist Complete!

Jika semua ✅, maka CMS Anda siap untuk digunakan!

**Next: Mulai manage konten & sebarkan ke masyarakat! 🚀**

---

Last updated: 2026-07-21
Difficulty: 🟩 Intermediate (technical user)
Time estimate: 1-2 hours
