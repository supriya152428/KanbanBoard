import { describe, it, expect } from "vitest";
  import {
  addTaskLogic,
  deleteTaskLogic,
  moveTaskLogic,
} from "../../utils/kanbanLogic.js";

describe("Kanban Logic Tests", () => {

  it("should add a task", () => {
    const tasks = [];
    const newTask = { id: 1, title: "Test Task" };

    const result = addTaskLogic(tasks, newTask);

    expect(result.length).toBe(1);
  });

  it("should delete a task", () => {
    const tasks = [{ id: 1, title: "Test Task" }];

    const result = deleteTaskLogic(tasks, 1);

    expect(result.length).toBe(0);
  });

  it("should move a task", () => {
    const tasks = [{ id: 1, column: "To Do" }];

    const result = moveTaskLogic(tasks, 1, "Done");

    expect(result[0].column).toBe("Done");
  });

});
