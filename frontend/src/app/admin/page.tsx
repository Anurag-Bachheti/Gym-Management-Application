"use client";

import { useState, useEffect } from "react";
import { getAllUsers } from "@/lib/api/users";
import api from "../../lib/api";
import DashboardLayout from "../components/DashboardLayout";
import { CreatePlanModal } from "@/app/components/plans/CreatePlanModal";
import { PlanList } from "@/app/components/plans/PlanList";
import { getPlans } from "@/services/plan.service";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  plan?: string;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);

  const [showUsers, setShowUsers] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [showPlans, setShowPlans] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    plan: "",
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
          prev.map((user) => (user._id === editingUserId ? res.data : user))
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
      setFormData({ name: "", email: "", role: "", plan: "" });
      setEditingUserId(null);
      setShowForm(false);
    } catch (error) {
      console.error("User submit failed:", error);
      alert("Something went wrong");
    }
  };

  const handleEdit = (user: User) => {
    setFormData({ name: user.name, email: user.email, role: user.role, plan: user.plan || "" });
    setEditingUserId(user._id);
    setShowForm(true);

  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getPlans();
        if (res.success) {
          setPlans(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch plans", err);
      }
    };

    fetchPlans();
  }, [refresh]);

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="p-6 space-y-8 max-w-3xl">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <button
          onClick={() => {
            setShowForm(true);
            setEditingUserId(null);
            setFormData({ name: "", email: "", role: "", plan: "" });
          }}
          style={{ backgroundColor: 'black', color: 'white', marginTop: '14px', padding: '8px' }}
        >
          Create User
        </button>

        <div>
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="text-lg font-medium" >
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

              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                disabled={formData.role !== "MEMBER"}
                className={`w-full border rounded px-3 py-2 ${formData.role !== "MEMBER" ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">Membership Plan</option>

                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name || `${plan.durationInMonths} Month${plan.durationInMonths > 1 ? "s" : ""}`} – ₹{plan.price}
                  </option>
                ))}
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
                  <p>
                    Temporary Password:{" "}
                    <span className="font-mono bg-white px-2 py-1 rounded border">
                      {tempPassword}
                    </span>
                  </p>
                  <p className="text-sm mt-2 font-semibold text-red-600 italic">
                    Please share this password with the user. They will need to
                    change it on their first login.
                  </p>
                  <button
                    onClick={() => setTempPassword(null)}
                    className="mt-2 text-xs underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plan Section */}
        <div className="bg-white pt-6 rounded-lg shadow space-y-4">
          <h1 className="text-lg font-medium" style={{paddingLeft:'10px'}}>
            Membership Plans
          </h1>

          <button
            onClick={() => {
              setSelectedPlan(null);
              setShowModal(true);
            }}
            className="bg-black text-white px-4 py-2 rounded"
            style={{marginLeft:'10px'}}
          >
            Create Plan
          </button>

          <div>
            <div>
              <button onClick={() => setShowPlans(prev => !prev)} style={{paddingTop:'10px', paddingBottom: '15px', paddingLeft: '10px'}}>
                {showPlans ? "Hide Plans" : "Show Plans"}
              </button>
            </div>

            {showModal && selectedPlan !== "SHOW_ALL" && (
              <CreatePlanModal
                planData={selectedPlan}
                onClose={() => {
                  setShowModal(false);
                  setSelectedPlan(null);
                }}
                onSuccess={() => setRefresh(!refresh)}
              />
            )}
          </div>
          {showPlans && (
            <PlanList refresh={refresh} onEdit={handleEditPlan} />
          )}
        </div>

        <button
          onClick={handleViewUsers}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          {showUsers ? "Hide Users" : "View All Users"}
        </button>

        {showUsers && (
          <div className="bg-white rounded-lg shadow divide-y">
            {loading && (
              <p className="p-4 text-sm text-gray-500">Loading users...</p>
            )}
            {!loading && users.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No users found</p>
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
    </DashboardLayout>
  );
}
