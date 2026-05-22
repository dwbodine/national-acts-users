# Agent Development Guidelines

These instructions are for AI coding agents and contributors working in this repository.

## Project defaults

- Use Yarn 4. Do not use npm or pnpm for installs or scripts.
- Keep changes scoped to the requested task.
- Prefer small, reviewable pull requests over broad rewrites.
- Do not modify production environment files, secrets, deployment credentials, or generated build output.
- Do not commit `coverage/`, `.next/`, `out/`, `dist/`, `node_modules/`, or local log files.

## Required validation

Before opening or updating a pull request, run the applicable checks:

```bash
yarn lint
yarn typecheck
yarn test
yarn build
```

For coverage-focused work, also run:

```bash
yarn coverage
```

## Testing guidance

- Add or update tests close to the code being changed.
- Prefer behavior-focused tests over implementation-detail tests.
- For React components, use Testing Library patterns and query the UI the way a user would.
- Mock external services, browser APIs, timers, and routing only where necessary.
- Do not change production behavior just to make tests pass unless the task explicitly requires a testability refactor.

## Pull request expectations

Each pull request should include:

- A short summary of the change.
- The files or areas touched.
- The validation commands run.
- Any known limitations or follow-up work.

## Branch naming

Use descriptive feature branches, for example:

```text
features/2026-05-code-coverage
features/2026-05-global-slice-tests
fix/2026-05-eslint-config
```

## Safety boundaries

Avoid autonomous changes to:

- Authentication and authorization flows.
- Payment or order-processing logic.
- Database schema or migrations.
- Production deployment configuration.
- DNS, Traefik, SSL, or infrastructure settings.

When a task touches one of those areas, keep the PR small and call out the risk clearly in the PR description.
