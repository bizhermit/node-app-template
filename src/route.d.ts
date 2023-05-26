// generate by script
// do not edit

type AppDir = true;

type PagePath = "/"
  | "/sandbox/color"
  | "/sandbox/dynamic"
  | "/sandbox/dynamic/[id]"
  | "/sandbox/elements/badge"
  | "/sandbox/elements/button"
  | "/sandbox/elements/card"
  | "/sandbox/elements/container/navigation-container"
  | "/sandbox/elements/container/slide-container"
  | "/sandbox/elements/container/split-container"
  | "/sandbox/elements/container/tab-container"
  | "/sandbox/elements/data-table"
  | "/sandbox/elements/divider"
  | "/sandbox/elements/form"
  | "/sandbox/elements/form-items/check-box"
  | "/sandbox/elements/form-items/date-box"
  | "/sandbox/elements/form-items/date-picker"
  | "/sandbox/elements/form-items/electronic-signature"
  | "/sandbox/elements/form-items/file-button"
  | "/sandbox/elements/form-items/file-drop"
  | "/sandbox/elements/form-items/hidden"
  | "/sandbox/elements/form-items/number-box"
  | "/sandbox/elements/form-items/radio-buttons"
  | "/sandbox/elements/form-items/select-box"
  | "/sandbox/elements/form-items/slider"
  | "/sandbox/elements/form-items/text-area"
  | "/sandbox/elements/form-items/text-box"
  | "/sandbox/elements/form-items/time-box"
  | "/sandbox/elements/form-items/time-picker"
  | "/sandbox/elements/form-items/toggle-box"
  | "/sandbox/elements/group-box"
  | "/sandbox/elements/icons"
  | "/sandbox/elements/label"
  | "/sandbox/elements/link"
  | "/sandbox/elements/loading"
  | "/sandbox/elements/menu"
  | "/sandbox/elements/popup"
  | "/sandbox/elements/stepper"
  | "/sandbox/elements/struct-view"
  | "/sandbox/elements/tooltip"
  | "/sandbox/env"
  | "/sandbox/fetch"
  | "/sandbox/message-box"
  | "/sandbox"
  | "/sandbox/process"
  | "/sandbox/storage";

type ApiPath = "/fetch"
  | "/";

type TypeofApi = {
  "/fetch": typeof import("~/app/api/fetch/route");
  "/": typeof import("~/app/api//route");
};