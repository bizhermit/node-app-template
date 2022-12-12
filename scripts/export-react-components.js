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
fse.copySync(path.join(projectRoot, "src/index.d.ts"), path.join(root, "src/index.d.ts"));
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