export async function getAllUsers() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const response = await res.json();
  return response;
}
