import React, { useState, useEffect, useRef } from 'react';

const CustomTimer = (props) => {
  const [time, setTime] = useState(props.initialTime);
  const timerRef = useRef(null); 
  const autoStartDelay = 5;
  

  useEffect(() => {
    setTime(props.initialTime);
  }, [props.initialTime]);

  useEffect(() => {
    let timer;
    if (props.isRunning && time > 0) {
      timerRef.current = setInterval(() => { 
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            props.setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (props.isRunning && time === 0) {
      props.setIsRunning(false);
    }

    return () => clearInterval(timerRef.current);
  }, [props.isRunning, time]);

  // 開始時間の遅延関数
  useEffect(() => {
    let delayTimer;
    if (autoStartDelay > 0 && !props.isRunning) {
      delayTimer = setTimeout(() => {
        props.setIsRunning(true);
      }, autoStartDelay * 1000);
    }

    return () => clearTimeout(delayTimer);
  }, [autoStartDelay, props.isRunning]);

  // 分数、秒数のFormat関数
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer" style={{ fontSize: '110px', margin: '10px 0'  }}>
      <p>{formatTime(time)}</p>
    </div>
  );
};

export default CustomTimer;


