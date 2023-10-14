"use client";

import StructView from "#/client/elements/struct-view";
import Text from "#/client/elements/text";
import { useEffect, useState } from "react";

const EnvClient = () => {
  const [env, setEnv] = useState<Struct>();

  useEffect(() => {
    setEnv(process.env);
    console.log(process.env.NEXT_PUBLIC_TEST);
  }, []);

  return (
    <section>
      <h1>Client</h1>
      {Object.keys(env ?? {}).length > 0 ?
        <StructView $value={env} /> :
        <Text>no contents</Text>
      }
    </section>
  );
};

export default EnvClient;