import pickUid from "#/auth/pick-uid";
import { withAuth, type NextMiddlewareWithAuth } from "next-auth/middleware";
import formatDate from "./foundations/objects/date/format";

export const config = {
  matcher: "/((?!$|_next|favicon).*)",
};

const middleware: NextMiddlewareWithAuth = withAuth(
  ({ nextUrl: { pathname } }) => {
    if (pathname.match(/\/api($|\/)/)) {
      // NOTE: API
      // eslint-disable-next-line no-console
      console.log(`[${formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.SSS")}] api : ${pathname}`);
    } else {
      // NOTE: Page
      // eslint-disable-next-line no-console
      console.log(`[${formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.SSS")}] page: ${pathname}`);
    }

    // NOTE: redirect
    // return NextResponse.redirect(new URL("[new url]", url));

    // NOTE: return not found
    // return NextResponse.json({}, { status: 404 });
  },
  {
    callbacks: {
      authorized: ({ token, req: { nextUrl: { pathname } } }) => {
        if (/^\/(dev|sandbox|sign-in|api|api\/fetch)(\/|$)/.test(pathname)) {
          // NOTE: skip signed-in check
          return true;
        }
        return token?.user.id != null && token?.user.id?.toString() === pickUid(pathname);
      },
    },
    pages: {
      signIn: "/sign-in",
    },
  },
);

export default middleware;
