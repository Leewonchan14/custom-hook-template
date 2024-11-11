import { useCallback, useEffect, useRef, useState } from 'react';

export default function useSmoothApproach({
  goal,
  speed = 50,
  minTick = 0.05,
}: {
  goal: number;
  speed?: number;
  minTick?: number;
}) {
  const currentRef = useRef({ goal, speed, minTick });
  const [smooth, setSmooth] = useState(0);
  const [trigger, setTrigger] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);

  // 실시간 업데이트
  useEffect(() => {
    currentRef.current = { goal, speed, minTick };
  }, [goal, minTick, speed]);

  // interval 생성: 실시간으로 current값이 업데이트 되어서 useCallback 사용
  const interval = useCallback(() => {
    return setInterval(() => {
      const { goal, minTick, speed } = currentRef.current;

      setSmooth((prev) => {
        const prevToGoal = goal - prev;
        const sign =
          prevToGoal !== 0
            ? Math.round(Math.abs(prevToGoal) / prevToGoal)
            : 0;

        const nextTick = prevToGoal * (speed / 100);

        const next = prev + sign * Math.max(Math.abs(nextTick), minTick);

        if (sign > 0) {
          return Math.min(goal, next);
        } else {
          return Math.max(goal, next);
        }
      });
    }, 200);
  }, []);

  // goal이 변경되면 interval 재시작
  useEffect(() => {
    // goal이 변경되면 interval 재시작
    if (goal !== smooth && !intervalRef.current) {
      setTrigger((prev) => prev + 1);
    }

    // goal이 smooth와 같아지면 interval 중지
    if (goal === smooth && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, [smooth, goal]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (trigger === 0) return;
    intervalRef.current = interval();
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    };
  }, [interval, trigger]);

  return { smooth };
}
