import type { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type QueryDataType = "string" | "number";
type QueryDataConvert<T extends QueryDataType = "string"> =
  T extends "number" ? number :
  string
  ;

export const pickQueryString = (val: string | string[] | undefined) => {
  const v = Array.isArray(val) ? val[0] : val;
  if (v == null || v === "") return null!;
  return v;
};

const convertValue = (val: string | null | undefined, dt: QueryDataType) => {
  if (val == null) return val;
  switch (dt) {
    case "number":
      return Number(val);
    default:
      return val;
  }
};

export const useQueryParam = (pageProps: Struct, dataName = "id", dataType: QueryDataType = "string") => {
  const router = useRouter();
  const state = useState<QueryDataConvert<typeof dataType> | null | undefined>(convertValue(pageProps?.[dataName], dataType));

  useEffect(() => {
    state[1](convertValue(pickQueryString(router.query[dataName]), dataType));
  }, [router.query[dataName]]);

  return state;
};

export const getInitialQueryProps = <T = { id: string; }>(dataName: string | Array<string> = "id"): Exclude<NextComponentType<NextPageContext, T>["getInitialProps"], undefined> => {
  return async (ctx) => {
    if (typeof dataName === "string") {
      return {
        [dataName]: pickQueryString(ctx.query[dataName]),
      } as T;
    }
    const res: Struct = {};
    dataName.forEach(dn => {
      res[dn] = pickQueryString(ctx.query[dn]);
    });
    return res as T;
  };
};