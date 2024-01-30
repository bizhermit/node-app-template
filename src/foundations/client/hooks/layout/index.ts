import { LayoutContext } from "#/client/hooks/layout/context";
import { useContext } from "react";

const useLayout = () => {
  return useContext(LayoutContext);
};

export default useLayout;