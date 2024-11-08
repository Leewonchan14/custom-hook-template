import { useCallback, useEffect, useRef, useState } from 'react';

const useScreenOn = <T extends HTMLElement>(margin?: {
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
  const targetRef = useRef<T>(null);
  const [isObserving, setIsObserving] = useState(true);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    if (!targetRef.current || !isObserving) return;

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
  }, [top, right, bottom, left, isObserving]);

  const disconnect = useCallback(() => {
    setIsObserving(false);
  }, []);

  const connect = useCallback(() => {
    setIsObserving(true);
  }, []);

  return {
    isOnScreen,
    isObserving,
    targetRef,
    disconnect,
    connect,
  };
};

export default useScreenOn;
