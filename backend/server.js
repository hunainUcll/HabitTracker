const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const DB_PATH = path.join(__dirname, 'tracker.json');

let store = {
  daily_logs: [],      // { date, weight, calories, protein, carbs, fat, water, prayers:{fajr,zuhr,asr,maghrib,isha}, quran }
  weight_entries: [],  // { date, weight }
  progress_items: {},  // "uni:subject:name" or "ict:playlist:num" => { completed, notes }
  workout_logs: [],    // { date, day_name, exercises: {id: bool} }
};

function loadStore() {
  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      store = { ...store, ...raw };
      if (!store.workout_logs) store.workout_logs = [];
    } catch(e) { console.error('Failed to load store:', e); }
  }
}

function saveStore() {
  fs.writeFileSync(DB_PATH, JSON.stringify(store, null, 2));
}

loadStore();

// ── helpers ──────────────────────────────────────────────────────────────────
function todayUTC() { return new Date().toISOString().split('T')[0]; }

// ── DAILY LOGS ────────────────────────────────────────────────────────────────
app.get('/api/daily-logs', (req, res) => res.json(store.daily_logs || []));

app.post('/api/daily-logs', (req, res) => {
  if (!req.body.date) return res.status(400).json({ error: 'date required' });
  if (!store.daily_logs) store.daily_logs = [];
  const entry = { ...req.body, savedAt: new Date().toISOString() };
  const idx = store.daily_logs.findIndex(l => l.date === entry.date);
  if (idx >= 0) store.daily_logs[idx] = entry;
  else store.daily_logs.push(entry);
  saveStore();
  res.json(entry);
});

// ── WEIGHT ────────────────────────────────────────────────────────────────────
app.get('/api/weight', (req, res) => res.json(store.weight_entries || []));

app.post('/api/weight', (req, res) => {
  if (!req.body.date) return res.status(400).json({ error: 'date required' });
  if (!store.weight_entries) store.weight_entries = [];
  const entry = { date: req.body.date, weight: req.body.weight };
  const idx = store.weight_entries.findIndex(w => w.date === entry.date);
  if (idx >= 0) store.weight_entries[idx] = entry;
  else store.weight_entries.push(entry);
  store.weight_entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveStore();
  res.json(entry);
});

// ── PROGRESS (university + ict) ───────────────────────────────────────────────
app.get('/api/progress', (req, res) => res.json(store.progress_items || {}));

app.post('/api/progress/:itemKey', (req, res) => {
  if (!store.progress_items) store.progress_items = {};
  store.progress_items[req.params.itemKey] = { ...req.body };
  saveStore();
  res.json({ key: req.params.itemKey, ...req.body });
});

// ── WORKOUT LOGS ─────────────────────────────────────────────────────────────
app.get('/api/workout-logs', (req, res) => res.json(store.workout_logs || []));

app.post('/api/workout-logs', (req, res) => {
  if (!req.body.date) return res.status(400).json({ error: 'date required' });
  if (!store.workout_logs) store.workout_logs = [];
  const entry = { ...req.body };
  const idx = store.workout_logs.findIndex(w => w.date === entry.date);
  if (idx >= 0) store.workout_logs[idx] = entry;
  else store.workout_logs.push(entry);
  saveStore();
  res.json(entry);
});

// ── FALLBACK ──────────────────────────────────────────────────────────────────
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Hunain Tracker running on http://localhost:${PORT}`));
