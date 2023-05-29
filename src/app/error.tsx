"use client";

import Button from "#/components/elements/button";
import { RedoIcon } from "#/components/elements/icon";
import { useEffect } from "react";

const ErrorPage: ErrorFC = ({
  error,
  reset,
}) => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex-center w-100 h-100 gap-2">
      <h2>Fatal Error</h2>
      <Button
        $icon={<RedoIcon />}
        $onClick={reset}
      />
    </div>
  );
};

export default ErrorPage;