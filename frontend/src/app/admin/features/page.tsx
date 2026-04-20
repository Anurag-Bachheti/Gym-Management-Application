"use client";

import { useState, useEffect } from "react";
import { getAllUsers } from "@/lib/api/users";
import api from "../../../lib/api";
import DashboardLayout from "../../components/DashboardLayout";
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

export default function AdminFeatures() {
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
  const [showAssignTrainer, setShowAssignTrainer] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState("");

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
      setShowAssignTrainer(false);
      setSelectedTrainerId("");
      setShowForm(false);
    } catch (error) {
      console.error("User submit failed:", error);
      alert("Something went wrong");
    }
  };

  const handleEdit = async (user: User) => {
    // Reset trainer state
    setShowAssignTrainer(false);
    setSelectedTrainerId("");

    // Fetch all users (including trainers) when editing
    if (users.length === 0) {
      try {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    // Ensure plans are loaded
    if (plans.length === 0) {
      try {
        const res = await getPlans();
        if (res.success) {
          setPlans(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    }
    
    // If user is a MEMBER, fetch member data to get plan details
    let planId = "";
    if (user.role === "MEMBER") {
      try {
        const memberRes = await api.get(`/members?userId=${user._id}`);
        const member = memberRes.data[0];
        if (member && member.plan) {
          // Extract plan ID from populated plan object or use direct ID
          planId = member.plan?._id || member.plan || "";
        }
      } catch (error) {
        console.error("Failed to fetch member data:", error);
      }
    }
     planId = String(planId);
    setFormData({ name: user.name, email: user.email, role: user.role, plan: planId });
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
    <DashboardLayout title="Admin Features">
      <div className="p-6 space-y-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Admin Management Console</h1>

        <div className="flex gap-4">
          <button
            onClick={async () => {
              // Fetch users if not already loaded
              if (users.length === 0) {
                try {
                  const data = await getAllUsers();
                  setUsers(Array.isArray(data) ? data : []);
                } catch (error) {
                  console.error("Failed to fetch users:", error);
                }
              }
              setShowForm(true);
              setEditingUserId(null);
              setFormData({ name: "", email: "", role: "", plan: "" });
            }}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all"
          >
            + Create New User
          </button>

          <button
            onClick={handleViewUsers}
            className="border-2 border-black px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            {showUsers ? "Hide User List" : "View All Users"}
          </button>
        </div>

        <div>
          {showForm && (
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 relative max-w-2xl">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingUserId(null);
                  setShowAssignTrainer(false);
                  setSelectedTrainerId("");
                  setFormData({ name: "", email: "", role: "", plan: "" });
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full flex items-center justify-center transition-colors font-bold"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800" >
                {editingUserId ? "Edit User Account" : "Register New User"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                  <input
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="">Select role</option>
                      <option value="SUPER_ADMIN">Admin</option>
                      <option value="GYM_MANAGER">Manager</option>
                      <option value="TRAINER">Trainer</option>
                      <option value="RECEPTIONIST">Receptionist</option>
                      <option value="MEMBER">Member</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Plan (Members Only)</label>
                    <select
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
                      disabled={formData.role !== "MEMBER"}
                      className={`w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all ${formData.role !== "MEMBER" ? "bg-gray-50 cursor-not-allowed opacity-50" : ""}`}
                    >
                      <option value="">Membership Plan</option>
                      {plans.map((plan) => (
                        <option key={plan._id} value={plan._id}>
                          {plan.name || `${plan.durationInMonths} Month`} – ₹{plan.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Assign Trainer */}
                {formData.role === "MEMBER" && (
                  <div className="mt-4">

                    {/* Radio Button */}
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="assign-trainer"
                        name="trainer-option"
                        checked={showAssignTrainer}
                        onChange={() => setShowAssignTrainer(true)}
                        className="cursor-pointer"
                      />
                      <label htmlFor="assign-trainer" className="cursor-pointer font-medium">
                        Assign Trainer
                      </label>
                    </div>

                    {/* Dropdown (only when radio selected) */}
                    {showAssignTrainer && (
                      <div className="mt-3">
                        {users.filter((u) => u.role === "TRAINER").length === 0 ? (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                            ⚠️ No trainers available in the system
                          </div>
                        ) : (
                          <select
                            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                            value={selectedTrainerId}
                            onChange={(e) => setSelectedTrainerId(e.target.value)}
                          >
                            <option value="">Select Trainer</option>

                            {users
                              .filter((u) => u.role === "TRAINER")
                              .map((trainer) => (
                                <option key={trainer._id} value={trainer._id}>
                                  {trainer.name}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-md transition-all mt-4"
                >
                  {editingUserId ? "Update Profile" : "Create Account"}
                </button>
              </div>

              {tempPassword && (
                <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 text-green-800 rounded-2xl animate-bounce">
                  <p className="font-extrabold text-xl mb-2">🎉 Success!</p>
                  <p className="mb-2">The account has been created.</p>
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-green-200">
                    <p className="text-sm font-bold text-gray-500 uppercase">Temporary Password:</p>
                    <span className="font-mono text-2xl font-black text-green-700">
                      {tempPassword}
                    </span>
                  </div>
                  <p className="text-xs mt-4 text-gray-500 italic font-medium">Important: User must change this password after login.</p>
                  <button
                    onClick={() => setTempPassword(null)}
                    className="mt-4 px-4 py-2 bg-green-200 rounded-lg text-xs font-bold hover:bg-green-300"
                  >
                    Dismiss Note
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Plan Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Membership Plans
            </h1>
            <div className="flex gap-4">
              <button onClick={() => setShowPlans(prev => !prev)} className="text-sm font-bold text-blue-600 hover:underline">
                {showPlans ? "Hide Existing" : "Load Existing Plans"}
              </button>
              <button
                onClick={() => {
                  setSelectedPlan(null);
                  setShowModal(true);
                }}
                className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md"
              >
                + New Plan
              </button>
            </div>
          </div>

          <div>
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
            <div className="pt-4">
              <PlanList refresh={refresh} onEdit={handleEditPlan} />
            </div>
          )}
        </div>

        {showUsers && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 divide-y overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-bold text-gray-700 uppercase tracking-widest text-xs">Registered Members & Staff</h2>
            </div>
            {loading && (
              <div className="p-10 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            {!loading && users.length === 0 && (
              <p className="p-8 text-center text-gray-500 italic">No users found in database</p>
            )}
            {!loading &&
              Array.isArray(users) &&
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                      <p className="text-sm text-gray-500">
                        {user.email} • <span className="font-bold text-blue-600">{user.role.replace(/_/g, ' ')}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm"
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
