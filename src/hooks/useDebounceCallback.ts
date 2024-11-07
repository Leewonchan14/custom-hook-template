/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { DependencyList, useEffect, useRef } from 'react';

export default function useDebounceCallback<
  T extends (...args: any[]) => any,
>(callback: T, delay: number, deps: DependencyList = []): T {
  const callbackRef = useRef(callback);

  // 항상 최신의 callback을 참조하도록 업데이트
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  const debouncedFnRef = useRef<T>(
    _.debounce((...args: any[]) => {
      callbackRef.current(...args);
    }, delay) as unknown as T,
  );

  // 컴포넌트 언마운트 시 디바운스된 함수 취소
  useEffect(() => {
    const debouncedFn = debouncedFnRef.current;
    return () => {
      (
        debouncedFn as unknown as _.DebouncedFunc<(...args: any[]) => void>
      ).cancel();
    };
  }, []);

  return debouncedFnRef.current;
}
