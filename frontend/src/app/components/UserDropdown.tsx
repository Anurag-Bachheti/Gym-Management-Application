"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type UserInfo = {
  name: string;
  email: string;
  role: string;
};

function formatRole(role: string) {
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UserDropdown() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        // silently fail – token may be invalid
      }
    }
    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Avatar Button */}
      <button
        id="user-dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        title={user.name}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          // background: "none",
          border: "1.5px solid #e2e8f0",
          borderRadius: "9999px",
          padding: "6px 14px 6px 6px",
          cursor: "pointer",
          transition: "box-shadow 0.2s ease, background 0.2s ease",
          boxShadow: open ? "0 0 0 3px rgba(99,102,241,0.25)" : "0 1px 4px rgba(0,0,0,0.08)",
          background: open ? "#f5f3ff" : "#ffffff",
        }}
      >
        {/* Avatar circle */}
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "0.04em",
            flexShrink: 0,
          }}
        >
          {getInitials(user.name)}
        </span>

        {/* Name + role */}
        <span style={{ textAlign: "left", lineHeight: 1.2 }}>
          <span
            style={{
              display: "block",
              fontWeight: 600,
              fontSize: 14,
              color: "#1e293b",
              maxWidth: 120,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.name}
          </span>
          <span
            style={{
              display: "block",
              fontSize: 11,
              color: "#6366f1",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {formatRole(user.role)}
          </span>
        </span>

        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          id="user-dropdown-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            minWidth: 220,
            background: "#ffffff",
            borderRadius: 14,
            boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid #f1f5f9",
            overflow: "hidden",
            zIndex: 9999,
            animation: "dropdownFadeIn 0.18s ease",
          }}
        >
          {/* User info header */}
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(135deg, #f5f3ff, #eef2ff)",
              borderBottom: "1px solid #e0e7ff",
            }}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 15,
                color: "#1e293b",
              }}
            >
              {user.name}
            </p>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 12,
                color: "#64748b",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: 6,
                background: "#6366f1",
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 999,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              {formatRole(user.role)}
            </span>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px 0" }}>
            <button
              id="dropdown-profile-btn"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: "#374151",
                textAlign: "left",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f8fafc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "none")
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Profile
            </button>

            <div
              style={{
                height: 1,
                background: "#f1f5f9",
                margin: "4px 10px",
              }}
            />

            <button
              id="dropdown-logout-btn"
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                color: "#ef4444",
                textAlign: "left",
                fontWeight: 500,
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fff5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "none")
              }
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Keyframe animation */}
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
