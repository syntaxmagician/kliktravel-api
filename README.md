# KlikTravel API

Backend NestJS + Prisma + PostgreSQL untuk frontend **kliktravel-1** (storefront + admin CMS).

Swagger: `/docs`

## Model & endpoint (selaras frontend)

| Frontend | Public | Admin |
|---|---|---|
| Regions / destinations | `GET /destinations?locale=id\|en` | CRUD `/admin/destinations` |
| Curated journeys | `GET /journeys?locale=id\|en` | CRUD `/admin/journeys` |
| Open trips / tour packages | `GET /open-trips?locale=id\|en` | CRUD `/admin/open-trips` |
| Journal | `GET /journal` | CRUD `/admin/journal` |
| Testimonials | `GET /testimonials` | CRUD `/admin/testimonials` |
| Private trip inquiries | `POST /private-trip-requests` | GET/PATCH/DELETE `/admin/private-trips` |
| Settings | `GET /settings/public` | GET/PUT `/admin/settings` |
| Media upload | — | `POST /admin/media/upload` |
| Auth | `POST /auth/login` | `GET /auth/me` |

Response publik destinations/journeys/open-trips mengikuti shape TypeScript di frontend (`RegionDestination`, `Journey`, `TourPackageDetail`).

## Quick start

```bash
docker compose up -d
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate reset --force
npm run start:dev
```

- API: http://localhost:3000  
- Swagger: http://localhost:3000/docs  

**Admin seed:** `admin@kliktravel.id` / `admin123` (override via `.env`)

## Notes

- Role admin tunggal: `ADMIN` (JWT Bearer)
- Locale query `?locale=id|en` untuk destinations, journeys, open-trips
- Journal & testimonials bilingual via field `*ID` / `*EN`
- Booking / Midtrans / etalase lama sudah dihapus agar schema cocok dengan frontend CMS
