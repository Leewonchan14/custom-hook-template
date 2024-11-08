import useDebounceCallback from '@/hooks/useDebounceCallback';
import { useEffect, useRef, useState } from 'react';

export enum ScrollDirection {
  IDLE = 'IDLE',
  UP = 'UP',
  DOWN = 'DOWN',
}

export const useScrollState = (
  offset = 0,
  delay = 300,
  isCanIdle = true,
) => {
  const [scrollState, setScrollState] = useState<ScrollDirection>(
    ScrollDirection.IDLE,
  );
  const lastTopScroll = useRef<number>(0);
  const timeout = useDebounceCallback(() => {
    setScrollState(ScrollDirection.IDLE);
  }, delay);

  useEffect(() => {
    const handleScroll = () => {
      const currentTopScroll = document.documentElement.scrollTop;

      // offset 만큼의 변화가 없다면 무시
      if (Math.abs(currentTopScroll - lastTopScroll.current) < offset)
        return;

      if (currentTopScroll > lastTopScroll.current) {
        setScrollState(ScrollDirection.DOWN);
      } else if (currentTopScroll < lastTopScroll.current) {
        setScrollState(ScrollDirection.UP);
      }
      lastTopScroll.current = currentTopScroll;
      if (isCanIdle) timeout();
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [delay, isCanIdle, offset, timeout]);

  return { scrollState };
};
