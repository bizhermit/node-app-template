import { NextResponse } from "next/server";
import formatDate from "../../foundations/objects/date/format";

export const GET = async () => {
  return new NextResponse(formatDate(new Date(), "yyyy/MM/dd hh:mm:ss.SSS"));
};
