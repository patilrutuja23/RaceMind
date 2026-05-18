/**
 * @typedef {Object} LapRecord
 * @property {number} lap
 * @property {number} lap_time
 * @property {number} speed
 * @property {number} tire_wear
 * @property {number} fuel
 * @property {number} brake_temperature
 */

/**
 * @typedef {Object} TireStatus
 * @property {number} lap
 * @property {number} tire_wear
 * @property {number} wear_rate
 * @property {'nominal'|'warning'|'critical'} status
 */

/**
 * @typedef {Object} SpeedRecord
 * @property {number} lap
 * @property {number} speed
 * @property {number} brake_temperature
 */

/**
 * @typedef {Object} RaceStatus
 * @property {number} current_lap
 * @property {number} total_laps
 * @property {number} avg_lap_time
 * @property {number} best_lap_time
 * @property {number} fuel_remaining
 * @property {number} tire_wear
 * @property {number} brake_temperature
 */

/**
 * @typedef {Object} WhatIfAnalysis
 * @property {string} [if_pit_now]
 * @property {string} [if_stay_out]
 * @property {string} [if_push_harder]
 * @property {string} [best_case]
 * @property {string} [worst_case]
 * @property {string} [most_likely]
 */

/**
 * @typedef {Object} GraniteResponse
 * @property {string} recommendation
 * @property {string} explanation
 * @property {number} confidence_score
 * @property {WhatIfAnalysis} what_if_analysis
 */

/**
 * @typedef {Object} SimulationScenario
 * @property {string} scenario
 * @property {number} lap_time_impact
 * @property {number} tire_impact
 * @property {'low'|'medium'|'high'|'critical'} position_risk
 * @property {string} ai_explanation
 * @property {number} confidence
 */

/**
 * @typedef {Object} SimulationResult
 * @property {number} base_lap
 * @property {number} base_lap_time
 * @property {number} base_tire_wear
 * @property {SimulationScenario[]} scenarios
 */

export {};
