import { NextMiddleware, NextResponse } from "next/server";

const pageMiddleware: NextMiddleware = async (request) => {
  const { pathname } = request.nextUrl;
  console.log(`[page] ${pathname}`);
  return NextResponse.next();
};

export default pageMiddleware;