# Contributing to PulseWatch

Thanks for your interest in improving PulseWatch. Contributions of all sizes are welcome, from typo fixes to new features.

## Getting set up

```bash
git clone https://github.com/gerboi68i/pulsewatch.git
cd pulsewatch
npm install
cp .env.example .env        # fill in the values
npx prisma migrate dev
npm run dev
```

You will need a PostgreSQL database. A free serverless Postgres (such as Neon) works well for development.

## Before you open a pull request

- Run the production build to make sure types and lint pass:
  ```bash
  npm run build
  ```
- Keep changes focused. One feature or fix per pull request is easiest to review.
- Match the existing style: TypeScript, Server Components by default, Server Actions for mutations, Tailwind for styling.
- If you change the data model, include the Prisma migration.

## Reporting bugs and ideas

Open an issue with clear steps to reproduce for bugs, or a short description of the problem you want to solve for feature requests. Screenshots help.

## Code of conduct

Be respectful and constructive. We are here to build something useful together.
