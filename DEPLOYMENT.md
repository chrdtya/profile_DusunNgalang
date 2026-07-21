# Vercel Deployment Checklist

Panduan step-by-step untuk deploy Dusun Ngalang CMS ke Vercel (100% Gratis).

## ✅ Pre-Deployment Checklist

### Code Ready
- [ ] Semua files sudah di-commit
- [ ] Tidak ada uncommitted changes
- [ ] `.env.local` tidak di-commit (di .gitignore)
- [ ] Build lokal berjalan: `npm run build`

### Sanity Setup
- [ ] Sanity project sudah dibuat di sanity.io
- [ ] Project ID dicatat
- [ ] Auth token sudah di-generate (permission: "Editor")
- [ ] Token disimpan aman (simpan di note/password manager)

### GitHub Setup
- [ ] Code sudah di-push ke GitHub
- [ ] Repository public atau invited Vercel
- [ ] Branch main adalah default

## 🚀 Step-by-Step Deployment

### Step 1: Prepare GitHub

```bash
# Ensure all changes are committed
git status

# Jika ada changes, commit dulu:
git add .
git commit -m "Add Sanity CMS integration"

# Push ke GitHub
git push origin main
```

### Step 2: Sign Up Vercel

1. Buka https://vercel.com
2. Click "Sign Up"
3. Pilih "Continue with GitHub"
4. Authorize Vercel
5. Set username/email

### Step 3: Create Vercel Project

1. Setelah login, click "Add New..."
2. Select "Project"
3. Click "Continue with GitHub"
4. Search untuk `profile_DusunNgalang` repository
5. Click "Import"

### Step 4: Configure Project

Di halaman konfigurasi Vercel:

1. **Project Name:** `dusun-ngalang` (atau nama lain)
2. **Framework Preset:** Auto-detected (React/Vite) ✅
3. **Root Directory:** ./
4. **Build Command:** Auto-filled ✅
5. **Output Directory:** Auto-filled (dist) ✅

### Step 5: Add Environment Variables

Ini bagian PENTING! Click "Environment Variables"

Tambahkan 4 variables berikut:

| Name | Value | Example |
|------|-------|---------|
| VITE_SANITY_PROJECT_ID | Your Project ID | `abc123def456` |
| VITE_SANITY_DATASET | `production` | `production` |
| VITE_SANITY_API_VERSION | `2024-01-15` | `2024-01-15` |
| VITE_SANITY_TOKEN | Your Auth Token | `sanity_abc...` |
| VITE_ADMIN_PASSWORD | Pilih password kuat | `YourSecurePassword123!` |

**⚠️ JANGAN SHARE ATAU COMMIT TOKEN!**

### Step 6: Deploy

1. Click "Deploy"
2. Tunggu proses build (~3-5 menit)
3. Tunggu deployment selesai
4. Lihat "Congratulations! Your site is live! 🎉"

### Step 7: Verify Deployment

Setelah deployment selesai:

1. **Website:** https://dusun-ngalang-xxx.vercel.app
2. **Admin Panel:** https://dusun-ngalang-xxx.vercel.app/#admin
3. Login dengan VITE_ADMIN_PASSWORD
4. Test manage content (UMKM, Acara, etc)

## 🔄 Updating After Deployment

Jika ada code changes:

```bash
# 1. Make changes locally
# ... edit files ...

# 2. Test locally
npm run dev

# 3. Commit dan push
git add .
git commit -m "Update CMS features"
git push origin main

# 4. Vercel auto-deploy! 🚀
# Check: https://vercel.com/dashboard untuk status
```

Vercel akan auto-deploy ketika code di-push ke main branch.

## 📊 Monitoring Deployment

### Vercel Dashboard
1. Buka https://vercel.com/dashboard
2. Select project "dusun-ngalang"
3. Monitor:
   - **Deployments** - Riwayat deploys
   - **Analytics** - Traffic & performance
   - **Settings** - Edit configuration

### Sanity Dashboard
1. Buka https://sanity.io
2. Select project "Dusun Ngalang CMS"
3. Monitor:
   - **Usage** - API queries & bandwidth
   - **Assets** - Storage usage
   - **Logs** - API activity

## 🆘 Troubleshooting Deployment

### Build fails
```
❌ Error: "Module not found"
✅ Solution:
  1. Check npm install lokal: npm install --legacy-peer-deps
  2. Verify .gitignore tidak exclude files penting
  3. Redeploy dari Vercel dashboard
```

### Environment variables not working
```
❌ Error: "Project ID undefined"
✅ Solution:
  1. Check di Vercel → Settings → Environment Variables
  2. Verify exact variable names (case-sensitive!)
  3. Redeploy: Vercel → Deployments → ... → Redeploy
```

### Admin panel shows "Cannot fetch data"
```
❌ Error: "Token invalid" atau "API error"
✅ Solution:
  1. Verify VITE_SANITY_TOKEN di Vercel
  2. Check token masih valid di Sanity dashboard
  3. Generate token baru jika needed
  4. Update environment variable
  5. Redeploy
```

### Images not loading
```
❌ Error: "404 Not Found" pada images
✅ Solution:
  1. Check images uploaded di Sanity
  2. Verify Sanity assets storage active
  3. Check Sanity API token permissions
  4. Redeploy
```

## 🔒 Security Checklist

After deployment, verify:

- [ ] Admin password set (tidak default)
- [ ] Token tidak di-expose di GitHub
- [ ] Environment variables set di Vercel
- [ ] HTTPS enabled (automatic ✅)
- [ ] CORS properly configured (default ✅)
- [ ] API rate limiting active (Sanity free tier)

## 📈 Next Steps

1. ✅ Deployment live
2. ✅ Add domain name (optional)
3. ✅ Setup custom email (optional)
4. ✅ Configure analytics
5. ✅ Backup data strategy
6. ✅ Monitor usage & scale

### Custom Domain (Optional)

1. Di Vercel → Project → Settings → Domains
2. Add custom domain
3. Update DNS records (3-24 jam untuk propagate)
4. Verify di Vercel dashboard

### Analytics (Optional)

1. Vercel: Built-in analytics
2. Sanity: Usage dashboard
3. Optional: Add Google Analytics jika perlu

## 💰 Cost Management

### Free Tier Limits
- **Vercel:** Unlimited bandwidth, 100 Serverless Functions
- **Sanity:** 1M API queries/month, unlimited assets

### Usage Tips
- Monitor API queries di Sanity dashboard
- Optimize queries dengan caching
- Upgrade jika perlu (pay-as-you-go)

## 📞 Support

- **Vercel Help:** https://vercel.com/help
- **Sanity Support:** https://www.sanity.io/docs
- **Community:** Stack Overflow dengan tag `#vercel` `#sanity`

## ✨ Success Checklist

- [ ] Website accessible di production URL
- [ ] Admin panel working & login successful
- [ ] Can create/edit content
- [ ] Images upload correctly
- [ ] Data persists in Sanity
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable

---

**Congratulations! Your CMS is live! 🎉**

Ready to manage content for Dusun Ngalang!
