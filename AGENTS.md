# Vibe Development Guidelines

Defines coding standards, structure, and agent workflows in this project

## Project Overview

[codex, implement!]

## Project Docs

- Implementation plan: `.agents/docs/kid-glue-demo-plan.md`

## Project Stack

- Language: TypeScript 5.x
- Framework: React 19.x
- UI: Tailwind CSS 4.x, shadcn
- Data: SWR, Zod
- Build Tool: Vite
- Package Manager: bun
- Linting: ESLint

## Commands

- `bun install` — install dependencies
- `bun run dev` — start dev server
- `bun run build` — build for production
- `bun run preview` — preview production build
- `bun run lint` — run linting

## Conventions

- ALWAYS update (all nested) AGENTS.md files when facing relevant updates
- Prefer the most elegant and short solution; avoid premature optimization.
- For type assertions, null checks, and sharable abstract helpers, copy needed functions from [https://github.com/souljorje/utilities](https://github.com/souljorje/utilities)

## Code Style

- Formatting: 2-space indentation
- Paradigm: Prefer functional and declarative programming patterns
- Naming: `PascalCase` for types/classes/enums/components/component folders, `SCREAMING_SNAKE_CASE` for global constants, `kebab-case` for pages, `camelCase` for the rest, Enums must be named with singular nouns or noun phrases, e.g. _OperationStatus_ instead of _OperationStatuses_
- Typing: use Zod-derived domain types; enable strict mode.
- Components: functional React components with hooks; avoid classes
- Imports: Use path aliases (@d, @api, @ui, @lib, @config) for clean imports
- Declarativity: Prefix boolean props/variables with is, has, should (e.g., isLoading, hasError)

## Do

- ALWAYS install latest stable package version initially
- Follow data flow: api > repo + mapper > query > [hook] > page
- Follow import order: app > pages > domains > shared
- ALWAYS keep folders flat until logical grouping is required
- Export only via {layer}.ts or layer/index.ts inside each layer
<!-- - Use Zod schemas for all validation boundaries -->
- Export functions and constants separately for tree-shaking
- Declare routes in app/
- Name pages in kebab-case
- ALWAYS use context7 MCP when working with third-party packages for the latest guides and code patterns

## Don’t

- Don't import directly from another domain’s internal subfolder
- Don't mix API I/O logic with domain logic
- Don't Introduce side effects in mappers
- Don't unite functions under object for export
- Don't declare routes in domains
- Don't hardcode colors
- Don't adjust multi-line class strings
- Don't use kebab-case for folder-naming except .src/pages
- Don't create excessive folders
- Dont' write classNames in jsx as arrays and then .join(' ')
- Don't use void as function return
- Don't use deprecated features

## Path Aliases

- `@d/* → src/domains/*`
- `@api/* → src/shared/api/*`
- `@ui/* → src/shared/ui/*`
- `@lib/* → src/shared/lib/*`
- `@config/* → src/shared/config/*`

## Project Structure

```text
└── backend/
    ├── src [codex, help me to define backend if it's needed for this project]
└── frontend/
    ├── src/
    │   ├── domains/
    │   │   └── {domain}/              # business domain
    │   │       ├── model/             # data contracts and access
    │   │       │   ├── schemas.ts     # Zod schemas (raw + domain), types, branded aliases
    │   │       │   ├── mappers.ts     # raw data → domain data (pure functions) using schemas
    │   │       │   ├── repos.ts       # composes @api calls and mappers
    │   │       │   ├── queries.ts     # declarative SWR wrappers, composes repos
    │   │       │   ├── hooks.ts       # composes queries, add logic, utilize workflows
    │   │       │   └── index.ts       # exports * from queries and hooks
    │   │       ├── ui/                # presentational UI components
    │   │       ├── widgets/           # complex components that compose model/ and ui/
    │   │       ├── lib/               # utilities
    │   │       ├── config/             # configuration
    │   │       └── index.ts           # public API, exports * from model/, widgets/ and ui/
    │   ├── shared/
    │   │   ├── api/                   # external API clients, no business logic
    │   │   │   └── {service}/         # external API service
    │   │   │      ├── schemas.ts      # Zod schemas and types
    │   │   │      └── index.ts        # thin API client, simple http requests
    │   │   ├── lib/                   # shared utilities
    │   │   ├── ui/                    # shared presentational UI components (buttons, modals, etc.)
    │   │   └── config/                 # global settings
    │   ├── pages/                     # route-level components, compose domain and shared UI
    │   ├── app/                       # app entrypoint, routing, providers
    │   └── index.ts                   # bunlder entrypoint
    ├── .gitignore
    ├── AGENTS.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── tsconfig.json
```

## Architecture

Domain-oriented design: each business entity (domain) is an isolated module with its own data, logic, UI and public API. This allows replacing or scaling domains independently without affecting others.

### Strict layering

- Layer can import only from layers above it: app > pages > domains > shared
- Each layer ALWAYS has entryfile index.ts
- schemas.ts uses @api/{service}/schemas.ts
- mappers.ts uses schemas.ts
- repos.ts uses mappers.ts + @api/{service}/index.ts
- queries.ts uses repos.ts
- hooks.ts composes queries.ts + custom logic
- ui/ components are presentational only (no queries/hooks)
- Domain public API (index.ts) reexports everything from model, widgets and ui
- pages/ compose domains and shared UI

### Data flow

Data flow is unidirectional and type-safe: @api > repos + mappers > queries > hooks > pages

- API (shared/api): raw I/O from external services, no business logic
- Mappers: pure transformations from raw to domain models
- Repos: fetch from API, validate, map w/ mappers, return safe results
- Queries: declarative state management (SWR), caching, and invalidation
- Hooks: orchestrate workflows by composing queries.
- UI: uses only validated domain models, never raw data.

## Commit & Pull Request Guidelines

Follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

- Format: type(scope): summary
- Types: feat, fix, docs, style, refactor, test, chore
- Examples:
  - feat(product): add product detail page
  - fix(auth): handle token refresh edge case

## When stuck

- Ask a clarifying question, propose a short plan, or open a draft PR with notes
- Do not push large speculative changes without confirmation
