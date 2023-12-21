import { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  layout?: (page: React.ReactElement, props: P) => React.ReactNode;
};