# Supabase Setup Guide for Chronos

## 🔧 Database Setup

### 1. Run the SQL Script
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to execute all the queries

### 2. Verify Tables Created
After running the script, you should see these new tables:
- `user_profiles` - Extended user information
- `wishlist` - User wishlist items
- `addresses` - User shipping/billing addresses
- `orders` - Order information
- `order_items` - Individual items in orders

## 🔐 Authentication Configuration

### 1. Email Templates (Optional)
1. Go to **Authentication > Email Templates**
2. Customize the email templates for:
   - **Confirm signup**
   - **Reset password**
   - **Magic link**

### 2. Site URL Configuration
1. Go to **Authentication > URL Configuration**
2. Set your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/reset-password`

### 3. Google OAuth Setup
1. Go to **Authentication > Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
4. Add authorized redirect URI in Google Console:
   - `https://your-project.supabase.co/auth/v1/callback`

### 4. Email Provider Setup
1. Go to **Authentication > Providers**
2. Configure your email provider (SMTP settings)
3. Or use Supabase's built-in email service

## 🌐 Environment Variables

Make sure your `.env.local` file has these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 Testing the Setup

### 1. Test User Registration
1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/auth/signup`
3. Create a new account
4. Check your email for verification link

### 2. Test User Login
1. Go to `http://localhost:3000/auth/signin`
2. Login with your credentials
3. Verify you can access the account page

### 3. Check Database
1. Go to **Table Editor** in Supabase
2. Check that a record was created in `user_profiles`
3. Verify the user appears in `auth.users`

## 🔒 Row Level Security (RLS)

The setup script automatically enables RLS and creates policies for:
- Users can only see their own data
- Products are publicly viewable
- Proper access control for all tables

## 📊 Database Schema Overview

```
auth.users (Supabase built-in)
├── user_profiles (extends user data)
├── wishlist (user's saved items)
├── addresses (shipping/billing)
├── orders (order information)
    └── order_items (items in each order)
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Policy violation" errors**
   - Make sure RLS policies are created correctly
   - Check that user is authenticated

2. **Email not sending**
   - Verify email provider configuration
   - Check spam folder

3. **User profile not created**
   - Verify the trigger function is created
   - Check the `handle_new_user()` function

4. **Authentication errors**
   - Verify environment variables
   - Check Supabase project URL and keys

## 🔄 Next Steps

After setup, you can:
1. Implement wishlist functionality
2. Add order management
3. Create address management
4. Add payment integration

## 📞 Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Verify all SQL queries executed successfully
3. Test with a fresh user account 