// generate by script
// do not edit

type AppRoutePath = "/"
  | "/dev"
  | "/dev/color"
  | "/dev/dynamic-route"
  | "/dev/dynamic-route/param/[slug]"
  | "/dev/dynamic-route/slug-param/[...slug]"
  | "/dev/dynamic-route/slugs-param/[[...slug]]"
  | "/dev/elements"
  | "/dev/elements/badge"
  | "/dev/elements/button"
  | "/dev/elements/container/card"
  | "/dev/elements/container/group"
  | "/dev/elements/container/navigation"
  | "/dev/elements/container/slide"
  | "/dev/elements/container/split"
  | "/dev/elements/container/tab"
  | "/dev/elements/divider"
  | "/dev/elements/form"
  | "/dev/elements/form/item/check-list"
  | "/dev/elements/form/item/select-box"
  | "/dev/elements/icon"
  | "/dev/elements/label"
  | "/dev/elements/link"
  | "/dev/elements/loading"
  | "/dev/elements/popup"
  | "/dev/elements/stepper"
  | "/dev/elements/tooltip"
  | "/dev/elements/view/data-list"
  | "/dev/elements/view/data-table"
  | "/dev/elements/view/menu"
  | "/dev/elements/view/struct-view"
  | "/dev/extensions"
  | "/dev/extensions/hoge"
  | "/dev/fetch"
  | "/sandbox"
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
  | "/sandbox/post/sender"
  | "/sandbox/process"
  | "/sandbox/storage"
  | "/sandbox/window"
  | "/sign-in"
  | "/[uid]";

type AppApiPath = "/api"
  | "/api/auth/[...nextauth]"
  | "/api/fetch"
  | "/dev/fetch/api"
  | "/dev/fetch/api/dev";

type TypeofAppApi = {
  "/api": typeof import("app/api/route.ts");
  "/api/auth/[...nextauth]": typeof import("app/api/auth/[...nextauth]/route.ts");
  "/api/fetch": typeof import("app/api/fetch/route.ts");
  "/dev/fetch/api": typeof import("app/dev/fetch/api/route.ts");
  "/dev/fetch/api/dev": typeof import("app/dev/fetch/api/dev/route.dev.ts");
};

type PagesRoutePath = "/404"
  | "/pages"
  | "/root"
  | "/sandbox/pages"
  | "/sandbox/route"
  | "/sandbox/extensions"
  | "/sandbox/extensions/hoge"
  | "/sandbox/nest/[id]"
  | "/sandbox/post/recipient";

type PagesApiPath = "/api/form"
  | "/api/hello";

type TypeofPagesApi = {
  "/api/form": typeof import("pages/api/form.ts");
  "/api/hello": typeof import("pages/api/hello.ts");
};

type PagePath = AppRoutePath | PagesRoutePath;

type TypeofApi = TypeofAppApi & TypeofPagesApi;
