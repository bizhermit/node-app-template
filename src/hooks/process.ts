import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { useRef, useState } from "react";

type ProcessFunc<T> = (() => Promise<T>);

type Options = {
  wait?: boolean;
  collectListenInterval?: number;
};

const defaultInterval = 200;

const useProcess = (listenInterval = defaultInterval) => {
  const ref = useRef(false);
  const state = useState(ref.current);
  const waitQueue = useRef<Array<{ id: string; func: ProcessFunc<any> }>>([]);
  const returnQueue = useRef<{ [id: string]: { ret?: any; err?: any; } }>({});
  const listenId = useRef(0);

  const begin = () => {
    ref.current = true;
    state[1](true);
  };

  const completed = () => {
    ref.current = false;
    state[1](false);
  };

  const listen = (lid: number) => {
    if (lid !== listenId.current) {
      completed();
      return;
    }
    if (ref.current) {
      setTimeout(() => {
        listen(lid);
      }, listenInterval);
      return;
    }
    const item = waitQueue.current.shift();
    if (item == null) {
      completed();
      return;
    }
    begin();
    item.func().then((ret) => {
      if (lid === listenId.current) {
        returnQueue.current[item.id] = { ret };
        return;
      }
      returnQueue.current[item.id] = { err: new Error("process killed.") };
    }).catch((err) => {
      returnQueue.current[item.id] = { err };
    }).finally(() => {
      completed();
      listen(lid);
    });
  };

  const main = <T>(func: ProcessFunc<T>, options?: Options) => {
    if (func == null) throw new Error("no process");
    if (ref.current && options?.wait === false) throw new Error("other process running.");

    const id = StringUtils.generateUuidV4();
    waitQueue.current.push({ id, func });

    if (!ref.current) listen(++listenId.current);
    const collectListenInterval = Math.max(10, options?.collectListenInterval ?? listenInterval);
    return new Promise<T>((resolve, reject) => {
      const endListen = () => {
        if (!(id in returnQueue.current)) {
          setTimeout(endListen, collectListenInterval);
          return;
        }
        const { ret, err } = returnQueue.current[id];
        if (err) {
          reject(err);
          return;
        }
        resolve(ret as T);
      };
      endListen();
    });
  };
  main.ing = state[0];
  main.get = () => ref.current;
  main.clear = () => waitQueue.current.splice(0, waitQueue.current.length);
  main.kill = (all?: boolean) => {
    if (all) {
      main.clear().forEach(item => {
        returnQueue.current[item.id] = { err: new Error("process killed.") };
      });
    }
    listen(++listenId.current);
  };
  return main;
};

export default useProcess;
