"use client";

import Button from "#/client/elements/button";
import { RedoIcon } from "#/client/elements/icon";
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
    <div className="flex column center middle w-100 h-100 g-m">
      <h2>Fatal Error</h2>
      <Button
        $icon={<RedoIcon />}
        onClick={reset}
      />
    </div>
  );
};

export default ErrorPage;