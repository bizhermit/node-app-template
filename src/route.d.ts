// generate by script
// do not edit

type AppRoutePath = "/"
 | "/sandbox/group-a"
 | "/sandbox/group-b"
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
 | "/sandbox/elements/data-list"
 | "/sandbox/elements/data-table"
 | "/sandbox/elements/divider"
 | "/sandbox/elements/form"
 | "/sandbox/elements/form-items/check-box"
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

type RelativePagePath = "./"
 | "../"
 | "../../"
 | "../../../"
 | "./sandbox/group-a"
 | "../sandbox/group-a"
 | "../../sandbox/group-a"
 | "../../../sandbox/group-a"
 | "./group-a"
 | "../group-a"
 | "../../group-a"
 | "../../../group-a"
 | "./sandbox/group-b"
 | "../sandbox/group-b"
 | "../../sandbox/group-b"
 | "../../../sandbox/group-b"
 | "./group-b"
 | "../group-b"
 | "../../group-b"
 | "../../../group-b"
 | "./sandbox/color"
 | "../sandbox/color"
 | "../../sandbox/color"
 | "../../../sandbox/color"
 | "./color"
 | "../color"
 | "../../color"
 | "../../../color"
 | "./sandbox/dynamic"
 | "../sandbox/dynamic"
 | "../../sandbox/dynamic"
 | "../../../sandbox/dynamic"
 | "./dynamic"
 | "../dynamic"
 | "../../dynamic"
 | "../../../dynamic"
 | "./sandbox/dynamic/[id]"
 | "../sandbox/dynamic/[id]"
 | "../../sandbox/dynamic/[id]"
 | "../../../sandbox/dynamic/[id]"
 | "./dynamic/[id]"
 | "../dynamic/[id]"
 | "../../dynamic/[id]"
 | "../../../dynamic/[id]"
 | "./[id]"
 | "../[id]"
 | "../../[id]"
 | "../../../[id]"
 | "./sandbox/elements/badge"
 | "../sandbox/elements/badge"
 | "../../sandbox/elements/badge"
 | "../../../sandbox/elements/badge"
 | "./elements/badge"
 | "../elements/badge"
 | "../../elements/badge"
 | "../../../elements/badge"
 | "./badge"
 | "../badge"
 | "../../badge"
 | "../../../badge"
 | "./sandbox/elements/button"
 | "../sandbox/elements/button"
 | "../../sandbox/elements/button"
 | "../../../sandbox/elements/button"
 | "./elements/button"
 | "../elements/button"
 | "../../elements/button"
 | "../../../elements/button"
 | "./button"
 | "../button"
 | "../../button"
 | "../../../button"
 | "./sandbox/elements/card"
 | "../sandbox/elements/card"
 | "../../sandbox/elements/card"
 | "../../../sandbox/elements/card"
 | "./elements/card"
 | "../elements/card"
 | "../../elements/card"
 | "../../../elements/card"
 | "./card"
 | "../card"
 | "../../card"
 | "../../../card"
 | "./sandbox/elements/container/navigation-container"
 | "../sandbox/elements/container/navigation-container"
 | "../../sandbox/elements/container/navigation-container"
 | "../../../sandbox/elements/container/navigation-container"
 | "./elements/container/navigation-container"
 | "../elements/container/navigation-container"
 | "../../elements/container/navigation-container"
 | "../../../elements/container/navigation-container"
 | "./container/navigation-container"
 | "../container/navigation-container"
 | "../../container/navigation-container"
 | "../../../container/navigation-container"
 | "./navigation-container"
 | "../navigation-container"
 | "../../navigation-container"
 | "../../../navigation-container"
 | "./sandbox/elements/container/slide-container"
 | "../sandbox/elements/container/slide-container"
 | "../../sandbox/elements/container/slide-container"
 | "../../../sandbox/elements/container/slide-container"
 | "./elements/container/slide-container"
 | "../elements/container/slide-container"
 | "../../elements/container/slide-container"
 | "../../../elements/container/slide-container"
 | "./container/slide-container"
 | "../container/slide-container"
 | "../../container/slide-container"
 | "../../../container/slide-container"
 | "./slide-container"
 | "../slide-container"
 | "../../slide-container"
 | "../../../slide-container"
 | "./sandbox/elements/container/split-container"
 | "../sandbox/elements/container/split-container"
 | "../../sandbox/elements/container/split-container"
 | "../../../sandbox/elements/container/split-container"
 | "./elements/container/split-container"
 | "../elements/container/split-container"
 | "../../elements/container/split-container"
 | "../../../elements/container/split-container"
 | "./container/split-container"
 | "../container/split-container"
 | "../../container/split-container"
 | "../../../container/split-container"
 | "./split-container"
 | "../split-container"
 | "../../split-container"
 | "../../../split-container"
 | "./sandbox/elements/container/tab-container"
 | "../sandbox/elements/container/tab-container"
 | "../../sandbox/elements/container/tab-container"
 | "../../../sandbox/elements/container/tab-container"
 | "./elements/container/tab-container"
 | "../elements/container/tab-container"
 | "../../elements/container/tab-container"
 | "../../../elements/container/tab-container"
 | "./container/tab-container"
 | "../container/tab-container"
 | "../../container/tab-container"
 | "../../../container/tab-container"
 | "./tab-container"
 | "../tab-container"
 | "../../tab-container"
 | "../../../tab-container"
 | "./sandbox/elements/data-list"
 | "../sandbox/elements/data-list"
 | "../../sandbox/elements/data-list"
 | "../../../sandbox/elements/data-list"
 | "./elements/data-list"
 | "../elements/data-list"
 | "../../elements/data-list"
 | "../../../elements/data-list"
 | "./data-list"
 | "../data-list"
 | "../../data-list"
 | "../../../data-list"
 | "./sandbox/elements/data-table"
 | "../sandbox/elements/data-table"
 | "../../sandbox/elements/data-table"
 | "../../../sandbox/elements/data-table"
 | "./elements/data-table"
 | "../elements/data-table"
 | "../../elements/data-table"
 | "../../../elements/data-table"
 | "./data-table"
 | "../data-table"
 | "../../data-table"
 | "../../../data-table"
 | "./sandbox/elements/divider"
 | "../sandbox/elements/divider"
 | "../../sandbox/elements/divider"
 | "../../../sandbox/elements/divider"
 | "./elements/divider"
 | "../elements/divider"
 | "../../elements/divider"
 | "../../../elements/divider"
 | "./divider"
 | "../divider"
 | "../../divider"
 | "../../../divider"
 | "./sandbox/elements/form"
 | "../sandbox/elements/form"
 | "../../sandbox/elements/form"
 | "../../../sandbox/elements/form"
 | "./elements/form"
 | "../elements/form"
 | "../../elements/form"
 | "../../../elements/form"
 | "./form"
 | "../form"
 | "../../form"
 | "../../../form"
 | "./sandbox/elements/form-items/check-box"
 | "../sandbox/elements/form-items/check-box"
 | "../../sandbox/elements/form-items/check-box"
 | "../../../sandbox/elements/form-items/check-box"
 | "./elements/form-items/check-box"
 | "../elements/form-items/check-box"
 | "../../elements/form-items/check-box"
 | "../../../elements/form-items/check-box"
 | "./form-items/check-box"
 | "../form-items/check-box"
 | "../../form-items/check-box"
 | "../../../form-items/check-box"
 | "./check-box"
 | "../check-box"
 | "../../check-box"
 | "../../../check-box"
 | "./sandbox/elements/form-items/credit-card-number-box"
 | "../sandbox/elements/form-items/credit-card-number-box"
 | "../../sandbox/elements/form-items/credit-card-number-box"
 | "../../../sandbox/elements/form-items/credit-card-number-box"
 | "./elements/form-items/credit-card-number-box"
 | "../elements/form-items/credit-card-number-box"
 | "../../elements/form-items/credit-card-number-box"
 | "../../../elements/form-items/credit-card-number-box"
 | "./form-items/credit-card-number-box"
 | "../form-items/credit-card-number-box"
 | "../../form-items/credit-card-number-box"
 | "../../../form-items/credit-card-number-box"
 | "./credit-card-number-box"
 | "../credit-card-number-box"
 | "../../credit-card-number-box"
 | "../../../credit-card-number-box"
 | "./sandbox/elements/form-items/date-box"
 | "../sandbox/elements/form-items/date-box"
 | "../../sandbox/elements/form-items/date-box"
 | "../../../sandbox/elements/form-items/date-box"
 | "./elements/form-items/date-box"
 | "../elements/form-items/date-box"
 | "../../elements/form-items/date-box"
 | "../../../elements/form-items/date-box"
 | "./form-items/date-box"
 | "../form-items/date-box"
 | "../../form-items/date-box"
 | "../../../form-items/date-box"
 | "./date-box"
 | "../date-box"
 | "../../date-box"
 | "../../../date-box"
 | "./sandbox/elements/form-items/date-picker"
 | "../sandbox/elements/form-items/date-picker"
 | "../../sandbox/elements/form-items/date-picker"
 | "../../../sandbox/elements/form-items/date-picker"
 | "./elements/form-items/date-picker"
 | "../elements/form-items/date-picker"
 | "../../elements/form-items/date-picker"
 | "../../../elements/form-items/date-picker"
 | "./form-items/date-picker"
 | "../form-items/date-picker"
 | "../../form-items/date-picker"
 | "../../../form-items/date-picker"
 | "./date-picker"
 | "../date-picker"
 | "../../date-picker"
 | "../../../date-picker"
 | "./sandbox/elements/form-items/electronic-signature"
 | "../sandbox/elements/form-items/electronic-signature"
 | "../../sandbox/elements/form-items/electronic-signature"
 | "../../../sandbox/elements/form-items/electronic-signature"
 | "./elements/form-items/electronic-signature"
 | "../elements/form-items/electronic-signature"
 | "../../elements/form-items/electronic-signature"
 | "../../../elements/form-items/electronic-signature"
 | "./form-items/electronic-signature"
 | "../form-items/electronic-signature"
 | "../../form-items/electronic-signature"
 | "../../../form-items/electronic-signature"
 | "./electronic-signature"
 | "../electronic-signature"
 | "../../electronic-signature"
 | "../../../electronic-signature"
 | "./sandbox/elements/form-items/file-button"
 | "../sandbox/elements/form-items/file-button"
 | "../../sandbox/elements/form-items/file-button"
 | "../../../sandbox/elements/form-items/file-button"
 | "./elements/form-items/file-button"
 | "../elements/form-items/file-button"
 | "../../elements/form-items/file-button"
 | "../../../elements/form-items/file-button"
 | "./form-items/file-button"
 | "../form-items/file-button"
 | "../../form-items/file-button"
 | "../../../form-items/file-button"
 | "./file-button"
 | "../file-button"
 | "../../file-button"
 | "../../../file-button"
 | "./sandbox/elements/form-items/file-drop"
 | "../sandbox/elements/form-items/file-drop"
 | "../../sandbox/elements/form-items/file-drop"
 | "../../../sandbox/elements/form-items/file-drop"
 | "./elements/form-items/file-drop"
 | "../elements/form-items/file-drop"
 | "../../elements/form-items/file-drop"
 | "../../../elements/form-items/file-drop"
 | "./form-items/file-drop"
 | "../form-items/file-drop"
 | "../../form-items/file-drop"
 | "../../../form-items/file-drop"
 | "./file-drop"
 | "../file-drop"
 | "../../file-drop"
 | "../../../file-drop"
 | "./sandbox/elements/form-items/hidden"
 | "../sandbox/elements/form-items/hidden"
 | "../../sandbox/elements/form-items/hidden"
 | "../../../sandbox/elements/form-items/hidden"
 | "./elements/form-items/hidden"
 | "../elements/form-items/hidden"
 | "../../elements/form-items/hidden"
 | "../../../elements/form-items/hidden"
 | "./form-items/hidden"
 | "../form-items/hidden"
 | "../../form-items/hidden"
 | "../../../form-items/hidden"
 | "./hidden"
 | "../hidden"
 | "../../hidden"
 | "../../../hidden"
 | "./sandbox/elements/form-items/number-box"
 | "../sandbox/elements/form-items/number-box"
 | "../../sandbox/elements/form-items/number-box"
 | "../../../sandbox/elements/form-items/number-box"
 | "./elements/form-items/number-box"
 | "../elements/form-items/number-box"
 | "../../elements/form-items/number-box"
 | "../../../elements/form-items/number-box"
 | "./form-items/number-box"
 | "../form-items/number-box"
 | "../../form-items/number-box"
 | "../../../form-items/number-box"
 | "./number-box"
 | "../number-box"
 | "../../number-box"
 | "../../../number-box"
 | "./sandbox/elements/form-items/password-box"
 | "../sandbox/elements/form-items/password-box"
 | "../../sandbox/elements/form-items/password-box"
 | "../../../sandbox/elements/form-items/password-box"
 | "./elements/form-items/password-box"
 | "../elements/form-items/password-box"
 | "../../elements/form-items/password-box"
 | "../../../elements/form-items/password-box"
 | "./form-items/password-box"
 | "../form-items/password-box"
 | "../../form-items/password-box"
 | "../../../form-items/password-box"
 | "./password-box"
 | "../password-box"
 | "../../password-box"
 | "../../../password-box"
 | "./sandbox/elements/form-items/radio-buttons"
 | "../sandbox/elements/form-items/radio-buttons"
 | "../../sandbox/elements/form-items/radio-buttons"
 | "../../../sandbox/elements/form-items/radio-buttons"
 | "./elements/form-items/radio-buttons"
 | "../elements/form-items/radio-buttons"
 | "../../elements/form-items/radio-buttons"
 | "../../../elements/form-items/radio-buttons"
 | "./form-items/radio-buttons"
 | "../form-items/radio-buttons"
 | "../../form-items/radio-buttons"
 | "../../../form-items/radio-buttons"
 | "./radio-buttons"
 | "../radio-buttons"
 | "../../radio-buttons"
 | "../../../radio-buttons"
 | "./sandbox/elements/form-items/select-box"
 | "../sandbox/elements/form-items/select-box"
 | "../../sandbox/elements/form-items/select-box"
 | "../../../sandbox/elements/form-items/select-box"
 | "./elements/form-items/select-box"
 | "../elements/form-items/select-box"
 | "../../elements/form-items/select-box"
 | "../../../elements/form-items/select-box"
 | "./form-items/select-box"
 | "../form-items/select-box"
 | "../../form-items/select-box"
 | "../../../form-items/select-box"
 | "./select-box"
 | "../select-box"
 | "../../select-box"
 | "../../../select-box"
 | "./sandbox/elements/form-items/slider"
 | "../sandbox/elements/form-items/slider"
 | "../../sandbox/elements/form-items/slider"
 | "../../../sandbox/elements/form-items/slider"
 | "./elements/form-items/slider"
 | "../elements/form-items/slider"
 | "../../elements/form-items/slider"
 | "../../../elements/form-items/slider"
 | "./form-items/slider"
 | "../form-items/slider"
 | "../../form-items/slider"
 | "../../../form-items/slider"
 | "./slider"
 | "../slider"
 | "../../slider"
 | "../../../slider"
 | "./sandbox/elements/form-items/text-area"
 | "../sandbox/elements/form-items/text-area"
 | "../../sandbox/elements/form-items/text-area"
 | "../../../sandbox/elements/form-items/text-area"
 | "./elements/form-items/text-area"
 | "../elements/form-items/text-area"
 | "../../elements/form-items/text-area"
 | "../../../elements/form-items/text-area"
 | "./form-items/text-area"
 | "../form-items/text-area"
 | "../../form-items/text-area"
 | "../../../form-items/text-area"
 | "./text-area"
 | "../text-area"
 | "../../text-area"
 | "../../../text-area"
 | "./sandbox/elements/form-items/text-box"
 | "../sandbox/elements/form-items/text-box"
 | "../../sandbox/elements/form-items/text-box"
 | "../../../sandbox/elements/form-items/text-box"
 | "./elements/form-items/text-box"
 | "../elements/form-items/text-box"
 | "../../elements/form-items/text-box"
 | "../../../elements/form-items/text-box"
 | "./form-items/text-box"
 | "../form-items/text-box"
 | "../../form-items/text-box"
 | "../../../form-items/text-box"
 | "./text-box"
 | "../text-box"
 | "../../text-box"
 | "../../../text-box"
 | "./sandbox/elements/form-items/time-box"
 | "../sandbox/elements/form-items/time-box"
 | "../../sandbox/elements/form-items/time-box"
 | "../../../sandbox/elements/form-items/time-box"
 | "./elements/form-items/time-box"
 | "../elements/form-items/time-box"
 | "../../elements/form-items/time-box"
 | "../../../elements/form-items/time-box"
 | "./form-items/time-box"
 | "../form-items/time-box"
 | "../../form-items/time-box"
 | "../../../form-items/time-box"
 | "./time-box"
 | "../time-box"
 | "../../time-box"
 | "../../../time-box"
 | "./sandbox/elements/form-items/time-picker"
 | "../sandbox/elements/form-items/time-picker"
 | "../../sandbox/elements/form-items/time-picker"
 | "../../../sandbox/elements/form-items/time-picker"
 | "./elements/form-items/time-picker"
 | "../elements/form-items/time-picker"
 | "../../elements/form-items/time-picker"
 | "../../../elements/form-items/time-picker"
 | "./form-items/time-picker"
 | "../form-items/time-picker"
 | "../../form-items/time-picker"
 | "../../../form-items/time-picker"
 | "./time-picker"
 | "../time-picker"
 | "../../time-picker"
 | "../../../time-picker"
 | "./sandbox/elements/form-items/toggle-box"
 | "../sandbox/elements/form-items/toggle-box"
 | "../../sandbox/elements/form-items/toggle-box"
 | "../../../sandbox/elements/form-items/toggle-box"
 | "./elements/form-items/toggle-box"
 | "../elements/form-items/toggle-box"
 | "../../elements/form-items/toggle-box"
 | "../../../elements/form-items/toggle-box"
 | "./form-items/toggle-box"
 | "../form-items/toggle-box"
 | "../../form-items/toggle-box"
 | "../../../form-items/toggle-box"
 | "./toggle-box"
 | "../toggle-box"
 | "../../toggle-box"
 | "../../../toggle-box"
 | "./sandbox/elements/group-box"
 | "../sandbox/elements/group-box"
 | "../../sandbox/elements/group-box"
 | "../../../sandbox/elements/group-box"
 | "./elements/group-box"
 | "../elements/group-box"
 | "../../elements/group-box"
 | "../../../elements/group-box"
 | "./group-box"
 | "../group-box"
 | "../../group-box"
 | "../../../group-box"
 | "./sandbox/elements/icons"
 | "../sandbox/elements/icons"
 | "../../sandbox/elements/icons"
 | "../../../sandbox/elements/icons"
 | "./elements/icons"
 | "../elements/icons"
 | "../../elements/icons"
 | "../../../elements/icons"
 | "./icons"
 | "../icons"
 | "../../icons"
 | "../../../icons"
 | "./sandbox/elements/label"
 | "../sandbox/elements/label"
 | "../../sandbox/elements/label"
 | "../../../sandbox/elements/label"
 | "./elements/label"
 | "../elements/label"
 | "../../elements/label"
 | "../../../elements/label"
 | "./label"
 | "../label"
 | "../../label"
 | "../../../label"
 | "./sandbox/elements/link"
 | "../sandbox/elements/link"
 | "../../sandbox/elements/link"
 | "../../../sandbox/elements/link"
 | "./elements/link"
 | "../elements/link"
 | "../../elements/link"
 | "../../../elements/link"
 | "./link"
 | "../link"
 | "../../link"
 | "../../../link"
 | "./sandbox/elements/loading"
 | "../sandbox/elements/loading"
 | "../../sandbox/elements/loading"
 | "../../../sandbox/elements/loading"
 | "./elements/loading"
 | "../elements/loading"
 | "../../elements/loading"
 | "../../../elements/loading"
 | "./loading"
 | "../loading"
 | "../../loading"
 | "../../../loading"
 | "./sandbox/elements/menu"
 | "../sandbox/elements/menu"
 | "../../sandbox/elements/menu"
 | "../../../sandbox/elements/menu"
 | "./elements/menu"
 | "../elements/menu"
 | "../../elements/menu"
 | "../../../elements/menu"
 | "./menu"
 | "../menu"
 | "../../menu"
 | "../../../menu"
 | "./sandbox/elements/popup"
 | "../sandbox/elements/popup"
 | "../../sandbox/elements/popup"
 | "../../../sandbox/elements/popup"
 | "./elements/popup"
 | "../elements/popup"
 | "../../elements/popup"
 | "../../../elements/popup"
 | "./popup"
 | "../popup"
 | "../../popup"
 | "../../../popup"
 | "./sandbox/elements/stepper"
 | "../sandbox/elements/stepper"
 | "../../sandbox/elements/stepper"
 | "../../../sandbox/elements/stepper"
 | "./elements/stepper"
 | "../elements/stepper"
 | "../../elements/stepper"
 | "../../../elements/stepper"
 | "./stepper"
 | "../stepper"
 | "../../stepper"
 | "../../../stepper"
 | "./sandbox/elements/struct-view"
 | "../sandbox/elements/struct-view"
 | "../../sandbox/elements/struct-view"
 | "../../../sandbox/elements/struct-view"
 | "./elements/struct-view"
 | "../elements/struct-view"
 | "../../elements/struct-view"
 | "../../../elements/struct-view"
 | "./struct-view"
 | "../struct-view"
 | "../../struct-view"
 | "../../../struct-view"
 | "./sandbox/elements/tooltip"
 | "../sandbox/elements/tooltip"
 | "../../sandbox/elements/tooltip"
 | "../../../sandbox/elements/tooltip"
 | "./elements/tooltip"
 | "../elements/tooltip"
 | "../../elements/tooltip"
 | "../../../elements/tooltip"
 | "./tooltip"
 | "../tooltip"
 | "../../tooltip"
 | "../../../tooltip"
 | "./sandbox/env"
 | "../sandbox/env"
 | "../../sandbox/env"
 | "../../../sandbox/env"
 | "./env"
 | "../env"
 | "../../env"
 | "../../../env"
 | "./sandbox/fetch"
 | "../sandbox/fetch"
 | "../../sandbox/fetch"
 | "../../../sandbox/fetch"
 | "./fetch"
 | "../fetch"
 | "../../fetch"
 | "../../../fetch"
 | "./sandbox/message-box"
 | "../sandbox/message-box"
 | "../../sandbox/message-box"
 | "../../../sandbox/message-box"
 | "./message-box"
 | "../message-box"
 | "../../message-box"
 | "../../../message-box"
 | "./sandbox"
 | "../sandbox"
 | "../../sandbox"
 | "../../../sandbox"
 | "./sandbox/post/sender"
 | "../sandbox/post/sender"
 | "../../sandbox/post/sender"
 | "../../../sandbox/post/sender"
 | "./post/sender"
 | "../post/sender"
 | "../../post/sender"
 | "../../../post/sender"
 | "./sender"
 | "../sender"
 | "../../sender"
 | "../../../sender"
 | "./sandbox/process"
 | "../sandbox/process"
 | "../../sandbox/process"
 | "../../../sandbox/process"
 | "./process"
 | "../process"
 | "../../process"
 | "../../../process"
 | "./sandbox/storage"
 | "../sandbox/storage"
 | "../../sandbox/storage"
 | "../../../sandbox/storage"
 | "./storage"
 | "../storage"
 | "../../storage"
 | "../../../storage"
 | "./sandbox/window"
 | "../sandbox/window"
 | "../../sandbox/window"
 | "../../../sandbox/window"
 | "./window"
 | "../window"
 | "../../window"
 | "../../../window";
