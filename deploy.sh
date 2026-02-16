#!/bin/bash
# Quick Deployment Commands for Vercel
# Save as: deploy.sh
# Usage: chmod +x deploy.sh && ./deploy.sh

set -e

echo "🚀 Radhika's Homecraft - Vercel Deployment Helper"
echo "=================================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "📋 Deployment Options:"
echo "1. Deploy to production (vercel --prod)"
echo "2. Deploy preview"
echo "3. Check git status"
echo "4. Generate NEXTAUTH_SECRET"
echo "5. Show environment variables template"
echo ""
read -p "Choose option (1-5): " option

case $option in
    1)
        echo "🚀 Deploying to production..."
        echo ""
        echo "Make sure you have:"
        echo "  ✓ MongoDB URI"
        echo "  ✓ NEXTAUTH_SECRET"
        echo "  ✓ Payment gateway keys (Razorpay/Stripe)"
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            vercel --prod
            echo "✅ Deployment complete!"
            echo "Visit: https://vercel.com/dashboard"
        fi
        ;;
    2)
        echo "🔍 Deploying preview..."
        vercel
        echo "✅ Preview deployment complete!"
        ;;
    3)
        echo "📊 Git Status:"
        git status
        echo ""
        echo "Recent commits:"
        git log --oneline -5
        ;;
    4)
        echo "🔑 Generating NEXTAUTH_SECRET..."
        SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
        echo ""
        echo "Your new secret key:"
        echo "$SECRET"
        echo ""
        echo "Copy this to NEXTAUTH_SECRET in Vercel environment variables"
        ;;
    5)
        echo "📝 Environment Variables Template:"
        echo ""
        cat << 'EOF'
# Critical (Required)
NEXTAUTH_SECRET=<generate_with_option_4>
NEXTAUTH_URL=https://your-domain.vercel.app
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/radhikas-homecraft
NEXT_PUBLIC_SITE_URL=https://radhikashomecraft.com

# Payment Gateway (Choose one or both)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx

# Feature Flags
ENABLE_INVENTORY_TRACKING=true
ENABLE_REVIEWS=true
ENABLE_NEWSLETTER=true
EOF
        echo ""
        echo "See .env.production for full template"
        ;;
    *)
        echo "Invalid option"
        ;;
esac

echo ""
echo "For detailed guide, see: DEPLOYMENT_GUIDE_VERCEL.md"
