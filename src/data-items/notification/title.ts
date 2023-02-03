import { stringItem } from "@/data-items/data-item-wrapper";

const notification_title = stringItem({
  name: "title",
  label: "タイトル",
  maxLength: 32,
  width: 300,
} as const);

export default notification_title;