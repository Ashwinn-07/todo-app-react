import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import "./ToDoList.css";

function ToDoList() {
  const [tasks, setTask] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");
  const [statColors] = useState({
    completed: `hsl(${Math.random() * 360}, 70%, 45%)`,
    pending: `hsl(${Math.random() * 360}, 70%, 45%)`,
    percentage: `hsl(${Math.random() * 360}, 70%, 45%)`,
  });

  const tasksPerPage = 5;

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
    setError("");
  }
  function addTask() {
    const taskText = newTask.trim();
    if (taskText === "") {
      setError("Task cannot be empty");
      toast.error("Task cannot be empty");
      return;
    }
    const isDuplicate = tasks.some(
      (task) => task.text.toLowerCase() === taskText.toLowerCase()
    );
    if (isDuplicate) {
      setError("This task already exists");
      toast.error("This task already exists");
      return;
    }
    setTask((t) => [...t, { text: taskText, completed: false }]);
    setNewTask("");
    setError("");
    toast.success("Task added successfully");

    const newTotalPages = Math.ceil((tasks.length + 1) / tasksPerPage);
    setCurrentPage(newTotalPages);
  }

  function deleteTask(index) {
    const taskText = tasks[index].text;
    const updatedTasks = tasks.filter((element, i) => i !== index);
    setTask(updatedTasks);
    toast.success(`"${taskText}" deleted successfully`);

    const newTotalPages = Math.ceil(updatedTasks.length / tasksPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1);
    }
  }
  function toggleComplete(index) {
    const updatedTasks = tasks.map((element, i) =>
      i === index ? { ...element, completed: !element.completed } : element
    );
    const task = tasks[index];
    setTask(updatedTasks);
    toast.success(
      task.completed
        ? `"${task.text}" marked as incomplete`
        : `"${task.text}" completed`
    );
  }

  function startEditing(index, text) {
    setEditingIndex(index);
    setEditValue(text);
  }

  function handleEditChange(event) {
    setEditValue(event.target.value);
    setEditError("");
  }

  function saveEdit(index) {
    const editedText = editValue.trim();

    if (editedText === "") {
      setEditError("Task cannot be empty");
      toast.error("Task cannot be empty");
      return;
    }
    const isDuplicate = tasks.some(
      (task, i) =>
        i !== index && task.text.toLowerCase() === editedText.toLowerCase()
    );

    if (isDuplicate) {
      setEditError("This task already exists");
      toast.error("This task already exists");
      return;
    }
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editedText } : task
    );
    setTask(updatedTasks);
    setEditingIndex(null);
    setEditValue("");
    setEditError("");
    toast.success("Task updated successfully");
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditValue("");
    setEditError("");
  }

  function clearCompletedTasks() {
    const updatedTasks = tasks.filter((task) => !task.completed);
    setTask(updatedTasks);
    toast.success("Removed all completed tasks");
    const newTotalPages = Math.ceil(updatedTasks.length / tasksPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1);
    }
  }
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionPercentage =
    tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }

  const hasCompletedTasks = tasks.some((task) => task.completed);

  return (
    <div className="to-do-list">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#363636",
          },
          success: {
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#f44336",
              color: "#fff",
            },
          },
        }}
      />
      <h1>TODO LIST</h1>
      <div className="stats-container">
        <div
          className="stat-box"
          style={{ backgroundColor: statColors.completed }}
        >
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completedTasks}</span>
        </div>
        <div
          className="stat-box"
          style={{ backgroundColor: statColors.pending }}
        >
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pendingTasks}</span>
        </div>
        <div
          className="stat-box"
          style={{ backgroundColor: statColors.percentage }}
        >
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completionPercentage}%</span>
        </div>
      </div>
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
      {error && <div className="error-message">{error}</div>}
      <ol>
        {currentTasks.map((element, index) => (
          <li key={indexOfFirstTask + index}>
            {editingIndex === indexOfFirstTask + index ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editValue}
                  onChange={handleEditChange}
                  className="edit-input"
                  autoFocus
                />
                <button
                  className="save-button"
                  onClick={() => saveEdit(indexOfFirstTask + index)}
                >
                  Save
                </button>
                <button className="cancel-button" onClick={cancelEdit}>
                  Cancel
                </button>
                {editError && <div className="error-message">{editError}</div>}
              </div>
            ) : (
              <>
                <span
                  className={`text ${element.completed ? "completed" : ""}`}
                >
                  {element.text}
                </span>
                <button
                  className="edit-button"
                  onClick={() =>
                    startEditing(indexOfFirstTask + index, element.text)
                  }
                  disabled={element.completed}
                >
                  Edit
                </button>
                <button
                  className="complete-button"
                  onClick={() => toggleComplete(indexOfFirstTask + index)}
                >
                  {element.completed ? "Undo" : "Complete"}
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(indexOfFirstTask + index)}
                >
                  Delete
                </button>
              </>
            )}
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
