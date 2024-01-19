"use client";

import useRouter from "#/client/hooks/router";
import { signOut } from "next-auth/react";
import { FC, ReactNode, createContext, useContext } from "react";

type SignedInContextProps = {
  data: SignInUser;
  signOut: (unlock?: VoidFunc) => Promise<void>;
};

const SignedInContext = createContext<SignedInContextProps>({
  data: null!,
  signOut: null!,
});

export const useUser = () => useContext(SignedInContext);

export const SignedInProvider: FC<{
  user: SignInUser;
  children: ReactNode;
}> = ({ user, children }) => {
  const router = useRouter();

  return (
    <SignedInContext.Provider value={{
      data: user,
      signOut: async (unlock) => {
        try {
          await signOut({ redirect: false });
          router.push("/sign-in");
        } catch {
          unlock?.();
        }
      },
    }}>
      {children}
    </SignedInContext.Provider>
  );
};
