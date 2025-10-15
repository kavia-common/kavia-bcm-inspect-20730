# CI build notes

- Use npm ci when package-lock.json is present:
  - npm ci --no-audit --no-fund
- Postinstall is a no-op in CI and Amplify environments. Local developers can run:
  - npm run rebuild:local
- Optional dependencies are omitted via .npmrc (omit=optional) to reduce install footprint and avoid native rebuilds that can be killed in constrained environments.
- Scripts do not require /bin/bash; standard Node/npm scripts are used.
- Build command:
  - npm run build (craco build)

If using AWS Amplify:
- Prefer a preBuild step of:
  - if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi
- Ensure no custom postinstall triggers a rebuild: our postinstall is a no-op by default in CI.

ESLint:
- Follow docs/ESLINT_NOTES.md to avoid plugin conflicts during craco build.
