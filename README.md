# StarX Health

An interactive, offline-friendly astronaut health companion. Built around a fictional Mission Aurora and a fictional astronaut, Alex Morgan. The reference dashboard date is **14 November 2026, mission day 042**.

## Open the prototype

- **Live preview:** the running StarX Health app on port 5173.
- **Self-contained file:** `StarX Health.html` in the parent folder. Open this file in a modern browser; it includes its JavaScript, styles, font, icons, and Earth illustration. No installation or internet connection is required.
- **Restricted file viewer:** all local interactions work, but browser storage may be unavailable. A visible banner explains when entries are session-only. Download and open the HTML, or use the live preview, for persistent browser storage and file exports.

## What you can try

| Area | Working interactions |
| --- | --- |
| Overview | Six-category health breakdown, illustrative composite score, personal-baseline comparisons, contextual alerts, cabin readings, and exercise progress |
| Health insights | Heart, sleep, bone, muscle, mood, and radiation views; 7-, 14-, and 30-day example trends; chart tooltips; JSON summary export |
| Daily check-in | Five mood choices, sleep duration, energy, optional private journal note, local history, and update-in-place for the demo day |
| Mental wellness | Timed box breathing, body scan, and quiet reset routines with start, pause, continue, and restart controls; visual guidance, not audio |
| Exercise | Session details, completion toggles, movement progress, sample weekly overview, and local in-app UTC reminders |
| Radiation | Additional dose entry, cumulative log, a clearly labeled local space-weather watch simulation, and ending the simulation |
| Cabin | CO₂, humidity, and temperature readings and trends; manual overrides; locally recorded reading history |
| Sensors | Simulated connection/disconnection for five sensor types; transport details; a normalized schema; real local JSON import with validation |
| Ground sharing | All categories unselected by default, explicit extra permission for journal notes, exact JSON preview, local queue snapshots, cancellation, and simulated delivery |
| Local workspace | Local backup export, demo reset with confirmation, offline status, responsive navigation, and keyboard-dismissable focus-trapped dialogs |

### A short demo walkthrough

1. Complete the daily check-in with a new mood and sleep duration. The overview updates and the entry survives a reload when browser storage is available.
2. Add a cabin CO₂ reading of **850 ppm**. The cabin demo alert clears.
3. Open **Connected devices** and disconnect/reconnect a demo sensor. No hardware permissions are requested.
4. Import `examples/readings.json`, or paste a normalized reading into the import dialog.
5. Open **Ground sharing**, choose two categories, and preview the exact snapshot. Journal notes are excluded unless mood sharing and its separate notes permission are both selected.
6. Queue the summary while in onboard mode. Enable the **simulated Earth communication link**, then simulate sync. Nothing is sent outside the browser.
7. After the live production app has loaded once and its service worker has activated, disable the network and reload. Alternatively, use the standalone HTML directly offline.

## Run the editable source

Requires Node.js 20 or later.

```sh
npm ci
npm run build
npm run preview
```

The app binds to `0.0.0.0:5173`. Vite permits proxied preview hosts. There is no backend, account, API key, analytics service, CDN, or external runtime request.

For development:

```sh
npm run dev
```

The service worker is registered only by production builds. `npm run build` creates `dist/`, an offline app-shell service worker, and `../StarX Health.html`. The single-file build deliberately skips service-worker registration.

## Local data and privacy

- State is stored under `starx-health-v1` in this browser’s `localStorage`.
- A storage failure falls back to session memory and displays a warning.
- The app shell is cached with a service worker; health records are not sent to the asset server.
- Sharing queues are **local snapshots** of the selections at creation time. Changing future permissions does not rewrite an existing snapshot; cancel that snapshot to revoke it.
- “Simulate sync” changes a local record to `simulated`; it never makes a transmission request.
- A full local summary export excludes journal notes. The explicitly labeled **private local backup** includes all local state, including notes.
- Resetting the demo clears the stored prototype state and restores sample data.
- Storage is **not encrypted**, and there is no authentication or production security/compliance implementation. Do not enter real health or identifying information.

## Important prototype boundaries

This is **not a medical device, diagnosis tool, validated readiness score, live radiation warning service, or mission-approved exercise plan**.

- Health scores, baseline history, targets, prior check-ins, mission details, and device readings begin as illustrative data.
- The six category scores are equally weighted in the composite. Bone and muscle indicators are demonstration exercise proxies—not measurements of bone density or muscle mass. Their sample adherence values are not inferred from real sensors.
- Trend ranges beyond the sample week extend synthetic example history. This prototype does not train a baseline model from long-term sensor data.
- Cabin targets are illustrative UI settings, not spacecraft exposure limits.
- No real Bluetooth pairing, USB access, ECG interpretation, pulse-oximetry integration, live weather feed, ground clinician service, or external sync is implemented.
- Exercise reminders appear only inside the open app, using UTC. They are not operating-system or background notifications.
- Relaxation routines are visual timers. They do not provide spoken audio or treatment.
- Radiation doses entered manually are added to the sample cumulative history. Real dose interpretation and protective actions must follow mission protocols.

A production version would need approved sensor adapters, robust time-series storage, clinician-reviewed scoring and alert rules, mission-specific environmental and dose limits, strong encryption/key management, identity and consent controls, audited ground delivery, and medical/human-factors validation.

## Normalized reading format

```json
{
  "sensor_id": "wrist-demo-01",
  "timestamp": "2026-11-14T09:41:00Z",
  "metric": "heart_rate",
  "value": 62,
  "unit": "bpm",
  "source": "demo"
}
```

Supported metrics: `heart_rate` (`bpm`), `sleep_hours` (`h`), `co2` (`ppm`), `temperature` (`°C`), `humidity` (`%`), and `radiation_dose` (`mSv`). The import accepts one object or an array of 1–100 objects. Metric, numeric range, unit, and optional timestamp are validated. Imported records are labeled as imported readings rather than trusted hardware.

## Tests

Start the production preview as above, then in a second terminal:

```sh
npx playwright install --with-deps chromium
npm test
```

`tests/smoke.mjs` checks scoring transparency, check-in persistence, manual readings and alerts, charts and exports, simulated devices, import validation, radiation logging, exercise progress, sharing permissions and snapshots, simulated delivery, guided timers, a genuine network-offline reload, responsive layouts, the standalone file, and the restricted iframe viewer. Results are written to `tests/results.json`.

## Project structure

```text
src/App.jsx             Screens, navigation, local state, sharing, and dialogs
src/components.jsx      Accessible primitives, local forms, charts, and routines
src/data.js             Demo data, normalized metric definitions, and alert logic
src/styles.css          Core visual system and responsive layouts
src/readability.css     Contrast, readable type, and keyboard-access refinements
scripts/package.mjs     Single-file export and service-worker packaging
public/                 Bundled local font, favicon, and orbital illustration
examples/               Sample JSON readings
licenses/               Third-party font license
```

## Credits

React, Vite, Lucide icons, and Manrope are open-source dependencies; see `THIRD_PARTY_NOTICES.md`. The orbital Earth background is AI-generated artwork made for this prototype. All profile and mission details are fictional.
