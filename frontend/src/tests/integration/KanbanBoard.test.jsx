import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import KanbanBoard from "../../Components/KanbanBoard";


vi.mock("socket.io-client", () => {
  return {
    io: () => ({
      on: vi.fn(),
      emit: vi.fn(),
      off: vi.fn(),
    }),
  };
});

describe("KanbanBoard Integration Tests", () => {

  it("renders board title", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
  });

  it("allows user to type in input", () => {
    render(<KanbanBoard />);

    const input = screen.getByPlaceholderText("Task title");

    fireEvent.change(input, {
      target: { value: "New Task" },
    });

    expect(input.value).toBe("New Task");
  });

  it("renders all three columns", () => {
    render(<KanbanBoard />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

});