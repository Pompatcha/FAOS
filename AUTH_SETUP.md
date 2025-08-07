# Authentication Setup Guide

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. **OAuth Callback Route**

- สร้าง `/app/auth/callback/route.ts` สำหรับจัดการ OAuth redirects
- รองรับการ sync profile data จาก Google/Facebook
- Auto-create หรือ update user profiles

### 2. **Enhanced OAuth Configuration**

- อัพเดท Google OAuth ให้มี offline access และ consent prompt
- เพิ่ม Facebook scopes สำหรับ email และ public_profile
- Redirect URLs ชี้ไปที่ `/auth/callback`

### 3. **Database Setup**

- สร้าง SQL migration สำหรับ profiles table
- Row Level Security (RLS) policies
- Auto-trigger สำหรับสร้าง profile เมื่อ user signup

### 4. **Password Reset**

- หน้า reset password ที่ `/auth/reset-password`
- Form validation และ UI ที่สวยงาม

## 🔧 การตั้งค่าที่ต้องทำ

### 1. **Supabase Dashboard Configuration**

#### Google OAuth:

1. ไปที่ Supabase Dashboard → Authentication → Providers → Google
2. เปิดใช้งาน Google provider
3. เพิ่ม authorized redirect URLs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
4. ใส่ Google Client ID และ Client Secret

#### Facebook OAuth:

1. ไปที่ Supabase Dashboard → Authentication → Providers → Facebook
2. เปิดใช้งาน Facebook provider
3. เพิ่ม authorized redirect URLs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
4. ใส่ Facebook App ID และ App Secret

### 2. **Google Cloud Console**

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างหรือเลือก project
3. เปิดใช้งาน Google+ API
4. ไปที่ Credentials → OAuth 2.0 Client IDs
5. เพิ่ม authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   https://localhost:3000/auth/callback
   ```

### 3. **Facebook Developers**

1. ไปที่ [Facebook Developers](https://developers.facebook.com/)
2. สร้าง Facebook App
3. เพิ่ม Facebook Login product
4. ตั้งค่า Valid OAuth Redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   https://localhost:3000/auth/callback
   ```

### 4. **Database Migration**

รัน SQL migration ใน Supabase:

```bash
# Copy content from supabase/migrations/create_profiles_trigger.sql
# และรันใน Supabase SQL Editor
```

### 5. **Environment Variables**

อัพเดทไฟล์ `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🧪 การทดสอบ

### Email Authentication

- [x] Register ด้วย email/password
- [x] Login ด้วย email/password
- [x] Password reset
- [x] Auto-create profile

### Google OAuth

- [ ] Login ด้วย Google
- [ ] Profile sync จาก Google
- [ ] Callback handling
- [ ] Session management

### Facebook OAuth

- [ ] Login ด้วย Facebook
- [ ] Profile sync จาก Facebook
- [ ] Callback handling
- [ ] Session management

## 🔒 Security Features

- ✅ Row Level Security (RLS)
- ✅ CSRF Protection
- ✅ Secure cookie handling
- ✅ Profile data validation
- ✅ OAuth state verification

## 📱 User Experience

- ✅ Loading states
- ✅ Error handling
- ✅ Success messages
- ✅ Responsive design
- ✅ Accessibility features

## 🚀 Production Checklist

- [ ] อัพเดท redirect URLs สำหรับ production domain
- [ ] ตั้งค่า environment variables สำหรับ production
- [ ] ทดสอบ OAuth flows ใน production
- [ ] ตั้งค่า email templates ใน Supabase
- [ ] Monitor authentication logs
