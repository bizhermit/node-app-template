/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer } from "electron";

const $global = global as { [key: string]: any };

process.once("loaded", () => {
  $global.ipcRenderer = ipcRenderer;
});

contextBridge.exposeInMainWorld("electron", {
  test: () => ipcRenderer.sendSync("test"),
  fetch: (path: string, params?: { [key: string]: any }, options?: RequestInit) => ipcRenderer.invoke("fetch", path, params, options),
  setSize: (params: { width?: number; height?: number; animate?: boolean; }) => ipcRenderer.sendSync("setSize", params),
  getSize: () => ipcRenderer.sendSync("getSize"),
  setAlwaysOnTop: (alwaysOnTop: boolean) => ipcRenderer.sendSync("setAlwaysOnTop", alwaysOnTop),
  isAlwaysOnTop: () => ipcRenderer.sendSync("isAlwaysOnTop"),
  minimize: () => ipcRenderer.sendSync("minimize"),
  unminimize: () => ipcRenderer.sendSync("unminimize"),
  isMinimize: () => ipcRenderer.sendSync("isMinimize"),
  maximize: () => ipcRenderer.sendSync("maximize"),
  unmaximize: () => ipcRenderer.sendSync("unmaximize"),
  isMaximize: () => ipcRenderer.sendSync("isMaximize"),
  setFullScreen: (fullScreen: boolean) => ipcRenderer.sendSync("setFullScreen", fullScreen),
  isFullScreen: () => ipcRenderer.sendSync("isFullScreen"),
  setOpacity: (opacity: number) => ipcRenderer.sendSync("setOpacity", opacity),
  getOpacity: () => ipcRenderer.sendSync("getOpacity"),
  setPosition: (params: { position: { x: number; y: number; } | "center" | "left-top" | "right-bottom"; animate?: boolean; }) => ipcRenderer.sendSync("setPosition", params),
  close: () => ipcRenderer.sendSync("close"),
  destory: () => ipcRenderer.sendSync("destory"),
  focus: () => ipcRenderer.sendSync("focus"),
  blur: () => ipcRenderer.sendSync("blur"),
  hasFocus: () => ipcRenderer.sendSync("hasFocus"),
  notification: (title: string, options: NotificationOptions) => ipcRenderer.invoke("notification", title, options),
  setLayoutColor: (color: "light" | "dark") => ipcRenderer.invoke("setLayoutColor", color),
  getLayoutColor: () => ipcRenderer.sendSync("getLayoutColor"),
  setLayoutDesign: (design: string) => ipcRenderer.invoke("setLayoutDesign", design),
  getLayoutDesign: () => ipcRenderer.sendSync("getLayoutDesign"),
  saveConfig: (config: { [key: string]: any }) => ipcRenderer.invoke("saveConfig", config),
  getConfig: (key?: string) => ipcRenderer.sendSync("getConfig", key),
  getSession: (key?: string) => ipcRenderer.sendSync("getSession", key),
  setSession: (key: string, value: any) => ipcRenderer.sendSync("setSession", key, value),
  clearSession: (key: string) => ipcRenderer.sendSync("clearSession", key),
});

window.addEventListener("DOMContentLoaded", () => {
  $global._session = $global._session ?? $global?.ipcRenderer?.sendSync("getSession") ?? {};
});