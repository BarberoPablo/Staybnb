# Environment Variables

## Core Variables

```bash
# Required - Base URL for SEO and canonical URLs
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Database (required)
DATABASE_URL=postgresql://...

# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# UploadThing (required)
UPLOADTHING_TOKEN=your_uploadthing_token

# Email (optional)
RESEND_API_KEY=your_resend_key
```

## SEO Variables (Optional)

```bash
# Branding
NEXT_PUBLIC_SITE_NAME=StayBnb
NEXT_PUBLIC_SITE_DESCRIPTION="Your site description"

# Social Media
NEXT_PUBLIC_TWITTER_HANDLE=@yourusername
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/yourpage
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourprofile

# Google Search Console (get from https://search.google.com/search-console)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
```

## Setup

1. Create `.env.local` in project root
2. Add required variables
3. Restart development server

## Development Example

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
# ... other required variables
```
