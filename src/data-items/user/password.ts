import dataItem from "@/data-items/data-item-wrapper";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

const user_password = dataItem({
  name: "password",
  type: "string",
  minLength: 8,
  maxLength: 32,
  validations: [
    (v) => {
      if (StringUtils.isHalfWidthAlphanumericAndSymbols(v)) return "";
      return "半角英数字記号で入力してください。";
    },
  ],
} as const);

export default user_password;