import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { useRef, useState } from "react";

type Options<T> = {
  key?: string;
  wait?: boolean | "keyUnique" | "keyMonopoly";
  killRunning?: boolean;
  killAll?: boolean;
  cancelWaiting?: boolean;
  cutIn?: boolean;
  then?: (ret: T) => void;
  blocked?: (context: { hasSameKey: boolean; waitingLength: number }) => void;
  killed?: () => void;
  canceled?: () => void;
  catch?: (err: any) => void;
  finally?: (succeeded: boolean) => void;
  done?: (succeeded: boolean) => void;
};

type ProcessFunc<T> = (() => Promise<T>);
type ProcessItem = {
  id: string;
  func: ProcessFunc<any>;
  opts?: Options<any>;
  resolve: (v: any) => void;
  reject: (err: any) => void;
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
      item.opts?.then?.(ret);
      item.opts?.finally?.(true);
      item.opts?.done?.(true);
      item.resolve(ret);
    }).catch(e => {
      if (running.current?.id !== item.id) return;
      item.opts?.catch?.(e);
      item.opts?.finally?.(false);
      item.opts?.done?.(false);
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
      const err = new Error("running process killed.");
      running.current.reject(err);
      running.current?.opts?.killed?.();
      running.current.opts?.catch?.(err);
      running.current.opts?.finally?.(false);
      running.current = undefined;
      completed();
      count++;
    }
    if (all) {
      cancel().forEach(item => {
        const err = new Error("waiting process killed.");
        item.reject(err);
        item.opts?.canceled?.();
        item.opts?.catch?.(err);
        item.opts?.finally?.(false);
        count++;
      });
    }
    if (all !== true && preventListen !== true) listen();
    return count;
  };

  const hasKey = (key?: string) => {
    if (!key) return false;
    if (running.current?.opts?.key === key) return true;
    return waiting.current.some(item => item.opts?.key === key);
  };

  const main = <T>(func: ProcessFunc<T>, options?: Options<T>) => {
    if (func == null) {
      const err = new Error("no process");
      options?.catch?.(err);
      options?.finally?.(false);
      throw err;
    }
    if (options?.killRunning || options?.killAll) kill(options?.killAll, true);
    if (options?.cancelWaiting) cancel();
    if (ref.current) {
      const blocked = () => {
        const err = new Error("other process running.");
        options?.blocked?.({ hasSameKey: hasKey(options?.key), waitingLength: waiting.current.length });
        options?.catch?.(err);
        options?.finally?.(false);
        return err;
      };
      if (options?.wait === "keyUnique") {
        if (hasKey(options?.key)) throw blocked();
      } else if (options?.wait === "keyMonopoly") {
        if (running.current?.opts?.key !== options?.key || waiting.current.some(item => item.opts?.key !== options?.key)) {
          throw blocked();
        }
      } else if (!options?.wait) {
        throw blocked();
      }
    }

    const item: ProcessItem = {
      id: StringUtils.generateUuidV4(),
      func,
      opts: options,
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
  main.getWaitingLength = () => waiting.current.length;
  main.hasKey = hasKey;

  return main;
};
export default useProcess;
