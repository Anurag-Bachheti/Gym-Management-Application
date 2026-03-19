"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import PasswordInput from "../components/PasswordInput";
import { getPlans } from "@/services/plan.service";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    plan: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plans, setPlans] = useState<any[]>([]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword, plan } = form;

    if (!name || !email || !password || !confirmPassword || !plan) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        plan,
      });

      console.log("SIGNUP SUCCESS:", res.data);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }
  
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
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border rounded-lg p-6 space-y-4 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-center">Join the Gym 💪</h1>
        <p className="text-sm text-gray-500 text-center">
          Create your membership account
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="john@email.com"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Create Password
          </label>
          <PasswordInput
            value={form.password}
            onChange={(val) => setForm({ ...form, password: val })}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <PasswordInput
            value={form.confirmPassword}
            onChange={(val) =>
              setForm({ ...form, confirmPassword: val })
            }
          />
        </div>

        {/* Plan */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Membership Plan
          </label>
          <select
            name="plan"
            value={form.plan}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select a plan</option>
            {plans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name || `${plan.duration} Months`} – ₹{plan.price}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Membership"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already a member?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-black font-medium cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}