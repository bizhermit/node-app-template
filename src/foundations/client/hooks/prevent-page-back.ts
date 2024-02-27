import { useEffect } from "react";

const usePreventPageBack = () => {
  useEffect(() => {
    history.pushState(null, "");
    const event = () => history.go(1);
    window.addEventListener("popstate", event);
    return () => {
      window.removeEventListener("popstate", event);
    };
  }, []);
};

export default usePreventPageBack;
