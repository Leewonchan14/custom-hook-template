import { useEffect, useRef, useState } from 'react';

const useScreenOn = (marginOffset = 0) => {
  const targetRef = useRef(null);
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { rootMargin: `${marginOffset}px` },
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [marginOffset]);

  return { isOnScreen, targetRef };
};

export default useScreenOn;
