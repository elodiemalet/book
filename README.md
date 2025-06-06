# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Database

The database is configured in `server/utils/db.ts`. You can change the database configuration according to your needs.

### Migrations

To create a new migration, run the following command:

```bash
# npm
npm run db:migrate:create <name>

# pnpm
pnpm run db:migrate:create <name>

# yarn
yarn run db:migrate:create <name>

# bun
bun run db:migrate:create <name>
```

This will create a new migration file in the `migrations` directory.

To run the migrations, run the following command:

```bash
# npm
npm run db:migrate

# pnpm
pnpm run db:migrate

# yarn
yarn run db:migrate

# bun
bun run db:migrate
```

This will run all the migrations in the `migrations` directory.