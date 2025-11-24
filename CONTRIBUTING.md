# Contribution Guide

We're glad you're interested in contributing Papilio! In this document you will find the information you need to contribute to the project.

## Issues

TBD

## Pull Requests

TBD

## Localization (I10n)

Papilio uses Misskey and Sharkey's localization files. For Papilio itself, localization files are located in the `locales-source/sukerbuka` directory.

## Development

### Setup

Before developing, you have to set up the development environment. Please refer to the `README.md` file for detailed instructions on setting up the development environment.

### Testing

TBD

### Linting and Formatting

Papilio uses ESLint and Prettier for code linting and formatting. You can run the following commands to check and fix code style issues:

```sh
pnpm lint # check linting issues
pnpm format # fix auto-fixable issues
```

Please ensure that your code passes linting and formatting checks before submitting a pull request.

## Continuous Integration

Papilio uses GitHub Actions for continuous integration. The CI pipeline runs tests, linting, and builds the project to ensure code quality. Configuration files for GitHub Actions are located in the `.github/workflows` directory.

## Technical Informations

### React

Papilio is built using React. If you're not familiar with React, we recommend checking out the official [React documentation](https://reactjs.org/docs/getting-started.html) to get started.

[React Compiler](https://react.dev/learn/react-compiler) is used for building the project. Thus, you can safely forget your `useMemo`, `useCallback` worries and focus on writing clean and simple code.

### TypeScript

Papilio is developed using TypeScript. If you're new to TypeScript, please refer to the official [TypeScript documentation](https://www.typescriptlang.org/docs/) for more information.

Please make sure to pass strict type checks when contributing code to Papilio. This helps maintain code quality and prevents potential runtime errors.

### TanStack

Papilio uses TanStack libraries such as [React Query](https://tanstack.com/query/latest) and [React Router](https://tanstack.com/router/latest) for data fetching and routing. Familiarity with these libraries will be beneficial when contributing to the project.

