import path from "path";
import url from "url";
import { BrowserWindow, app, protocol, ipcMain, screen, nativeTheme, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { existsSync, mkdir, readFile, writeFile } from "fs-extra";

const $global = global as { [key: string]: any };
const logFormat = (...contents: Array<string>) => `${DatetimeUtils.format(new Date(), "yyyy-MM-ddThh:mm:ss.SSS")} ${StringUtils.join(" ", ...contents)}\n`;
const log = {
  debug: (...contents: Array<string>) => {
    if (!isDev) return;
    process.stdout.write(logFormat(...contents));
  },
  info: (...contents: Array<string>) => {
    process.stdout.write(logFormat(...contents));
  },
  error: (...contents: Array<string>) => {
    process.stderr.write(logFormat(...contents));
  },
};

log.info(`::: dev :::${isDev ? " [dev]" : ""}`);

const appRoot = path.join(__dirname, "../../");

app.on("ready", async () => {
  const port = Number(process.env.PORT || "8008");
  if (isDev) await prepareNext(appRoot, port);

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "dev",
    icon: path.join(appRoot, "src/public/favicon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  let loadUrl = "";
  if (isDev) {
    loadUrl = `http://localhost:${port}${process.env.BASE_PATH || ""}/`;
    mainWindow.webContents.openDevTools();
    log.info("app listen start", loadUrl);
  } else {
    mainWindow.setMenu(null);
    loadUrl = url.format({
      pathname: "index.html",
      protocol: "file:",
      slashes: true,
    });
    log.info("app boot");

    const rendererRoot = path.join(appRoot, ".renderer");
    protocol.interceptFileProtocol("file", (req, callback) => {
      try {
        let url = req.url.substring(7);
        const splited = url.split(/\/|\\/);
        const [pathName, queryStr] = splited[splited.length - 1].split("?");
        const extension = path.extname(pathName);
        url = decodeURI(url.substring(0, url.lastIndexOf("/") + 1) + pathName);
        if (StringUtils.isEmpty(extension) && StringUtils.isNotEmpty(queryStr)) {
          url += `?${queryStr}`;
        }
        if (path.isAbsolute(url)) {
          callback(path.join(rendererRoot, url));
          return;
        }
        callback(url);
      } catch (e) {
        log.error("url convert error:", String(e));
      }
    });
  }

  $global._session = {};
  const appDirname = isDev ? appRoot : path.dirname(process.argv[0]);

  const configDir = path.join(appDirname, "resources");
  if (!existsSync(configDir)) {
    await mkdir(configDir, { recursive: true });
  }
  const configFileName = path.join(configDir, "config.json");
  let config: { [key: string]: any } = { appDirname, isDev, layout: { color: undefined, design: undefined } };
  const saveConfig = async () => {
    const c = { ...config };
    delete c.appDirname;
    delete c.isDev;
    return await writeFile(configFileName, JSON.stringify(c, null, 2), { encoding: "utf-8" });
  };
  const getConfigFile = async () => {
    const c = JSON.parse(await readFile(configFileName, { encoding: "utf-8" }));
    c.appDirname = appDirname;
    c.isDev = isDev;
    return c;
  };
  if (!existsSync(configFileName)) {
    config = { appDirname, isDev };
    await saveConfig();
  }
  config = await getConfigFile();

  $global._session.layoutColor = config.layout?.color;
  $global._session.layoutDesign = config.layout?.design;

  $global.electron = {};
  const setListener = (name: string, type: "handle" | "on", func: (event: IpcMainEvent | IpcMainInvokeEvent, ...args: Array<any>) => any) => {
    if (type === "handle") {
      $global.electron[name] = (...args: Array<any>) => func({} as any, ...args);
      ipcMain.handle(name, func);
    }
    if (type === "on") {
      $global.electron[name] = (...args: Array<any>) => {
        const event = {} as any;
        func(event, ...args);
        return event.returnValue;
      }
      ipcMain.on(name, func);
    }
  };

  if (isDev) {
    setListener("fetch", "handle", (_e, apiPath: string, params: { [key: string]: any } = {}, options?: RequestInit) => {
      log.debug("fetch api: ", apiPath, JSON.stringify(params), JSON.stringify(options));
      const url = (loadUrl + "api/" + apiPath).replace(/\/\//g, "/");
      const opts: RequestInit = { ...options };
      if (options?.method !== "GET") {
        if (StringUtils.isEmpty(opts.method)) opts.method = "POST";
        opts.headers = { "Content-Type": "application/json", ...opts.headers };
        if (opts.body == null) opts.body = JSON.stringify(params ?? {});
      }
      return new Promise<any>((resolve, reject) => {
        fetch(url, opts).then((res) => {
          if (!res.ok) {
            reject(`fetch failed`);
            return;
          }
          res.json().then((ret) => {
            resolve(ret);
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      });
    });
  } else {
    setListener("fetch", "handle", (_e, apiPath: string, params: { [key: string]: any } = {}, options?: RequestInit) => {
      return new Promise<any>((resolve, reject) => {
        try {
          let data: { [key: string]: any } = {};
          const res = {
            statusCode: 0,
            status: (code: number) => {
              res.statusCode = code ?? 0;
              return res;
            },
            json: (struct: { [key: string]: any }) => {
              data = struct;
              return res;
            },
          };
          const listener = () => {
            if (res.statusCode !== 0) {
              resolve(JSON.parse(JSON.stringify(data)));
              return;
            }
            setTimeout(() => {
              listener();
            }, 5);
          };
          $global._session.regenerate = (callback?: () => void) => {
            Object.keys($global._session).forEach((key) => {
              if (key === "regenerate") return;
              delete $global._session[key];
            });
            callback?.();
          };
          const req = {
            body: params,
            session: $global._session,
            query: {} as { [key: string]: string | Array<string> },
            cookies: {} as { [key: string]: string },
            method: options?.method,
          };
          let ap = apiPath;
          let sepIndex = apiPath.indexOf("?");
          if (sepIndex >= 0) {
            ap = apiPath.substring(0, sepIndex);
            const queryStrs = apiPath.substring(sepIndex + 1).split("&");
            queryStrs.forEach((q) => {
              sepIndex = q.indexOf("=");
              const key = q.substring(0, sepIndex);
              const val = sepIndex >= 0 ? q.substring(sepIndex + 1) : "";
              if (key in req.query) {
                const v = req.query[key];
                if (typeof v === "string") req.query[key] = [v as string, val];
                else v.push(val);
              } else {
                req.query[key] = val;
              }
            });
          }
          import(path.join(appRoot, ".main/src/pages/api", ap)).then((handler) => {
            try {
              handler.default(req, res);
              listener();
            } catch (ex) {
              reject(ex);
            }
          }).catch((ex) => {
            reject(ex);
          });
        } catch (ex) {
          reject(ex);
        }
      });
    });
  }

  setListener("setSize", "on", (event, params: { width?: number; height?: number; animate?: boolean; }) => {
    try {
      const size = mainWindow.getSize();
      mainWindow.setSize(params.width ?? size[0], params.height ?? size[1], params.animate);
      event.returnValue = true;
    } catch {
      event.returnValue = false;
    }
  });
  const getSize = () => {
    const size = mainWindow.getSize();
    return { width: size[0], height: size[1] };
  }
  setListener("getSize", "on", (event) => {
    event.returnValue = getSize();
  });
  setListener("setAlwaysOnTop", "on", (event, alwaysOnTop) => {
    mainWindow.setAlwaysOnTop(event.returnValue = alwaysOnTop ?? false);
  });
  setListener("isAlwaysOnTop", "on", (event) => {
    event.returnValue = mainWindow.isAlwaysOnTop();
  });
  setListener("minimize", "on", (event) => {
    mainWindow.minimize();
    event.returnValue = getSize();
  });
  setListener("unminimize", "on", (event) => {
    mainWindow.restore();
    event.returnValue = getSize();
  })
  setListener("isMinimize", "on", (event) => {
    event.returnValue = mainWindow.isMinimized();
  });
  setListener("maximize", "on", (event) => {
    mainWindow.maximize();
    event.returnValue = getSize();
  });
  setListener("unmaximize", "on", (event) => {
    mainWindow.unmaximize();
    event.returnValue = getSize();
  })
  setListener("isMaximize", "on", (event) => {
    event.returnValue = mainWindow.isMaximized();
  });
  setListener("setFullScreen", "on", (event, fullScreen) => {
    mainWindow.setFullScreen(event.returnValue = fullScreen ?? false);
  });
  setListener("isFullScreen", "on", (event) => {
    event.returnValue = mainWindow.isFullScreen();
  });
  setListener("setOpacity", "on", (event, opacity) => {
    mainWindow.setOpacity(event.returnValue = opacity ?? 1);
  });
  setListener("getOpacity", "on", (event) => {
    event.returnValue = mainWindow.getOpacity();
  });
  const getPosition = () => {
    const pos = mainWindow.getPosition();
    return { x: pos[0], y: pos[1] };
  }
  setListener("setPosition", "on", (event, params: { position: { x: number; y: number; } | "center" | "left-top" | "right-bottom"; animate?: boolean; }) => {
    switch (params.position) {
      case "center":
        mainWindow.center();
        break;
      case "left-top":
        mainWindow.setPosition(0, 0, params.animate);
        break;
      case "right-bottom":
        const appSize = getSize();
        const dispSize = screen.getPrimaryDisplay().workAreaSize;
        mainWindow.setPosition(dispSize.width - appSize.width, dispSize.height - appSize.height, params.animate);
        break;
      default:
        const pos = mainWindow.getPosition();
        mainWindow.setPosition(params.position.x ?? pos[0], params.position.y ?? pos[1], params.animate);
        break;
    }
    event.returnValue = getPosition();
  });
  setListener("close", "on", (event) => {
    mainWindow.close();
    event.returnValue = null;
  });
  setListener("destory", "on", (event) => {
    mainWindow.destroy();
    event.returnValue = null;
  });
  setListener("focus", "on", (event) => {
    mainWindow.focus();
    event.returnValue = null;
  });
  setListener("blur", "on", (event) => {
    mainWindow.blur();
    event.returnValue = null;
  });
  setListener("hasFocus", "on", (event) => {
    event.returnValue = mainWindow.isFocused();
  });
  setListener("notification", "on", (_e, title: string, options: NotificationOptions) => {
    return new Notification(title, options);
  });
  setListener("setLayoutColor", "handle", async (_e, color: "light" | "dark" | "system") => {
    if (config.layout == null) config.layout = {};
    if (color === "system") nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? "dark" : "light";
    else nativeTheme.themeSource = color;
    $global._session.layoutColor = config.layout.color = nativeTheme.themeSource = color;
    await saveConfig();
    return config.layout.color;
  });
  setListener("getLayoutColor", "on", (event) => {
    event.returnValue = $global._session.layoutColor;
  });
  setListener("setLayoutDesign", "handle", async (_e, design: string) => {
    if (config.layout == null) config.layout = {};
    $global._session.layoutDesign = config.layout.design = design || "";
    await saveConfig();
    return config.layout.design;
  });
  setListener("getLayoutDesign", "on", (event) => {
    event.returnValue = $global._session.layoutDesign;
  });
  setListener("saveConfig", "handle", async (_e, newConfig: { [key: string]: any }) => {
    config = { ...config, ...newConfig };
    await saveConfig();
  });
  setListener("getConfig", "on", (event, key?: string) => {
    if (key == null || key.length === 0) event.returnValue = config;
    else event.returnValue = config[key];
  });
  setListener("getSession", "on", (event, key: string) => {
    if (key == null) event.returnValue = $global._session;
    else event.returnValue = $global._session[key];
  });
  setListener("setSession", "on", (event, key: string, value: any) => {
    if (key != null) $global._session[key] = value;
    event.returnValue = value;
  });
  setListener("clearSession", "on", (event, key: string) => {
    if (key != null) delete $global._session[key];
    event.returnValue = null;
  });

  mainWindow.loadURL(loadUrl);

  app.on("window-all-closed", () => {
    app.quit();
    log.info("app quit");
  });

});