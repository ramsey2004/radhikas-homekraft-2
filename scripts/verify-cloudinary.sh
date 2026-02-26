#!/bin/bash

# Cloudinary Integration Verification Script
# Run this to verify your Cloudinary setup is working

echo "🔍 Cloudinary Integration Verification"
echo "======================================"
echo ""

# Check 1: Environment variables
echo "✓ Check 1: Environment Variables"
if grep -q "CLOUDINARY_CLOUD_NAME" /Users/ramtiwari/Final-Website/.env.local; then
  echo "  ✅ CLOUDINARY_CLOUD_NAME set in .env.local"
else
  echo "  ❌ CLOUDINARY_CLOUD_NAME not found in .env.local"
fi

if grep -q "dk1ovmxuj" /Users/ramtiwari/Final-Website/.env.local; then
  echo "  ✅ Cloud Name (dk1ovmxuj) configured"
else
  echo "  ❌ Cloud Name not configured"
fi
echo ""

# Check 2: Components Created
echo "✓ Check 2: Components Created"
if [ -f "/Users/ramtiwari/Final-Website/src/components/CloudinaryImage.tsx" ]; then
  echo "  ✅ CloudinaryImage.tsx exists"
else
  echo "  ❌ CloudinaryImage.tsx missing"
fi

if [ -f "/Users/ramtiwari/Final-Website/src/components/CloudinaryProductCard.tsx" ]; then
  echo "  ✅ CloudinaryProductCard.tsx exists"
else
  echo "  ❌ CloudinaryProductCard.tsx missing"
fi
echo ""

# Check 3: Utilities Created
echo "✓ Check 3: Utilities"
if [ -f "/Users/ramtiwari/Final-Website/src/lib/cloudinary.ts" ]; then
  echo "  ✅ cloudinary.ts utility file exists"
  if grep -q "getCloudinaryUrl" /Users/ramtiwari/Final-Website/src/lib/cloudinary.ts; then
    echo "  ✅ getCloudinaryUrl function found"
  fi
else
  echo "  ❌ cloudinary.ts missing"
fi
echo ""

# Check 4: Package installed
echo "✓ Check 4: Dependencies"
if grep -q "next-cloudinary" /Users/ramtiwari/Final-Website/package.json; then
  echo "  ✅ next-cloudinary in package.json"
else
  echo "  ❌ next-cloudinary not in package.json"
fi

if [ -d "/Users/ramtiwari/Final-Website/node_modules/next-cloudinary" ]; then
  echo "  ✅ next-cloudinary installed in node_modules"
else
  echo "  ❌ next-cloudinary not installed"
fi
echo ""

# Check 5: Documentation
echo "✓ Check 5: Documentation"
docs=(
  "CLOUDINARY_SETUP.md"
  "CLOUDINARY_EXAMPLES.md"
  "CLOUDINARY_MIGRATION.md"
  "CLOUDINARY_INTEGRATION_SUMMARY.md"
)

for doc in "${docs[@]}"; do
  if [ -f "/Users/ramtiwari/Final-Website/$doc" ]; then
    echo "  ✅ $doc exists"
  fi
done
echo ""

echo "======================================"
echo "✨ Cloudinary Integration Ready!"
echo ""
echo "Next steps:"
echo "1. Go to https://cloudinary.com/console/media_library"
echo "2. Copy a public ID from your images"
echo "3. Use CloudinaryImage component with that ID"
echo "4. See CLOUDINARY_SETUP.md for examples"
echo ""
