# Radhika's Homecraft - E-commerce Website

A production-ready full-stack e-commerce website for an authentic Indian handicrafts and home decor store, built with modern technologies.

**Tagline:** "Artistry Unleashed - Experience the soul of tradition woven into every print"

## 📋 Project Overview

Radhika's Homecraft is a complete e-commerce solution featuring:
- Handcrafted textiles and block print bedsheets
- Traditional rugs and home decor items
- Artisan-made products from Jaipur, Rajasthan
- Multi-payment gateway support (Razorpay, Stripe, COD)
- Complete admin dashboard for inventory management
- User authentication with NextAuth.js
- Advanced filtering and search capabilities

## 🛠️ Technology Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components
- **React Hook Form** - Efficient form handling
- **Framer Motion** - Smooth animations
- **Next Image API** - Optimized image delivery

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database access and migrations
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication and authorization

### Payments
- **Razorpay** - Primary for Indian customers (UPI, Cards, Net Banking)
- **Stripe** - International card payments
- **Cash on Delivery** - Traditional payment option

### Infrastructure
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **Zod** - Runtime schema validation
- **React Hot Toast** - Toast notifications
- **ESLint + Prettier** - Code quality and formatting
- **Husky** - Git hooks for pre-commit checks

## 📁 Project Structure

```
radhikas-homecraft/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── reset-password/
│   │   ├── (shop)/              # Shopping pages
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── products/
│   │   │   └── search/
│   │   ├── (user)/              # User dashboard
│   │   │   └── dashboard/
│   │   ├── admin/               # Admin routes
│   │   ├── api/                 # API routes
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable components
│   │   ├── layout/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── admin/
│   │   └── ui/
│   ├── hooks/                   # Custom React hooks
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   └── useAuth.ts
│   ├── lib/                     # Utility functions
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── prisma.ts            # Prisma client
│   │   ├── mailer.ts            # Email service
│   │   ├── utils.ts             # Helper functions
│   │   ├── validations.ts       # Zod schemas
│   │   └── constants.ts         # App constants
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   └── middleware.ts            # Next.js middleware
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding
├── public/                      # Static assets
├── .env.example                 # Environment template
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd radhikas-homecraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required values in `.env.local`:
   - Database URL
   - NextAuth credentials
   - OAuth credentials (Google, Facebook)
   - Payment gateway keys (Razorpay, Stripe)
   - Email service credentials

4. **Set up database**
   ```bash
   # Push Prisma schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Core Models
- **User** - Customer accounts with authentication
- **Product** - Store products with variants
- **Category** - Product categories
- **Order** - Customer orders
- **OrderItem** - Individual items in orders
- **Cart** - User shopping cart
- **CartItem** - Items in cart
- **Review** - Product reviews and ratings
- **Wishlist** - Saved products
- **Address** - Shipping addresses
- **DiscountCode** - Promotional codes
- **Newsletter** - Newsletter subscriptions
- **ContactMessage** - Contact form submissions

## 🔐 Authentication

### Supported Methods
1. **Email/Password** - Traditional signup and login
2. **Google OAuth** - Sign in with Google account
3. **Facebook OAuth** - Sign in with Facebook account

### Features
- Password hashing with bcrypt
- JWT-based sessions
- Email verification (optional)
- Password reset functionality
- Role-based access control (USER, ADMIN)

## 💳 Payment Integration

### Razorpay (Primary for India)
- Support for:
  - UPI
  - Credit/Debit Cards
  - Net Banking
  - Digital Wallets
  
- Features:
  - Webhook handling
  - Order verification
  - Refund processing

### Stripe
- Support for:
  - Credit/Debit Cards
  - Apple Pay
  - Google Pay

### Cash on Delivery
- Manual order confirmation
- Payment on delivery

## 📧 Email Notifications

### Configured Emails
- Order confirmation
- Shipping updates
- Delivery notification
- Password reset
- Newsletter

### Email Providers
- Resend (recommended)
- SMTP (Gmail, custom servers)

## 🛍️ Shopping Features

### Product Discovery
- Full-text search
- Multi-criteria filtering:
  - Category
  - Price range
  - Color
  - Material
  - Availability
- Sort options:
  - Newest arrivals
  - Price (low to high, high to low)
  - Popularity

### Shopping Cart
- Add/remove products
- Update quantities
- Apply discount codes
- Persistent cart (localStorage + database)
- Real-time total calculation

### Checkout Process
1. Cart review
2. Shipping address
3. Billing address (optional)
4. Payment method selection
5. Order confirmation

## 👤 User Dashboard

### Features
- Order history
- Order tracking
- Saved addresses
- Wishlist management
- Profile settings
- Password management

## 🔧 Admin Panel

### Dashboard
- Sales analytics
- Order statistics
- customer metrics
- Inventory overview

### Product Management
- Create/edit/delete products
- Bulk upload (CSV)
- Category management
- Image management
- Inventory tracking

### Order Management
- View all orders
- Update order status
- Generate invoices
- Track shipments

### Customer Management
- View customers
- Order history
- Communication history

### Discount Codes
- Create promotional codes
- Set validity dates
- Usage limits
- Percentage or fixed amount discounts

## 📱 Responsive Design

- Mobile-first approach
- Fully responsive from 320px to 4K
- Touch-friendly interactions
- Bottom navigation for mobile
- Fast loading on slow networks

## ⚡ Performance Optimization

### Image Optimization
- Next.js Image component
- Multiple formats (WebP, AVIF)
- Lazy loading
- Responsive images

### Code Optimization
- Code splitting
- Dynamic imports
- Tree shaking
- Bundle analysis

### Caching Strategy
- Server-side caching
- Client-side caching
- API response caching

### SEO Optimization
- Meta tags management
- Open Graph tags
- XML sitemap
- Schema.org structured data
- Robots.txt

## 📈 Analytics

### Integrated Services
- Google Analytics 4
- Facebook Pixel
- Conversion tracking
- Abandoned cart tracking

## 🔒 Security

### Implemented Measures
- CSRF protection
- Rate limiting on APIs
- Input sanitization
- Password hashing (bcrypt)
- Secure HTTP headers
- Environment variables for secrets
- SQL injection prevention via Prisma

## 🧪 Testing

### Tools
- Jest
- React Testing Library

### Test Coverage
- Unit tests for utilities
- Component tests
- API route tests
- Integration tests

## 📝 API Documentation

### Authentication Endpoints
```
POST   /api/auth/signup           - Register new user
POST   /api/auth/[...nextauth]    - NextAuth handler
GET    /api/user/me               - Get current user
```

### Product Endpoints
```
GET    /api/products              - Get products with filters
GET    /api/products/[id]         - Get single product
GET    /api/categories            - Get all categories
```

### Cart Endpoints
```
GET    /api/cart                  - Get cart
POST   /api/cart                  - Add to cart
PUT    /api/cart/[id]             - Update cart item
DELETE /api/cart/[id]             - Remove from cart
```

### Order Endpoints
```
POST   /api/checkout              - Create order
GET    /api/user/orders           - Get user orders
GET    /api/user/orders/[id]      - Get order details
```

### Admin Endpoints
```
GET    /api/admin/dashboard       - Dashboard stats
GET    /api/admin/products        - Get all products
POST   /api/admin/products        - Create product
PUT    /api/admin/products/[id]   - Update product
DELETE /api/admin/products/[id]   - Delete product
```

## 🎨 Design System

### Color Palette
- **Primary:** Warm terracotta (#D4736E)
- **Secondary:** Sage green (#9CAFA3)
- **Accent:** Deep burgundy (#8B1A1A)
- **Neutral:** Cream/beige (#F5F1E8)
- **Text:** Dark brown (#3E2723)

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Source Sans Pro (sans-serif)

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Database
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio

# Other
npm run type-check   # TypeScript type checking
```

## 🌍 Environment Variables

See `.env.example` for all required variables:

```
DATABASE_URL              # PostgreSQL connection string
NEXTAUTH_URL             # NextAuth app URL
NEXTAUTH_SECRET          # NextAuth secret key
GOOGLE_CLIENT_ID         # Google OAuth
GOOGLE_CLIENT_SECRET     # Google OAuth
RAZORPAY_KEY_ID          # Razorpay API key
RAZORPAY_KEY_SECRET      # Razorpay secret
SMTP_HOST               # Email service
SMTP_PORT               # Email service port
SMTP_USER               # Email username
SMTP_PASSWORD           # Email password
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- AWS Amplify
- Railway
- Render
- Digital Ocean

## 📚 Documentation

### Getting Started
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)

### API References
- [Razorpay API](https://razorpay.com/docs)
- [Stripe API](https://stripe.com/docs)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email: support@radhikashomecraft.com

## 🎯 Future Enhancements

- [ ] Multi-language support (Hindi, English)
- [ ] Advanced inventory management
- [ ] Loyalty points system
- [ ] Live chat integration
- [ ] Blog section
- [ ] AR product preview
- [ ] Subscription boxes
- [ ] Vendor portal
- [ ] Mobile app (React Native)
- [ ] Merchandise recommendation AI

## ✨ Team

**Radhika's Homecraft Development Team**
- Full-stack development
- Quality assurance
- Product management

---

**Last Updated:** February 8, 2026

**Version:** 1.0.0

For more information, visit [www.radhikashomecraft.com](https://www.radhikashomecraft.com)
