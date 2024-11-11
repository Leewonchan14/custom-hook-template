import { useEffect, useRef } from 'react';

export default function useAddScrollEvent<T extends HTMLElement>({
  callback,
  isWindow,
}: {
  callback: (e?: Event) => void;
  isWindow?: boolean;
}) {
  const targetRef = useRef<T>(null);
  useEffect(() => {
    const target = targetRef.current ?? (isWindow ? window : undefined);
    if (!target) return;

    target.addEventListener('scroll', callback);
    return () => {
      target.removeEventListener('scroll', callback);
    };
  }, [callback, isWindow]);

  return { targetRef };
}
