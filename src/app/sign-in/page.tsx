"use client";

import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import TextBox from "#/client/elements/form/items/text-box";
import PasswordBox from "#/client/elements/form/items/text-box/password";
import useMessageBox from "#/client/elements/message-box";
import useRouter from "#/client/hooks/router";
import credentialsSignIn from "$/auth/credentials-signin";
import { signin_mailAddress, signin_password } from "$/data-items/signin";
import { getSession } from "next-auth/react";
import Style from "./_components/sign-in.module.scss";

const Page = () => {
  const msgBox = useMessageBox();
  const router = useRouter();

  return (
    <div className={Style.wrap}>
      <Form
        className={Style.form}
        method="post"
        onSubmit={async (fd, { keepLock }) => {
          const { ok, message } = await credentialsSignIn(fd);
          if (!ok) {
            msgBox.alert(message);
            return;
          }
          const session = await getSession();
          router.push("/[uid]", { uid: session?.user.id });
          keepLock();
        }}
        $layout="flex"
        $messageDisplayMode="none"
      >
        <TextBox
          $dataItem={signin_mailAddress}
          $tag
          $focusWhenMounted
        />
        <PasswordBox
          $dataItem={signin_password}
          $tag
        />
        <div className={Style.button}>
          <Button type="submit">
            SignIn
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Page;