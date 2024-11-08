import { useCallback, useEffect, useRef, useState } from 'react';

const useScreenOn = (margin?: {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}) => {
  const { top, right, bottom, left } = margin ?? {
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  };
  const targetRef = useRef(null);
  const [isCanObserve, setIsCanObserve] = useState(true);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    if (!targetRef.current || !isCanObserve) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      {
        rootMargin: `${top ?? '0px'} ${right ?? '0px'} ${bottom ?? '0px'} ${
          left ?? '0px'
        }`,
      },
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [top, right, bottom, left, isCanObserve]);

  const disconnect = useCallback(() => {
    setIsCanObserve(false);
  }, []);

  const connect = useCallback(() => {
    setIsCanObserve(true);
  }, []);

  return { isOnScreen, targetRef, disconnect, connect };
};

export default useScreenOn;
