import { stringItem } from "@/data-items/data-item-wrapper";

const notification_title = stringItem({
  name: "title",
  label: "タイトル",
  type: "string",
  maxLength: 32,
  width: 300,
  charType: "h-alpha-num",
} as const);

export default notification_title;