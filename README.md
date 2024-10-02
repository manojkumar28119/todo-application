# Full-Stack Todo Application

## Objective

Create a full-stack Todo application with time tracking and a status board. This application will demonstrate your ability to build a functional, interactive application using modern web technologies for both frontend and backend development.

## Requirements

### Frontend

1. **Task Management**
    - Users can add, edit, and delete tasks.
    - Each task includes a title and optional description.

2. **Time Tracking**
    - Implement a timer for each task.
    - Users can start, pause, and reset the timer for each task.
    - Display the total time spent on each task.

3. **Status Board**
    - Create a board with three columns: "To Do," "In Progress," and "Done."
    - Users can drag and drop tasks between columns to update their status.

4. **User Interface**
    - Design a clean, intuitive user interface.
    - Ensure responsiveness for desktop and mobile devices.

### Backend

1. **API Development**
    - Create a RESTful API using Express.js for CRUD operations on tasks.
    - Implement endpoints for managing task timers.
    - Create an endpoint for updating task status.

2. **Database**
    - Use SQLite to store task data, including title, description, status, and time tracking information.

3. **Data Persistence**
    - Implement proper data models and schemas for SQLite.
    - Ensure task updates are persisted in the database.

4. **Authentication (Optional)**
    - Implement user authentication using JWT or similar methods.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript (React)
- **Backend:** Node.js, Express.js, SQLite
- **Authentication:** JWT (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/todo-application.git
   cd todo-application
