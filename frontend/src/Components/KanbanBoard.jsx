import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4001", { autoConnect: false }); // Don't crash if backend is missing

const columns = ["To Do", "In Progress", "Done"];

// ✅ Logic functions
const addTaskLogic = (tasks, newTask) => [...tasks, newTask];
const deleteTaskLogic = (tasks, id) => tasks.filter((t) => t.id !== id);
const moveTaskLogic = (tasks, id, newColumn) =>
  tasks.map((t) => (t.id === id ? { ...t, column: newColumn } : t));

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(() => {
    // Load from localStorage if backend/socket isn't available
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("Feature");
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    try {
      socket.connect(); // Try connecting
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        setSocketConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocketConnected(false);
      });

      socket.on("sync:tasks", (allTasks) => setTasks(allTasks));
      socket.on("task:create", (task) =>
        setTasks((prev) => addTaskLogic(prev, task))
      );
      socket.on("task:delete", (id) =>
        setTasks((prev) => deleteTaskLogic(prev, id))
      );
      socket.on("task:move", ({ id, newColumn }) =>
        setTasks((prev) => moveTaskLogic(prev, id, newColumn))
      );

      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("sync:tasks");
        socket.off("task:create");
        socket.off("task:delete");
        socket.off("task:move");
      };
    } catch (err) {
      console.log("Socket failed, using local state only:", err);
    }
  }, []);

  // Save to localStorage always
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title) return;

    const task = {
      id: Date.now(),
      title,
      column: "To Do",
      priority,
      category,
    };

    if (socketConnected) {
      socket.emit("task:create", task);
    } else {
      setTasks((prev) => addTaskLogic(prev, task)); // Fallback
    }

    setTitle("");
    setPriority("Low");
    setCategory("Feature");
  };

  const deleteTask = (id) => {
    if (socketConnected) {
      socket.emit("task:delete", id);
    } else {
      setTasks((prev) => deleteTaskLogic(prev, id)); // Fallback
    }
  };

  const moveTask = (id, newColumn) => {
    if (socketConnected) {
      socket.emit("task:move", { id, newColumn });
    } else {
      setTasks((prev) => moveTaskLogic(prev, id, newColumn)); // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Kanban Board</h1>

      {/* ADD TASK */}
      <div className="bg-gray-800 p-4 rounded-xl flex gap-3 mb-8 flex-wrap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="bg-gray-700 px-3 py-2 rounded outline-none"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-gray-700 px-3 py-2 rounded"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-700 px-3 py-2 rounded"
        >
          <option>Feature</option>
          <option>Bug</option>
          <option>Enhancement</option>
        </select>

        <button
          onClick={addTask}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      {/* COLUMNS */}
      <div className="flex gap-6 overflow-x-auto">
        {columns.map((col) => (
          <div
            key={col}
            className="w-72 bg-gray-800 rounded-xl p-4 flex-shrink-0"
          >
            <h2 className="text-xl font-semibold mb-4">{col}</h2>

            <div className="space-y-3">
              {tasks
                .filter((task) => task.column === col)
                .map((task) => (
                  <div key={task.id} className="bg-gray-700 p-3 rounded-lg">
                    <h3 className="font-semibold">{task.title}</h3>

                    <p className="text-sm text-gray-300">
                      {task.priority} • {task.category}
                    </p>

                    <select
                      value={task.column}
                      onChange={(e) => moveTask(task.id, e.target.value)}
                      className="w-full bg-gray-600 mt-2 rounded px-2 py-1"
                    >
                      {columns.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="w-full mt-2 bg-red-500 rounded py-1 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
