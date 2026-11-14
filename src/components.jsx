import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { Activity, ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Bell, Bluetooth, Bone, CalendarDays, Check, CheckCheck, CheckCircle2, ChevronDown, ChevronRight, Circle, Clock3, CloudSun, Download, Dumbbell, Earth, FileJson, FileText, Heart, HeartPulse, HelpCircle, LayoutDashboard, Link2, LockKeyhole, Menu, Moon, MoreHorizontal, Orbit, Pause, PersonStanding, Play, Plus, Radio, Radiation, RefreshCw, Satellite, Search, Send, Settings2, Shield, ShieldCheck, SlidersHorizontal, Smile, Sparkles, Target, Thermometer, Trash2, Usb, Watch, Waves, Wifi, WifiOff, Wind, X, Zap, Droplets, Headphones, Battery, CircleAlert } from 'lucide-react';
import { MOODS, READING_TYPES, formatSleep, shortTime } from './data';

const ICONS = { overview: LayoutDashboard, activity: Activity, heart: HeartPulse, moon: Moon, bone: Bone, dumbbell: Dumbbell, smile: Smile, radiation: Radiation, environment: Wind, devices: Link2, sharing: Satellite, arrow: ArrowRight, arrowup: ArrowUpRight, arrowdown: ArrowDownRight, left: ArrowLeft, chevron: ChevronRight, down: ChevronDown, check: Check, doublecheck: CheckCheck, circlecheck: CheckCircle2, circle: Circle, bell: Bell, bluetooth: Bluetooth, calendar: CalendarDays, clock: Clock3, download: Download, earth: Earth, json: FileJson, file: FileText, help: HelpCircle, link: Link2, lock: LockKeyhole, menu: Menu, more: MoreHorizontal, orbit: Orbit, pause: Pause, stretch: PersonStanding, play: Play, plus: Plus, radio: Radio, refresh: RefreshCw, search: Search, send: Send, settings: Settings2, shield: Shield, shieldcheck: ShieldCheck, sliders: SlidersHorizontal, sparkles: Sparkles, target: Target, thermometer: Thermometer, trash: Trash2, usb: Usb, watch: Watch, waves: Waves, wifi: Wifi, offline: WifiOff, x: X, zap: Zap, droplets: Droplets, headphones: Headphones, battery: Battery, alert: CircleAlert, sun: CloudSun };
export function Icon({ name, size = 19, ...props }) { const C = ICONS[name] || Activity; return <C size={size} strokeWidth={1.7} aria-hidden="true" {...props} />; }
export function Button({ children, variant = 'primary', icon, iconRight, className = '', ...props }) { return <button type="button" className={`button ${variant} ${className}`} {...props}>{icon && <Icon name={icon} size={16} />}{children}{iconRight && <Icon name={iconRight} size={16} />}</button>; }
export function Tag({ children, tone = 'green', dot = false, className = '' }) { return <span className={`tag ${tone} ${className}`}>{dot && <span className="status-dot" />}{children}</span>; }
export function Card({ children, className = '', ...props }) { return <section className={`card ${className}`} {...props}>{children}</section>; }
export function SectionHeading({ title, subtitle, action }) { return <div className="section-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</div>; }
export function PageHeading({ eyebrow = 'YOUR ONBOARD HEALTH COMPANION', title, description, action }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>; }
export function EmptyState({ icon = 'file', title, description, action }) { return <div className="empty-state"><span className="empty-icon"><Icon name={icon} size={26} /></span><h3>{title}</h3><p>{description}</p>{action}</div>; }

export function Logo({ small = false }) { return <div className={`brand ${small ? 'small' : ''}`}><span className="brand-symbol"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 2L24.5 15.5L38 20L24.5 24.5L20 38L15.5 24.5L2 20L15.5 15.5L20 2Z" fill="currentColor"/><path d="M6 6L16 16M24 24L34 34M34 6L24 16M16 24L6 34" stroke="currentColor" strokeWidth="1.5"/></svg></span><span className="brand-type">starx<span>HEALTH</span></span></div>; }

export function ScoreRing({ score, size = 154 }) {
  const r = 62, circumference = 2 * Math.PI * r;
  return <div className="score-ring" style={{ width: size, height: size }} aria-label={`Demo health score ${score} out of 100`}><svg viewBox="0 0 154 154"><circle cx="77" cy="77" r={r} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="8"/><circle className="ring-progress" cx="77" cy="77" r={r} fill="none" stroke={score >= 80 ? '#c7ed9e' : score >= 60 ? '#f0c184' : '#e99a91'} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} transform="rotate(-90 77 77)"/></svg><div className="ring-value"><strong>{score}</strong><span>OUT OF 100</span></div></div>;
}

export function MoodFace({ index = 3, size = 34 }) {
  const mouth = ['M10 25 Q18 14 26 25', 'M10 23 Q18 18 26 23', 'M11 23 L25 23', 'M10 21 Q18 30 26 21', 'M9 20 Q18 32 27 20'];
  return <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true"><circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="1.5"/><path d="M12 13v2M24 13v2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"/><path d={mouth[index]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
export function MoodPicker({ value, onChange, compact = false }) { return <div className={`mood-picker ${compact ? 'compact' : ''}`} role="group" aria-label="Choose your mood">{MOODS.map((mood, i) => <button key={mood} type="button" className={`mood-option ${value === i ? 'selected' : ''}`} onClick={() => onChange(i)} aria-label={mood} aria-pressed={value === i}><MoodFace index={i} /><span>{mood}</span></button>)}</div>; }

export function Sparkline({ data, color = '#5d8070', fill = true }) {
  const width = 140, height = 29, min = Math.min(...data) - 1, max = Math.max(...data) + 1;
  const points = data.map((v, i) => `${i * width / (data.length - 1)},${height - 3 - ((v - min) / (max - min)) * (height - 6)}`);
  return <svg viewBox={`0 0 ${width} ${height}`} className="sparkline" preserveAspectRatio="none" aria-hidden="true">{fill && <polygon points={`0,${height} ${points.join(' ')} ${width},${height}`} fill={color} opacity=".065"/>}<polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/></svg>;
}
function smoothPath(points) {
  if (!points.length) return '';
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}
export function LineChart({ metric = 'sleep', range = '7D', lastValue, compact = false }) {
  const [hover, setHover] = useState(null);
  const id = useId().replace(/:/g, '');
  const config = {
    sleep: { data: [7.5, 7.2, 7.7, 7.4, 6.9, 6.6, 6.2], min: 4, max: 9, baseline: 7.33, color: '#c88c50', format: v => formatSleep(v), axis: v => `${v.toFixed(0)}h` },
    heart: { data: [64, 62, 65, 61, 63, 62, 62], min: 45, max: 85, baseline: 64, color: '#d28575', format: v => `${v.toFixed(0)} bpm`, axis: v => v.toFixed(0) },
    bone: { data: [85, 88, 87, 90, 89, 91, 92], min: 60, max: 100, baseline: 90, color: '#8094b0', format: v => `${v.toFixed(0)}%`, axis: v => `${v.toFixed(0)}%` },
    muscle: { data: [89, 92, 90, 94, 93, 95, 96], min: 60, max: 110, baseline: 95, color: '#8b9b6c', format: v => `${v.toFixed(0)}%`, axis: v => `${v.toFixed(0)}%` },
    mood: { data: [3, 3, 4, 3, 2, 3, 3], min: -0.5, max: 4.5, baseline: 3, color: '#a98fb3', format: v => MOODS[Math.max(0, Math.min(4, Math.round(v)))], axis: v => v > 3 ? 'Great' : v > 1 ? 'Okay' : 'Low' },
    radiation: { data: [.30, .32, .34, .36, .38, .40, .42], min: .2, max: .6, baseline: null, color: '#8e9d73', format: v => `${v.toFixed(3)} mSv`, axis: v => v.toFixed(1) },
    co2: { data: [820, 900, 860, 940, 980, 1050, 1120], min: 500, max: 1500, baseline: 1000, color: '#c88c50', format: v => `${v.toFixed(0)} ppm`, axis: v => v.toFixed(0) },
    temperature: { data: [22.1, 22.3, 22, 22.2, 22.5, 22.3, 22.4], min: 16, max: 30, baseline: 22, color: '#8094b0', format: v => `${v.toFixed(1)}°C`, axis: v => `${v.toFixed(0)}°` },
    humidity: { data: [42, 44, 43, 46, 44, 43, 45], min: 20, max: 70, baseline: 45, color: '#789d9b', format: v => `${v.toFixed(0)}%`, axis: v => `${v.toFixed(0)}%` },
  };
  const c = config[metric] || config.sleep;
  const count = range === '30D' ? 30 : range === '14D' ? 14 : 7;
  const old = Array.from({ length: Math.max(0, count - 7) }, (_, i) => c.data[0] + Math.sin(i * 1.7) * (c.max - c.min) * .04);
  const data = [...old, ...c.data];
  if (lastValue != null) data[data.length - 1] = Number(lastValue);
  const W = 700, H = compact ? 175 : 205, L = 44, R = 18, T = 22, B = 32;
  const min = Math.min(c.min, ...data.map(v => v - (c.max - c.min) * .04)), max = Math.max(c.max, ...data.map(v => v + (c.max - c.min) * .04));
  const x = i => L + i / (data.length - 1) * (W - L - R);
  const y = v => T + (1 - (v - min) / (max - min)) * (H - T - B);
  const points = data.map((v, i) => [x(i), y(v)]);
  const path = smoothPath(points), bottom = H - B;
  const dateLabel = i => { const d = new Date('2026-11-14T12:00:00Z'); d.setUTCDate(d.getUTCDate() - (count - 1 - i)); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }); };
  const active = hover != null ? Math.min(hover, data.length - 1) : null;
  return <div className="chart-wrap" onMouseLeave={() => setHover(null)}><svg className="line-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${metric} trend over ${count} days. Simulated data. Latest value: ${c.format(data.at(-1))}.`} onMouseMove={e => { const rect = e.currentTarget.getBoundingClientRect(); const pos = (e.clientX - rect.left) / rect.width * W; setHover(Math.max(0, Math.min(data.length - 1, Math.round((pos - L) / (W - L - R) * (data.length - 1))))); }}><defs><linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.color} stopOpacity=".14"/><stop offset="100%" stopColor={c.color} stopOpacity="0"/></linearGradient></defs>{[0, .5, 1].map((p, i) => { const value = min + (max - min) * p; return <g key={i}><line x1={L} x2={W - R} y1={y(value)} y2={y(value)} stroke="#e9ebe5" strokeDasharray="3 5"/><text x={L - 13} y={y(value) + 4} textAnchor="end">{c.axis(value)}</text></g>; })}{metric === 'sleep' && <rect x={x(data.length - 3) - 8} y={T} width={W - R - x(data.length - 3) + 8} height={bottom - T} fill="#f5eddf" opacity=".5" rx="4"/>}{c.baseline !== null && <line x1={L} x2={W - R} y1={y(c.baseline)} y2={y(c.baseline)} stroke="#a8b7a9" strokeDasharray="5 5" strokeWidth="1.2"/>}<path d={`${path} L ${x(data.length - 1)},${bottom} L ${L},${bottom} Z`} fill={`url(#area-${id})`}/><path d={path} fill="none" stroke={c.color} strokeWidth="2.6" strokeLinecap="round"/>{data.map((v, i) => <g key={i}><circle cx={x(i)} cy={y(v)} r={active === i ? 5 : 3.6} fill="white" stroke={c.color} strokeWidth="2" opacity={count > 14 && active !== i ? 0 : 1}/>{(count === 7 || i === 0 || i === count - 1 || i % Math.floor(count / 5) === 0) && <text x={x(i)} y={H - 7} textAnchor="middle">{dateLabel(i)}</text>}<circle cx={x(i)} cy={y(v)} r="12" fill="transparent" tabIndex={0} onFocus={() => setHover(i)} onBlur={() => setHover(null)} aria-label={`${dateLabel(i)}: ${c.format(v)}`} /></g>)}{active != null && <line x1={x(active)} x2={x(active)} y1={T} y2={bottom} stroke={c.color} strokeOpacity=".3" strokeDasharray="3 3"/>}</svg>{active != null && <div className="chart-tooltip" style={{ left: `${Math.min(86, Math.max(15, x(active) / W * 100))}%`, top: 0 }}><span>{dateLabel(active)}</span><strong>{c.format(data[active])}</strong></div>}</div>;
}

export function RangeControl({ value, onChange }) { return <div className="range-control" role="group" aria-label="Chart date range">{['7D', '14D', '30D'].map(range => <button key={range} aria-pressed={range === value} className={range === value ? 'selected' : ''} onClick={() => onChange(range)}>{range}</button>)}</div>; }

export function Modal({ title, subtitle, children, onClose, wide = false }) {
  const ref = useRef(null), id = useId();
  useEffect(() => {
    const prev = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => ref.current?.querySelector('button, input, textarea, select, [tabindex="0"]')?.focus());
    const key = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const elems = [...ref.current.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea,select,a[href],[tabindex="0"]')];
        const first = elems[0], last = elems.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { cancelAnimationFrame(frame); document.body.style.overflow = old; document.removeEventListener('keydown', key); prev?.focus?.(); };
  }, []);
  return <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}><section className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={id} ref={ref}><div className="modal-heading"><div><h2 id={id}>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" aria-label="Close dialog" onClick={onClose}><Icon name="x" /></button></div><div className="modal-body">{children}</div></section></div>;
}

// Local-only forms also work in file previews sandboxed without allow-forms.
// Native constraint validation is retained; no browser form submission occurs.
const LocalSubmitContext = createContext(null);
export function LocalForm({ onSubmit, children, ...props }) {
  const ref = useRef(null);
  const submit = event => {
    event.preventDefault();
    if (ref.current?.reportValidity()) onSubmit(event);
  };
  return <LocalSubmitContext.Provider value={submit}><form {...props} ref={ref} onSubmit={submit} onKeyDown={event => { if (event.key === 'Enter' && event.target.tagName === 'INPUT' && event.target.type !== 'range' && !event.nativeEvent.isComposing) submit(event); }}>{children}</form></LocalSubmitContext.Provider>;
}
export function SubmitButton({ children, ...props }) { const submit = useContext(LocalSubmitContext); return <button {...props} type="button" onClick={submit}>{children}</button>; }

export function CheckInForm({ values, lastEntry, initialMood = 3, onSave, isSessionOnly = false }) {
  const [mood, setMood] = useState(initialMood);
  const [sleep, setSleep] = useState(values.sleep);
  const [energy, setEnergy] = useState(lastEntry?.energy ?? 3);
  const [notes, setNotes] = useState(lastEntry?.notes ?? '');
  return <LocalForm className="checkin-form" onSubmit={e => { e.preventDefault(); onSave({ mood, sleep: Number(sleep), energy: Number(energy), notes: notes.trim() }); }}><div className="form-label">How are you feeling right now?</div><MoodPicker value={mood} onChange={setMood}/><div className="form-grid"><label className="field">Sleep last night<div className="input-unit"><input name="sleep" type="number" min="0" max="16" step="0.1" required value={sleep} onChange={e => setSleep(e.target.value)}/><span>hours</span></div><small>{formatSleep(sleep || 0)} · Your baseline is 7h 20m</small></label><label className="field">Your energy <span className="muted">{energy} / 5</span><input aria-label="Energy level" type="range" min="1" max="5" value={energy} onChange={e => setEnergy(e.target.value)}/><div className="range-labels"><small>Low</small><small>High</small></div></label></div><label className="field">Anything on your mind? <span className="muted">Optional</span><textarea maxLength="500" rows="3" placeholder="A small win, something difficult, or just a thought…" value={notes} onChange={e => setNotes(e.target.value)}/><small>{notes.length}/500 · Journal notes stay private unless explicitly included in a sharing summary.</small></label><div className="form-footer"><span><Icon name="lock" size={14}/>{isSessionOnly ? 'Private to this session' : 'Saved only on this device'}</span><SubmitButton className="button primary">Save check-in<Icon name="check" size={16}/></SubmitButton></div></LocalForm>;
}

export function ManualEntryForm({ defaultType = 'heart_rate', onSave }) {
  const [type, setType] = useState(defaultType), [value, setValue] = useState(READING_TYPES[defaultType].default);
  const config = READING_TYPES[type];
  return <LocalForm className="stack-form" onSubmit={e => { e.preventDefault(); onSave(type, Number(value)); }}><div className="info-note"><Icon name="shield"/><span>No sensor? No problem. A manual entry updates your local demo dashboard.</span></div><label className="field">Reading type<select value={type} onChange={e => { setType(e.target.value); setValue(READING_TYPES[e.target.value].default); }}>{Object.entries(READING_TYPES).map(([key, info]) => <option key={key} value={key}>{info.label}</option>)}</select></label><label className="field">Value<div className="input-unit"><input type="number" required min={config.min} max={config.max} step={config.step} value={value} onChange={e => setValue(e.target.value)}/><span>{config.unit}</span></div><small>{type === 'radiation_dose' ? 'Added to the cumulative demo dose, not a replacement reading.' : 'This entry replaces the latest displayed reading for this metric.'}</small></label><p className="fine-print">Ranges validate the demo form only. They are not medical or mission safety limits.</p><SubmitButton className="button primary">Save local reading<Icon name="check" size={16}/></SubmitButton></LocalForm>;
}

export function GuidedRoutine({ mode = 'breathing', onComplete }) {
  const duration = mode === 'body' ? 180 : mode === 'quiet' ? 60 : 120;
  const [remaining, setRemaining] = useState(duration), [running, setRunning] = useState(false), [done, setDone] = useState(false);
  const elapsed = duration - remaining, stage = Math.floor((elapsed % 16) / 4);
  const phrases = ['Breathe in', 'Hold gently', 'Breathe out', 'Rest'];
  const bodyPhrases = ['Settle into a comfortable position', 'Soften your face and jaw', 'Let your shoulders relax', 'Notice your hands and arms', 'Notice your legs and feet', 'Return to the room, gently'];
  const instruction = mode === 'body' ? bodyPhrases[Math.min(5, Math.floor(elapsed / 30))] : mode === 'quiet' ? (elapsed < 30 ? 'Notice three things around you' : 'Take a slow, comfortable breath') : phrases[stage];
  useEffect(() => { if (!running || remaining <= 0) return; const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000); return () => clearInterval(id); }, [running, remaining]);
  useEffect(() => { if (remaining === 0 && !done) { setRunning(false); setDone(true); onComplete?.(); } }, [remaining, done]);
  return <div className="guided-routine"><Tag tone="neutral" dot>PRIVATE RECOVERY TIME</Tag><div className={`breathing-orb ${running && !done ? 'is-running' : ''} stage-${stage}`}><div className="breathing-orb-inner"><Icon name={done ? 'check' : 'waves'} size={32}/><strong>{done ? 'A moment, well spent.' : !running && remaining === duration ? 'Make room for calm.' : instruction}</strong><span>{done ? 'Your routine is complete.' : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')} remaining`}</span></div></div><p>{mode === 'breathing' ? 'Four counts in. Four to hold. Four out. Four to rest. Keep it comfortable, and stop if you feel unwell.' : 'Stay comfortable. There is no right way to feel. You can stop at any time.'}</p><div className="button-row"><Button variant="secondary" icon="refresh" onClick={() => { setRunning(false); setRemaining(duration); setDone(false); }}>Restart</Button><Button icon={running ? 'pause' : 'play'} onClick={() => { if (done) { setRemaining(duration); setDone(false); } setRunning(!running); }}>{running ? 'Pause' : remaining === duration || done ? 'Begin session' : 'Continue'}</Button></div><p className="fine-print">Visual guidance only · No audio or medical treatment</p></div>;
}
