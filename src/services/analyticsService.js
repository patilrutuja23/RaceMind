import apiClient from "./apiClient";

export const analyticsService = {
  getTireWear: () => apiClient.get("/analytics/tire-wear").then((r) => r.data),
  getPerformanceDrop: () => apiClient.get("/analytics/performance-drop").then((r) => r.data),
  getPitStrategy: () => apiClient.get("/analytics/pit-strategy").then((r) => r.data),
  getRiskScore: () => apiClient.get("/analytics/risk-score").then((r) => r.data),
};
