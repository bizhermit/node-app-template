import { RequestInit } from "next/dist/server/web/spec-extension/request";

const electron = (global as any).electron;

const toData = (status: number, text?: string) => {
  if (status === 204 || !text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const fetchElectron = async <T>(url: string, init?: RequestInit) => {
  const res = await electron.fetch(url, init);
  return {
    ok: res.ok as boolean,
    status: res.status as number,
    statusText: res.statusText as string,
    data: toData(res.status, res.text) as T,
  };
};

const fetchServer = async <T>(url: string, init?: RequestInit) => {
  const res = await fetch(url, init);
  return {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    data: toData(res.status, await res.text()) as T,
  };
};

const crossFetch = async (url: string, init?: RequestInit) => {
  if (electron) return fetchElectron(url, init);
  return fetchServer(url, init);
};

export default crossFetch;