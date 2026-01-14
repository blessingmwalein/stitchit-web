# Stitch't - Custom Tufted Rugs Website

A modern, full-featured e-commerce website for a custom tufted rug business in Zimbabwe. Built with Next.js, TypeScript, Redux Toolkit, and Framer Motion.

## Features

### 🎨 Core Features
- **Landing Page**: Showcases custom tufted rugs with our unique style
- **Rug Categories**: Display rugs for corporate offices, homes, schools, hotels, and more
- **Use Cases**: Showcase rug applications (dining rooms, bedrooms, bathrooms, cars, etc.)
- **Collections Gallery**: Browse previous productions and order from existing designs
- **Custom Rug Designer**: Interactive tool for clients to design their own rugs
  - Shape selection (Rectangle, Square, Round, Oval, Runner, Custom)
  - Size customization with sliders
  - Pattern selection (Solid, Geometric, Abstract, Floral, Striped, Custom)
  - Material selection (Wool, Cotton, Acrylic, Mixed)
  - Color palette (up to 5 colors)
  - Custom notes and design file upload
  - Real-time price calculation

### 🛒 E-commerce Features
- **Quick Order Form**: Generic interactive form for quick rug orders
- **Shopping Cart**: Full cart functionality with quantity management
- **Checkout System**: 
  - Multiple payment methods (Card, Mobile Money, Bank Transfer)
  - Billing information form
  - Order confirmation
- **Order Success Page**: Post-purchase confirmation

### 👤 User Management
- **Authentication**: Login and signup screens with validation
- **Profile Dashboard**: 
  - View and edit profile information
  - Order history with status tracking
  - Profile management
- **Redux State Management**: Global state for auth, cart, and orders

### ✨ UI/UX Features
- **Animations**: Smooth Framer Motion animations throughout
- **Orange Accent Colors**: Brand color integrated across the site
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Yup schema validation on all forms
- **Modern UI**: Built with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Form Validation**: Yup
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (via shadcn/ui)
- **Icons**: Lucide React
- **Payment**: Stripe integration ready

## Installation

1. **Install Dependencies**:
```bash
npm install @reduxjs/toolkit react-redux yup framer-motion @stripe/stripe-js @stripe/react-stripe-js
```

2. **Run Development Server**:
```bash
npm run dev
```

3. **Open Browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── about/              # About page
├── auth/
│   ├── login/         # Login page
│   └── signup/        # Signup page
├── cart/              # Shopping cart
├── checkout/          # Checkout page
├── collections/       # Product gallery
├── design/            # Custom rug designer
├── order/             # Quick order form
├── order-success/     # Order confirmation
├── profile/           # User dashboard
└── use-cases/         # Use cases showcase

components/
├── ui/                # Reusable UI components
├── header.tsx         # Navigation header
├── hero.tsx           # Hero section
├── footer.tsx         # Footer
├── rug-types-section.tsx
└── use-cases-section.tsx

store/
├── slices/
│   ├── authSlice.ts   # Authentication state
│   ├── cartSlice.ts   # Shopping cart state
│   └── orderSlice.ts  # Orders state
├── hooks.ts           # Typed Redux hooks
└── index.ts           # Store configuration

lib/
├── validation.ts      # Yup validation schemas
├── providers.tsx      # Redux & Theme providers
└── utils.ts
```

## Key Pages

### Landing Page (`/`)
- Hero section with business introduction
- Rug types for different spaces (offices, homes, hotels, schools)
- Use cases showcase (living rooms, dining, bedrooms, bathrooms, cars)
- Collections preview
- Call-to-action sections

### Collections (`/collections`)
- Gallery of pre-made rug designs
- Category filtering
- Add to cart functionality
- Detailed product information

### Design Your Rug (`/design`)
- Interactive rug designer
- Multi-step form with tabs
- Real-time price calculation
- Design summary panel
- Custom design file upload

### Quick Order (`/order`)
- Contact information form
- Order details selection
- Yup validation
- Redirect to collections or designer

### Cart & Checkout (`/cart`, `/checkout`)
- Cart management
- Multiple payment options
- Order summary
- Secure checkout process

### Profile Dashboard (`/profile`)
- User information management
- Order history with tracking
- Profile editing
- Authentication required

## Color Scheme

- **Primary**: `#2c2420` (Dark Brown)
- **Orange**: `#f97316` (Brand Accent)
- **Orange Light**: `#fb923c`
- **Orange Dark**: `#ea580c`
- **Background**: `#faf9f7` (Warm White)
- **Secondary**: `#e8e4df` (Light Beige)

## Form Validation

All forms use Yup schemas for validation:
- **Order Form**: Name, email, phone, address validation
- **Login**: Email and password validation
- **Signup**: Name, email, phone, password matching
- **Checkout**: Card details validation

## State Management

Redux slices manage:
- **Auth**: User authentication and profile
- **Cart**: Shopping cart items and total
- **Orders**: Order history and current order

## Animations

Framer Motion provides:
- Page transitions
- Scroll animations
- Hover effects
- Card entrance animations
- Smooth interactions

## Future Enhancements

- Real payment processing with Stripe
- Backend API integration
- Image upload for custom designs
- Admin dashboard
- Email notifications
- Advanced order tracking
- Review and rating system
- Wishlist functionality

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_API_URL=your_api_url
```

## License

Proprietary - Stitch't Custom Tufted Rugs

## Contact

For inquiries: stichiitt@gmail.com

---

**Made with ❤️ in Zimbabwe**
