import apiClient from "./apiClient";

export const simulationService = {
  getWhatIf: () => apiClient.get("/simulation/what-if").then((r) => r.data),
};
