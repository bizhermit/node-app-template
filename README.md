# Development Preparation

## Local

1. Install [Node.js](https://nodejs.org/) over v16
2. Execute commands.

## Docker (VSCode Remote)

1. Install [Docker](https://www.docker.com/) and start.
2. [Reopen in Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) at [Visual Studio Code](https://code.visualstudio.com/)[^1].
3. Execute commands.

[^1] config `dev.containers.mountWaylandSocket` set `false` when use windows and wsl.

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

```bashp
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

---

## Other

### Prepare to connect and check from an external terminal for debugging

#### add portproxy

```ps
netsh interface portproxy add v4tov4 listenaddress=<ipv4 address> listenport=3000 connectaddress=127.0.0.1 connectport=3000
```

#### delete portproxy

```ps
netsh interface portproxy delete v4tov4 listenaddress=<ipv4 address> listenport=3000
```

#### show portproxy

```ps
netsh interface portproxy show v4tov4
```

---

## Relase

### Docker Container

#### start

##### 1. change working directory to `.production`

```bash
cd .production
```

##### 2. build container and start

```bash
docker-compose up -d
```

#### stop

```bash
docker-compose stop
```

#### stop and cleanup

```bash
docker-compose down --rmi all --volumes --remove-orphans
```

---

## Use this template

Merge what is generated from this repository to the generated repository.

1. navigate to the workspace of the generated repository
   
2. add this repository as a remote

```bash
git remote add node-app-template git@github.com:bizhermit/node-app-template.git
```

3. fetch the node-app-template

```bash
git fetch node-app-template
```

4. merge node-app-template into the generated repository.

```bash
git merge --allow-unrelated-histories node-app-template/main
```