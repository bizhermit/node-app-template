import dataItem from "@/data-items/data-item-wrapper";

const notification_title = dataItem({
  name: "title",
  type: "string",
  maxLength: 32,
  width: 300,
} as const);

export default notification_title;