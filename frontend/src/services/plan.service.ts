import api from "@/lib/api";

export const createPlan = async (data: any) => {
    const res = await api.post("/plans", data);
    return res.data;
};

export const getPlans = async () => {
    const res = await api.get("/plans");
    return res.data;
}

export const updatePlan = async (id: string, data: any) => {
    const res = await api.put(`/plans/${id}`, data);
    return res.data;
}

export const deletePlan = async (id: string) => {
    const res = await api.delete(`/plans/${id}`);
    return res.data;
}