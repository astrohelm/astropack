<h1 align="center">Astrohelm default workspace</h1>

<h2 align="center">Installation guide 🚀</h2>

### First step: workspace installation

Use next commands to install and update your workspace

```bash
  # Download repository
  git clone https://github.com/astrohelm/workspace
  rm -rf ./workspace/.git ./workspace/package-lock.json
  cd ./workspace
  # Update and install dependencies
  ncu -u
  npm i
  # Update node.js (optional()
  nvm install latest
  nvm use latest
```

### Second step: Package personalization

Update package json, all with prefix <code>your-</code><br/>
If your nodejs version newer than package.json current add <code>|| your-node-version</code>.

```js
// package.json
{
  "license": "MIT",
  "version": "0.0.1",
  "type": "commonjs",
  "name": "your-package-name",
  "homepage": "https://astrohelm.ru",
  "description": "your-package-description",
  "author": "your-name <your-mail>",
  "keywords": ["your-keyword #1", "your-keyword #n"],

  "main": "index.js",
  "types": "types/index.d.ts",
  "packageManager": "npm@9.6.4",
  "readmeFilename": "README.md",
  "engines": { "node": "18 || 19 || 20" },
  "browser": {},
  "files": ["/dist", "/lib", "/types"],

  "scripts": {
    "test": "node --test && tsc",
    "dev": "node index.js",
    "prettier:fix": "prettier --write \"**/*.{js,ts,json,html,cjs,md,yaml}\"",
    "eslint:fix": "eslint --fix \"**/*.{js,ts}\""
  },

  "repository": { "type": "git", "url": "git+https://github.com/astrohelm/your-package-name.git" },
  "bugs": { "url": "https://github.com/astrohelm/your-package-name/issues", "email": "your-mail" },

  "devDependencies": {
    "@types/node": "^18.15.10",
    "eslint": "^8.40.0",
    "eslint-config-astrohelm": "^1.0.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-prettier": "^4.2.1",
    "prettier": "^2.8.8",
    "typescript": "^5.0.2"
  }
}
```

### Third step: About files

Go to CHANGELOG.md and update it for your package.

```md
<!-- CHANGELOG.md -->
# Changelog

## [Unreleased][unreleased]

## [0.0.1][] - xxxx-xx-xx

- Stable release version
- Repository created

[unreleased]: https://github.com/astrohelm/your-package-name/compare/release...HEAD
[0.0.1]: https://github.com/astrohelm/your-package-name/releases/tag/release
```

Update AUTHORS

```md
 <!-- AUTHORS -->
your-name <your-mail>
```

### Last step: Save results

_WARNING !_ Update this file before moving throw this step.

Create a new package in [organization][https://github.com/astrohelm/] repository.
Use next commands to save you package.

```bash
git init
git remote add origin your-package-location
git branch -M main # if your default branch is not main
git add .
git commit -m "Repository init"
git push origin main
```

Return to your organization repository and do:

- Add keywords
- Update description
- Draft release with `release` tag and `v1.0.0` as a title and this file as description.

> If you creating library you may publish it now to npm with `npm publish` command.

Congratulations, package initialized 🚀


## About files & structure

This workspace have commonjs in use by default. You can switch it in package.json if you want.

- `dist` directory used for fronted package analog. You can use it if your package is multi-platform based.
- `eslint` astrohelm eslint rules
- `types` .d.ts library types exports
- `CHANGELOG.md` in use for project history documentation
- `Makefile` ultimate commands shortcuts creator
- `tests` here you can put all test coverage of your package
- `.github` github ci pipeline by default
- `lib` folder should contain all you library logic, _WARNING !_ Remove if you not writing library. Replace with src folder.

<h2 align="center">Copyright & contributors</h2>

<p align="center">
Copyright © 2023 <a href="https://github.com/LeadFisherSolutions/workspace-example/graphs/contributors">Leadfisher contributors</a>.
Workspace is <a href="./LICENSE">MIT licensed</a>.<br/>
Workspace is part of <a href="https://github.com/astrohelm">astrohelm ecosystem</a>.
</p>
