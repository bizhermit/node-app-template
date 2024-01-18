import { getServerSession } from "next-auth";
import nextAuthOptions from "./options";

const electron = (global as any).electron;

const getSession = () => {
  if (electron) {
    return (async () => {
      return (global as any).session;
    })();
  }
  return getServerSession(nextAuthOptions);
};

export default getSession;