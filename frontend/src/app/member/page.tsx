"use client";

import { useState, useEffect } from "react";
import api from '@/lib/api';

type Member = {
  name: string;
  email: string;
}

export default function MemberDashboard() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile(){
      try{
        const res = await api.get("/auth/me");
        setMember(res.data.user);
      }catch(err){
        console.error("Failed to load member profile");
      }finally{
        setLoading(false);
      }
    }
    fetchProfile();
  }, [])

   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

   if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load member data
      </div>
    );
  }
return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
        <h1 className="text-3xl font-bold">
          Welcome, <span className="text-blue-600">{member.name}</span>
        </h1>

        <div className="border-t pt-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium">{member.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-medium">Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}
