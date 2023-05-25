import { NextRequest, NextResponse } from "next/server";

export const GET = async (_req: NextRequest, { params }: { params: { id: string } }) => {
  console.log(params);
  return new NextResponse("Node App Template Api");
};