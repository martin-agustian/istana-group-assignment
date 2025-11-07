## 🚀 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | [Next.js](https://nextjs.org/) (React) |
| Styled Component | [Mui](https://mui.com/material-ui/) |
| Backend | Next.js API Routes |
| ORM | [Prisma](https://www.prisma.io/) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| Auth | Next Auth + JSON Web Token (JWT) |
| Deployment | Docker + docker-compose |

---

## 🔑 User Credential
1. email: selamet@mailinator.com, password: password
2. email: budi@mailinator.com, password: password
3. email: anton@mailinator.com, password: password


---

## 📂 API Structure

```
/api
  /auth/[...nextauth]                                     → Authentication (login/logout)
  /auth
    POST   /login                                         → Login user via api with body { email: email, password: string }
  /order
    POST   /order                                         → Creates order with array body [{ productId: number, quantity: number }]
    GET    /order                                         → Lists own order
    GET    /order/[:orderCode]                            → Detail order
  /product
    GET    /product                                       → List product
```

---

## 📂 FOLDER Structure

```
/prisma
│
├── schema.prisma       → Defines database models and connection setup
├── seed.ts             → Script for generating dummy data into the database
└── migrate/            → Contains Prisma migration history and files

/public                 → Publicly accessible images (e.g., logos, assets)

/src
│
├── app/
│   ├── (Dashboard)/    → UI pages for dashboards (order history, products)
│   ├── (Auth)/         → UI pages for authentication (login)
│   └── api/            → API route handlers (path reflects the folder structure)
│
├── commons/
│   ├── helper/         → Reusable utility functions (e.g., formatters, parsers)
│   ├── error/          → Reusable utility for formatting sweet alert error message
│
├── components/         → Global and reusable UI components (e.g., form inputs, logo, table rows)
│
├── lib/                → Configured libraries and integrations (e.g., auth, prisma)
│
├── schema/             → Form validation schemas (e.g., Zod schemas for inputs, file size limits)
│
├── types/              → Global type definitions (e.g., `User`, `Product`, API request bodies)
│
├── utils/              → Utility files for theming, styling, or non-component utilities
│
└── middleware.ts       → Middleware logic (e.g., route protection, auth guards)
```

---

## ⚡ Development Setup
1. Install dependencies
```bash
npm install
```

2. Create database and Configure environment
Edit your .env:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/your-database-name?schema=public"
JWT_SECRET="your-super-secret-key"
```

3. Migrate & seed database
```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

4. Run the app
```bash
npm run dev
```
Open http://localhost:3000 in your browser.