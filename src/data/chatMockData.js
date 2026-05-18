// Each response is an array of structured blocks rendered by ChatBubble
export const mockResponses = {
  "Why are lap times increasing?": [
    { type: "alert", level: "warning", text: "Performance degradation detected — Lap 17–20" },
    { type: "section", label: "Critical Factors" },
    { type: "bullets", items: [
      { text: "Tire wear at", value: "67.4%", unit: "", color: "yellow", suffix: " — above 65% threshold" },
      { text: "Rear grip loss adding", value: "+0.4s", unit: "", color: "red", suffix: " per lap" },
      { text: "Brake temp elevated at", value: "487°C", unit: "", color: "orange", suffix: " in S2" },
    ]},
    { type: "section", label: "Recommendation" },
    { type: "recommendation", text: "Pit within next 2 laps for Hard compound. Undercut window on P2 is open." },
    { type: "section", label: "Confidence" },
    { type: "confidence", value: 89 },
    { type: "section", label: "Predicted Outcome" },
    { type: "whatif", items: [
      { label: "Pit Lap 21", outcome: "P2 projected", delta: "+0.8s net gain", positive: true },
      { label: "Stay out",   outcome: "P4 risk",      delta: "−2.3s net loss", positive: false },
    ]},
  ],
  "Should we pit now?": [
    { type: "alert", level: "critical", text: "Immediate pit stop recommended" },
    { type: "section", label: "Critical Factors" },
    { type: "bullets", items: [
      { text: "Tire degradation", value: "CRITICAL", unit: "", color: "red", suffix: " — 67.4% wear" },
      { text: "Laps to failure", value: "~2", unit: " laps", color: "red", suffix: " remaining" },
      { text: "Undercut gap to P2", value: "+3.1s", unit: "", color: "green", suffix: " — window open" },
    ]},
    { type: "section", label: "Recommendation" },
    { type: "recommendation", text: "Box this lap. Hard compound. Undercut on P2 yields +0.8s net over 10 laps." },
    { type: "section", label: "Confidence" },
    { type: "confidence", value: 94 },
    { type: "section", label: "Predicted Outcome" },
    { type: "whatif", items: [
      { label: "Pit now",    outcome: "P2 after undercut", delta: "+0.8s gain",  positive: true },
      { label: "Lap 24 pit", outcome: "P3 maintained",    delta: "Neutral",      positive: null },
      { label: "Stay out",   outcome: "P5 risk",          delta: "−3.1s loss",   positive: false },
    ]},
  ],
  "Which sector is slowest?": [
    { type: "alert", level: "info", text: "Sector 2 performance bottleneck identified" },
    { type: "section", label: "Sector Analysis" },
    { type: "bullets", items: [
      { text: "S2 delta vs best lap", value: "+0.31s", unit: "", color: "red", suffix: " — worst sector" },
      { text: "S1 delta", value: "+0.08s", unit: "", color: "yellow", suffix: " — marginal" },
      { text: "S3 delta", value: "+0.04s", unit: "", color: "green", suffix: " — nominal" },
    ]},
    { type: "section", label: "Root Cause" },
    { type: "recommendation", text: "Rear instability in S2 high-speed corners from tire degradation. Brake temps at 487°C reducing confidence under braking." },
    { type: "section", label: "Confidence" },
    { type: "confidence", value: 82 },
    { type: "section", label: "Predicted Outcome" },
    { type: "whatif", items: [
      { label: "Fresh tires", outcome: "S2 recovers +0.28s", delta: "Full pace restored", positive: true },
      { label: "Stay out",    outcome: "S2 worsens",         delta: "−0.05s/lap trend",  positive: false },
    ]},
  ],
  "Is tire wear critical?": [
    { type: "alert", level: "critical", text: "TIRE WEAR CRITICAL — Immediate action required" },
    { type: "section", label: "Wear Status" },
    { type: "bullets", items: [
      { text: "Current wear", value: "67.4%", unit: "", color: "red", suffix: " — critical threshold exceeded" },
      { text: "Degradation rate", value: "+4.8%", unit: "/lap", color: "red", suffix: " — accelerating" },
      { text: "Rear-left wear", value: "HIGHEST", unit: "", color: "red", suffix: " — primary concern" },
      { text: "Laps to failure", value: "~2", unit: " laps", color: "red", suffix: " at current rate" },
    ]},
    { type: "section", label: "Recommendation" },
    { type: "recommendation", text: "Pit immediately. Confidence in completing 5+ laps without pace loss is 23%. Tire failure risk is elevated." },
    { type: "section", label: "Confidence" },
    { type: "confidence", value: 96 },
    { type: "section", label: "Predicted Outcome" },
    { type: "whatif", items: [
      { label: "Pit now",   outcome: "Tire risk eliminated", delta: "Race pace restored", positive: true },
      { label: "Stay out",  outcome: "Lap time +1.8s/lap",  delta: "Position loss risk", positive: false },
    ]},
  ],
  default: [
    { type: "section", label: "Telemetry Summary" },
    { type: "bullets", items: [
      { text: "Tire wear", value: "67.4%", unit: "", color: "yellow", suffix: "" },
      { text: "Fuel load", value: "28.6", unit: " kg", color: "orange", suffix: "" },
      { text: "Brake temp", value: "487°C", unit: "", color: "red", suffix: "" },
    ]},
    { type: "section", label: "Recommendation" },
    { type: "recommendation", text: "Car is operating near performance limits. Review pit strategy within next 2 laps." },
    { type: "section", label: "Confidence" },
    { type: "confidence", value: 78 },
  ],
};

export const quickQuestions = [
  "Why are lap times increasing?",
  "Should we pit now?",
  "Which sector is slowest?",
  "Is tire wear critical?",
];
