"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const next_1 = __importDefault(require("next"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const csurf_1 = __importDefault(require("csurf"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const string_utils_1 = __importDefault(require("@bizhermit/basic-utils/dist/string-utils"));
const datetime_utils_1 = __importDefault(require("@bizhermit/basic-utils/dist/datetime-utils"));
const isDev = (process.env.NODE_ENV ?? "").startsWith("dev");
console.log(isDev, process.env.NODE_ENV);
dotenv_1.default.config({
    debug: isDev,
});
const basePath = process.env.BASE_PATH || "";
const port = Number(process.env.PORT || (isDev ? 8000 : 80));
const sessionName = process.env.SESSION_NAME || undefined;
const sessionSecret = process.env.SESSION_SECRET || string_utils_1.default.generateUuidV4();
const cookieParserSecret = process.env.COOKIE_PARSER_SECRET || string_utils_1.default.generateUuidV4();
const corsOrigin = process.env.CORS_ORIGIN || undefined;
const csrfPath = process.env.CSRF_PATH || "/csrf";
const logFormat = (...contents) => `${datetime_utils_1.default.format(new Date(), "yyyy-MM-ddThh:mm:ss.SSS")} ${string_utils_1.default.join(" ", ...contents)}\n`;
const log = {
    debug: (...contents) => {
        if (!isDev)
            return;
        process.stdout.write(logFormat(...contents));
    },
    info: (...contents) => {
        process.stdout.write(logFormat(...contents));
    },
    error: (...contents) => {
        process.stderr.write(logFormat(...contents));
    },
};
log.info(`::: nexpress :::${isDev ? " [dev]" : ""}`);
const appRoot = path_1.default.join(__dirname, "../");
const nextApp = (0, next_1.default)({
    dev: isDev,
    dir: appRoot,
});
nextApp.prepare().then(async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.static(path_1.default.join(appRoot, "/public")));
    app.use((0, express_session_1.default)({
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
    app.use((0, cookie_parser_1.default)(cookieParserSecret));
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: !isDev,
        hidePoweredBy: true,
        hsts: true,
        frameguard: true,
        xssFilter: true,
    }));
    if (!isDev)
        app.set("trust proxy", 1);
    app.disable("x-powered-by");
    const handler = nextApp.getRequestHandler();
    const corsProtection = (0, cors_1.default)({
        origin: corsOrigin,
        credentials: true,
    });
    // API
    const csrfProtection = (0, csurf_1.default)({
        cookie: true,
    });
    app.all(`${basePath}/api/*`, corsProtection, csrfProtection, (req, res) => {
        log.debug("api call:", req.url);
        return handler(req, res);
    });
    // CSRF
    app.use((0, csurf_1.default)({ cookie: true }));
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
}).catch((err) => {
    log.error(String(err));
    process.exit(1);
});
