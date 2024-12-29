import React, { useState, useEffect } from "react";
import "./ToDoList.css";

function ToDoList() {
  const [tasks, setTask] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");

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
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((element, i) => i !== index);
    setTask(updatedTasks);
  }
  function toggleComplete(index) {
    const updatedTasks = tasks.map((element, i) =>
      i === index ? { ...element, completed: !element.completed } : element
    );
    setTask(updatedTasks);
  }

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
        {tasks.map((element, index) => (
          <li key={index}>
            <span className={`text ${element.completed ? "completed" : ""}`}>
              {element.text}
            </span>
            <button
              className="complete-button"
              onClick={() => toggleComplete(index)}
            >
              {element.completed ? "undo" : "complete"}
            </button>
            <button className="delete-button" onClick={() => deleteTask(index)}>
              Delete
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;
