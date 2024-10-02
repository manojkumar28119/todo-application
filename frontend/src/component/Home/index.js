import React, { useState, useEffect } from 'react';
import Navbar from "../Navbar";
import TodoItem from "../TodoItem";
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import { FaTrash } from 'react-icons/fa'; // Importing a trash icon from react-icons
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';

const Api = "https://todo-app-backend-updated.onrender.com";

// API status constants for better readability
const apiConstrains = { 
  onSuccess: "SUCCESS",
  onFailure: "FAILURE",
  onLoading: "LOADING",
  noData: "NODATA"
};

const ItemTypes = {
  TASK: 'task',
};

const Home = () => {
  const [todos, setTodos] = useState([]); // State for storing todos
  const [todoText, setTodoText] = useState(''); // State for new todo text input
  const [description, setdescription] = useState(''); 
  const [apiStatus, setApiStatus] = useState(apiConstrains.onLoading); // State for API status

  const fetchTodos = async () => {
    const userId = Cookies.get('user_id');
    try {
      const response = await fetch(`${Api}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
        data.length === 0 ? setApiStatus(apiConstrains.noData) : setApiStatus(apiConstrains.onSuccess);
      } else {
        console.error('Failed to fetch todos');
        setApiStatus(apiConstrains.onFailure);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setApiStatus(apiConstrains.onFailure);
    }
  };

  useEffect(() => {
    setApiStatus(apiConstrains.onLoading);
    fetchTodos();
  }, []);

  const onChangeStatus = async (id, status) => {
    try {
      const response = await fetch(`${Api}/change-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "todo_id": id,
          status: status
        }),
      });

      if (response.ok) {
        console.log("Status updated");
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const onChangeDescription = (event) => {
    setdescription(event.target.value)
  }

  const onChangeTodo = (event) => {
    setTodoText(event.target.value);
  };

  const onClickAddBtn = async (event) => {
    event.preventDefault(); 
    if (todoText.trim() !== '') {
      const userId = Cookies.get('user_id');
      const newTodo = {
        user_id: userId,
        todo: todoText,
        status: "To Do",
        description,
      };

      try {
        const response = await fetch(`${Api}/add-todo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTodo),
        });

        if (response.ok) {
          setTodoText('');
          setdescription('')
          fetchTodos();
          toast.success('Todo added successfully!');
        } else {
          console.error('Failed to add todo');
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const onClickDeleteBtn = async (id) => {
    const new_todos = todos.filter((todo) => todo.id !== id);
    setTodos(new_todos);
    new_todos.length === 0 && setApiStatus(apiConstrains.noData);

    try {
      const response = await fetch(`${Api}/delete-todo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "todo_id": id
        })
      });

      if (response.ok) {
        toast.success('Todo deleted successfully!', {
          icon: <FaTrash color="red" />,
        });
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const moveTask = (fromIndex, targetStatus) => {
    const updatedTasks = [...todos];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    movedTask.status = targetStatus;
    updatedTasks.push(movedTask);
    setTodos(updatedTasks); 
    onChangeStatus(movedTask.id, targetStatus);
  };

  const Column = ({ status, tasks, moveTask }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.TASK,
      drop(item) {
        moveTask(item.index, status);
      },
    });

    return (
      <div ref={drop} className="col-md-5 col-lg-4 column mb-3">
        <h2 className='text-center column-head'>{status}</h2>
        {tasks.map((todo, index) => (
          <TodoItem 
            key={todo.id} 
            task={todo} 
            onClickDeleteBtn={onClickDeleteBtn} 
            index={index}
          />
        ))}
      </div>
    );
  };

  const renderTodos = () => {
    const taskColumns = {
      'To Do': todos.filter(task => task.status === 'To Do'),
      'In Progress': todos.filter(task => task.status === 'In Progress'),
      'Done': todos.filter(task => task.status === 'Done'),
    };

    switch (apiStatus) {
      case apiConstrains.onSuccess:
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="board row d-flex justify-content-around px-2">
              {Object.keys(taskColumns).map((status) => (
                <Column 
                  key={status}
                  status={status}
                  tasks={taskColumns[status]} 
                  moveTask={moveTask} 
                />
              ))}
            </div>
          </DndProvider>
        );
      case apiConstrains.onLoading:
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        );
      case apiConstrains.noData:
        return (
          <div className='no-data-card'>
            <img src='https://todoist.b-cdn.net/assets/images/f6fa2d79a28b6cf1c08d55511fee0c5b.png' alt='img' />
            <b>Your peace of mind is priceless</b>
            <p>Well done! All your tasks are organized in the right place.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='home '>
      <Navbar />
      <div className="todos-bg-container container">
        <div className="main-card">
          <form onSubmit={onClickAddBtn} className='d-flex flex-column align-items-center'>
            <input
              type="text"
              value={todoText}
              id="todoUserInput"
              className="todo-user-input"
              placeholder="What needs to be done?"
              onChange={onChangeTodo}
            />
            <input
              type="text"
              value={description}
              id="todoUserInput"
              className="todo-user-input"
              placeholder="description"
              onChange={onChangeDescription}
            />
            
            <button className="button" type="submit">
              Add
            </button>
          </form>
          {renderTodos()} {/* Render todos based on API status */}
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default Home;
