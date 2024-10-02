// useTimer.js
import { useState, useRef, useEffect } from 'react';

const useTimer = (initialSeconds) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const timerIdRef = useRef(null);

  const startTimer = () => {
    if (!timerIdRef.current) {
      timerIdRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    clearInterval(timerIdRef.current);
    timerIdRef.current = null;
  };

  const resetTimer = () => {
    clearInterval(timerIdRef.current);
    timerIdRef.current = null;
    setSeconds(0);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerIdRef.current);
    };
  }, []);

  return { seconds, startTimer, pauseTimer, resetTimer };
};

export default useTimer;
