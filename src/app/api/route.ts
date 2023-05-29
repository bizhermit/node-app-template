import DatetimeUtils from "@bizhermit/basic-utils/dist/datetime-utils";
import { NextResponse } from "next/server";

export const GET = async () => {
  return new NextResponse(DatetimeUtils.format(new Date(), "yyyy/MM/dd hh:mm:ss.SSS"));
};