# Hono Open API Starter

A starter template for building fully documented type-safe JSON APIs with Hono and Open API.
forked from [hono-open-api-starter](https://github.com/w3cj/hono-open-api-starter)

> For a cloudflare specific template, see the [cloudflare branch](https://github.com/w3cj/hono-open-api-starter/tree/cloudflare) on this repo and the [cloudflare-drizzle-v0.35 branch](https://github.com/w3cj/hono-open-api-starter/tree/cloudflare-drizzle-v0.35)

> For other deployment examples see the [hono-node-deployment-examples](https://github.com/w3cj/hono-node-deployment-examples) repo

1. [Hono Open API Starter](#hono-open-api-starter)
	1. [Included](#included)
	2. [Setup](#setup)
	3. [Code Tour](#code-tour)
	4. [Endpoints](#endpoints)
	5. [References](#references)

## Included

- Structured logging with [pino](https://getpino.io/) / [hono-pino](https://www.npmjs.com/package/hono-pino)
- Documented / type-safe routes with [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- Interactive API documentation with [scalar](https://scalar.com/#api-docs) / [@scalar/hono-api-reference](https://github.com/scalar/scalar/tree/main/packages/hono-api-reference)
- JSend standard response schema [jsend](https://github.com/omniti-labs/jsend)
- Type-safe schemas and environment variables with [zod](https://zod.dev/)
- Single source of truth database schemas with [drizzle](https://orm.drizzle.team/docs/overview) and [drizzle-zod](https://orm.drizzle.team/docs/zod)
- Testing with [vitest](https://vitest.dev/)
- Sensible editor, formatting and linting settings with [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## Setup

Clone this template without git history

```sh
npx degit hi-reeve/hono-open-api-starter my-api
cd my-api
```

Create `.env` file

```sh
cp .env.example .env
```

Install dependencies

```sh
pnpm install
```

Create postgres db / push schema

```sh
pnpm drizzle-kit push
```

Run

```sh
pnpm dev
```

Lint

```sh
pnpm lint
```

Test

```sh
pnpm test
```

## Code Tour

Base hono app exported from [app.ts](./src/app.ts). Local development uses [@hono/node-server](https://hono.dev/docs/getting-started/nodejs) defined in [index.ts](./src/index.ts) - update this file or create a new entry point to use your preferred runtime.

Typesafe env defined in [env.ts](./src/env.ts) - add any other required environment variables here. The application will not start if any required environment variables are missing

All app routes are grouped together and exported into single type as `AppType` in [app.ts](./src/app.ts) for use in [RPC / hono/client](https://hono.dev/docs/guides/rpc).

## Endpoints

| Path            | Description              |
| --------------- | ------------------------ |
| GET /docs       | Open API Specification   |
| GET /references | Scalar API Documentation |
| GET /           | Api Welcome Index        |

## References

- [What is Open API?](https://swagger.io/docs/specification/v3_0/about/)
- [Hono](https://hono.dev/)
  - [Zod OpenAPI Example](https://hono.dev/examples/zod-openapi)
  - [Testing](https://hono.dev/docs/guides/testing)
  - [Testing Helper](https://hono.dev/docs/helpers/testing)
- [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- [Scalar Documentation](https://github.com/scalar/scalar/tree/main/?tab=readme-ov-file#documentation)
  - [Themes / Layout](https://github.com/scalar/scalar/blob/main/documentation/themes.md)
  - [Configuration](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)
