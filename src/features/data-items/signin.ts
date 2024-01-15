import stringItem from "#/data-items/string";

export const signin_mailAddress = stringItem({
  name: "mail_address",
  label: "MailAddress",
  required: true,
  inputMode: "email",
});

export const signin_password = stringItem({
  name: "password",
  label: "Password",
  required: true,
  inputMode: "url",
});
