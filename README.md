# Jesse Course World

A modern, responsive course platform for trading and investment education.

## 🚀 Features

- **Course Management**: Complete CRUD operations for courses
- **Admin Panel**: Secure admin dashboard with authentication
- **Gallery System**: Upload and manage course screenshots
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for professional transitions
- **Telegram Integration**: Direct purchase flow via Telegram

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: Vercel Ready

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Supabase database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL commands from `database-setup.sql`
4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
5. Update `.env` with your configuration
6. Start development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Vercel
Add these in your Vercel dashboard:
- `VITE_ADMIN_ROUTE`: Admin panel route (default: 34324)
- `VITE_ADMIN_USERNAME`: Admin username
- `VITE_ADMIN_PASSWORD`: Admin password
- `VITE_TELEGRAM_USERNAME`: Your Telegram username
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 🔧 Configuration

### Admin Access
- Route: `/34324` (configurable via `VITE_ADMIN_ROUTE`)
- Default credentials: admin / secure123

### Database Setup
1. Create a Supabase project at https://supabase.com
2. Run the SQL commands from `database-setup.sql` in your Supabase SQL Editor
3. Add your Supabase credentials to environment variables

### Categories
- Forex Courses
- Option Trading
- Swing Trading
- Technical Trader
- Price Action
- Fundamentals
- SMC & ICT
- For Beginners

## 📱 Features

### Public Features
- Course browsing and filtering
- Category-based navigation
- Gallery with full-image modal
- Telegram purchase integration
- Responsive design

### Admin Features
- Course management (Add/Edit/Delete)
- Image upload for courses
- Gallery management
- Promo banner control
- Secure authentication

## 🎨 Design

- **Theme**: Clean light theme
- **Typography**: Inter font family
- **Colors**: Professional blue/green gradient scheme
- **Layout**: Mobile-first responsive design
- **Animations**: Smooth transitions and hover effects

## 📄 License

© 2025 Jesse Course World. All rights reserved.