import apiClient from "./apiClient";

export const telemetryService = {
  getLaps: () => apiClient.get("/telemetry/laps").then((r) => r.data),
  getTires: () => apiClient.get("/telemetry/tires").then((r) => r.data),
  getSpeed: () => apiClient.get("/telemetry/speed").then((r) => r.data),
  getStatus: () => apiClient.get("/telemetry/status").then((r) => r.data),
};
