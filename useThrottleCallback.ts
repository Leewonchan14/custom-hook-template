/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { DependencyList, useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useThrottleCallback2<T extends (...args: any[]) => any>(
  callback: T,
  limit: number,
  deps: DependencyList,
): T {
  const callbackRef = useRef<T>(callback);

  // 항상 최신의 callback을 유지
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  const throttledCallback = useCallback(
    _.throttle((...args: Parameters<T>) => {
      callbackRef.current(...args);
    }, limit),
    [limit],
  );

  // 컴포넌트 언마운트 시 throttled 함수 취소
  useEffect(() => {
    return () => {
      throttledCallback.cancel();
    };
  }, [throttledCallback]);

  return throttledCallback as unknown as T;
}

export default useThrottleCallback2;
