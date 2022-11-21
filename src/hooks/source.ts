import { useState, useEffect } from "react";

export type Source = Array<Struct> | (() => Array<Struct>) | (() => Promise<Array<Struct>>);

const useSource = (props: {
  source: Source;
  preventMemorize?: boolean;
}) => {
  const [originSource, setOriginSource] = useState<Array<Struct>>(() => {
    if (Array.isArray(props.source)) {
      return props.source;
    }
    return [];
  });
  const [source, setSource] = useState<Array<Struct>>(() => {
    return originSource;
  });

  useEffect(() => {
    setSource(originSource);
  }, [originSource]);

  useEffect(() => {
    if (Array.isArray(props.source)) {
      setOriginSource(props.source);
      return;
    }
    const arr = props.source();
    if (Array.isArray(arr)) {
      setOriginSource([...arr]);
      return;
    }
    arr.then(src => {
      setOriginSource([...src]);
    });
  }, [props.preventMemorize ? props.source : undefined]);

  return { originSource, setOriginSource, source, setSource };
};

export default useSource;