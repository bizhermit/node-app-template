import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import dotenv from "dotenv";
import express from "express";
import expressSession from "express-session";
import { existsSync } from "fs";
import helmet from "helmet";
import next from "next";
import path from "path";

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

const appRoot = path.join(__dirname, "../");
const isDev = (process.env.NODE_ENV ?? "").startsWith("dev");
log.info(`::: nexpress :::${isDev ? " [dev]" : ""}`);

dotenv.config({
  debug: isDev,
});
const loadNextEnv = (name: string) => {
  const envPath = path.join(appRoot, name);
  if (!existsSync(envPath)) return;
  dotenv.config({
    path: envPath,
    override: true,
    debug: isDev,
  });
};
if (isDev) {
  loadNextEnv(".env.development");
  loadNextEnv(".env.local");
  loadNextEnv(".env.development.local");
} else {
  loadNextEnv(".env.production");
  loadNextEnv(".env.local");
  loadNextEnv(".env.production.local");
}
log.debug(JSON.stringify(process.env, null, 2));

const basePath = process.env.BASE_PATH || "";
const port = Number(process.env.PORT || (isDev ? 8000 : 80));
const sessionName = process.env.SESSION_NAME || undefined;
const sessionSecret = process.env.SESSION_SECRET || StringUtils.generateUuidV4();
const cookieParserSecret = process.env.COOKIE_PARSER_SECRET || StringUtils.generateUuidV4();
const corsOrigin = process.env.CORS_ORIGIN || undefined;

const localhostUrl = `http://localhost:${port}${basePath}`;

const nextApp = next({
  dev: isDev,
  dir: appRoot,
});

nextApp.prepare().then(async () => {
  const app = express();

  app.use(express.static(path.join(appRoot, "/public")));

  app.use(expressSession({
    name: sessionName,
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: undefined,
    cookie: {
      secure: !isDev,
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    },
  }));
  app.use(cookieParser(cookieParserSecret));

  const unsafeInline = `'unsafe-inline' ${localhostUrl}`;
  app.use(helmet({
    contentSecurityPolicy: isDev ? false : {
      directives: {
        // ./node_modules/helmet/index.cjs
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", unsafeInline],
        "style-src": ["'self'", unsafeInline],
        "img-src": ["'self'", "data:", unsafeInline],
      },
    },
    hidePoweredBy: true,
    hsts: true,
    frameguard: true,
    xssFilter: true,
  }));

  if (!isDev) app.set("trust proxy", 1);
  app.disable("x-powered-by");

  const csrfTokenName = "csrf-token";
  app.use(csrf({
    cookie: true,
    value: (req) => {
      return req.body?._csrf
        || req.query?._csrf
        || req.headers?.[csrfTokenName]
        || req.cookies?.[csrfTokenName];
    }
  }));
  app.use(cors({
    origin: corsOrigin,
    credentials: true,
  }));

  const handler = nextApp.getRequestHandler();

  // API
  app.all(`${basePath}/api/*`, (req, res) => {
    log.debug(`api call: ${req.method}:`, req.url);
    return handler(req, res);
  });

  // ALL
  app.all("*", (req, res) => {
    if (!req.url.startsWith("/_")) {
      const token = req.csrfToken();
      res.cookie(csrfTokenName, token);
    }
    return handler(req, res);
  });

  app.listen(port, () => {
    log.info(localhostUrl);
  });
}).catch((err: any) => {
  log.error(String(err));
  process.exit(1);
});