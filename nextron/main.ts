import path from "path";
import url from "url";
import { BrowserWindow, app, protocol, ipcMain, screen, nativeTheme, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { existsSync, mkdir, readFile, writeFile } from "fs-extra";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import NextConfig from "../next.config";

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
const isAppDir = NextConfig.experimental?.appDir ?? false;

app.on("ready", async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: "dev",
    icon: path.join(appRoot, "public/favicons/favicon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  let loadUrl = "";
  if (isDev) {
    const port = 8000;
    await prepareNext(appRoot, port);
    loadUrl = `http://localhost:${port}${process.env.BASE_PATH || ""}/`;
    mainWindow.webContents.openDevTools();
    log.info("app listen start", loadUrl);
  } else {
    mainWindow.setMenu(null);
    // mainWindow.webContents.openDevTools();
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

  const $fetch = (uri: string, init?: RequestInit) => {
    return new Promise((resolve, reject) => {
      fetch(uri, init).then(async res => {
        const response = {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          text: await res.text(),
        };
        resolve(response);
      }).catch(err => {
        reject(err);
      });
    });
  };
  if (isDev) {
    setListener("fetch", "handle", (_e, url: string, init?: RequestInit) => {
      return $fetch(url.startsWith("http") ? url : path.join(loadUrl, url), init);
    });
  } else {
    const getStatusText = (statusCode: number) => {
      switch (statusCode) {
        case 100: return "Continue";
        case 101: return "Switching Protocols";
        case 102: return "Processing";
        case 103: return "Early Hints";
        case 200: return "OK";
        case 201: return "Created";
        case 202: return "Accepted";
        case 203: return "Non-Authoritative Information";
        case 204: return "No Content";
        case 205: return "Reset Content";
        case 206: return "Partial Content";
        case 207: return "Multi-Status";
        case 208: return "Already Reported";
        case 226: return "IM Used";
        case 300: return "Multiple Choices";
        case 301: return "Moved Permanently";
        case 302: return "Found";
        case 303: return "See Other";
        case 304: return "Not Modified";
        case 305: return "Use Proxy";
        case 306: return "(Unused)";
        case 307: return "Temporary Redirect";
        case 308: return "Permanent Redirect";
        case 400: return "Bad Request";
        case 401: return "Unauthorized";
        case 402: return "Payment Required";
        case 403: return "Forbidden";
        case 404: return "Not Found";
        case 405: return "Method Not Allowed";
        case 406: return "Not Acceptable";
        case 407: return "Proxy Authentication Required";
        case 408: return "Request Timeout";
        case 409: return "Conflict";
        case 410: return "Gone";
        case 411: return "Length Required";
        case 412: return "Precondition Failed";
        case 413: return "Payload Too Large";
        case 414: return "URI Too Long";
        case 415: return "Unsupported Media Type";
        case 416: return "Range Not Satisfiable";
        case 417: return "Expectation Failed";
        case 418: return "I'm a teapot";
        case 421: return "Misdirected Request";
        case 422: return "Unprocessable Content";
        case 423: return "Locked";
        case 424: return "Failed Dependency";
        case 425: return "Too Early";
        case 426: return "Upgrade Required";
        case 428: return "Precondition Required";
        case 429: return "Too Many Requests";
        case 431: return "Request Header Fields Too Large";
        case 451: return "Unavailable For Legal Reasons";
        case 500: return "Internal Server Error";
        case 501: return "Not Implemented";
        case 502: return "Bad Gateway";
        case 503: return "Service Unavailable";
        case 504: return "Gateway Timeout";
        case 505: return "HTTP Version Not Supported";
        case 506: return "Variant Also Negotiates";
        case 507: return "Insufficient Storage";
        case 508: return "Loop Detected";
        case 510: return "Not Extended";
        case 511: return "Network Authentication Required";
        default: return "Unknown";
      }
    };
    setListener("fetch", "handle", (_e, url: string, init?: RequestInit) => {
      if (url.startsWith("http")) {
        return $fetch(url, init);
      }
      return new Promise((resolve, reject) => {
        const uriCtx = url.match(/([^?]*)(?:\?|$)(.*)/);
        if (uriCtx == null) {
          reject(getStatusText(400));
          return;
        }
        const uri = uriCtx[1];
        const headers: { [key: string]: any } = {
          "content-type": "application/json;"
        };
        const req = {
          method: init?.method || "GET",
          query: (() => {
            const str = uriCtx[2];
            if (!str) return {};
            const query: { [key: string]: any } = {};
            str.split("&").forEach(item => {
              const [_, key, value] = item.match(/([^=]*)(?:=|$)(.*)/) ?? [];
              if (key in query) {
                if (!Array.isArray(query[key])) {
                  query[key] = [query[key]];
                }
                query[key].push(value);
                return;
              }
              query[key] = value;
            });
            return query;
          })(),
          body: JSON.parse((init as any)?.body ?? "{}"),
          url: uri,
          headers: {
            get: (key: string) => headers[key],
          },
          json: async () => {
            return JSON.parse((init as any)?.body ?? "{}");
          },
          session: $global._session,
          cookies: {},
        };
        const returnValue: { json?: any; status?: number | undefined; } = {};
        const returnJudge = () => {
          if (returnValue.status == null || returnValue.status < 200 || returnValue.json == null) return;
          resolve({
            ok: returnValue.status < 300,
            status: returnValue.status,
            statusText: getStatusText(returnValue.status),
            text: JSON.stringify(returnValue.json),
          });
        };
        const res = {
          status: (code: number) => {
            returnValue.status = Math.round(code);
            returnJudge();
            return res;
          },
          json: (body?: any) => {
            returnValue.json = body;
            returnJudge();
          },
        };
        import(path.join(appRoot, ".main/src/pages", uri)).then((handler) => {
          try {
            handler.default(req, res);
          } catch (err) {
            reject(err);
          }
        }).catch((_err) => {
          import(path.join(appRoot, ".main/src/app", uri, "route")).then((handler) => {
            try {
              // TODO: dynamic url param
              // TODO: response
              (handler[req.method.toUpperCase()](req, { params: {} }) as Promise<any>).then(res => {
                console.log(res);
              }).catch(err => {
                reject(err);
              });
            } catch (err) {
              reject(err);
            }
          }).catch((err) => {
            reject(err);
          });
        });
        
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