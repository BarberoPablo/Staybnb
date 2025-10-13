# 🏠 Staybnb - Full-Stack Rental Platform

A modern, full-featured Staybnb built with Next.js 15, TypeScript, and Supabase. This platform provides a complete rental experience for both hosts and guests, featuring advanced booking systems, interactive maps, and a seamless user experience.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.50.2-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.10-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🏡 **For Guests**

- **Smart Search & Discovery**:
  - Search properties by city with real-time filtering
  - Advanced URL-based filtering with persistent state
  - Smart filter persistence across page navigation and browser refresh
  - Real-time search validation with city error handling
- **Interactive Maps**: View listings on an interactive map with Leaflet integration
- **Advanced Booking System**:
  - Date range selection with availability checking
  - Guest count management (adults, children, infants, pets)
  - Real-time price calculation with promotions
  - Long-stay discounts automatically applied
- **Property Details**:
  - High-quality image galleries with slider navigation
  - Detailed property information and amenities
  - Host information and reviews
  - Property type classification (House, Apartment, Cabin, Boat)
- **Reservation Management**:
  - View upcoming and past reservations
  - Cancel reservations with policy enforcement
  - Reservation history tracking
- **Checkout Process**:
  - Secure payment flow
  - Booking confirmation
  - Date and guest validation

### 🏠 **For Hosts**

- **Multi-Step Listing Creation**:
  - Property type selection (House, Apartment, Cabin, Boat)
  - Privacy type configuration (Entire, Private, Shared)
  - Location setup with map integration
  - Photo upload with drag-and-drop functionality
  - Pricing and promotion management
  - Check-in/check-out time configuration
  - Amenities and safety items selection
- **Listing Management**:
  - Edit existing listings
  - View reservation requests
  - Manage listing status (draft, published, paused)
- **Reservation Dashboard**:
  - View all reservations for hosted properties
  - Guest information and booking details
  - Reservation status tracking

### 🔧 **Technical Features**

- **Authentication**: Secure Supabase authentication with SSR support
- **Real-time Updates**: Live availability and booking status
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Image Management**: Upload and organize property photos
- **Map Integration**: Interactive maps for property location and search
- **Promotion System**: Configurable discounts for longer stays
- **Timezone Support**: Proper handling of different timezones
- **Form Validation**: Comprehensive client and server-side validation
- **SEO Optimization**: Enterprise-level SEO with dynamic metadata and structured data
- **PWA Support**: Installable as a Progressive Web App on mobile devices

## 🚀 Performance & Quality Optimizations

### **Smart Guest Management System**

The booking system implements intelligent guest capacity management with comprehensive validation:

- **Multi-Type Guest Support**: Separate handling for adults, children, infants, and pets
- **Dynamic Capacity Validation**: Real-time checking against property guest limits
- **Smart Error Handling**: Contextual error messages with current guest counts
- **Flexible Guest Rules**: Pets don't count toward guest limits, infants have special considerations
- **URL State Persistence**: Guest selections maintained across page navigation

```typescript
// Example: Guest validation with capacity checking
const handleGuest = (type: Guests, amount: number) => {
  const newGuests = { ...guests, [type]: guests[type] + amount };
  const totalGuests = newGuests.adults + newGuests.children + newGuests.infant;

  if (totalGuests > listing.structure.guests) {
    setErrors({
      [type]: `Maximum ${listing.structure.guests} guests allowed. Current total: ${totalGuests}`,
    });
    return;
  }
  setGuests(newGuests);
};
```

### **Advanced Image Resolution Management**

Optimized image loading system for better performance and quality:

- **Responsive Image Loading**: Different resolutions based on display context
  - **Cover Images**: 1080px for main property photos
  - **Grid Images**: 720px for primary display areas
  - **Thumbnail Images**: 480px for secondary/smaller displays
- **Progressive Loading**: Smooth loading states with spinners and fallbacks
- **Error Handling**: Graceful fallback to placeholder icons when images fail
- **Drag & Drop Reordering**: Sortable image grid with visual feedback
- **Upload Optimization**: Efficient file handling with preview generation

```typescript
// Example: Context-aware image resolution
<ImageWithFallback src={url + `&w=${resolution}`} alt="listing image" priority={index === 0} fill className="object-cover" sizes="100%" />
```

### **Enhanced User Experience**

- **Loading States**: Visual feedback during image and data loading
- **Error Recovery**: Automatic fallback mechanisms for failed operations
- **Smooth Animations**: Framer Motion powered transitions
- **Accessibility**: WCAG compliant components with proper ARIA labels
- **Mobile Optimization**: Touch-friendly interfaces with responsive layouts

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19** - Latest React with concurrent features
- **Framer Motion** - Smooth animations and transitions

### **Backend & Database**

- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Supabase Auth** - Authentication and session management
- **UploadThing** - File upload service for images

### **UI Components & Libraries**

- **Headless UI** - Unstyled, accessible UI components
- **React Icons** - Icon library
- **React Date Range** - Date picker component
- **Keen Slider** - Touch-friendly carousel
- **React Leaflet** - Interactive maps
- **React Hot Toast** - Toast notifications
- **Zustand** - State management
- **DnD Kit** - Drag and drop functionality

### **Development Tools**

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler for development

### **Technical Improvements**

- **Stable Query Parameter Management**:
  - Custom `useQueryParams` hook for reliable URL parameter handling
  - Stable dependency management to prevent unnecessary re-renders
  - Optimized search parameter parsing and validation
- **Enhanced Filter Processing**:
  - Improved server-side filter parsing with comprehensive type safety
  - Better handling of complex filter combinations (dates, guests, amenities)
  - Robust error handling for malformed search parameters
- **Performance Optimizations**:
  - Memoized filter components to prevent unnecessary re-renders
  - Optimized search parameter building and URL construction
  - Efficient state management for complex filter states

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/airbnb-clone.git
   cd airbnb-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   ```

4. **Set up the database**

   ```bash
   npx supabase gen types typescript --project-id your_project_id > database.types.ts
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (site)/            # Guest-facing routes
│   │   ├── search/        # Property search with maps
│   │   ├── listing/       # Property details
│   │   ├── checkout/      # Booking process
│   │   ├── reservations/  # Guest reservations
│   │   └── auth/          # Authentication
│   ├── (hosting)/         # Host-facing routes
│   │   └── hosting/       # Host dashboard & listing creation
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── Booking/          # Booking system components
│   ├── Hosting/          # Host-specific components
│   ├── Leaflet/          # Map components
│   └── Skeleton/         # Loading states
├── lib/                  # Utilities and configurations
│   ├── api/             # API client functions
│   ├── supabase/        # Database client
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── hooks/               # Custom React hooks
└── store/               # State management (Zustand)
```

## 🔐 Authentication Flow

The application uses Supabase's SSR package for secure authentication:

- **Client-side**: Browser client for login/registration
- **Server-side**: Server client with HTTP-only cookies
- **Middleware**: Automatic session refresh and token rotation
- **OAuth Support**: Google, GitHub, and magic link authentication

## 🗺️ Map Integration

- **Interactive Maps**: Powered by Leaflet and React Leaflet
- **Property Markers**: Custom markers for each listing
- **Search Integration**: Map view alongside search results
- **Location Selection**: Map-based location picker for hosts

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Adaptive Layouts**: Responsive grid systems
- **Touch-Friendly**: Optimized for touch interactions
- **Progressive Enhancement**: Enhanced features on larger screens

## 🎨 UI/UX Features

- **Modern Design**: Clean, Airbnb-inspired interface
- **Smooth Animations**: Framer Motion powered transitions
- **Loading States**: Skeleton components for better UX
- **Toast Notifications**: User feedback and error handling
- **Accessibility**: WCAG compliant components

### **Navigation & User Experience**

- **Enhanced Filter System**:
  - Modular filter buttons with improved state management
  - Multi-step filter selection dialog with intuitive navigation
  - Real-time filter application with immediate search results
- **Smart Search Experience**:
  - Improved mobile responsiveness for search functionality
  - Better error handling and user feedback for search validation
  - Seamless integration between search input and filter system
- **URL State Management**:
  - Search parameters synced with browser URL for better navigation
  - Shareable search URLs with all applied filters
  - Browser back/forward button support for search history

## 🔄 Booking System

### **Smart Pricing**

- Base nightly rates
- Dynamic pricing based on demand
- Long-stay promotions (weekly/monthly discounts)
- Guest count adjustments

### **Availability Management**

- Real-time availability checking
- Conflict prevention
- Flexible check-in/check-out times
- Timezone-aware scheduling

### **Guest Management**

- Multiple guest types (adults, children, infants, pets)
- Guest limits per property
- Age-appropriate accommodations

## 📊 Host Dashboard

### **Listing Management**

- Multi-step creation wizard
- Photo upload with drag-and-drop
- Pricing strategy tools
- Promotion management
- Listing status control

### **Reservation Overview**

- Calendar view of bookings
- Guest communication tools
- Revenue tracking
- Performance analytics

## 🔍 SEO & Web Standards

The application implements enterprise-level SEO optimization with professional best practices:

### **SEO Core Files**

- **`src/lib/seo.ts`** - Central SEO utility library with reusable functions for metadata generation, structured data (JSON-LD), and OpenGraph tags. Supports internationalization (i18n) and environment-based configuration. The `generateSEOMetadata()` function is used across **all pages** (both public and private) to ensure consistent metadata for browser tabs, social media sharing, and accessibility, while the `noIndex` parameter controls whether Google indexes the page.

- **`src/app/robots.ts`** - Dynamic robots.txt generator that controls search engine crawling. Protects private pages (auth, checkout, profile, hosting) while allowing public content (listings, search) to be indexed.

- **`src/app/sitemap.ts`** - Auto-generated XML sitemap that updates hourly with all published listings, city search pages, and static routes. Helps search engines discover and index content efficiently.

- **`public/manifest.json`** - PWA manifest configuration enabling the app to be installed on mobile devices and desktop. Provides native app-like experience with custom icons, theme colors, and offline capabilities.

### **Dynamic SEO Pages**

Two pages implement **dynamic metadata generation** using `generateMetadata()` instead of static exports:

- **`src/app/(site)/listing/[id]/page.tsx`** - Generates unique SEO metadata for each listing by fetching listing data (title, description, images, location, price). Implements `generateListingStructuredData()` for LodgingBusiness schema (enables price and rating display in search results) and `generateBreadcrumbStructuredData()` for navigation breadcrumbs.

- **`src/app/(site)/search/page.tsx`** - Generates filter-aware metadata based on search parameters (city, guests, price range, property type). Each filter combination creates unique title, description, and keywords for better location-based search optimization.

These pages use dynamic metadata because their content varies per request, ensuring each listing and search query has optimized, unique SEO that improves search rankings and click-through rates.

### **SEO Features**

- **Dynamic Metadata**: Unique, optimized titles and descriptions for every page
- **Structured Data**: JSON-LD schemas (WebSite, Organization, LodgingBusiness, Breadcrumbs) for rich search results
- **OpenGraph & Twitter Cards**: Beautiful social media previews with custom images
- **Canonical URLs**: Prevent duplicate content issues
- **Robots Directives**: Smart indexing rules (public pages indexed, private pages protected)
- **Environment-Based Config**: Different SEO settings per environment (dev/staging/prod)
- **i18n Ready**: Multi-language support with alternate language tags
- **Mobile Optimization**: Viewport configuration and PWA manifest for optimal mobile SEO

### **SEO Protection Layers**

The application uses a **dual-layer protection system** for private pages:

- **`robots.txt` (Disallow)** - First defense layer that tells search engine crawlers not to visit private routes like `/profile/*`, `/hosting/*`, `/checkout/*`. This prevents bots from wasting crawl budget on private content.

- **`noIndex` Meta Tag** - Second defense layer that instructs search engines not to index a page even if they visit it. Used in all private pages as a backup protection in case bots ignore robots.txt or links are shared directly.

**Why both?** Using `disallow` in robots.txt is efficient (bots don't even request the page), while `noIndex` provides a safety net for edge cases where bots might still access the page through direct links or social sharing.

### **Documentation**

Comprehensive SEO documentation is available in the project root:

- `SEO_README.md` - Quick start guide
- `SEO_DOCUMENTATION.md` - Complete technical reference
- `SEO_ADVANCED_GUIDE.md` - Professional techniques and validation tools
- `ENV_VARIABLES.md` - Environment variables configuration

## 🙏 Acknowledgments

- Inspired by Airbnb's design and functionality
- Built with modern web technologies
- Community-driven development
