import { useCallback, useState } from 'react';
import './App.css';
import useAddScrollEvent from './hooks/useAddScrollEvent';
import useSmoothApproach from './hooks/useSmoothApproach';

const covertScrollToGoal = (
  value: number,
  range: { min: number; max: number },
  limit: { min: number; max: number },
) => {
  return Math.max(
    limit.min,
    Math.min(
      limit.max,
      ((value - range.min) / (range.max - range.min)) *
        (limit.max - limit.min),
    ),
  );
};

export default function App() {
  const [scroll, setScroll] = useState(0);
  const [goal, setGoal] = useState(0);

  const scrollHandler = useCallback(() => {
    setScroll(window.scrollY);
    setGoal(
      covertScrollToGoal(
        window.scrollY,
        { min: 100, max: 500 },
        { min: 100, max: 1500 },
      ),
    );
  }, []);

  useAddScrollEvent({ callback: scrollHandler, isWindow: true });

  const { smooth: smoothPosition } = useSmoothApproach({
    goal,
    minTick: 0.05,
  });

  return (
    <div className="h-[200vh] flex items-center">
      <div className="fixed font-bold text-3xl bottom-10 whitespace-pre-wrap">
        smoothPosition: {smoothPosition}
        {'\n'}
        scroll : {scroll}
      </div>
      <div
        className={`fixed top-0 w-48 p-4 bg-blue-500 text-white text-center rounded-lg transition-transform duration-200 ease-linear`}
        style={{ transform: `translateX(${smoothPosition}px)` }}
      >
        {smoothPosition} 스크롤 정도에 따라 이동하는 요소{' '}
      </div>
      <div className="absolute invisible h-screen"></div>
    </div>
  );
}
