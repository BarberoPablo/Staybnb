# 🏠 Airbnb Clone - Full-Stack Rental Platform

A modern, full-featured Airbnb clone built with Next.js 15, TypeScript, and Supabase. This platform provides a complete rental experience for both hosts and guests, featuring advanced booking systems, interactive maps, and a seamless user experience.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.50.2-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.10-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🏡 **For Guests**

- **Smart Search & Discovery**: Search properties by city with real-time filtering
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

### **Development Tools**

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler for development

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

## 🙏 Acknowledgments

- Inspired by Airbnb's design and functionality
- Built with modern web technologies
- Community-driven development
