# Fallacy

Debate platform with rooms, rules, participants, and spectators. This repository is a monorepo managed with Yarn Workspaces and Turborepo.

## Repository Structure

- `apps/next`: Next.js web app (`fallacy-web`).
- `apps/nest`: NestJS API (`fallacy-nest`).
- `apps/expo`: Expo mobile app (`fallacy-mobile`).
- `packages/types`: Shared types and interfaces (`@fallacy/types`).

## Requirements

- Node.js 22. Use the root `.nvmrc` when possible.
- Yarn 1.x. The root `package.json` declares `packageManager: yarn@1.22.19`.
- Expo Go or native simulators if you work on `apps/expo`.

## Setup

Install dependencies from the monorepo root:

```bash
yarn install
```

Set up the web app environment:

```bash
cp apps/next/.env.template apps/next/.env.local
```

Set up the API environment:

```bash
cp apps/nest/.env.example apps/nest/.env
```

Set up the mobile app environment:

```bash
cp apps/expo/.env.example apps/expo/.env.local
```

Fill the generated files with the values required by your local services:

- `apps/next/.env.local`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ROOM_SHOULD_MOCK`.
- `apps/nest/.env`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_URL`, `DIRECT_URL`, `PORT`, `CORS_ORIGIN`.
- `apps/expo/.env.local`: `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Development

Run each app from the monorepo root:

```bash
yarn dev:next
yarn dev:nest
yarn dev:expo
```

Useful workspace-specific commands:

```bash
yarn workspace fallacy-mobile android
yarn workspace fallacy-mobile ios
yarn workspace fallacy-mobile web
yarn workspace fallacy-nest prisma:generate
yarn workspace fallacy-nest prisma:migrate
yarn workspace fallacy-nest test
```

Use these commands when you need shared packages compiled before starting an app:

```bash
yarn start:next
yarn start:nest
```

## Root Scripts

- `yarn dev:next`: starts the Next.js app in development mode.
- `yarn dev:nest`: starts the NestJS API in watch mode.
- `yarn dev:expo`: starts the Expo development server.
- `yarn compile`: runs the Turborepo `compile` pipeline.
- `yarn check-types`: runs TypeScript checks across workspaces.
- `yarn test`: runs the test suites across workspaces.
- `yarn lint`: runs ESLint with auto-fix across workspaces.
- `yarn lint:ci`: runs ESLint in CI mode across workspaces.
- `yarn format`: formats files across workspaces.
- `yarn check-format`: checks formatting across workspaces.
- `yarn clean`: removes root and workspace `node_modules`, then clears caches.

After `yarn install`, the `prepare` script installs Husky hooks. Pre-commit checks are handled by `lint-staged`.

## Monorepo Conventions

- Keep comments, documentation, user-facing copy, variables, functions, and error messages in English.
- Prefer `const` plus arrow functions for helpers, utilities, and React components. Framework-required class methods are allowed in NestJS.
- Boolean variables, props, parameters, and state slices should use the `is` prefix, such as `isOpen`, `isLoading`, or `isValid`.
- Do not use nested ternaries. Prefer explicit helpers, `if` statements, or separate JSX conditions.
- If the same npm package is imported by two or more workspaces under `apps/*` or `packages/*`, declare it once in the root `package.json` and remove it from child `package.json` files.
- Keep shared contracts in `packages/types` and import them through `@fallacy/types`.
- UI primitives from shadcn live under `apps/next/src/components/ui/shadcnComponents`; product-level wrappers live above that layer in `apps/next/src/components/ui`.
- Client-facing API errors must be generic and must not expose environment names, stack traces, provider details, or configuration hints.

## Quality Checks

Before opening a pull request, run:

```bash
yarn check-format
yarn compile
yarn check-types
yarn lint:ci
yarn test
```

The GitHub workflow at `.github/workflows/ci.yml` runs the same quality gates on pull requests and pushes to `main`.

## Contributing

Branch workflow, pull request guidance, and review practices live in [CONTRIBUTING.md](./CONTRIBUTING.md).
