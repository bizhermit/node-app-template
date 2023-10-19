import { NextMiddleware, NextResponse } from "next/server";

const apiMiddleware: NextMiddleware = async (request) => {
  const { pathname } = request.nextUrl;
  console.log(`[api ] ${pathname}`);
  return NextResponse.next();
};

export default apiMiddleware;