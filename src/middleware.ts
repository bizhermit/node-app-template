import { NextMiddleware, NextResponse } from "next/server";
import apiMiddleware from "./middleware/api";
import pageMiddleware from "./middleware/page";

export const config = {
  matcher: "/((?!_next|favicon).*)",
};

const middleware: NextMiddleware = (request, event) => {
  const { pathname } = request.nextUrl;
  if (pathname.match(/^\/api($|\/.*)/)) {
    return apiMiddleware(request, event);
  }
  if (pathname.match(/^\/($|(?!_next|.*\..*|api($|\/.*)).*)/)) {
    return pageMiddleware(request, event);
  }
  return NextResponse.next();
};

export default middleware;