import { withAuth, type NextMiddlewareWithAuth } from "next-auth/middleware";
import formatDate from "./foundations/objects/date/format";

export const config = {
  matcher: "/((?!_next|favicon).*)",
};

const middleware: NextMiddlewareWithAuth = withAuth(
  ({ nextUrl: { pathname }, nextauth: { token } }) => {
    if (pathname.match(/\/api($|\/)/)) {
      // NOTE: API
      // eslint-disable-next-line no-console
      console.log(`[${formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.SSS")}] api : ${pathname}`);
    } else {
      // NOTE: Page
      // eslint-disable-next-line no-console
      console.log(`[${formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.SSS")}] page: ${pathname}`);
    }

    // eslint-disable-next-line no-console
    console.log(`- token:`, token);

    // NOTE: redirect
    // return NextResponse.redirect(new URL("[new url]", url));

    // NOTE: return not found
    // return NextResponse.json({}, { status: 404 });
  },
  {
    callbacks: {
      authorized: ({ token, req: { nextUrl: { pathname } } }) => {
        if (/^\/loggedin-page-path\/.*/.test(pathname)) {
          // NOTE: loggedin check
          return token?.user.id != null;
        }
        return true;
      },
    },
  },
);

export default middleware;