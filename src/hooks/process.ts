import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { useRef, useState } from "react";

type ProcessFunc<T> = (() => Promise<T>);
type ProcessItem = {
  id: string;
  func: ProcessFunc<any>;
  resolve: (v: any) => void;
  reject: (err: any) => void;
};

type Options = {
  wait?: boolean;
  killRunning?: boolean;
  killAll?: boolean;
  cancelWaiting?: boolean;
  cutIn?: boolean;
};

const useProcess = () => {
  const ref = useRef(false);
  const state = useState(ref.current);
  const waiting = useRef<Array<ProcessItem>>([]);
  const running = useRef<ProcessItem>();

  const begin = (item: ProcessItem) => {
    running.current = item;
    ref.current = true;
    state[1](true);
  };

  const completed = () => {
    running.current = undefined;
    ref.current = false;
    state[1](false);
  };

  const listen = () => {
    const item = waiting.current.shift();
    if (item == null) {
      completed();
      return;
    }
    begin(item);
    item.func().then(ret => {
      if (running.current?.id !== item.id) return;
      item.resolve(ret);
    }).catch(e => {
      if (running.current?.id !== item.id) return;
      item.reject(e);
    }).finally(() => {
      if (running.current?.id !== item.id) return;
      completed();
      listen();
    });
  };

  const cancel = () => {
    return waiting.current.splice(0, waiting.current.length);
  };

  const kill = (all?: boolean, preventListen?: boolean) => {
    let count = 0;
    if (running.current) {
      running.current.reject(new Error("running process killed."));
      running.current = undefined;
      completed();
      count++;
    }
    if (all) {
      cancel().forEach(item => {
        item.reject(new Error("waiting process killed."));
        count++;
      });
    }
    if (all !== true && preventListen !== true) listen();
    return count;
  };


  const main = <T>(func: ProcessFunc<T>, options?: Options) => {
    if (func == null) throw new Error("no process");
    if (options?.killRunning || options?.killAll) kill(options?.killAll, true);
    if (options?.cancelWaiting) cancel();
    if (ref.current && options?.wait !== true) {
      throw new Error("other process running.");
    }

    const item: ProcessItem = {
      id: StringUtils.generateUuidV4(),
      func,
      resolve: () => { },
      reject: () => { },
    };
    if (options?.cutIn) waiting.current.unshift(item);
    else waiting.current.push(item);

    if (!ref.current) listen();
    return new Promise<T>((resolve, reject) => {
      item.resolve = resolve;
      item.reject = reject;
    });
  };
  main.ing = state[0];
  main.get = () => ref.current;
  main.cancel = cancel;
  main.kill = kill;

  return main;
};
export default useProcess;
