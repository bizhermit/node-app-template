const path = require("path");
const fse = require("fs-extra");

const srcRootPath = path.join(__dirname, "../src");
const pageRootPath = path.join(srcRootPath, "pages");
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

    let pathName =  path.join(dirName, /index.ts[x]?$/.test(name) ? "" : name);
    pathName = pathName.replace(path.extname(pathName), "");

    if (api) {
      apis.push(`/${path.relative(apiRootPath, pathName).replace(/\\/g, "/")}`);
      return;
    }

    pages.push(`/${path.relative(pageRootPath, pathName).replace(/\\/g, "/")}`);
  });
}
main(pageRootPath);

fse.writeFileSync(path.join(srcRootPath, "route.d.ts"), `type PagePath = ${(() => {
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
})()};`);
process.stdout.write("\n");