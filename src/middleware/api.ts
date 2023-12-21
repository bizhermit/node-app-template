import { NextMiddleware, NextResponse } from "next/server";

const apiMiddleware: NextMiddleware = async (request) => {
  const { pathname } = request.nextUrl;
  // eslint-disable-next-line no-console
  console.log(`[api ] ${pathname}`);
  return NextResponse.next();
};

export default apiMiddleware;