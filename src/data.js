export const MISSION_DATE = '2026-11-14';
export const INITIAL_STATE = {
  checkIns: [],
  completed: ['mobility'],
  manual: {},
  readings: [],
  radiationLogs: [],
  devices: { watch: true, ecg: false, oximeter: false, dosimeter: true, cabin: true },
  shareScopes: [],
  shareNotes: false,
  queue: [],
  linkAvailable: false,
  radiationWatch: false,
  acknowledgedAlerts: [],
  reminder: null,
};

export const MOODS = ['Very low', 'Low', 'Okay', 'Good', 'Great'];
export const MOOD_SCORES = [34, 50, 68, 84, 96];
export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'insights', label: 'Health insights', icon: 'activity' },
  { id: 'checkin', label: 'Daily check-in', icon: 'smile' },
  { id: 'exercise', label: 'Exercise plan', icon: 'dumbbell' },
  { id: 'radiation', label: 'Radiation', icon: 'radiation' },
  { id: 'environment', label: 'Cabin environment', icon: 'environment' },
  { id: 'devices', label: 'Connected devices', icon: 'devices', group: true },
  { id: 'sharing', label: 'Ground sharing', icon: 'sharing' },
];

export const METRIC_INFO = {
  heart: { title: 'Heart', icon: 'heart', unit: 'bpm', baseline: '58–70 bpm', score: 94, color: '#dc806f', description: 'Resting heart rate is close to your personal baseline.', limitation: 'A demo resting-heart-rate trend, not an ECG interpretation or diagnosis.', data: [64, 62, 65, 61, 63, 62, 62] },
  sleep: { title: 'Sleep', icon: 'moon', unit: 'hours', baseline: '7h 20m', score: 68, color: '#c78c50', description: 'Your last three nights are below your usual sleep duration.', limitation: 'A sustained change from your baseline can be useful to discuss with your flight surgeon. These are simulated readings.', data: [7.5, 7.2, 7.7, 7.4, 6.9, 6.6, 6.2] },
  bone: { title: 'Bone', icon: 'bone', unit: '% adherence', baseline: '90% plan adherence', score: 88, color: '#7a91b0', description: 'You are keeping up with your bone-loading exercise plan.', limitation: 'This demo index reflects countermeasure adherence. It does not measure bone density or diagnose bone loss.', data: [85, 88, 87, 90, 89, 91, 92] },
  muscle: { title: 'Muscle', icon: 'dumbbell', unit: '% training target', baseline: '90–100% of plan', score: 90, color: '#899a68', description: 'Your training consistency is within your planned target.', limitation: 'This demo index reflects logged exercise, not measured muscle mass or strength.', data: [89, 92, 90, 94, 93, 95, 96] },
  mood: { title: 'Mood', icon: 'smile', unit: 'self-report', baseline: 'Good', score: 84, color: '#b293ba', description: 'Your latest check-in is close to your usual mood.', limitation: 'Self-reported mood is personal and contextual. This is not a mental-health assessment or diagnosis.', data: [3, 3, 4, 3, 2, 3, 3] },
  radiation: { title: 'Radiation', icon: 'radiation', unit: 'mSv', baseline: 'Mission-defined limits', score: 96, color: '#8b9c73', description: 'Your simulated mission dose is logged and available to review.', limitation: 'No live space-weather feed is connected. Dose limits and protective actions must follow mission protocols.', data: [0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42] },
};

export const EXERCISES = [
  { id: 'ared', title: 'ARED resistance', subtitle: 'Bone loading · Strength', duration: 30, time: '16:00', icon: 'dumbbell', color: 'peach', steps: ['Warm up with mission-approved mobility movements.', 'Follow your assigned resistance countermeasure protocol.', 'Log the session and allow time to cool down.'] },
  { id: 'cycle', title: 'Cycle ergometer', subtitle: 'Cardiovascular endurance', duration: 20, time: '17:00', icon: 'activity', color: 'blue', steps: ['Set up your ergometer using crew procedures.', 'Use the intensity and cadence in your approved plan.', 'Cool down and record your session.'] },
  { id: 'mobility', title: 'Mobility reset', subtitle: 'Range of motion · Recovery', duration: 10, time: '08:00', icon: 'stretch', color: 'lime', steps: ['Find a comfortable, secure position.', 'Complete the mobility sequence assigned to you.', 'Finish with a relaxed recovery period.'] },
];

export const DEVICES = [
  { id: 'watch', name: 'Smartwatch', subtitle: 'Heart rate, sleep & activity', transport: 'Bluetooth', icon: 'watch', battery: 86, model: 'Wrist sensor · DEMO-01' },
  { id: 'ecg', name: 'ECG patch', subtitle: 'Cardiac rhythm readings', transport: 'Bluetooth', icon: 'heart', battery: 94, model: 'ECG patch · DEMO-02' },
  { id: 'oximeter', name: 'Pulse oximeter', subtitle: 'Oxygen saturation & pulse', transport: 'USB', icon: 'activity', battery: null, model: 'SpO₂ sensor · DEMO-03' },
  { id: 'dosimeter', name: 'Dosimeter', subtitle: 'Personal radiation exposure', transport: 'USB', icon: 'radiation', battery: 92, model: 'Dose sensor · DEMO-04' },
  { id: 'cabin', name: 'Cabin air sensor', subtitle: 'CO₂, humidity & temperature', transport: 'API', icon: 'environment', battery: null, model: 'Cabin node · DEMO-05' },
];

export const SHARE_OPTIONS = [
  { id: 'heart', label: 'Heart summary', detail: 'Resting rate & trend', icon: 'heart' },
  { id: 'sleep', label: 'Sleep summary', detail: 'Duration & personal baseline', icon: 'moon' },
  { id: 'bone', label: 'Bone countermeasures', detail: 'Plan adherence estimate', icon: 'bone' },
  { id: 'muscle', label: 'Muscle countermeasures', detail: 'Training target estimate', icon: 'dumbbell' },
  { id: 'mood', label: 'Mood summary', detail: 'Latest self-reported mood', icon: 'smile' },
  { id: 'radiation', label: 'Radiation summary', detail: 'Cumulative logged dose', icon: 'radiation' },
  { id: 'environment', label: 'Cabin environment', detail: 'Latest cabin conditions', icon: 'environment' },
];

export const READING_TYPES = {
  heart_rate: { label: 'Resting heart rate', unit: 'bpm', min: 25, max: 220, step: 1, default: 62, key: 'heart' },
  sleep_hours: { label: 'Sleep duration', unit: 'h', min: 0, max: 16, step: 0.1, default: 6.2, key: 'sleep' },
  co2: { label: 'Cabin CO₂', unit: 'ppm', min: 200, max: 10000, step: 1, default: 1120, key: 'co2' },
  temperature: { label: 'Cabin temperature', unit: '°C', min: -10, max: 60, step: 0.1, default: 22.4, key: 'temperature' },
  humidity: { label: 'Cabin humidity', unit: '%', min: 0, max: 100, step: 1, default: 45, key: 'humidity' },
  radiation_dose: { label: 'Additional radiation dose', unit: 'mSv', min: 0, max: 1000, step: 0.001, default: 0.018, key: 'radiation' },
};

export function formatSleep(hours) {
  const minutes = Math.round(Number(hours) * 60);
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
}
export function shortTime(date = new Date()) { return new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }); }
export function shortDate(date) { return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }); }
export function uid() { return globalThis.crypto?.randomUUID?.() || `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`; }
export function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }
export function getValues(state) {
  const last = state.checkIns[0];
  const sleep = state.manual.sleep ?? last?.sleep ?? 6.2;
  const mood = last?.mood ?? 3;
  const heart = state.manual.heart ?? 62;
  const dose = Number((0.42 + state.radiationLogs.reduce((s, log) => s + Number(log.value), 0)).toFixed(3));
  const scores = { heart: heart >= 58 && heart <= 70 ? 94 : heart >= 50 && heart <= 85 ? 72 : 48, sleep: clamp(Math.round(68 + (sleep - 6.2) * 13), 20, 100), bone: 88, muscle: 90, mood: MOOD_SCORES[mood], radiation: state.radiationWatch ? 72 : 96 };
  return { heart, sleep, mood, dose, bone: 92, muscle: 96, co2: state.manual.co2 ?? 1120, humidity: state.manual.humidity ?? 45, temperature: state.manual.temperature ?? 22.4, scores, score: Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6) };
}

export function getAlerts(state, values) {
  const list = [];
  if (values.sleep < 7.33) list.push({ id: 'sleep-drift', type: 'sleep', icon: 'moon', title: 'A little less sleep, three nights in a row.', brief: 'Your sleep is drifting below your usual 7h 20m.', time: '08:45 UTC', label: 'Sleep trend', action: 'Make time for a wind-down', detail: 'In this demo, the last three nights have fallen below your personal sleep baseline. Your latest entry is ' + formatSleep(values.sleep) + '. A quieter pre-sleep routine may help you prepare for rest.', steps: ['Review your sleep timing and recent workload.', 'Try a short relaxation routine before lights out.', 'Discuss persistent changes with your flight surgeon through approved channels.'] });
  if (values.co2 > 1000 || values.humidity < 30 || values.humidity > 60 || values.temperature < 18 || values.temperature > 26) list.push({ id: 'cabin-review', type: 'environment', icon: 'environment', title: 'A cabin reading needs a closer look.', brief: values.co2 > 1000 ? `CO₂ is ${Number(values.co2).toLocaleString()} ppm, above the demo target.` : 'A reading is outside the illustrative cabin target.', time: '09:32 UTC', label: 'Cabin environment', action: 'Review cabin conditions', detail: 'One or more readings are outside the illustrative targets configured for this prototype. These targets are not spacecraft safety limits.', steps: ['Confirm the reading and sensor status.', 'Review cabin conditions with your crew.', 'Use your mission’s approved environmental procedures.'] });
  if (state.radiationWatch) list.push({ id: 'radiation-watch', type: 'radiation', icon: 'radiation', title: 'Simulated space-weather watch.', brief: 'A local test event is active. This is not a live advisory.', time: 'Just now', label: 'Simulation only', action: 'Review simulated event', detail: 'This watch was created with the “Run alert simulation” button. No space-weather data has been received.', steps: ['Use this event to test the alert review workflow.', 'Real actions must follow your mission radiation protocol.', 'End the simulation from the radiation panel.'] });
  if (values.heart < 50 || values.heart > 85) list.push({ id: 'heart-drift', type: 'heart', icon: 'heart', title: 'Your heart-rate entry differs from baseline.', brief: `Latest entry: ${values.heart} bpm. Demo baseline: 58–70 bpm.`, time: 'Just now', label: 'Personal baseline', action: 'Review your entry', detail: 'The manual reading is outside the illustrative personal range. This prototype does not interpret symptoms or provide emergency monitoring.', steps: ['Check the entry and measurement conditions.', 'Review changes with your flight surgeon as appropriate.', 'For urgent concerns, follow established mission procedures.'] });
  return list;
}
