import { useCallback, useRef, useState } from "react";

/** Undo/redo state container used by every Nexora editor. */
export function useHistory<T>(initial: T, limit = 80) {
  const [state, setState] = useState<T>(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const [version, setVersion] = useState(0);

  const commit = useCallback(
    (next: T | ((prev: T) => T)) => {
      setState((prev) => {
        past.current = [...past.current.slice(-limit), prev];
        future.current = [];
        return typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      });
      setVersion((v) => v + 1);
    },
    [limit],
  );

  /** Update without creating a history entry (e.g. live drag strokes). */
  const set = useCallback((next: T | ((prev: T) => T)) => {
    setState((prev) => (typeof next === "function" ? (next as (p: T) => T)(prev) : prev));
    setState(next as T);
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      const last = past.current.pop();
      if (last === undefined) return prev;
      future.current = [prev, ...future.current];
      return last;
    });
    setVersion((v) => v + 1);
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      const [next, ...rest] = future.current;
      if (next === undefined) return prev;
      future.current = rest;
      past.current = [...past.current, prev];
      return next;
    });
    setVersion((v) => v + 1);
  }, []);

  const reset = useCallback((value: T) => {
    past.current = [];
    future.current = [];
    setState(value);
    setVersion((v) => v + 1);
  }, []);

  return {
    state,
    setState: set,
    commit,
    undo,
    redo,
    reset,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
    version,
  };
}
