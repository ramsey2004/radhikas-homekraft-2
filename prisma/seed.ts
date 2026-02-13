import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.discountCode.deleteMany({});

  // Create users
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@radhikashomecraft.com',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'ADMIN',
      phone: '+91-9999999999',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Radhika Customer',
      email: 'customer@example.com',
      password: await bcrypt.hash('Customer@123', 10),
      role: 'USER',
      phone: '+91-8888888888',
    },
  });

  const anotherCustomer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('John@123', 10),
      role: 'USER',
      phone: '+91-8239316066',
    },
  });

  console.log('✅ Users created');

  // Create addresses
  const address1 = await prisma.address.create({
    data: {
      userId: customerUser.id,
      firstName: 'Radhika',
      lastName: 'Customer',
      email: 'customer@example.com',
      phone: '+91-8888888888',
      street1: '123 Main Street',
      street2: 'Apartment 4B',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302001',
      country: 'India',
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: anotherCustomer.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+91-8239316066',
      street1: '456 Oak Avenue',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India',
      isDefault: true,
    },
  });

  console.log('✅ Addresses created');

  // Create categories
  const bedsheetsCategory = await prisma.category.create({
    data: {
      name: 'Bedsheets',
      slug: 'bedsheets',
      description: 'Handcrafted block print bedsheets',
      image: 'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/bedsheet.jpg',
    },
  });

  const rugsCategory = await prisma.category.create({
    data: {
      name: 'Rugs',
      slug: 'rugs',
      description: 'Beautiful handwoven rugs and carpets',
      image: 'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/rug.jpg',
    },
  });

  const wallArtCategory = await prisma.category.create({
    data: {
      name: 'Wall Art',
      slug: 'wall-art',
      description: 'Traditional wall hangings and tapestries',
      image: 'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/wall-art.jpg',
    },
  });

  const cushionsCategory = await prisma.category.create({
    data: {
      name: 'Cushions',
      slug: 'cushions',
      description: 'Decorative cushions and pillows',
      image: 'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/cushion.jpg',
    },
  });

  const tablewareCategory = await prisma.category.create({
    data: {
      name: 'Tableware',
      slug: 'tableware',
      description: 'Handcrafted table linens and covers',
      image: 'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/tableware.jpg',
    },
  });

  console.log('✅ Categories created');

  // Create products
  const products = [
    {
      name: 'Indigo Block Print Bedsheet - Double',
      slug: 'indigo-block-print-bedsheet-double',
      description:
        'Beautiful handcrafted indigo block print bedsheet made from finest cotton. Features traditional Jaipur patterns.',
      shortDescription: 'Traditional indigo block print cotton bedsheet',
      price: 2499,
      discountedPrice: 1999,
      inventory: 15,
      sku: 'SHEET-INDIGO-001',
      thumbnail:
        'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/product1.jpg',
      images: [
        'https://res.cloudinary.com/demo/image/fetch/w_400/https://example.com/product1.jpg',
        'https://res.cloudinary.com/demo/image/fetch/w_400/https://example.com/product1-alt.jpg',
      ],
      material: '100% Cotton',
      color: 'Indigo Blue',
      dimensions: JSON.stringify({ length: 274, width: 228, height: 10 }),
      weight: 0.8,
      categoryId: bedsheetsCategory.id,
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Rust Floral Block Print Bedsheet - Queen',
      slug: 'rust-floral-block-print-bedsheet-queen',
      description:
        'Elegant rust-colored floral block print bedsheet. Perfect for creating a warm, inviting bedroom atmosphere.',
      shortDescription: 'Rust floral block print bedsheet',
      price: 2799,
      discountedPrice: 2199,
      inventory: 20,
      sku: 'SHEET-RUST-002',
      thumbnail:
        'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/product2.jpg',
      images: [
        'https://res.cloudinary.com/demo/image/fetch/w_400/https://example.com/product2.jpg',
      ],
      material: '100% Cotton',
      color: 'Rust',
      dimensions: JSON.stringify({ length: 228, width: 228, height: 10 }),
      weight: 0.85,
      categoryId: bedsheetsCategory.id,
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Sage Green Hand-Blocked Rug - 4x6',
      slug: 'sage-green-hand-blocked-rug-4x6',
      description:
        'Handwoven rug with sage green color and traditional block patterns. Perfect for living rooms and bedrooms.',
      shortDescription: 'Sage green hand-blocked rug',
      price: 5999,
      discountedPrice: 4799,
      inventory: 8,
      sku: 'RUG-SAGE-003',
      thumbnail:
        'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/product3.jpg',
      images: [
        'https://res.cloudinary.com/demo/image/fetch/w_400/https://example.com/product3.jpg',
      ],
      material: 'Wool and Cotton',
      color: 'Sage Green',
      dimensions: JSON.stringify({ length: 183, width: 122, height: 15 }),
      weight: 3.5,
      categoryId: rugsCategory.id,
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Traditional Jaipur Wall Hanging',
      slug: 'traditional-jaipur-wall-hanging',
      description:
        'Beautiful handembroidered wall hanging featuring traditional Jaipur patterns. A perfect addition to your home decor.',
      shortDescription: 'Traditional embroidered wall hanging',
      price: 1899,
      discountedPrice: 1499,
      inventory: 12,
      sku: 'WALL-TRAD-004',
      thumbnail:
        'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/product4.jpg',
      images: [
        'https://res.cloudinary.com/demo/image/fetch/w_400/https://example.com/product4.jpg',
      ],
      material: 'Cotton and Polyester',
      color: 'Multi-color',
      dimensions: JSON.stringify({ length: 91, width: 61, height: 2 }),
      weight: 0.3,
      categoryId: wallArtCategory.id,
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'Block Print Cushion Cover - Set of 4',
      slug: 'block-print-cushion-cover-set-4',
      description:
        'Beautiful set of 4 block print cushion covers. Mix and match designs for a personalized look.',
      shortDescription: 'Set of 4 block print cushion covers',
      price: 1299,
      discountedPrice: 999,
      inventory: 25,
      sku: 'CUSHION-SET-005',
      thumbnail:
        'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/product5.jpg',
      images: [
        'https://res.cloudinary.com/demo/image/fetch/w_400/https://example.com/product5.jpg',
      ],
      material: '100% Cotton',
      color: 'Multi-design',
      dimensions: JSON.stringify({ length: 40, width: 40, height: 5 }),
      weight: 0.4,
      categoryId: cushionsCategory.id,
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'Handprinted Table Runner - 180cm',
      slug: 'handprinted-table-runner-180cm',
      description:
        'Elegant handprinted table runner perfect for your dining table. Adds a traditional touch to your home.',
      shortDescription: 'Handprinted cotton table runner',
      price: 899,
      discountedPrice: 699,
      inventory: 18,
      sku: 'TABLE-RUN-006',
      thumbnail:
        'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/product6.jpg',
      images: [
        'https://res.cloudinary.com/demo/image/fetch/w_400/https://example.com/product6.jpg',
      ],
      material: '100% Cotton',
      color: 'Terracotta',
      dimensions: JSON.stringify({ length: 180, width: 33, height: 2 }),
      weight: 0.25,
      categoryId: tablewareCategory.id,
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'Burgundy Silk Saree Fabric - 5 meters',
      slug: 'burgundy-silk-saree-fabric-5-meters',
      description:
        'Premium quality burgundy silk fabric with intricate block patterns. Perfect for sarees, suits, and dresses.',
      shortDescription: 'Premium burgundy silk fabric',
      price: 3999,
      inventory: 10,
      sku: 'FABRIC-BURG-007',
      thumbnail:
        'https://res.cloudinary.com/demo/image/fetch/w_300/https://example.com/product7.jpg',
      images: [
        'https://res.cloudinary.com/demo/image/fetch/w_400/https://example.com/product7.jpg',
      ],
      material: '100% Silk',
      color: 'Burgundy',
      dimensions: JSON.stringify({ length: 500, width: 110, height: 0.5 }),
      weight: 0.75,
      categoryId: bedsheetsCategory.id,
      isFeatured: false,
      isActive: true,
    },
  ];

  let createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    createdProducts.push(created);
  }

  console.log('✅ Products created');

  // Create reviews
  if (createdProducts.length > 0) {
    await prisma.review.create({
      data: {
        productId: createdProducts[0].id,
        userId: customerUser.id,
        rating: 5,
        comment: 'Absolutely love this bedsheet! The quality is amazing and the colors are vibrant.',
        verified: true,
      },
    });

    await prisma.review.create({
      data: {
        productId: createdProducts[0].id,
        userId: anotherCustomer.id,
        rating: 4,
        comment: 'Good quality, beautiful design. Would recommend to anyone looking for traditional prints.',
        verified: true,
      },
    });

    await prisma.review.create({
      data: {
        productId: createdProducts[2].id,
        userId: customerUser.id,
        rating: 5,
        comment: 'This rug is absolutely beautiful! Perfect for my living room.',
        verified: true,
      },
    });
  }

  console.log('✅ Reviews created');

  // Create discount codes
  await prisma.discountCode.create({
    data: {
      code: 'WELCOME10',
      description: 'Welcome bonus - 10% off on first purchase',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      maxDiscount: 500,
      minOrderValue: 500,
      usageLimit: 100,
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2025-12-31'),
      isActive: true,
    },
  });

  await prisma.discountCode.create({
    data: {
      code: 'FLAT500',
      description: 'Flat 500 rupees off on orders above 2000',
      discountType: 'FIXED_AMOUNT',
      discountValue: 500,
      minOrderValue: 2000,
      usageLimit: 50,
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2025-12-31'),
      isActive: true,
    },
  });

  console.log('✅ Discount codes created');

  // Create sample cart for customer
  const cart = await prisma.cart.create({
    data: {
      userId: customerUser.id,
    },
  });

  if (createdProducts.length > 0) {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: createdProducts[0].id,
        quantity: 1,
      },
    });
  }

  console.log('✅ Cart created');

  // Create sample order
  if (createdProducts.length > 0 && address1) {
    const order = await prisma.order.create({
      data: {
        orderNumber: 'ORD-2024-001',
        email: customerUser.email,
        userId: customerUser.id,
        subtotal: 1999,
        tax: 360,
        shippingCost: 0,
        discountAmount: 0,
        total: 2359,
        status: 'DELIVERED',
        paymentStatus: 'COMPLETED',
        paymentMethod: 'RAZORPAY',
        shippingAddressId: address1.id,
        billingAddressId: address1.id,
        paymentId: 'pay_1234567890',
        paymentRef: 'Order #ORD-2024-001',
        trackingNumber: 'TRACK123456789',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: createdProducts[0].id,
        quantity: 1,
        price: 1999,
      },
    });
  }

  console.log('✅ Orders created');

  // Create wishlist items
  if (createdProducts.length > 1) {
    await prisma.wishlistItem.create({
      data: {
        userId: customerUser.id,
        productId: createdProducts[1].id,
      },
    });

    await prisma.wishlistItem.create({
      data: {
        userId: customerUser.id,
        productId: createdProducts[3].id,
      },
    });
  }

  console.log('✅ Wishlist items created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
