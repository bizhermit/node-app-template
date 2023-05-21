import StringUtils from "@bizhermit/basic-utils/dist/string-utils";
import { useRef, useState } from "react";

type ProcessKillMode = "sameKey" | "otherKey";
type ProcessCancelMode = "sameKey" | "otherKey";

type Options<T> = {
  key?: string;
  wait?: boolean | "keyUnique" | "keyMonopoly";
  kill?: boolean | ProcessKillMode;
  cancel?: boolean | ProcessCancelMode;
  cutIn?: boolean;
  throughError?: boolean;
  then?: (ret: T) => void;
  blocked?: (context: { hasSameKey: boolean; waitingLength: number }) => void;
  killed?: () => void;
  canceled?: () => void;
  catch?: (err: any) => void;
  finally?: (succeeded: boolean) => void;
  failed?: (err: any) => void;
  finished?: (succeeded: boolean) => void;
};

type ProcessFunc<T> = (() => Promise<T>);
type ProcessItem = {
  id: string;
  func: ProcessFunc<any>;
  opts?: Options<any>;
  resolve: (v: any) => void;
  reject: (err: any) => void;
};

const returnReject = <T>(item: ProcessItem | null, err: any) => {
  // eslint-disable-next-line no-console
  console.warn(`process${item?.opts?.key ? `[${item.opts.key}]` : ""} reject as resolve.`, err?.message);
  return new Promise<T>(resolve => resolve);
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
      try {
        item.opts?.then?.(ret);
        item.opts?.finally?.(true);
        item.opts?.finished?.(true);
        item.resolve(ret);
      } catch (e) {
        if (item.opts?.throughError) {
          item.reject(e);
        } else {
          returnReject(item, e);
          item.resolve(undefined);
        }
      }
    }).catch(err => {
      if (running.current?.id !== item.id) return;
      try {
        item.opts?.failed?.(err);
        item.opts?.catch?.(err);
        item.opts?.finally?.(false);
        item.opts?.finished?.(false);
        if (item.opts?.throughError) {
          item.reject(err);
        } else {
          returnReject(item, err);
          item.resolve(undefined);
        }
      } catch (e) {
        if (item.opts?.throughError) {
          item.reject(e);
        } else {
          returnReject(item, e);
          item.resolve(undefined);
        }
      }
    }).finally(() => {
      if (running.current?.id !== item.id) return;
      completed();
      setTimeout(listen);
    });
  };

  const kill = (mode?: ProcessKillMode, key?: string, preventListen?: boolean) => {
    if (running.current == null) return 0;

    switch (mode) {
      case "sameKey":
        if (running.current.opts?.key !== key) return 0;
        break;
      case "otherKey":
        if (running.current.opts?.key === key) return 0;
        break;
      default:
        break;
    }

    try {
      const err = new Error("running process killed.");
      running.current.opts?.killed?.();
      running.current.opts?.catch?.(err);
      running.current.opts?.finally?.(false);
      if (running.current.opts?.throughError) {
        running.current.reject(err);
      } else {
        returnReject(running.current!, err);
        running.current.resolve(undefined);
      }
    } catch (e) {
      if (running.current.opts?.throughError) {
        running.current.reject(e);
      } else {
        returnReject(running.current, e);
        running.current.resolve(undefined);
      }
    }

    completed();
    if (!preventListen) listen();
    return 1;
  };

  const cancel = (mode?: ProcessCancelMode, key?: string) => {
    let count = 0;
    const canceled = (item: ProcessItem) => {
      try {
        const err = new Error("waiting process canceled.");
        item.opts?.canceled?.();
        item.opts?.catch?.(err);
        item.opts?.finally?.(false);
        if (item.opts?.throughError) {
          item.reject(err);
        } else {
          returnReject(item, err);
          item.resolve(err);
        }
      } catch (e) {
        if (item.opts?.throughError) {
          item.reject(e);
        } else {
          returnReject(item, e);
          item.resolve(e);
        }
      }
      count++;
    };
    if (mode) {
      for (let i = waiting.current.length - 1; i >= 0; i--) {
        const item = waiting.current[i];
        if (item == null) continue;
        switch (mode) {
          case "sameKey":
            if (item.opts?.key !== key) continue;
            break;
          case "otherKey":
            if (item.opts?.key === key) continue;
            break;
        }
        canceled(item);
        waiting.current.splice(i, 1);
      }
      return count;
    }
    waiting.current.forEach(item => canceled(item));
    waiting.current.splice(0, waiting.current.length);
    return count;
  };

  const destory = (mode?: ProcessKillMode, key?: string) => {
    const killCount = kill(mode, key, true);
    const cancelCount = cancel(mode, key);
    if (killCount > 0) listen();
    return {
      killed: killCount,
      canceled: cancelCount,
    };
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
      if (options?.throughError) throw err;
      else return returnReject<T>(null, err);
    }

    if (options?.kill) {
      kill(options.kill === true ? undefined : options.kill, options.key, true);
    }
    if (options?.cancel) {
      cancel(options.cancel === true ? undefined : options.cancel, options.key);
    }

    const item: ProcessItem = {
      id: StringUtils.generateUuidV4(),
      func,
      opts: options,
      resolve: () => { },
      reject: () => { },
    };

    if (ref.current || waiting.current.length > 0) {
      const blocked = () => {
        try {
          const err = new Error("other process is running.");
          options?.blocked?.({ hasSameKey: hasKey(options?.key), waitingLength: waiting.current.length });
          options?.catch?.(err);
          options?.finally?.(false);
          return err;
        } catch (e) {
          return e;
        }
      };
      if (options?.wait === "keyUnique") {
        if (hasKey(options?.key)) {
          const err = blocked();
          if (options?.throughError) throw err;
          return returnReject<T>(item, err);
        }
      } else if (options?.wait === "keyMonopoly") {
        if (running.current?.opts?.key !== options?.key || waiting.current.some(item => item.opts?.key !== options?.key)) {
          const err = blocked();
          if (options?.throughError) throw err;
          return returnReject<T>(item, err);
        }
      } else if (!options?.wait) {
        const err = blocked();
        if (options?.throughError) throw err;
        return returnReject<T>(item, err);
      }
    }

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
  main.kill = (mode?: ProcessKillMode, key?: string) => kill(mode, key);
  main.cancel = cancel;
  main.destory = destory;
  main.getWaitingLength = () => waiting.current.length;
  main.hasKey = hasKey;

  return main;
};

export default useProcess;
