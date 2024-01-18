"use client";

import credentialsSignIn from "#/auth/credentials-signin";
import { signin_mailAddress, signin_password } from "#/auth/data-items";
import pickUid from "#/auth/pick-uid";
import Button from "#/client/elements/button";
import Form from "#/client/elements/form";
import TextBox from "#/client/elements/form/items/text-box";
import PasswordBox from "#/client/elements/form/items/text-box/password";
import Loading from "#/client/elements/loading";
import useMessageBox from "#/client/elements/message-box";
import useRouter from "#/client/hooks/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Style from "./_components/sign-in.module.scss";

const Page: PageFC = ({ searchParams }) => {
  const msgBox = useMessageBox();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      const uid = session.data.user.id;
      const callbackUrl = searchParams?.callbackUrl;
      if (callbackUrl) {
        const href = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
        if (uid?.toString() === pickUid(href)) {
          location.href = href;
          return;
        }
      }
      router.push("/[uid]", { uid });
    }
  }, [session.status]);

  if (session.status === "authenticated") {
    return <Loading />;
  }
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