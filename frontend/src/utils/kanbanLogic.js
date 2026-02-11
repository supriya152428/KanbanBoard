export function addTaskLogic(tasks, newTask) {
  return [...tasks, newTask];
}

export function deleteTaskLogic(tasks, id) {
  return tasks.filter(task => task.id !== id);
}

export function moveTaskLogic(tasks, id, newColumn) {
  return tasks.map(task =>
    task.id === id ? { ...task, column: newColumn } : task
  );
}
