// generate by script
// do not edit

type AppRoutePath = "/dev/dynamic-route/param/[slug]"
 | "/dev/dynamic-route/slug-param/[...slug]"
 | "/dev/dynamic-route/slugs-param/[[...slug]]"
 | "/dev/elements/button"
 | "/dev/elements/container/navigation"
 | "/dev/elements/icon"
 | "/dev/elements/link"
 | "/dev/elements"
 | "/dev/elements/popup"
 | "/dev"
 | "/"
 | "/sandbox/group-a"
 | "/sandbox/group-b"
 | "/sandbox/color"
 | "/sandbox/dynamic"
 | "/sandbox/dynamic/slug/[...slug]"
 | "/sandbox/dynamic/slug-arr/[[...slug]]"
 | "/sandbox/dynamic/[id]"
 | "/sandbox/elements/badge"
 | "/sandbox/elements/button"
 | "/sandbox/elements/card"
 | "/sandbox/elements/container/navigation-container"
 | "/sandbox/elements/container/slide-container"
 | "/sandbox/elements/container/split-container"
 | "/sandbox/elements/container/tab-container"
 | "/sandbox/elements/data-list"
 | "/sandbox/elements/data-table"
 | "/sandbox/elements/divider"
 | "/sandbox/elements/form"
 | "/sandbox/elements/form-items/check-box"
 | "/sandbox/elements/form-items/check-list"
 | "/sandbox/elements/form-items/credit-card-number-box"
 | "/sandbox/elements/form-items/date-box"
 | "/sandbox/elements/form-items/date-picker"
 | "/sandbox/elements/form-items/electronic-signature"
 | "/sandbox/elements/form-items/file-button"
 | "/sandbox/elements/form-items/file-drop"
 | "/sandbox/elements/form-items/hidden"
 | "/sandbox/elements/form-items/number-box"
 | "/sandbox/elements/form-items/password-box"
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
 | "/sandbox/post/sender"
 | "/sandbox/process"
 | "/sandbox/storage"
 | "/sandbox/window";

type AppApiPath = "/api/fetch"
 | "/api";

type TypeofAppApi = {
  "/api/fetch": typeof import("@/api/fetch/route");
  "/api": typeof import("@/api/route");
};

type PagesRoutePath = "/404"
 | "/pages"
 | "/root"
 | "/sandbox/nest/[id]"
 | "/sandbox/pages"
 | "/sandbox/post/recipient"
 | "/sandbox/route";

type PagesApiPath = "/api/form"
 | "/api/hello";

type TypeofPagesApi = {
  "/api/form": typeof import("~/api/form");
  "/api/hello": typeof import("~/api/hello");
};

type PagePath = AppRoutePath | PagesRoutePath;

type TypeofApi = TypeofAppApi & TypeofPagesApi;
