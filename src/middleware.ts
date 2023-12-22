import { NextResponse, type NextMiddleware } from "next/server";
import formatDate from "./foundations/objects/date/format";

export const config = {
  matcher: "/((?!_next|favicon).*)",
};

const middleware: NextMiddleware = (request) => {
  const { pathname } = request.nextUrl;
  if (pathname.match(/\/api($|\/)/)) {
    // eslint-disable-next-line no-console
    console.log(`[${formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.SSS")}] api : ${pathname}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`[${formatDate(new Date(), "yyyy-MM-dd hh:mm:ss.SSS")}] page: ${pathname}`);
  }
  return NextResponse.next();
};

export default middleware;