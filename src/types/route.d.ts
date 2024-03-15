// generate by script
// do not edit

type AppRoutePath = "/[uid]"
 | "/dev/color"
 | "/dev/dynamic-route"
 | "/dev/dynamic-route/param/[slug]"
 | "/dev/dynamic-route/slug-param/[...slug]"
 | "/dev/dynamic-route/slugs-param/[[...slug]]"
 | "/dev/elements/badge"
 | "/dev/elements/button"
 | "/dev/elements/container/card"
 | "/dev/elements/container/group"
 | "/dev/elements/container/navigation"
 | "/dev/elements/container/slide"
 | "/dev/elements/container/split"
 | "/dev/elements/container/tab"
 | "/dev/elements/divider"
 | "/dev/elements/form/item/check-list"
 | "/dev/elements/form/item/select-box"
 | "/dev/elements/form"
 | "/dev/elements/icon"
 | "/dev/elements/label"
 | "/dev/elements/link"
 | "/dev/elements/loading"
 | "/dev/elements"
 | "/dev/elements/popup"
 | "/dev/elements/stepper"
 | "/dev/elements/tooltip"
 | "/dev/elements/view/data-list"
 | "/dev/elements/view/data-table"
 | "/dev/elements/view/menu"
 | "/dev/elements/view/struct-view"
 | "/dev/fetch"
 | "/dev"
 | "/"
 | "/sandbox/group-a"
 | "/sandbox/group-b"
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
 | "/sandbox/elements/form-items/toggle-switch"
 | "/sandbox/fetch"
 | "/sandbox/message-box"
 | "/sandbox"
 | "/sandbox/post/sender"
 | "/sandbox/process"
 | "/sandbox/storage"
 | "/sandbox/window"
 | "/sign-in";

type AppApiPath = "/api/auth/[...nextauth]"
 | "/api/fetch"
 | "/api"
 | "/dev/fetch/api";

type TypeofAppApi = {
  "/api/auth/[...nextauth]": typeof import("app/api/auth/[...nextauth]/route");
  "/api/fetch": typeof import("app/api/fetch/route");
  "/api": typeof import("app/api/route");
  "/dev/fetch/api": typeof import("app/dev/fetch/api/route");
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
  "/api/form": typeof import("pages/api/form");
  "/api/hello": typeof import("pages/api/hello");
};

type PagePath = AppRoutePath | PagesRoutePath;

type TypeofApi = TypeofAppApi & TypeofPagesApi;
