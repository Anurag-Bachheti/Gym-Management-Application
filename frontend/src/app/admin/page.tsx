"use client";

import { useState } from "react";
import { getAllUsers } from "@/lib/api/users";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);

  const [showUsers, setShowUsers] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const fetchUsers = async () => {
  try {
    setLoading(true);
    const data = await getAllUsers();

    setUsers(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};


  const handleViewUsers = () => {
    setShowUsers((prev) => !prev);

    if (!showUsers) {
      fetchUsers();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editingUserId) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUserId
            ? { ...user, ...formData }
            : user
        )
      );
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setFormData({ name: "", email: "", role: "" });
    setEditingUserId(null);
  };

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditingUserId(user.id);
  };

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {/* CREATE / EDIT FORM */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-medium">
          {editingUserId ? "Edit User" : "Create User"}
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          {editingUserId ? "Update User" : "Create User"}
        </button>
      </div>

      {/* VIEW USERS BUTTON */}
      <button
        onClick={handleViewUsers}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        {showUsers ? "Hide Users" : "View All Users"}
      </button>

      {/* USERS LIST */}
      {showUsers && (
        <div className="bg-white rounded-lg shadow divide-y">
          {loading && (
            <p className="p-4 text-sm text-gray-500">
              Loading users...
            </p>
          )}

          {!loading && users.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No users found
            </p>
          )}

          {!loading &&
            Array.isArray(users) &&
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user.email} • {user.role}
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            ))}
        </div>
      )}

    </div>
  );
}
