// generate by script
// do not edit

type PagePath = "/"
  | "/404"
  | "/sandbox/color"
  | "/sandbox/elements/badge"
  | "/sandbox/elements/button"
  | "/sandbox/elements/card"
  | "/sandbox/elements/container/navigation-container"
  | "/sandbox/elements/container/slide-container"
  | "/sandbox/elements/container/split-container"
  | "/sandbox/elements/container/tab-container"
  | "/sandbox/elements/data-table"
  | "/sandbox/elements/divider"
  | "/sandbox/elements/form-items/check-box"
  | "/sandbox/elements/form-items/date-box"
  | "/sandbox/elements/form-items/date-picker"
  | "/sandbox/elements/form-items/electronic-signature"
  | "/sandbox/elements/form-items/file-button"
  | "/sandbox/elements/form-items/file-drop"
  | "/sandbox/elements/form-items/number-box"
  | "/sandbox/elements/form-items/radio-buttons"
  | "/sandbox/elements/form-items/select-box"
  | "/sandbox/elements/form-items/slider"
  | "/sandbox/elements/form-items/text-area"
  | "/sandbox/elements/form-items/text-box"
  | "/sandbox/elements/form-items/time-box"
  | "/sandbox/elements/form-items/time-picker"
  | "/sandbox/elements/form-items/toggle-box"
  | "/sandbox/elements/form"
  | "/sandbox/elements/group-box"
  | "/sandbox/elements/link"
  | "/sandbox/elements/loading"
  | "/sandbox/elements/menu"
  | "/sandbox/elements/popup"
  | "/sandbox/elements/stepper"
  | "/sandbox/elements/struct-view"
  | "/sandbox/elements/tooltip"
  | "/sandbox/fetch"
  | "/sandbox/message-box"
  | "/sandbox/storage";

type ApiPath = "/fetch"
  | "/fetch/[id]"
  | "/form"
  | "/hello";

type TypeofApi = {
  "/fetch": typeof import("@/pages/api/fetch");
  "/fetch/[id]": typeof import("@/pages/api/fetch/[id]");
  "/form": typeof import("@/pages/api/form");
  "/hello": typeof import("@/pages/api/hello");
};