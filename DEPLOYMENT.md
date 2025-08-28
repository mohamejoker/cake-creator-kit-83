
# دليل النشر والتشغيل - Deployment Guide

## 🚀 خيارات النشر

### 1. النشر على Lovable (الأسهل)

المشروع مستضاف حالياً على منصة Lovable ويمكن نشره مباشرة:

```bash
# النشر التلقائي عبر Lovable Dashboard
1. اضغط على زر "Publish" في لوحة Lovable
2. اختر اسم النطاق المرغوب
3. انتظر اكتمال النشر (دقائق قليلة)
```

### 2. النشر على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel --prod

# إعداد متغيرات البيئة في لوحة Vercel
```

### 3. النشر على Netlify

```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# بناء المشروع
npm run build

# نشر المشروع
netlify deploy --prod --dir=dist
```

## ⚙️ إعدادات البيئة للإنتاج

### متغيرات البيئة المطلوبة:

```env
# Supabase Configuration (مطلوب)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id

# إعدادات الإنتاج
VITE_APP_ENV=production
NODE_ENV=production
```

## 🏗️ أوامر البناء

### البناء للإنتاج:
```bash
# بناء المشروع المحسن
npm run build

# معاينة البناء محلياً
npm run preview

# فحص جودة الكود
npm run lint

# إصلاح مشاكل الكود تلقائياً
npm run lint:fix
```

### إعدادات Vite للإنتاج:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false, // إيقاف في الإنتاج
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
```

## 🔧 تحسينات الأداء

### 1. تحسين الصور:
```bash
# ضغط الصور قبل النشر
npm install -g imagemin-cli
imagemin public/images/* --out-dir=public/images/optimized
```

### 2. تحسين CSS:
```bash
# إزالة CSS غير المستخدم
npm install -g purgecss
purgecss --css dist/assets/*.css --content dist/**/*.html
```

### 3. تفعيل التخزين المؤقت:
```nginx
# إعداد nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔐 إعدادات الأمان

### 1. HTTPS إجباري:
```javascript
// إضافة في head
<script>
if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
</script>
```

### 2. Content Security Policy:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;">
```

## 📊 مراقبة الأداء

### 1. Google Analytics (اختياري):
```html
<!-- إضافة في index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 2. مراقبة الأخطاء:
```bash
# تثبيت Sentry (اختياري)
npm install @sentry/react @sentry/tracing
```

## 🗄️ إدارة قاعدة البيانات

### النسخ الاحتياطية:
```sql
-- تصدير البيانات من Supabase
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql

-- استيراد البيانات
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

### مراقبة الاستعلامات:
```sql
-- فحص الاستعلامات البطيئة
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

## 🌍 دعم المناطق الزمنية

```javascript
// إعداد المنطقة الزمنية
const now = new Date().toLocaleString('ar-EG', {
  timeZone: 'Africa/Cairo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
});
```

## 📱 PWA (تطبيق ويب تقدمي)

### إضافة Service Worker:
```javascript
// public/sw.js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### إعداد Manifest:
```json
// public/manifest.json
{
  "name": "سندرين بيوتي",
  "short_name": "Sandreen",
  "description": "منتجات العناية بالبشرة الطبيعية",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🔍 SEO للصفحة الواحدة

### إعداد Meta Tags:
```html
<!-- في index.html -->
<title>سندرين بيوتي - منتجات العناية بالبشرة الطبيعية</title>
<meta name="description" content="اكتشفي أفضل منتجات العناية بالبشرة الطبيعية مع سندرين بيوتي">
<meta name="keywords" content="عناية بالبشرة، منتجات طبيعية، جمال، سندرين">
<meta property="og:title" content="سندرين بيوتي">
<meta property="og:description" content="منتجات العناية بالبشرة الطبيعية">
<meta property="og:type" content="website">
```

## 📈 تحليل الأداء

### فحص Core Web Vitals:
```bash
# تثبيت أدوات الفحص
npm install -g lighthouse
npm install -g @lhci/cli

# فحص الأداء
lighthouse https://your-domain.com --view
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة وحلولها:

1. **خطأ في متغيرات البيئة:**
```bash
# التحقق من المتغيرات
echo $VITE_SUPABASE_URL
```

2. **مشاكل CORS:**
```javascript
// إعداد CORS في Supabase
// Dashboard > Settings > API > CORS Origins
// إضافة: https://your-domain.com
```

3. **مشاكل الذاكرة:**
```bash
# زيادة ذاكرة Node.js
NODE_OPTIONS="--max_old_space_size=4096" npm run build
```

## 📞 الدعم الفني

في حالة وجود مشاكل:
1. راجع logs النشر
2. تأكد من صحة متغيرات البيئة
3. فحص اتصال قاعدة البيانات
4. مراجعة console errors في المتصفح

---

**نشر ناجح = عملاء سعداء! 🎉**
