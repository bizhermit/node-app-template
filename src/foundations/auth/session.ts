import { getServerSession } from "next-auth";
import nextAuthOptions from "./options";

const getSession = () => {
  return getServerSession(nextAuthOptions);
};

export default getSession;