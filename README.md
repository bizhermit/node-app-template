# Development Preparation

## Local

1. Install [Node.js](https://nodejs.org/) over v16
2. Execute commands.

## Docker (VSCode Remote)

1. Install [Docker](https://www.docker.com/) and start.
2. [Reopen in Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) at [Visual Studio Code](https://code.visualstudio.com/).
3. Execute commands.

# Commands

## Common

### install deps

```bash
npm i
```

### ESLint

```bash
npm run lint
```

## Frontend (Next.js)

### debug start

```bash
npm run dev
```

### start

```bash
npm run next
```

### export

```bash
npm run export
```

When completed, check `./dist/out`.

## Frontend + Backend (Next.js + Express)

### debug start

```bash
npm run dev:nexpress
```

### start

```bash
npm run nexpress
```

## Desktop (Next.js + Electron)

### debug start

```bash
npm run nextron
```

### build (generate executer)

```bash
npm run dist
```

When completed, check `./dist/pack`.

### pack (generate installer)

```bash
npm run pack
```

When completed, check `./dist/pack`.