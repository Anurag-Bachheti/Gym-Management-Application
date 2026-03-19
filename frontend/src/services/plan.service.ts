import api from "@/lib/api";

export const createPlan = async (data: any) => {
    const res = await api.post("/plans", data);
    return res.data;
};

export const getPlans = async () => {
    const res = await api.get("/plans");
    return res.data;
}