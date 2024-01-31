import $str from "../data-items/string";

export const signin_mailAddress = $str({
  name: "mail_address",
  label: "MailAddress",
  required: true,
  inputMode: "email",
});

export const signin_password = $str({
  name: "password",
  label: "Password",
  required: true,
  inputMode: "url",
});
