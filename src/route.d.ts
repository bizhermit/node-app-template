// generate by script
// do not edit

type AppDir = true;

type PagePath = "/"
  | "/sandbox/color"
  | "/sandbox/fetch"
  | "/sandbox"
  | "/sandbox/process"
  | "/sandbox/storage";

type ApiPath = "/fetch"
  | "/";

type TypeofApi = {
  "/fetch": typeof import("~/app/api/fetch/route");
  "/": typeof import("~/app/api//route");
};