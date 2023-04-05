import dotenv from "dotenv";
import path from "path";
import next from "next";
import express from "express";
import expressSession from "express-session";
import helmet from "helmet";
import cors from "cors";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { existsSync } from "fs";

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
if (isDev) {
  const devEnvPath = path.join(appRoot, ".env.development");
  if (existsSync(devEnvPath)) {
    dotenv.config({
      path: devEnvPath,
      debug: true,
    });
  }
  const devLocalEnvPath = path.join(appRoot, ".env.development.local");
  if (existsSync(devLocalEnvPath)) {
    dotenv.config({
      path: devLocalEnvPath,
      debug: true,
    });
  }
} else {
  const prodEnvPath = path.join(appRoot, ".env.production");
  if (existsSync(prodEnvPath)) {
    dotenv.config({
      path: prodEnvPath,
    });
  }
  const prodLocalEnvPath = path.join(appRoot, ".env.production.local");
  if (existsSync(prodLocalEnvPath)) {
    dotenv.config({
      path: prodLocalEnvPath,
    });
  }
}
log.debug(JSON.stringify(process.env, null, 2));

const basePath = process.env.BASE_PATH || "";
const port = Number(process.env.PORT || (isDev ? 8000 : 80));
const sessionName = process.env.SESSION_NAME || undefined;
const sessionSecret = process.env.SESSION_SECRET || StringUtils.generateUuidV4();
const cookieParserSecret = process.env.COOKIE_PARSER_SECRET || StringUtils.generateUuidV4();
const corsOrigin = process.env.CORS_ORIGIN || undefined;

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

  app.use(helmet({
    contentSecurityPolicy: !isDev,
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
    log.debug("api call:", req.url);
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
    log.info(`http://localhost:${port}${basePath}`);
  });
}).catch((err: any) => {
  log.error(String(err));
  process.exit(1);
});