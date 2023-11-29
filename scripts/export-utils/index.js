const path = require("path");
const fse = require("fs-extra");

const projectRoot = path.join(__dirname, "../../");
const root = path.join(projectRoot, "/dist/libs/utils");
if (!fse.existsSync(root)) {
  process.stdout.write(`no directory: ${root}\n`);
  process.exit();
}

const projectRootPkg = JSON.parse(fse.readFileSync(path.join(__dirname,"package.json")).toString());
const version = (projectRootPkg.version ?? "").match(/(\d)\.(\d)\.(\d)(?:$|\-([^\.]*)\.(\d))/) ?? [];
let majorVer = Number(version[1] ?? 0);
let minorVer = Number(version[2] ?? 0);
let patchVer = Number(version[3] ?? 0);
const preVerName = version[4];
let preVer = preVerName ? Number(version[5] ?? 0) : undefined;
console.log("current version", majorVer, minorVer, patchVer, preVerName, preVer);
if (preVerName) {
  preVer++;
} else {
  patchVer++;
}
console.log("new version", majorVer, minorVer, patchVer, preVerName, preVer);

const pkg = {
  ...projectRootPkg,
};
const authorName = (pkg.author ?? "").match(/([^(<|\())]*)(\s|$)/)?.[1] ?? "";
fse.writeFileSync(path.join(root, "package.json"), JSON.stringify(pkg, null, 2));

const license = `
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