"use client";

import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import TextBox from "#/client/elements/form/items/text-box";
import PasswordBox from "#/client/elements/form/items/text-box/password";
import useMessageBox from "#/client/elements/message-box";
import useRouter from "#/client/hooks/router";
import credentialsSignIn from "$/auth/credentials-signin";
import pickUid from "$/auth/pick-uid";
import { signin_mailAddress, signin_password } from "$/data-items/signin";
import { getSession } from "next-auth/react";
import Style from "./_components/sign-in.module.scss";

const Page: PageFC = ({ searchParams }) => {
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
          keepLock();
          const uid = (await getSession())?.user.id;
          const callbackUrl = searchParams?.callbackUrl;
          if (callbackUrl) {
            const href = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
            if (uid?.toString() === pickUid(href)) {
              location.href = href;
              return;
            }
          }
          router.push("/[uid]", { uid });
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