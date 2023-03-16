import { useRef, useState } from "react";

const useProcess = (init = false) => {
  const ref = useRef(init);
  const state = useState(ref.current);
  return {
    ing: state[0],
    get: () => ref.current,
    begin: () => {
      ref.current = true;
      state[1](true);
    },
    complete: () => {
      ref.current = false;
      state[1](false);
    },
  };
};

export default useProcess;