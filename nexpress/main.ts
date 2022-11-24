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

const isDev = (process.env.NODE_ENV ?? "").startsWith("dev");
dotenv.config({
  debug: isDev,
});

const basePath = process.env.BASE_PATH || "";
const port = Number(process.env.PORT || (isDev ? 8000 : 80));
const sessionName = process.env.SESSION_NAME || undefined;
const sessionSecret = process.env.SESSION_SECRET || StringUtils.generateUuidV4();
const cookieParserSecret = process.env.COOKIE_PARSER_SECRET || StringUtils.generateUuidV4();
const corsOrigin = process.env.CORS_ORIGIN || undefined;
const csrfPath = process.env.CSRF_PATH || "/csrf";

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

log.info(`::: nexpress :::${isDev ? " [dev]" : ""}`);

const appRoot = path.join(__dirname, "../");
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
      httpOnly: !isDev,
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

  const handler = nextApp.getRequestHandler();

  const corsProtection = cors({
    origin: corsOrigin,
    credentials: true,
  });

  // API
  const csrfProtection = csrf({
    cookie: true,
  });
  app.all(`${basePath}/api/*`, corsProtection, csrfProtection, (req, res) => {
    log.debug("api call:", req.url);
    return handler(req, res);
  });

  // CSRF
  app.use(csrf({ cookie: true }));
  app.get(`${basePath}${csrfPath}`, corsProtection, (req, res) => {
    const token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token).status(204).send();
  });

  // ALL
  app.all("*", corsProtection, (req, res) => {
    return handler(req, res);
  });

  app.listen(port, () => {
    log.info(`http://localhost:${port}${basePath}`);
  });
}).catch((err: any) => {
  log.error(String(err));
  process.exit(1);
});