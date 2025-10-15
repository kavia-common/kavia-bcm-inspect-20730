# ESLint configuration notes

This project uses Create React App (via CRACO), which already brings `eslint-config-react-app`. That configuration bundles and manages `eslint-plugin-react-hooks`.

To avoid the common build error:

```
Plugin "react-hooks" was conflicted between "package.json » eslint-config-react-app" and ".eslintrc.json"
```

we rely exclusively on the `react-app` presets and do NOT re-declare the `react-hooks` plugin or duplicate its rules in `.eslintrc.json`.

Key points:
- `.eslintrc.json` extends from "react-app" and "react-app/jest" only.
- Do not add "plugins": ["react-hooks"] or "extends": ["plugin:react-hooks/recommended"] locally.
- If you need rule tweaks, prefer adding targeted rule overrides without adding the plugin again.
- If you must customize TypeScript files, use "overrides" targeting **/*.ts and **/*.tsx but still avoid re-adding the plugin.

If you see conflicts, check:
- `package.json` does not force a conflicting version of `eslint-plugin-react-hooks` that overrides CRA’s. Prefer removing `eslint-plugin-react-hooks` from devDependencies and relying on `eslint-config-react-app` to manage it.
- `.eslintrc.*` files do not re-declare `react-hooks`.

With this setup, `npm run build` should complete without ESLint plugin conflicts.
