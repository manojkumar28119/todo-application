import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import './index.css'; // Add your styles for completed todos

const CompletedTodos = ({ task, onClickDeleteBtn, index }) => {
  let { start_time, id } = task;

  const [totalTimeSpent, setTotalTimeSpent] = useState(task.total_time_spent || 0);

  // Convert start_time to Date object
  const startTime = new Date(start_time);
  const endTime = new Date(startTime.getTime() + totalTimeSpent * 1000); // Assuming total_time_spent is in seconds

  // Helper function to format time spent into a human-readable string
  const formatTimeSpent = (seconds) => {
    if (!seconds || isNaN(seconds)) {
      return "0 sec"; // Handle invalid or undefined total_time_spent
    }

    // Calculate hours, minutes, and seconds from total seconds
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Return formatted time string
    return `${hrs > 0 ? `${hrs} hr ` : ""}${mins > 0 ? `${mins} min ` : ""}${secs > 0 ? `${secs} sec` : ""}`;
  };

  // Fetch the actual total time spent from the backend
  const fetchTimerData = async () => {
    try {
      const response = await fetch(`https://todo-app-backend-updated.onrender.com/timer-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo_id: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch timer data');
      }

      const data = await response.json();
      setTotalTimeSpent(data.total_time_spent); // Update the total time spent
    } catch (error) {
      console.error("Error fetching timer data:", error);
    }
  };

  useEffect(() => {
    fetchTimerData(); // Call the fetch function when the component mounts
  }, []);

  return (
    <>
      <div className="d-flex w-100 flex-column align-items-start mb-3">
        <p className="fw-bolder todo">
          {task.todo} {/* This is where the task name/description is displayed */}
        </p>
        <p>{task.description}</p>
      </div>

      <div className="todo-details align-self-start">
        <p className="end-time">
          <b>Task ended on:</b> {endTime.toLocaleString()} {/* Display end time */}
        </p>
      </div>

      <div className="delete-icon-container" onClick={() => onClickDeleteBtn(task.id)}>
        <MdDeleteOutline size={20} /> {/* Delete icon */}
      </div>
    </>
  );
};

export default CompletedTodos;
