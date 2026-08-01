import { getApprovedProviders, getPendingProviders } from "./providersService";

export const getDashboardSummary = async () => {
  const [approvedProviders, pendingProviders] = await Promise.all([
    getApprovedProviders(),
    getPendingProviders(),
  ]);

  const subscribedProviders = approvedProviders.filter(
    (provider) => provider.subscription,
  );

  return {
    stats: [
      {
        title: "مزودون معتمدون",
        value: approvedProviders.length,
      },
      {
        title: "طلبات توثيق معلقة",
        value: pendingProviders.length,
      },
      {
        title: "مزودون مشتركون",
        value: subscribedProviders.length,
      },
    ],
    approvedProviders,
    pendingProviders,
  };
};
