import dataItem from "@/data-items/data-item-wrapper";

const notification_releaseDate = dataItem({
  name: "release_date",
  type: "date",
} as const);

export default notification_releaseDate;