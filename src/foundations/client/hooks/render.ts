import { useState } from "react";

const useRender = () => {
  const [_, s] = useState(0);
  return () => s(c => c + 1);
};

export default useRender;
