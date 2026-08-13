import { api } from "./api";
import { endpoints } from "./endpoints";

export const getSubscriptionPlans = async (filters = {}) => {
  const response = await api.get(endpoints.subscriptionPlans, {
    params: filters,
  });

  return response.data.data.data;
};


export const getSubscriptionPlanDetails = async (id) => {
  const response = await api.get(`/api/admin/subscription-plans/${id}`);
  return response.data.data;
};



export const createSubscriptionPlan = async (payload) => {
  const response = await api.post("/api/admin/subscription-plans", payload);
  return response.data.data;
};



export const updateSubscriptionPlan = async (id, payload) => {
  const response = await api.patch(`/api/admin/subscription-plans/${id}`, payload);

  return response.data.data;
};


export const deleteSubscriptionPlan = async (id) => {
  const response = await api.delete(`/api/admin/subscription-plans/${id}`);
  return response.data;
};


export const getProviderSubscriptions = async (filters = {}) => {
  const response = await api.get("/api/admin/provider-subscriptions", {
    params: filters,
  });

  return response.data.data;
};



export const getProviderSubscriptionDetails = async (id) => {
  const response = await api.get(`/api/admin/provider-subscriptions/${id}`);
  return response.data.data;
};


export const activateProviderSubscription = async (id) => {
  const response = await api.patch(`/api/admin/provider-subscriptions/activate/${id}`);
  return response.data.data;
};


export const getPlatformRevenueStats = async () => {
  const response = await api.get("/api/admin/stats/subscriptions-revenue");
  return response.data.data;
};

