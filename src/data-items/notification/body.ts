import dataItem from "@/data-items/data-item-wrapper";

const notification_body = dataItem({
  name: "body",
  type: "string",
  maxLength: 1023,
} as const);

export default notification_body;