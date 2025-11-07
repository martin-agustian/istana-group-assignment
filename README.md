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
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

4. Run the app
```bash
npm run dev
```
Open http://localhost:3000 in your browser.