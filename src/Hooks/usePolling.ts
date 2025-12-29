import { useCallback, useEffect, useRef, useState } from "react";

export function usePolling(
  callback: () => Promise<boolean | void>,
  interval: number = 5000
) {
  const [isPolling, setIsPolling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const start = useCallback(() => {
    if (isPolling) return;
    setIsPolling(true);

    const poll = async () => {
      const shouldStop = await callback();
      if (shouldStop) {
        stop();
      } else {
        timerRef.current = setTimeout(poll, interval);
      }
    };

    poll();
  }, [callback, interval, isPolling, stop]);

  useEffect(() => stop, [stop]);

  return { start, stop, isPolling };
}
