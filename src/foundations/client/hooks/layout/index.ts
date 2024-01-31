import { useContext } from "react";
import { LayoutContext } from "./context";

const useLayout = () => {
  return useContext(LayoutContext);
};

export default useLayout;