import apiClient from "./apiClient";

export const aiService = {
  getStrategy: (payload = {}) =>
    apiClient.post("/ai/strategy", {
      current_lap: 20,
      total_laps: 57,
      position: 3,
      gap_ahead: "+1.842s",
      ...payload,
    }).then((r) => r.data),

  getCoaching: () => apiClient.get("/ai/coaching").then((r) => r.data),

  ask: (question) =>
    apiClient.post("/ai/ask", { question }).then((r) => r.data),
};
