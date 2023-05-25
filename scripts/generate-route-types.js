const path = require("path");
const fse = require("fs-extra");
const nextConfig = require(path.join(__dirname, "../next.config.js"));

const isAppDir = nextConfig.experimental?.appDir ?? false;

const srcRootPath = path.join(__dirname, "../src");
const pageRootPath = path.join(srcRootPath, isAppDir ? "app" : "pages");
const apiRootPath = path.join(pageRootPath, "api");

const pages = [];
const apis = [];

const main = (dirName, nestLevel = 0, isApi = false) => {
  const items = fse.readdirSync(dirName);
  items.sort((a, b) => {
    if (/index.ts[x]?$/.test(a)) return -1;
    if (/index.ts[x]?$/.test(b)) return 1;
    return 0;
  }).forEach(name => {
    let api = isApi;
    if (nestLevel === 0) {
      if (name.startsWith("_")) return;
      if (name === "api") api = true;
    }
    const fullName = path.join(dirName, name);
    if (fse.statSync(fullName).isDirectory()) {
      main(fullName, nestLevel + 1, api);
      return;
    }

    if (!isAppDir) {
      const pathName = path.join(dirName, /index.ts[x]?$/.test(name) ? "" : path.basename(name, path.extname(name)));

      if (api) {
        const relativePathName = `/${path.relative(apiRootPath, pathName).replace(/\\/g, "/")}`;
        apis.push(relativePathName);
        return;
      }

      pages.push(`/${path.relative(pageRootPath, pathName).replace(/\\/g, "/")}`);
      return;
    }

    if (api) {
      if (/route.ts$/.test(name)) {
        apis.push(`/${path.relative(apiRootPath, dirName).replace(/\\/g, "/")}`);
      }
      return;
    }

    if (/page.ts[x]?$/.test(name)) {
      pages.push(`/${path.relative(pageRootPath, dirName).replace(/\\/g, "/")}`);
    }
  });
}
main(pageRootPath);

fse.writeFileSync(path.join(srcRootPath, "route.d.ts"), `// generate by script\n// do not edit\n\ntype AppDir = ${String(isAppDir)};\n\ntype PagePath = ${(() => {
  process.stdout.write(`-- pages -- ${pages.length}\n`);
  return pages.map(pathName => {
    process.stdout.write(`${pathName}\n`);
    return `"${pathName}"`;
  }).join("\n  | ");
})()};\n\ntype ApiPath = ${(() => {
  process.stdout.write(`\n-- api -- ${apis.length}\n`);
  return apis.map(pathName => {
    process.stdout.write(`${pathName}\n`);
    return `"${pathName}"`;
  }).join("\n  | ");
})()};\n\ntype TypeofApi = {\n${(() => {
  return apis.map(pathname => {
    if (isAppDir) return `  "${pathname}": typeof import("@/app/api${pathname}/route");`;
    return `  "${pathname}": typeof import("@/pages/api${pathname}");`;
  }).join("\n");
})()}\n};`);
process.stdout.write("\n");