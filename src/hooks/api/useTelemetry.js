import { useApi } from "./useApi";
import { telemetryService } from "../../services/telemetryService";
import { analyticsService } from "../../services/analyticsService";
import { aiService } from "../../services/aiService";
import { simulationService } from "../../services/simulationService";

export const useLaps = () => useApi(telemetryService.getLaps);
export const useTires = () => useApi(telemetryService.getTires);
export const useSpeed = () => useApi(telemetryService.getSpeed);
export const useRaceStatus = () => useApi(telemetryService.getStatus);

export const useTireAnalysis = () => useApi(analyticsService.getTireWear);
export const usePerformanceDrop = () => useApi(analyticsService.getPerformanceDrop);
export const usePitStrategy = () => useApi(analyticsService.getPitStrategy);
export const useRiskScore = () => useApi(analyticsService.getRiskScore);

export const useAIStrategy = () => useApi(aiService.getStrategy);
export const useAICoaching = () => useApi(aiService.getCoaching);
export const useAIAsk = () => useApi(aiService.ask);

export const useSimulation = () => useApi(simulationService.getWhatIf);
