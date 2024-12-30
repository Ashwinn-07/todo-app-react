import React, { useState, useEffect } from "react";
import "./ToDoList.css";

function ToDoList() {
  const [tasks, setTask] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 5;

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }
  function addTask() {
    if (newTask.trim() !== "") {
      setTask((t) => [...t, { text: newTask, completed: false }]);
      setNewTask("");
    }

    const newTotalPages = Math.ceil((tasks.length + 1) / tasksPerPage);
    setCurrentPage(newTotalPages);
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((element, i) => i !== index);
    setTask(updatedTasks);

    const newTotalPages = Math.ceil(updatedTasks.length / tasksPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1);
    }
  }
  function toggleComplete(index) {
    const updatedTasks = tasks.map((element, i) =>
      i === index ? { ...element, completed: !element.completed } : element
    );
    setTask(updatedTasks);
  }

  function clearCompletedTasks() {
    const updatedTasks = tasks.filter((task) => !task.completed);
    setTask(updatedTasks);
    const newTotalPages = Math.ceil(updatedTasks.length / tasksPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1);
    }
  }
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  const hasCompletedTasks = tasks.some((task) => task.completed);

  return (
    <div className="to-do-list">
      <h1>TODO LIST</h1>
      <div>
        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      <ol>
        {currentTasks.map((element, index) => (
          <li key={indexOfFirstTask + index}>
            <span className={`text ${element.completed ? "completed" : ""}`}>
              {element.text}
            </span>
            <button
              className="complete-button"
              onClick={() => toggleComplete(indexOfFirstTask + index)}
            >
              {element.completed ? "undo" : "complete"}
            </button>
            <button
              className="delete-button"
              onClick={() => deleteTask(indexOfFirstTask + index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ol>
      {tasks.length > 0 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
      {hasCompletedTasks && (
        <button
          className="clear-completed-button"
          onClick={clearCompletedTasks}
        >
          Clear Completed Tasks
        </button>
      )}
    </div>
  );
}

export default ToDoList;
