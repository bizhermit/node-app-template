import { getServerSession } from "next-auth";
import nextAuthOptions from "./options";

const getSession = async () => {
  return getServerSession(nextAuthOptions);
};

export default getSession;