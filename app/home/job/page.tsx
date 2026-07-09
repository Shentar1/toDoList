"use client";

import { useState, useEffect } from "react";
import { getSession } from "../../authContext";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignee?: string;
}

export default function Job() {
  useEffect(() => {
    window.history.replaceState({}, "", "/job");
  });
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design homepage",
      description: "Create mockups and design system for the homepage",
      status: "in-progress",
      priority: "high",
      dueDate: "2024-02-15",
      assignee: "John Doe",
    },
    {
      id: "2",
      title: "Fix login bug",
      description: "Resolve authentication issue on login page",
      status: "pending",
      priority: "high",
      dueDate: "2024-02-10",
      assignee: "Jane Smith",
    },
    {
      id: "3",
      title: "Write API documentation",
      description: "Document all endpoints and parameters",
      status: "pending",
      priority: "medium",
      dueDate: "2024-02-20",
      assignee: "Bob Johnson",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Task Details</h1>

      <div className="grid gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {task.title}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
              >
                {task.status}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{task.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Priority</p>
                <p
                  className={`text-lg font-bold capitalize ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Due Date</p>
                <p className="text-lg text-gray-900">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-semibold text-gray-500">Assignee</p>
                <p className="text-lg text-gray-900">
                  {task.assignee || "Unassigned"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
