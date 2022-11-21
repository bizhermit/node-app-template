import { useEffect, useRef, useState } from "react";

const usePortalElement = (options?: {
  id?: string;
  mount?: (element: HTMLDivElement) => void;
  unmount?: (element: HTMLDivElement) => void;
}) => {
  const idRef = useRef(options?.id || "");
  const [element, setElement] = useState<HTMLDivElement>();

  useEffect(() => {
    let elem = element || document.getElementById(idRef.current) as HTMLDivElement;
    if (elem == null) {
      elem = document.createElement("div");
      if (idRef.current) elem.id = idRef.current;
      document.body.appendChild(elem);
      options?.mount?.(elem);
      setElement(elem);
    }
    return () => {
      try {
        options?.unmount?.(elem);
      } catch (e) {
        // console.log(e);
      }
      try {
        document.body.removeChild(elem);
      } catch (e) {
        // console.log(e);
      }
    };
  }, []);

  return element;
};

export default usePortalElement;