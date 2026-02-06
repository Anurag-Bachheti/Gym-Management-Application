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
    <div>
      <div>
        <h1>
          Welcome, <span>{member.name}</span>
        </h1>
      </div>

      <div>
        <p className="text-sm text-gray-500">Email</p>
        <p className="text-lg font-medium">{member.email}</p>
      </div>

      <div>
        <p className="text-sm text-gray-500">Role</p>
        <p className="text-lg font-medium">Member</p>
      </div>
    </div>
  )
}