"use client";

import { useState } from "react";
import { getAllUsers } from "@/lib/api/users";
import api from "../../lib/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);

  const [showUsers, setShowUsers] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [tempPassword, setTempPassword] = useState<string | null>(null);

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

  const handleSubmit = async () => {
    try {
      if (editingUserId) {
        // UPDATE USER (PUT)
        const res = await api.put(`/users/${editingUserId}`, formData);

        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUserId ? res.data : user
          )
        );
      } else {
        // CREATE USER (POST)
        const res = await api.post("/users", formData);

        if (res.data.temporaryPassword) {
          setTempPassword(res.data.temporaryPassword);
        }

        setUsers((prev) => [...prev, res.data.user || res.data]);
      }

      // Reset UI state
      setFormData({ name: "", email: "", role: "" });
      setEditingUserId(null);
      setShowForm(false);

    } catch (error) {
      console.error("User submit failed:", error);
      alert("Something went wrong");
    }
  };


  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditingUserId(user._id);
    setShowForm(true);
  };

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <button
        onClick={() => {
          setShowForm(true);
          setEditingUserId(null);
          setFormData({ name: "", email: "", role: "" });
        }}
      >
        Create User
      </button>

      {/* CREATE / EDIT FORM */}
      {showForm && (
        < div className="bg-white p-6 rounded-lg shadow space-y-4">
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
            <option value="SUPER_ADMIN">Admin</option>
            <option value="GYM_MANAGER">Manager</option>
            <option value="TRAINER">Trainer</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="MEMBER">Member</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded hover:opacity-90"
          >
            {editingUserId ? "Update User" : "Create User"}
          </button>

          {tempPassword && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <p className="font-bold">User Created Successfully!</p>
              <p>Temporary Password: <span className="font-mono bg-white px-2 py-1 rounded border">{tempPassword}</span></p>
              <p className="text-sm mt-2 font-semibold text-red-600 italic">Please share this password with the user. They will need to change it on their first login.</p>
              <button
                onClick={() => setTempPassword(null)}
                className="mt-2 text-xs underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )
      }

      {/* VIEW USERS BUTTON */}
      <button
        onClick={handleViewUsers}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        {showUsers ? "Hide Users" : "View All Users"}
      </button>

      {/* USERS LIST */}
      {
        showUsers && (
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
        )
      }

    </div >
  );
}
