import stringItem from "@/data-items/string";
import StringUtils from "@bizhermit/basic-utils/dist/string-utils";

const user_password = stringItem({
  name: "password",
  minLength: 8,
  maxLength: 32,
  validations: [
    (v) => {
      if (StringUtils.isHalfWidthAlphanumericAndSymbols(v)) return undefined;
      return "半角英数字記号で入力してください。";
    },
  ],
});

export default user_password;