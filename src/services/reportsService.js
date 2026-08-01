import { defaultReportsData } from "../mocks/reports";

const normalizeSeries = (payload, fallback) => {
  if (!payload) return fallback;

  if (Array.isArray(payload)) {
    return {
      labels: payload.map((item) => item.label ?? item.name ?? ""),
      values: payload.map((item) => item.value ?? item.count ?? 0),
    };
  }

  if (payload.series) {
    return {
      labels: payload.labels ?? [],
      series: payload.series,
    };
  }

  return {
    labels: payload.labels ?? [],
    values: payload.values ?? [],
  };
};

const normalizeHotZones = (payload, fallback) => {
  if (!payload) return fallback;

  if (Array.isArray(payload)) {
    return {
      labels: payload.map((item) => item.name ?? item.label ?? ""),
      values: payload.map((item) => item.value ?? item.orders ?? 0),
    };
  }

  return {
    labels: payload.labels ?? [],
    values: payload.values ?? [],
  };
};

export const mapReportsPayload = (payload) => {
  const source = payload?.data ?? payload ?? {};

  return {
    stats: source.stats ?? defaultReportsData.stats,
    ordersTrend: normalizeSeries(
      source.ordersTrend ?? source.orders ?? source.orderTrend,
      defaultReportsData.ordersTrend,
    ),
    subscriptionsTrend: normalizeSeries(
      source.subscriptionsTrend ??
        source.subscriptions ??
        source.subscriptionTrend,
      defaultReportsData.subscriptionsTrend,
    ),
    hotZones: normalizeHotZones(
      source.hotZones ?? source.hotZonesTrend,
      defaultReportsData.hotZones,
    ),
  };
};

export const getReports = async () => {
  return mapReportsPayload(defaultReportsData);
};
