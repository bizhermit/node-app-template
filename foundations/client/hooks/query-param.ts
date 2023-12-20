import type { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const pickQueryString = (val: string | string[] | undefined) => {
  const v = Array.isArray(val) ? val[0] : val;
  if (v == null || v === "") return null!;
  return v;
};

export const useQueryParam = <S extends string = string>(pageProps: { [v: string | number | symbol]: any }, dataName = "id", init?: S | (() => S)) => {
  const router = useRouter();
  const state = useState<S>(pageProps?.[dataName] ?? init);

  useEffect(() => {
    state[1](pickQueryString(router.query[dataName]) as S ?? init!);
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
    const res: { [v: string | number | symbol]: any } = {};
    dataName.forEach(dn => {
      res[dn] = pickQueryString(ctx.query[dn]);
    });
    return res as T;
  };
};