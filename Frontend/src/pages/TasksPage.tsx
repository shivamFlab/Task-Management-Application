import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../store/slices/tasksSlice";
import { logout } from "../store/slices/authSlice";

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((s) => s.tasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const create = async () => {
    if (!title.trim()) return;
    await dispatch(createTask({ title, description }));
    setTitle("");
    setDescription("");
  };

  const changeStatus = (id: string, next: "Pending" | "Partially Completed" | "Completed" | "Working...") => {
    dispatch(updateTask({ id, update: { status: next } }));
  };
  
  // @ts-ignore
  const startEdit = (t) => {
    setEditingId(t._id);
    setEditTitle(t.title || "");
    setEditDescription(t.description || "");
  };

  const saveEdit = async (id: string) => {
    await dispatch(updateTask({ id, update: { title: editTitle, description: editDescription } }));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="container">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="muted mt-1">Capture, track, and complete your work efficiently</p>
        </div>
        <button className="btn w-full sm:w-auto" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>
      <div className="card mb-6">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input"
            placeholder="Short description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="sm:col-span-2">
            <button className="btn" onClick={create}>
              Add Task
            </button>
          </div>
        </div>
      </div>

      {status === "loading" && (
        <div className="card flex items-center gap-3">
          <span className="spinner" />
          <span>Loading tasks…</span>
        </div>
      )}
      {status !== "loading" && items.length === 0 && (
        <div className="card text-center py-10">
          <p className="muted">No tasks yet. Add your first task above!</p>
        </div>
      )}
      <div className="grid gap-3">
        {items.map((t) => (
          <div key={t._id} className="card flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                {editingId === t._id ? (
                  <div className="grid gap-2">
                    <input
                      className="input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                    />
                    <input
                      className="input"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description (optional)"
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-lg truncate">{t.title}</div>
                      <span className={`badge ${t.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : ''}`}>
                        {t.status}
                      </span>
                    </div>
                    {t.description && (
                      <div className="text-sm opacity-80 mt-1 break-words">{t.description}</div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <select
                  className="input w-full sm:w-56"
                  value={t.status}
                  onChange={(e) =>
                    changeStatus(
                      t._id,
                      e.target.value as "Pending" | "Partially Completed" | "Completed" | "Working..."
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Working...">Working…</option>
                  <option value="Partially Completed">Partially Completed</option>
                  <option value="Completed">Completed</option>
                </select>
                {editingId === t._id ? (
                  <div className="flex gap-2">
                    <button className="btn" onClick={() => saveEdit(t._id)}>Save</button>
                    <button className="btn-ghost" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn" onClick={() => startEdit(t)}>Edit</button>
                )}
                <button
                  className="btn bg-red-600 hover:bg-red-700"
                  onClick={() => dispatch(deleteTask(t._id))}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
