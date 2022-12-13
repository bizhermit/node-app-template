const path = require("path");
const fse = require("fs-extra");
const { isEmpty } = require("@bizhermit/basic-utils/dist/string-utils");

const projectRoot = path.join(__dirname, "../");
const root = path.join(projectRoot, "/dist/libs/react-components");
if (!fse.existsSync(root)) {
  process.stdout.write(`no directory: ${root}\n`);
  process.exit();
}

fse.copySync(path.join(projectRoot, "src/styles"), path.join(root, "src/styles"));
fse.copySync(path.join(projectRoot, "src/global.d.ts"), path.join(root, "src/global.d.ts"));
fse.copySync(path.join(projectRoot, "src/styles.d.ts"), path.join(root, "src/styles.d.ts"));

const impl = (basePath = root, nest = 0) => {
  const dirs = fse.readdirSync(basePath);
  dirs.forEach(dir => {
    const name = path.join(basePath, dir);
    const stat = fse.statSync(name);
    if (stat.isDirectory()) {
      impl(name, nest + 1);
      return;
    }
    const ext = path.extname(name);
    if (isEmpty(ext)) return;
    const nestPath = path.join(root, "src").replace(/\\/g, "/");
    const regExp = new RegExp(`(?<=(?:require\\(|@use\\s)")(${nestPath.replace(/\//g, "\\/").replace("\:", "\\:")})([^"]*)(?="(?:\\)|))`, "g");
    if (ext === ".js" || ext === ".scss") {
      let content = fse.readFileSync(name).toString()
        .replace(/(?<=(?:require\(|@use\s)")(@\/)([^"]*)(?="(?:\)|))/g, `${nestPath}/$2`)
        .replace(/(?<=(?:require\(|@use\s)")(\$\/)([^"]*)(?="(?:\)|))/g, `${nestPath}/styles/$2`);
      content.match(regExp)?.forEach(item => {
        let relativePath = path.relative(basePath, item).replace(/\\/g, "/");
        if (!relativePath.startsWith(".")) relativePath = `./${relativePath}`;
        content = content.replace(item, relativePath);
      });
      fse.writeFileSync(name, content);
    }
  });
};

impl();

fse.copySync(path.join(root, "src"), path.join(root, "dist"))
fse.removeSync(path.join(root, "src"));

const projectRootPkg = JSON.parse(fse.readFileSync(path.join(projectRoot, "package.json")).toString());
// const version = (projectRootPkg.version ?? "").match(/(\d)\.(\d)\.(\d)(?:$|\-([^\.]*)\.(\d))/) ?? [];
// const majorVer = Number(version[1] ?? 0);
// const minorVer = Number(version[2] ?? 0);
// const patchVer = Number(version[3] ?? 0);
// const preVerName = version[4];
// const preVer = preVerName ? Number(version[5] ?? 0) : undefined;
// console.log("version", majorVer, minorVer, patchVer, preVerName, preVer);

const pkg = {
  "name": "react-components",
  "version": projectRootPkg.version ?? "0.0.0-alpha.0",
  "description": "React components",
  "keywords": [
    "react",
    "react-components",
    "ui"
  ],
  "author": "Senda Ryoichi <rsenda@bizhermit.com> (https://bizhermit.com)",
  "license": "MIT",
  "files": [
    "dist"
  ],
  "dependencies": {
    "@bizhermit/basic-utils": "^2.0.0",
    "@bizhermit/time": "^2.0.0"
  },
  "peerDependencies": {
    "react": "18.X",
    "react-dom": "18.X",
    "sass": "^1.56.1"
  }
};
const authorName = (pkg.author ?? "").match(/([^(<|\())]*)(\s|$)/)?.[1] ?? "";
fse.writeFileSync(path.join(root, "package.json"), JSON.stringify(pkg, null, 2));

const license =
  `
MIT License

Copyright (c) __YEAR__ __NAME__

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
fse.writeFileSync(path.join(root, "LICENSE"),
  license
    .replace(/__YEAR__/g, new Date().getFullYear())
    .replace(/__NAME__/g, authorName)
);