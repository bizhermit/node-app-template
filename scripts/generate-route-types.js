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

    const pathName = path.join(dirName, /index.ts[x]?$/.test(name) ? "" : path.basename(name, path.extname(name)));

    if (api) {
      const relativePathName = `/${path.relative(apiRootPath, pathName).replace(/\\/g, "/")}`;
      apis.push(relativePathName);

      // const variableLine = `const pathname = "${relativePathName}";`;
      // let content = fse.readFileSync(fullName).toString();
      // const variable = content.match(/const pathname[\s]?=[\s]?\"[^"]+\"[;]?/);
      // if (variable) {
      //   if (variable[0] === variableLine) return;
      //   content = content.replace(variable[0], variableLine);
      // } else {
      //   const lines = content.split(/[\r]?\n/g);
      //   let findex = -1;
      //   lines.forEach((line, index) => {
      //     if (line.startsWith("import ")) findex = index;
      //   });
      //   lines.splice(findex + 1, 0, `${findex < 0 ? "" : "\n"}${variableLine}`);
      //   content = lines.join("\n");
      // }
      // fse.writeFileSync(fullName, content);
      return;
    }

    pages.push(`/${path.relative(pageRootPath, pathName).replace(/\\/g, "/")}`);
  });
}
main(pageRootPath);

fse.writeFileSync(path.join(srcRootPath, "route.d.ts"), `// generate by script\n// do not edit\n\ntype PagePath = ${(() => {
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
    return `  "${pathname}": typeof import("@/pages/api${pathname}");`;
  }).join("\n");
})()}\n};`);
process.stdout.write("\n");