# ⚡ Quick Start Guide (5 Minutes)

Get **Radhika's Homecraft** running locally in under 5 minutes.

---

## 📋 Prerequisites

Make sure you have installed:
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 12+** (macOS: `brew install postgresql@15`)
- **Git** (macOS: `brew install git`)

Verify:
```bash
node --version        # Should be 18+
npm --version         # Should be 9+
psql --version        # Should be 12+
```

---

## 🚀 Step 1: Install Dependencies (1 minute)

```bash
cd /Users/ramtiwari/Final-Website
npm install
```

---

## 🗄️ Step 2: Set Up Database (2 minutes)

### Create PostgreSQL User & Database

```bash
# Start PostgreSQL
brew services start postgresql@15

# Connect to PostgreSQL
psql -U postgres

# Run these commands in PostgreSQL:
CREATE USER radhika WITH PASSWORD 'radhika123';
CREATE DATABASE radhikas_homecraft OWNER radhika;
GRANT ALL PRIVILEGES ON DATABASE radhikas_homecraft TO radhika;
\q
```

### Initialize Prisma

```bash
# Copy environment file
cp .env.example .env.local

# Add to .env.local:
DATABASE_URL="postgresql://radhika:radhika123@localhost:5432/radhikas_homecraft"

# Push schema
npm run db:push

# Seed sample data
npm run db:seed
```

---

## 🔑 Step 3: Configure Environment (1 minute)

Edit `.env.local` and add these minimum required values:

```env
# Database (from step 2)
DATABASE_URL="postgresql://radhika:radhika123@localhost:5432/radhikas_homecraft"

# NextAuth - Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"

# Google OAuth (optional for development)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (optional, uses console by default)
SMTP_FROM="noreply@radhikashomecraft.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Payment Gateways (optional for testing)
NEXT_PUBLIC_RAZORPAY_KEY="your-razorpay-key"
STRIPE_SECRET_KEY="your-stripe-key"
```

---

## 🎯 Step 4: Start Development Server (< 1 minute)

```bash
npm run dev
```

**Open:** http://localhost:3000

---

## ✅ Verify Setup

Check these pages work:
- ✅ http://localhost:3000 - Homepage
- ✅ http://localhost:3000/login - Login
- ✅ http://localhost:3000/signup - Signup
- ✅ http://localhost:3000/about - About
- ✅ http://localhost:3000/contact - Contact

---

## 🎉 You're Ready!

Your e-commerce platform is now running! 

### Next Steps:

1. **Test Features:**
   - Sign up with a test account
   - Browse products
   - Add items to cart
   - Submit contact form

2. **Customize:**
   - Edit [src/app/page.tsx](src/app/page.tsx) for homepage
   - Update [tailwind.config.ts](tailwind.config.ts) for colors
   - Modify [src/lib/constants.ts](src/lib/constants.ts) for store info

3. **Add More Features:**
   - Follow [EXTENSION_GUIDE.md](EXTENSION_GUIDE.md)
   - Reference existing APIs in [src/app/api/](src/app/api/)
   - Use existing pages as templates

4. **Deploy:**
   - See [SETUP_GUIDE.md](SETUP_GUIDE.md) for production deployment

---

## 🧪 Test Sample Data

After `npm run db:seed`, you have:

**Accounts Created:**
```
Email: admin@radhika.com
Password: Admin@123

Email: customer1@radhika.com
Password: Customer@123
```

**Sample Products:**
- 7 handcrafted items ready to browse

**Test Discount Codes:**
- `WELCOME10` - 10% off
- `FLAT500` - ₹500 off

---

## 🆘 Troubleshooting

### PostgreSQL Connection Error

```bash
# Check if PostgreSQL is running
brew services list

# Start PostgreSQL
brew services start postgresql@15

# Check connection
psql -U postgres -d radhikas_homecraft
```

### Port 3000 Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Try again
npm run dev
```

### Prisma Schema Out of Sync

```bash
# Reset database (development only!)
npm run db:push --force-reset
npm run db:seed
```

### Modules Not Found

```bash
# Clean install
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 📚 Learn More

- **Configuration:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **How to Add Features:** [EXTENSION_GUIDE.md](EXTENSION_GUIDE.md)
- **Project Overview:** [README.md](README.md)
- **Feature Status:** [FEATURES.md](FEATURES.md)
- **All Files:** [FILES_REFERENCE.md](FILES_REFERENCE.md)

---

## 🚀 Common Commands

```bash
npm run dev              # Start development
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Check code quality
npm run format           # Format code
npm run type-check       # Check TypeScript
npm run db:push          # Apply schema changes
npm run db:seed          # Add sample data
npm run db:studio        # Open Prisma Studio (visual DB editor)
npm run db:generate      # Generate Prisma client
```

---

## ⏱️ Timing Breakdown

```
Prerequisites check: 1 min
npm install: 2 mins
PostgreSQL setup: 1 min
Database init: 1 min
Environment config: 30 sec
Start dev server: 1 min
─────────────────────────
Total: ~6-7 minutes
```

---

**🎊 Congratulations! Your e-commerce platform is live!**

Start building amazing features! 🚀

---

*For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)*
