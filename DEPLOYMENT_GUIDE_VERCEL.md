# 🚀 Deployment Guide: Vercel

Your **Radhika's Homecraft** website is production-ready and optimized for deployment on Vercel!

## Overview

- **Platform**: Vercel (recommended for Next.js)
- **Build Time**: ~2-3 minutes
- **Deployment**: Automatic from Git
- **Framework**: Next.js 14
- **Database**: MongoDB
- **Authentication**: NextAuth.js 4
- **Payment**: Razorpay / Stripe Integration

---

## ✅ Pre-Deployment Checklist

- [x] Production build verified (`npm run build` ✓)
- [x] All Phase 5 features compiled successfully
- [x] TypeScript strict mode passing
- [x] Environment variables configured
- [ ] Git repository initialized
- [ ] MongoDB Atlas cluster ready
- [ ] Razorpay/Stripe accounts configured
- [ ] Custom domain purchased (optional)

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Git Repository

```bash
# Initialize git if not already done
cd /Users/ramtiwari/Final-Website
git init
git add .
git commit -m "Initial commit: Phase 5 production-ready release"

# Add remote (GitHub, GitLab, or Bitbucket)
git remote add origin https://github.com/YOUR_USERNAME/radhikas-homecraft.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow interactive prompts:
# - Link to existing project or create new ✓
# - Configure project settings ✓
# - Add environment variables ✓
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub/GitLab/Bitbucket account
5. Select `radhikas-homecraft` repository
6. Configure project (auto-detected as Next.js)
7. Add environment variables (see next step)
8. Click "Deploy"

---

## 🔐 Step 3: Configure Environment Variables

### In Vercel Dashboard:

1. Navigate to: **Project Settings** → **Environment Variables**
2. Add the following variables:

#### Production Environment

```
NEXTAUTH_SECRET=<YOUR_SECRET_KEY_HERE>
NEXTAUTH_URL=https://your-domain-on-vercel.vercel.app

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/radhikas-homecraft

NEXT_PUBLIC_RAZORPAY_KEY_ID=<Your_Razorpay_Public_Key>
RAZORPAY_KEY_SECRET=<Your_Razorpay_Secret_Key>

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

#### Generating NEXTAUTH_SECRET

```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Environment Variables Details:

| Variable | Type | Description | Required |
|----------|------|-------------|----------|
| `NEXTAUTH_SECRET` | Secret | Encryption key for NextAuth sessions | ✅ Yes |
| `NEXTAUTH_URL` | URL | Your production URL (auto-set by Vercel) | ✅ Yes |
| `MONGODB_URI` | Secret | MongoDB Atlas connection string | ✅ Yes |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Secret | Razorpay public API key | Optional |
| `RAZORPAY_KEY_SECRET` | Secret | Razorpay secret API key | Optional |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | String | Stripe public key | Optional |
| `STRIPE_SECRET_KEY` | Secret | Stripe secret key | Optional |
| `NEXT_PUBLIC_SITE_URL` | URL | Your production URL | ✅ Yes |

---

## 🎯 Step 4: Set Up MongoDB Atlas

If you haven't already:

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user with username and password
4. Allow access from "0.0.0.0/0" (or Vercel IP)
5. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/radhikas-homecraft`
6. Add to Vercel environment variables as `MONGODB_URI`

---

## 💳 Step 5: Configure Payment Gateways

### Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Navigate to Settings → API Keys
3. Copy:
   - **Key ID** (Public) → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** (Private) → `RAZORPAY_KEY_SECRET`
4. Update in Vercel environment variables

### Stripe Setup (Alternative)

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Copy:
   - **Publishable Key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret Key** → `STRIPE_SECRET_KEY`
4. Update in Vercel environment variables

---

## 🚀 Step 6: Deploy

### Using Vercel CLI

```bash
# Deploy to production
vercel --prod

# View deployment URL
vercel | grep "https://"
```

### Using Vercel Dashboard

1. After adding environment variables
2. Click the **"Deploy"** button
3. Wait for build completion (~3 minutes)
4. Get your production URL: `https://radhikas-homecraft.vercel.app`

---

## ✨ Step 7: Custom Domain Setup

1. In Vercel Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `radhikashomecraft.com`)
4. Add DNS records:
   ```
   A Record: @ → 76.76.19.21
   CNAME: www → cname.vercel-dns.com
   ```
5. Verify domain ownership
6. SSL certificate auto-generated

---

## 📊 Step 8: Verify Deployment

After deployment completes:

```bash
# Check your live site
curl -I https://your-domain.vercel.app

# Verify environment variables are set
# (Don't expose secrets in logs)

# Test key features:
# ✓ Homepage loads
# ✓ Products display
# ✓ Search works
# ✓ Authentication flow
# ✓ Checkout process
# ✓ Admin dashboard access
```

### Checklist:

- [ ] Homepage loads without errors
- [ ] Images load (from public/)
- [ ] Navigation works
- [ ] Search functionality operational
- [ ] Theme toggle works (dark/light)
- [ ] Authentication login works
- [ ] Checkout accepts test payments
- [ ] Admin dashboard accessible
- [ ] Mobile responsive layout works

---

## 🔍 Monitoring & Debugging

### View Logs

```bash
# Using Vercel CLI
vercel logs

# Using Vercel Dashboard
# Project Settings → Deployments → Click deployment → Logs
```

### Monitor Performance

**Vercel Analytics Dashboard:**
- Web Vitals (LCP, FID, CLS, FCP)
- Request volume and response times
- Error tracking
- User analytics

### Error Tracking with Sentry

Already integrated! Errors auto-reported to Sentry.

---

## 🔄 Continuous Deployment

1. Push code to `main` branch:
   ```bash
   git add .
   git commit -m "Update feature XYZ"
   git push origin main
   ```

2. Vercel automatically:
   - Triggers build
   - Runs tests
   - Deploys to production
   - Updates your live site

---

## 🛠️ Troubleshooting

### Build Failures

**Error: "Cannot find MongoDB"**
- Ensure `MONGODB_URI` is set in environment variables
- Check MongoDB cluster is accessible from Vercel

**Error: "NextAuth secret missing"**
- Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Add to `NEXTAUTH_SECRET` environment variable

**Error: "Payment gateway not responding"**
- Verify Razorpay/Stripe keys in environment variables
- Check API keys are for production, not test mode

### Performance Issues

**Slow initial load?**
- Enable Vercel Edge Caching
- Check image optimization in `next.config.js`
- Reduce database queries with caching

**High serverless function duration?**
- Optimize database queries
- Add connection pooling
- Increase function timeout in `vercel.json`

---

## 📈 Production Optimization

### Enabled by Default:

- ✅ Next.js Image Optimization
- ✅ Automatic code splitting
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ Gzip compression
- ✅ HTTP/2
- ✅ Edge caching

### Additional Recommendations:

```js
// vercel.json - Already configured
{
  "regions": ["iad1"],           // US East (closest to users)
  "functions": {
    "api/**/*.ts": {
      "memory": 512,             // RAM per function
      "maxDuration": 60          // Timeout in seconds
    }
  }
}
```

---

## 🆘 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth.js Docs**: https://next-auth.js.org
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

## 📞 Post-Deployment Checklist

After going live:

- [ ] Domain connected and SSL working
- [ ] All pages load without errors
- [ ] Admin can create/edit products
- [ ] Users can complete checkout
- [ ] Email notifications sending (if configured)
- [ ] Analytics tracking events
- [ ] Backups configured (MongoDB)
- [ ] Monitoring alerts set up (Sentry)
- [ ] Team members have access
- [ ] Documentation updated

---

## 🎉 You're Live!

Congratulations! Your e-commerce store is now live on Vercel.

**Production URL**: `https://your-domain.vercel.app`

Monitor performance and make updates as needed. Each git push to `main` automatically deploys new changes.

---

*Last Updated: February 2026*
*Platform: Vercel (Next.js 14)*
*Status: ✅ Production Ready*
