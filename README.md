# رفيق رمضان - Ramadan Companion (Web + PWA Beta)

تطبيق رمضاني متكامل يساعد على تنظيم العبادات اليومية عبر:
- خطة ختمة القرآن
- مصحف أساسي مع بحث وعلامات
- مواقيت الصلاة (AlAdhan)
- اتجاه القبلة (بوصلة + خريطة)
- الأذكار اليومية
- مكتبة إسلامية موثقة

## المتطلبات
- Node.js 22+
- npm 10+
- PostgreSQL (لخصائص Push server-side)

## التشغيل محليًا

```bash
cd /Users/titotitos/Documents/Tito/ramadan-companion
npm install
cp .env.example .env.local
npm run prisma:generate
npm run dev
```

افتح: [http://localhost:3000](http://localhost:3000)

## إعداد قاعدة البيانات

```bash
npm run prisma:dbpush
```

## الاختبارات

```bash
npm run lint
npm run test
npm run test:e2e
npm run build
```

## واجهات API
- `GET /api/prayer-times?lat={number}&lng={number}&date={YYYY-MM-DD}&method={id}`
- `GET /api/imsakiya?lat={number}&lng={number}&method={id}&year={hijriYear?}`
- `GET /api/quran/surah/{surahNumber}`
- `GET /api/library`
- `POST /api/push/subscribe`
- `POST /api/push/unsubscribe`
- `POST /api/push/reminder-preferences`
- `POST /api/push/test`
- `GET /api/cron/push`

## ملاحظات النسخة التجريبية
- البيانات الشخصية لا تتبع سلوكيًا.
- بدون تسجيل دخول؛ البيانات الأساسية تحفظ محليًا عبر IndexedDB.
- Push يحتاج مفاتيح VAPID وقاعدة بيانات Postgres.

## GitHub Actions

تم إعداد مسارين في GitHub Actions:
- `CI` في الملف `.github/workflows/ci.yml`
  - يشغّل: `lint` + `unit tests` + `build` + `Playwright E2E`
- `Deploy to Vercel` في الملف `.github/workflows/deploy-vercel.yml`
  - يعمل عند `push` على `main` أو تشغيل يدوي

### الأسرار المطلوبة للنشر
أضف هذه الأسرار في إعدادات المستودع على GitHub:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
