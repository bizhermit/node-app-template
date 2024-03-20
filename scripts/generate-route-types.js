const path = require("path");
const fse = require("fs-extra");

const srcRootPath = path.join(__dirname, "../src");
const appRootPath = path.join(srcRootPath, "app");
const appAlias = "app";
const pageRootPath = path.join(srcRootPath, "pages");
const pagesAlias = "pages";

const nextConfig = require("../next.config");
const extensions = (nextConfig.pageExtensions ?? ["ts", "tsx"]).sort((a, b) => b.length - a.length);

const pagesRoutes = [];
const pagesApiRoutes = [];
const appRoutes = [];
const appApiRoutes = [];

const isNextPathName = (fileName) => {
  return extensions.find(ex => fileName.endsWith("." + ex));
};

const findNextPathName = (fileName, findPathname) => {
  return extensions.find(ex => fileName === `${findPathname}.${ex}`);
};

const pickNextPathName = (fileName) => {
  const ex = isNextPathName(fileName);
  if (ex) return fileName.replace(`.${ex}`, "");;
  return "";
};

const mainForApp = (dirName, nestLevel = 0, underApi = false) => {
  const items = fse.readdirSync(dirName);
  items.sort((a, b) => {
    
    if (findNextPathName(a, "index")) return -1;
    if (findNextPathName(b, "index")) return 1;
    return 0;
  }).forEach(name => {
    let api = underApi;
    if (name.startsWith("@")) return;
    if (name === "api") api = true;

    const fullName = path.join(dirName, name);
    if (fse.statSync(fullName).isDirectory()) {
      mainForApp(fullName, nestLevel + 1, api);
      return;
    }
    
    if (!isNextPathName(name)) return;

    if (api) {
      if (findNextPathName(name, "route")) {
        appApiRoutes.push(`/${path.relative(appRootPath, dirName).replace(/\\/g, "/")}`);
      }
    }

    if (findNextPathName(name, "page")) {
      appRoutes.push(`/${path.relative(appRootPath, dirName).replace(/\\/g, "/").replace(/\/\([^)]*\)/g, "")}`);
    }
  });
};
if (fse.existsSync(appRootPath)) mainForApp(appRootPath);

const mainForPages = (dirName, nestLevel = 0, isApi = false) => {
  const items = fse.readdirSync(dirName);
  items.sort((a, b) => {
    if (findNextPathName(a, "index")) return -1;
    if (findNextPathName(b, "index")) return 1;
    return 0;
  }).forEach(name => {
    let api = isApi;
    if (nestLevel === 0) {
      if (name.startsWith("_")) return;
      if (name === "api") api = true;
    }
    const fullName = path.join(dirName, name);
    if (fse.statSync(fullName).isDirectory()) {
      mainForPages(fullName, nestLevel + 1, api);
      return;
    }

    const pathName = path.join(dirName, findNextPathName(name, "index") ? "" : pickNextPathName(name));

    if (api) {
      const relativePathName = `/${path.relative(pageRootPath, pathName).replace(/\\/g, "/")}`;
      pagesApiRoutes.push(relativePathName);
      return;
    }

    pagesRoutes.push(`/${path.relative(pageRootPath, pathName).replace(/\\/g, "/")}`);
    return;
  });
}
if (fse.existsSync(pageRootPath)) mainForPages(pageRootPath);

const contents = `// generate by script
// do not edit

type AppRoutePath = ${(() => {
  process.stdout.write(`-- app route -- ${appRoutes.length}\n`);
  if (appRoutes.length === 0) return "\"\"";
  return appRoutes.map(pathName => {
    process.stdout.write(`${pathName}\n`);
    return `"${pathName}"`;
  }).join("\n | ");
})()};

type AppApiPath = ${(() => {
  process.stdout.write(`\n-- app api -- ${appApiRoutes.length}\n`);
  if (appApiRoutes.length === 0) return "\"\"";
  return appApiRoutes.map(pathName => {
    process.stdout.write(`${pathName}\n`);
    return `"${pathName}"`;
  }).join("\n | ");
})()};

type TypeofAppApi = {
${(() => {
  return appApiRoutes.map(pathname => {
    return `  "${pathname}": typeof import("${appAlias}${pathname}/route");`;
}).join("\n");
})()}
};

type PagesRoutePath = ${(() => {
  process.stdout.write(`\n-- pages route -- ${pagesRoutes.length}\n`);
  if (pagesRoutes.length === 0) return "\"\"";
  return pagesRoutes.map(pathName => {
    process.stdout.write(`${pathName}\n`);
    return `"${pathName}"`;
  }).join("\n | ");
})()};

type PagesApiPath = ${(() => {
  process.stdout.write(`\n-- pages api -- ${pagesApiRoutes.length}\n`);
  if (pagesApiRoutes.length === 0) return "\"\"";
  return pagesApiRoutes.map(pathName => {
    process.stdout.write(`${pathName}\n`);
    return `"${pathName}"`;
  }).join("\n | ");
})()};

type TypeofPagesApi = {
${(() => {
  return pagesApiRoutes.map(pathname => {
    return `  "${pathname}": typeof import("${pagesAlias}${pathname}");`;
}).join("\n");
})()}
};

type PagePath = AppRoutePath | PagesRoutePath;

type TypeofApi = TypeofAppApi & TypeofPagesApi;
`;
fse.writeFileSync(path.join(srcRootPath, "types", "route.d.ts"), contents);

const duplicatedRoutes = [];
appRoutes.forEach(appRoute => {
  for (const pagesRoute of pagesRoutes) {
    if (pagesRoute === appRoute) {
      duplicatedRoutes.push(appRoute)
      return;
    }
  }
});

if (duplicatedRoutes.length > 0) {
  process.stdout.write(`\n-- duplicated route -- ${duplicatedRoutes.length}\n`);
  duplicatedRoutes.forEach(pathName => {
    process.stdout.write(`${pathName}\n`);
  });
}

const duplicatedApiRoutes = [];
appApiRoutes.forEach(apiRoute => {
  for (const pagesApiRoute of pagesApiRoutes) {
    if (pagesApiRoute === apiRoute) {
      duplicatedApiRoutes.push(apiRoute);
      return;
    }
  }
});

if (duplicatedApiRoutes.length > 0) {
  process.stdout.write(`\n-- duplicated api -- ${duplicatedApiRoutes.length}\n`);
  duplicatedApiRoutes.forEach(pathName => {
    process.stdout.write(`${pathName}\n`);
  });
}

process.stdout.write("\n");