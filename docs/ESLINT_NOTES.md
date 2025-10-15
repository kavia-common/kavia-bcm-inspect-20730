# ESLint configuration notes

We added a local `.eslintrc.json` to ensure the `eslint-plugin-react-hooks` is properly registered during the build. This addresses the error:

- Definition for rule 'react-hooks/exhaustive-deps' was not found.

Key points:
- The repository already declares `eslint-plugin-react-hooks` in `devDependencies`.
- CRA/CRACO builds can still fail to resolve rules when a local ESLint config is not present or doesn't register the plugin.
- Our `.eslintrc.json` extends `react-app` and `plugin:react-hooks/recommended`, and explicitly lists the plugin and rules.

If you change React versions or CRA tooling, ensure the plugin remains compatible:
- eslint-plugin-react-hooks: ^7 (compatible with React 18+)
