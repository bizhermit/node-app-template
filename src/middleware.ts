import { NextResponse, type NextMiddleware } from "next/server";

export const config = {
  matcher: "/((?!_next|favicon).*)",
};

const middleware: NextMiddleware = (request) => {
  const { pathname } = request.nextUrl;
  if (pathname.match(/\/api($|\/)/)) {
    console.log(`[api ]: ${pathname}`);
  } else {
    console.log(`[page]: ${pathname}`);
  }
  return NextResponse.next();
};

export default middleware;