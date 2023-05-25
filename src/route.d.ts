// generate by script
// do not edit

type PagePath = "/"
  | "/sandbox/color"
  | "/sandbox/fetch"
  | "/sandbox";

type ApiPath = "/fetch"
  | "/";

type TypeofApi = {
  "/fetch": typeof import("@/pages/api/fetch");
  "/": typeof import("@/pages/api/");
};