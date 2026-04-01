# KV Garage - E-Commerce Platform

A modern, scalable e-commerce platform built with Next.js, featuring Shopify integration, custom pricing engines, and a comprehensive admin system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 📁 Project Structure

```
kv-garage/
├── pages/                    # Next.js pages
│   ├── shop/                # Product pages
│   │   ├── [slug].js        # Dynamic product page
│   │   ├── demo/[slug].js   # Demo Shopify product pages
│   │   └── private-preview.js
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   └── wholesale/           # Wholesale portal
├── components/              # React components
│   ├── product/            # Product-specific components
│   │   ├── ShopifyProductPage.jsx  # Shopify product template
│   │   └── ReplicaDisclaimerModal.jsx
│   └── layout/             # Layout components
├── lib/                     # Utility libraries
│   ├── shopifyProduct.js   # Shopify product system
│   ├── pricing.js          # Pricing engine
│   └── analytics.js        # Analytics tracking
├── data/                    # Static data files
│   ├── shopify-products.json
│   └── camping-products.json
├── docs/                    # Documentation
│   ├── SHOPIFY_PRODUCT_SYSTEM_GUIDE.md
│   ├── BLOG_SYSTEM_GUIDE.md
│   └── ANALYTICS_SYSTEM_GUIDE.md
├── scripts/                 # Utility scripts
│   ├── test-shopify-product-system.js
│   └── import-camping-products.cjs
├── admin/                   # Admin interface
├── public/                  # Static assets
└── styles/                  # Global styles
```

## 🛍️ Shopify Product System

The platform includes a powerful Shopify-integrated product page system with custom pricing logic.

### Key Features

- ✅ **Custom Pricing Engine**: Role-based discounts (Retail: 0%, Student: 20%, Wholesale: 40%)
- ✅ **Local Image Gallery**: Uses local product images with zoom and thumbnail support
- ✅ **Shopify Buy Button**: Hidden Shopify pricing, custom pricing displayed
- ✅ **User Type Management**: localStorage-based user type detection and switching
- ✅ **Test Controls**: Development UI for previewing different pricing tiers
- ✅ **Modular & Scalable**: Designed for 100+ products with consistent structure

### Demo Products

Visit the demo pages to see the system in action:

- `/shop/demo/demo-luxury-watch` - Luxury Chronograph Watch ($299.99)
- `/shop/demo/demo-leather-messenger-bag` - Premium Leather Messenger Bag ($199.99)
- `/shop/demo/demo-portable-camp-grill` - Portable Camping Grill ($89.99)

### Testing the System

```bash
# Run pricing engine tests
node scripts/test-shopify-product-system.js

# Start dev server and visit demo pages
npm run dev
# Then visit: http://localhost:3000/shop/demo/demo-luxury-watch
```

### Adding New Products

1. Add product data to `data/shopify-products.json`:

```json
{
  "id": "unique-id",
  "slug": "product-slug",
  "name": "Product Name",
  "basePrice": 99.99,
  "images": ["/path/to/image-1.jpg"],
  "shopify": {
    "variantId": "shopify-variant-id"
  }
}
```

2. Create a product page or use the dynamic route system.

See [docs/SHOPIFY_PRODUCT_SYSTEM_GUIDE.md](docs/SHOPIFY_PRODUCT_SYSTEM_GUIDE.md) for complete documentation.

## 💰 Pricing System

### User Types & Discounts

| Type      | Discount | Use Case                    |
|-----------|----------|-----------------------------|
| Guest     | 0%       | Regular retail customers    |
| Student   | 20%      | Resellers with small volume |
| Wholesale | 40%      | Bulk buyers                 |

### Volume Discounts

- 5-9 units: 5% off
- 10-24 units: 10% off
- 25+ units: 15% off

### Cart Total Discounts

- $100-$249: 5% off
- $250-$499: 10% off
- $500-$999: 15% off
- $1000+: 20% off

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **E-commerce**: Shopify Buy Button, Stripe
- **Analytics**: Custom analytics system
- **Authentication**: Supabase Auth
- **Deployment**: Vercel, Netlify

## 📊 Key Systems

### 1. Product Management
- Dynamic product pages with custom pricing
- Local image gallery system
- Shopify Buy Button integration
- Volume and role-based pricing

### 2. Admin Dashboard
- Product management
- Order tracking
- Customer management
- Analytics and reporting
- Affiliate management

### 3. Blog System
- Automated blog generation
- SEO optimization
- Category-based organization
- Social media integration

### 4. Analytics
- Product view tracking
- Add to cart tracking
- Traffic event tracking
- Conversion analytics

### 5. Affiliate System
- Affiliate dashboard
- Click tracking
- Commission management
- Payout system

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_ADMIN_KEY=your-supabase-admin-key

# Shopify
NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📝 Development

### Running Tests

```bash
# Test pricing engine
node scripts/test-shopify-product-system.js

# Test analytics system
node scripts/test-analytics.js

# Test blog system
node scripts/test-blog-system.js
```

### Building for Production

```bash
npm run build
npm start
```

### Code Style

- ESLint configuration in `eslint.config.mjs`
- Prettier for code formatting
- Husky for pre-commit hooks

## 📚 Documentation

- [Shopify Product System](docs/SHOPIFY_PRODUCT_SYSTEM_GUIDE.md)
- [Blog System](docs/BLOG_SYSTEM_GUIDE.md)
- [Analytics System](docs/ANALYTICS_SYSTEM_GUIDE.md)
- [Mobile Optimization](docs/MOBILE_OPTIMIZATION_GUIDE.md)

## 🚀 Deployment

### Vercel (Recommended)

```bash
vercel deploy --prod
```

### Netlify

```bash
npm run build
netlify deploy --prod
```

### Self-Hosting

```bash
npm run build
npm start
# Runs on port 3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Email: kvgarage@kvgarage.com
- Documentation: See `/docs` folder
- Issues: GitHub Issues

---

**Built with ❤️ by KV Garage Team**

*Grand Rapids, Michigan, United States*