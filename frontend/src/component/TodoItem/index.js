import { MdDeleteOutline } from "react-icons/md"; // Import delete icon
import "./index.css"; // Import component styles
import { useDrag } from 'react-dnd';
import CompletedTodos from "../CompletedTodos"
import { useState } from "react";

let timerId;

const TodoItem = (props) => {
  const { task, onClickDeleteBtn, index } = props;
  let { todo, id, start_time, status, description } = task;
  let startTime = start_time;

  const [seconds, setSeconds] = useState(0);

  // Format time as MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Start timer and make API call
  const onClickStartTimer = async () => {
    startTime = new Date().toISOString(); // Current time

    if (!timerId) {
      timerId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    await fetch("https://todo-app-backend-updated.onrender.com/start-timer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        todo_id: id,
        start_time: startTime
      }),
    });
  };

  // Pause timer and make API call
  const onClickPauseBtn = async () => {
    try {
      const response = await fetch("https://todo-app-backend-updated.onrender.com/pause-timer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo_id: id }),
      });

      if (response.ok) {
        clearInterval(timerId);
        timerId = null;
      }
    } catch (error) {
      console.error("Error pausing timer:", error);
    }
  };

  // Reset timer and make API call
  const onClickResetTime = async () => {
    try {
      const response = await fetch("https://todo-app-backend-updated.onrender.com/reset-timer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo_id: id }),
      });

      if (response.ok) {
        clearInterval(timerId);
        timerId = null;
        setSeconds(0);
      }
    } catch (error) {
      console.error("Error resetting timer:", error);
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { index, id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      className={`label-container d-flex flex-column align-items-start mb-3 task ${isDragging ? 'dragging' : ''}`}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}>
      {status === "Done" ? (
        <CompletedTodos 
          key={id}  
          startTime={startTime} 
          seconds={seconds}
          task={task} 
          onClickDeleteBtn={onClickDeleteBtn} 
          index={index} 
        />
      ) : (
        <>
          <div className="d-flex w-100 flex-column align-items-start mb-3">
            <p className="fw-bolder todo">{todo}</p>
            <p>{description}</p>
          </div>
          <div className="delete-icon-container" onClick={() => onClickDeleteBtn(id)}>
            <MdDeleteOutline size={20} /> {/* Delete icon */}
          </div>
          <div className="d-flex flex-column timer-card align-items-center">
            <div className="btns-container w-100 d-flex justify-content-center align-items-center flex-wrap">
              <button type="button" className="btn btn-primary mb-2" onClick={onClickStartTimer}>Start Timer</button>
              <button type="button" className="btn btn-secondary mb-2" onClick={onClickPauseBtn}>Pause Timer</button>
              <button type="button" className="btn btn-danger mb-2" onClick={onClickResetTime}>Reset Timer</button>
            </div>
            <p className="fw-bold timer">{formatTime(seconds)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
