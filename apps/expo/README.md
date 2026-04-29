# fallacy-mobile

Mobile app (Expo) for the `fallacy` monorepo. Expo SDK 55, React Native 0.83, React 19.2.

## Development

From the monorepo root:

```bash
yarn dev:expo
yarn workspace fallacy-mobile start
yarn workspace fallacy-mobile ios
yarn workspace fallacy-mobile android
yarn workspace fallacy-mobile web
```

The project is integrated with Yarn Workspaces and Metro. The configuration in
`metro.config.js` adds the monorepo root to `watchFolders` and
`nodeModulesPaths` to resolve hoisted packages, such as `@fallacy/types`.

## Structure

```
apps/expo/
├── App.tsx            # Root component
├── index.ts           # Entry point (registerRootComponent)
├── app.json           # Expo configuration
├── babel.config.js    # Babel preset for Expo
├── metro.config.js    # Metro with monorepo support
├── tsconfig.json      # Extends expo/tsconfig.base
└── eslint.config.mjs  # ESLint flat config
```
