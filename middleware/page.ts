import { NextMiddleware, NextResponse } from "next/server";

const pageMiddleware: NextMiddleware = async (request) => {
  const { pathname } = request.nextUrl;
  // eslint-disable-next-line no-console
  console.log(`[page] ${pathname}`);
  return NextResponse.next();
};

export default pageMiddleware;