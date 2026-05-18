export const lapData = Array.from({ length: 20 }, (_, i) => ({
  lap: i + 1,
  lap_time: +(88 + Math.random() * 4 - i * 0.05).toFixed(3),
  speed: +(290 + Math.random() * 30).toFixed(1),
  fuel: +(100 - i * 4.5 - Math.random() * 1.5).toFixed(1),
  tire_wear: +(i * 4.8 + Math.random() * 3).toFixed(1),
  brake_temperature: +(380 + Math.random() * 120).toFixed(0),
}));

export const currentTelemetry = {
  lap_time: 89.342,
  tire_wear: 67.4,
  speed: 312,
  fuel: 28.6,
  brake_temperature: 487,
  current_lap: 20,
  total_laps: 57,
  position: 3,
  gap_ahead: "+1.842s",
  driver: "VER",
  team: "Red Bull Racing",
};

export const strategyRecommendation = {
  id: "str-001",
  recommendation: "Pit within next 2 laps due to high tire degradation.",
  confidence: 87,
  risk_level: "medium",
  strategy_type: "Undercut",
  pit_window: "Lap 21–22",
  compound_switch: "Medium → Hard",
  factors: [
    { label: "Tire Wear", value: 67.4, unit: "%", impact: "high" },
    { label: "Brake Temp", value: 487, unit: "°C", impact: "medium" },
    { label: "Fuel Load", value: 28.6, unit: "kg", impact: "low" },
    { label: "Gap Ahead", value: 1.842, unit: "s", impact: "medium" },
  ],
  explanation:
    "Current tire degradation rate exceeds the 65% threshold. Pitting now enables an undercut on P2 (+3.1s gap). Hard compound projected to last 28 laps. Staying out risks a VSC-forced pit with no strategic benefit.",
  scenarios: [
    { label: "Pit Now (Lap 21)", projected_pos: 2, delta: "+0.8s net gain" },
    { label: "Stay Out (Lap 24)", projected_pos: 4, delta: "−2.3s net loss" },
    { label: "Pit Late (Lap 26)", projected_pos: 3, delta: "Neutral" },
  ],
};
