import { useContext } from "react";
import { MessageContext } from "./context";

const useMessage = () => {
  return useContext(MessageContext);
};

export default useMessage;
