// =============================================
// HUNAIN TRACKER — MAIN APP
// =============================================

const API = 'http://localhost:3000/api';
let progress = {};
let weightData = [];
let workoutLogs = [];
let dailyLog = null;
let allDailyLogs = [];
let currentNoteKey = null;
let prayerView = 'year'; // 'year' or 'month:YYYY-MM'
let weightChart = null;
let activePlaylist = null;

// =============================================
// WORKOUT PLAN (static)
// =============================================
const WORKOUT_PLAN = {
  1: {
    name: 'Upper Push', muscles: 'Chest · Triceps · Front Delts', duration: '~75 min',
    exercises: [
      { id: 'mon_1', name: 'Flat Dumbbell Bench Press',      sets: '4×8–12',    eq: 'Dumbbell', rest: '2 min' },
      { id: 'mon_2', name: 'Incline Dumbbell Press (30–45°)', sets: '3×10–12',   eq: 'Dumbbell', rest: '2 min' },
      { id: 'mon_3', name: 'Dumbbell Flyes / Cable Crossover',sets: '3×12–15',   eq: 'Dumbbell', rest: '60 s' },
      { id: 'mon_4', name: 'Cable Pushdown (bar or rope)',    sets: '4×12–15',   eq: 'Cable',    rest: '90 s' },
      { id: 'mon_5', name: 'Cable Overhead Tricep Extension', sets: '3×12',      eq: 'Cable',    rest: '90 s' },
      { id: 'mon_6', name: 'Bench Dips',                     sets: '3×AMRAP',   eq: 'Bodyweight',rest: '90 s'},
    ]
  },
  3: {
    name: 'Upper Pull', muscles: 'Back · Biceps · Rear Delts', duration: '~75 min',
    exercises: [
      { id: 'wed_1', name: 'Dumbbell Bent-Over Row',           sets: '4×10–12',     eq: 'Dumbbell', rest: '2 min' },
      { id: 'wed_2', name: 'Single-Arm Dumbbell Row',          sets: '3×10–12/arm', eq: 'Dumbbell', rest: '90 s' },
      { id: 'wed_3', name: 'Cable Seated Row (close grip)',    sets: '3×12',        eq: 'Cable',    rest: '90 s' },
      { id: 'wed_4', name: 'Dumbbell Romanian Deadlift',       sets: '3×10–12',     eq: 'Dumbbell', rest: '2 min' },
      { id: 'wed_5', name: 'Incline Dumbbell Reverse Fly',     sets: '3×15',        eq: 'Dumbbell', rest: '60 s' },
      { id: 'wed_6', name: 'Seated Alt. Dumbbell Curl',        sets: '3×10–12',     eq: 'Dumbbell', rest: '90 s' },
      { id: 'wed_7', name: 'Hammer Curls',                     sets: '3×12',        eq: 'Dumbbell', rest: '60 s' },
      { id: 'wed_8', name: 'Dumbbell Shrugs',                  sets: '3×15',        eq: 'Dumbbell', rest: '60 s' },
    ]
  },
  5: {
    name: 'Legs + Abs', muscles: 'Quads · Hamstrings · Glutes · Calves · Core', duration: '~85 min',
    exercises: [
      { id: 'fri_1', name: 'Goblet Squat (DB at chest)',       sets: '4×12–15',     eq: 'Dumbbell',   rest: '2 min' },
      { id: 'fri_2', name: 'Dumbbell Walking Lunges',          sets: '3×10/leg',    eq: 'Dumbbell',   rest: '2 min' },
      { id: 'fri_3', name: 'Bulgarian Split Squat',            sets: '3×10/leg',    eq: 'Dumbbell',   rest: '2 min' },
      { id: 'fri_4', name: 'Dumbbell Romanian Deadlift',       sets: '4×10–12',     eq: 'Dumbbell',   rest: '2 min' },
      { id: 'fri_5', name: 'Standing Calf Raise',              sets: '4×20',        eq: 'Dumbbell',   rest: '60 s' },
      { id: 'fri_6', name: 'Decline Sit-Ups (DB at chest)',    sets: '3×15–20',     eq: 'Dumbbell',   rest: '45 s' },
      { id: 'fri_7', name: 'Russian Twists (DB)',              sets: '3×20',        eq: 'Dumbbell',   rest: '45 s' },
      { id: 'fri_8', name: 'Lying Leg Raises',                 sets: '3×15',        eq: 'Bodyweight', rest: '45 s' },
      { id: 'fri_9', name: 'Plank',                            sets: '3×45–60 s',   eq: 'Bodyweight', rest: '45 s' },
    ]
  },
  6: {
    name: 'Shoulders + Forearms', muscles: 'All Delt Heads · Forearms · Grip', duration: '~70 min',
    exercises: [
      { id: 'sat_1',  name: 'Seated DB Shoulder Press',              sets: '4×10–12',  eq: 'Dumbbell', rest: '2 min' },
      { id: 'sat_2',  name: 'Dumbbell Lateral Raises',               sets: '4×15',     eq: 'Dumbbell', rest: '60 s' },
      { id: 'sat_3',  name: 'Dumbbell Front Raises (alternating)',   sets: '3×12',     eq: 'Dumbbell', rest: '60 s' },
      { id: 'sat_4',  name: 'Incline DB Reverse Fly',                sets: '3×15',     eq: 'Dumbbell', rest: '60 s' },
      { id: 'sat_5',  name: 'Dumbbell Upright Row',                  sets: '3×12',     eq: 'Dumbbell', rest: '90 s' },
      { id: 'sat_6',  name: 'Seated Wrist Curls (palms up)',         sets: '4×15–20',  eq: 'Dumbbell', rest: '60 s' },
      { id: 'sat_7',  name: 'Behind-the-Back Wrist Curls',           sets: '3×15',     eq: 'Dumbbell', rest: '60 s' },
      { id: 'sat_8',  name: 'Reverse Wrist Curls (palms down)',      sets: '4×15–20',  eq: 'Dumbbell', rest: '60 s' },
      { id: 'sat_9',  name: 'Reverse Curls (overhand)',              sets: '3×12',     eq: 'Dumbbell', rest: '90 s' },
      { id: 'sat_10', name: "Farmer's Carry Hold (static)",          sets: '3×30–45 s',eq: 'Dumbbell', rest: '60 s' },
    ]
  },
};

// today's workout exercises state (id → bool)
let todayWorkoutChecks = {};

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
  initParticles();
  initClock();
  fetchWeather();
  initGlobe();
  initNav();
  await loadAllData();
  renderUniversity();
  renderWealth();
  renderTodayWorkout();
  renderWorkoutHeatmap();
  renderSpiritPage();
  renderNextLessons();
  fetchQuote();
  scheduleMidnightReset();
  showPage('home');
});

// =============================================
// NAVIGATION
// =============================================
function initNav() {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });
  document.getElementById('startBtn').addEventListener('click', openDailyModal);

  // Close notes sidebar when clicking outside it
  document.addEventListener('mousedown', (e) => {
    const sidebar = document.getElementById('notesSidebar');
    if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target)) {
      closeNotes();
    }
  });
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  const page = document.getElementById(name === 'home' ? 'home' : name + '-page');
  if (page) page.classList.add('active');
  const btn = document.querySelector(`[data-page="${name}"]`);
  if (btn) btn.classList.add('active');

  const isHome = name === 'home';
  document.getElementById('datetimeDisplay').style.display = isHome ? '' : 'none';
  document.getElementById('weatherWidget').style.display  = isHome ? '' : 'none';

  if (name === 'home')   renderNextLessons();
  if (name === 'body')   setTimeout(renderWeightChart, 100);
  if (name === 'spirit') renderSpiritPage();
}

// =============================================
// DATA LOADING
// =============================================
async function loadAllData() {
  try {
    const [prog, weights, wkLogs, logs] = await Promise.all([
      fetch(`${API}/progress`).then(r => r.json()),
      fetch(`${API}/weight`).then(r => r.json()),
      fetch(`${API}/workout-logs`).then(r => r.json()),
      fetch(`${API}/daily-logs`).then(r => r.json()),
    ]);
    progress      = prog   || {};
    weightData    = weights|| [];
    workoutLogs   = wkLogs || [];
    allDailyLogs  = Array.isArray(logs) ? logs : [];
    const today   = todayStr();
    dailyLog = allDailyLogs.find(l => l.date === today) || null;
    if (!weightData.length) {
      const seed = { date: today, weight: 83.9 };
      await saveToApi('/api/weight', seed);
      weightData = [seed];
    }
    updateNutritionBars(dailyLog);
    updateWeightStats();
    loadTodayWorkoutChecks();
  } catch(e) {
    console.warn('Backend unavailable — local mode');
    progress    = JSON.parse(localStorage.getItem('hprogress')     || '{}');
    weightData  = JSON.parse(localStorage.getItem('hweights')      || '[]');
    workoutLogs = JSON.parse(localStorage.getItem('hworkout_logs') || '[]');
    const logs  = JSON.parse(localStorage.getItem('hlogs')         || '[]');
    allDailyLogs  = Array.isArray(logs) ? logs : [];
    const today   = todayStr();
    dailyLog = allDailyLogs.find(l => l.date === today) || null;
    if (!weightData.length) {
      weightData = [{ date: today, weight: 83.9 }];
      localStorage.setItem('hweights', JSON.stringify(weightData));
    }
    updateNutritionBars(dailyLog);
    updateWeightStats();
    loadTodayWorkoutChecks();
  }
}

// Returns a local YYYY-MM-DD string (avoids UTC midnight offset bugs)
function localDateStr(d) {
  const dt = d || new Date();
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}
function todayStr() { return localDateStr(); }

// =============================================
// MIDNIGHT RESET
// =============================================
function scheduleMidnightReset() {
  const now = new Date();
  const closingDayStr = localDateStr(now); // capture current local date before the timeout fires
  const next = new Date(now);
  next.setHours(24, 0, 5, 0); // 00:00:05 next day
  const ms = next - now;
  setTimeout(async () => {
    // Auto-submit empty log for the closing day if no entry was made
    if (!allDailyLogs.find(l => l.date === closingDayStr)) {
      const lastWeight = getLastKnownWeight(closingDayStr);
      const emptyEntry = {
        date:     closingDayStr,
        weight:   lastWeight || 0,
        calories: 0, protein: 0, carbs: 0, fat: 0, water: 0,
        prayers:  { fajr: false, zuhr: false, asr: false, maghrib: false, isha: false },
        quran:    false,
      };
      await saveToApi('/api/daily-logs', emptyEntry);
      allDailyLogs.push(emptyEntry);
    }
    await loadAllData();
    renderTodayWorkout();
    renderSpiritPage();
    renderNextLessons();
    showToast('New day started — daily items reset');
    scheduleMidnightReset();
  }, ms);
}

// =============================================
// CLOCK & GREETING
// =============================================
function initClock() {
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function tick() {
    const now = new Date();
    document.getElementById('clockDisplay').textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    document.getElementById('dateLabel').textContent = days[now.getDay()].toUpperCase();
    document.getElementById('dateFull').textContent  = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    const h = now.getHours();
    let greet = 'Good Morning';
    if (h >= 12 && h < 17) greet = 'Good Afternoon';
    else if (h >= 17 && h < 21) greet = 'Good Evening';
    else if (h >= 21) greet = 'Good Night';
    document.getElementById('greetingTime').textContent = greet;
  }
  tick(); setInterval(tick, 1000);
}

// =============================================
// WEATHER
// =============================================
async function fetchWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=50.85&longitude=4.35&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh`;
    const data = await fetch(url).then(r => r.json());
    const c = data.current;
    document.getElementById('weatherTemp').textContent  = `${Math.round(c.temperature_2m)}°C`;
    document.getElementById('weatherHumid').textContent = c.relative_humidity_2m;
    document.getElementById('weatherWind').textContent  = Math.round(c.wind_speed_10m);
    const wmo = {0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',51:'Light drizzle',61:'Light rain',63:'Moderate rain',65:'Heavy rain',80:'Light showers',81:'Showers',95:'Thunderstorm'};
    document.getElementById('weatherDesc').textContent  = wmo[c.weather_code] || 'Variable';
  } catch { document.getElementById('weatherDesc').textContent = 'Unavailable'; }
}

// =============================================
// INSPIRATIONAL QUOTE
// =============================================
const FALLBACK_QUOTES = [
  { content: 'Discipline is doing what needs to be done, even when you don\'t want to.', author: 'Unknown' },
  { content: 'Every day is another chance to get stronger, to eat better, to live healthier.', author: 'Unknown' },
  { content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { content: 'The only bad workout is the one that didn\'t happen.', author: 'Unknown' },
  { content: 'Push yourself because no one else is going to do it for you.', author: 'Unknown' },
  { content: 'With hardship comes ease.', author: 'Quran 94:5' },
];

async function fetchQuote() {
  const el = document.getElementById('greetingQuote');
  if (!el) return;
  try {
    const data = await fetch('https://api.quotable.io/random?tags=motivational,inspirational').then(r => r.json());
    if (data.content) {
      el.innerHTML = `"${data.content}" <span class="quote-author">— ${data.author}</span>`;
      return;
    }
  } catch {}
  // Fallback
  const q = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  el.innerHTML = `"${q.content}" <span class="quote-author">— ${q.author}</span>`;
}

// =============================================
// NEXT LESSONS (home page panel)
// =============================================
function renderNextLessons() {
  const list = document.getElementById('nextLessonsList');
  if (!list) return;
  const items = [];

  // University subjects
  for (const subject of Object.keys(UNIVERSITY_DATA)) {
    const topics = UNIVERSITY_DATA[subject];
    let found = null;
    outer: for (const topic of Object.keys(topics)) {
      for (const item of topics[topic]) {
        if (!progress[`uni:${subject}:${item.name}`]?.completed) {
          found = { topic, item };
          break outer;
        }
      }
    }
    const shortName = subject.replace('Software Engineering','SW Eng').replace('Advanced AI','Adv. AI').replace('Data Engineering','Data Eng').replace('Data Management','Data Mgmt');
    items.push({
      label: shortName,
      icon: '◈',
      color: 'var(--purple2)',
      next: found ? found.item.name : null,
      sub: found ? found.topic : '✓ Complete',
    });
  }

  // ICT — first incomplete video
  for (const pl of Object.keys(ICT_DATA)) {
    const vid = ICT_DATA[pl].find(v => !progress[`ict:${pl}:${v.num}`]?.completed);
    if (vid) {
      items.push({ label: 'ICT', icon: '◆', color: 'var(--cyan)', next: vid.title, sub: pl });
      break;
    }
  }

  list.innerHTML = items.map(it => `
    <div class="next-lesson-item">
      <div class="next-lesson-label" style="color:${it.color}">${it.icon} ${it.label}</div>
      <div class="next-lesson-name">${it.next || '✓ All done'}</div>
      <div class="next-lesson-sub">${it.sub}</div>
    </div>
  `).join('');
}

// =============================================
// GLOBE (Three.js) — Organic Sentient Sphere
// =============================================
function initGlobe() {
  const canvas = document.getElementById('globe-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(340, 340);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.2;

  const vertexShader = `
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vViewPos;
    float hash(float n){return fract(sin(n)*43758.5453123);}
    float noise3(vec3 p){
      vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);
      float n=i.x+i.y*57.0+113.0*i.z;
      return mix(mix(mix(hash(n),hash(n+1.0),f.x),mix(hash(n+57.0),hash(n+58.0),f.x),f.y),
                 mix(mix(hash(n+113.0),hash(n+114.0),f.x),mix(hash(n+170.0),hash(n+171.0),f.x),f.y),f.z);
    }
    void main(){
      vNormal=normalize(normalMatrix*normal);
      float n1=noise3(position*1.8+vec3(time*.35,time*.28,time*.22));
      float n2=noise3(position*3.5-vec3(time*.18,time*.25,time*.30));
      float n3=noise3(position*6.0+vec3(time*.45,-time*.32,time*.15));
      float disp=(n1*.55+n2*.30+n3*.15-.5)*.14;
      vec3 disp3=position+normal*disp;
      vec4 mv=modelViewMatrix*vec4(disp3,1.0);
      vViewPos=-mv.xyz;
      gl_Position=projectionMatrix*mv;
    }
  `;
  const fragmentShader = `
    uniform float time;
    varying vec3 vNormal;
    varying vec3 vViewPos;
    void main(){
      vec3 vd=normalize(vViewPos);
      float fr=pow(1.0-clamp(dot(vNormal,vd),0.0,1.0),2.8);
      float sh=sin(time*.4)*.5+.5;
      vec3 cc=mix(vec3(.06,.02,.28),vec3(.02,.18,.38),sh);
      vec3 rc=mix(vec3(.55,.18,1.),vec3(.10,.75,1.),sh);
      float wv=sin(vNormal.y*7.+time*2.)*.5+.5;
      vec3 col=mix(cc,rc,fr)+rc*wv*fr*.35;
      float alpha=clamp(.12+fr*.65+wv*fr*.10,0.,0.92);
      gl_FragColor=vec4(col,alpha);
    }
  `;

  const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms:{ time:{ value:0 } }, transparent:true, side:THREE.DoubleSide, depthWrite:false });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 80, 80), mat);
  scene.add(sphere);

  const core = new THREE.Mesh(new THREE.SphereGeometry(0.92,32,32), new THREE.MeshBasicMaterial({ color:0x330066, transparent:true, opacity:0.18, side:THREE.BackSide }));
  scene.add(core);
  const wire = new THREE.Mesh(new THREE.SphereGeometry(1.02,22,22), new THREE.MeshBasicMaterial({ color:0x7c3aed, wireframe:true, transparent:true, opacity:0.07 }));
  scene.add(wire);

  const ring  = new THREE.Mesh(new THREE.RingGeometry(1.14,1.19,64), new THREE.MeshBasicMaterial({ color:0x9933ff, side:THREE.DoubleSide, transparent:true, opacity:0.38 }));
  ring.rotation.x = Math.PI / 2.4; scene.add(ring);
  const ring2 = new THREE.Mesh(new THREE.RingGeometry(1.23,1.26,64), new THREE.MeshBasicMaterial({ color:0x22d3ee, side:THREE.DoubleSide, transparent:true, opacity:0.20 }));
  ring2.rotation.x = Math.PI / 2.4; ring2.rotation.z = 0.3; scene.add(ring2);

  const positions = new Float32Array(280*3);
  for (let i=0;i<280;i++){const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),r=1.12+Math.random()*.45;positions[i*3]=r*Math.sin(ph)*Math.cos(th);positions[i*3+1]=r*Math.sin(ph)*Math.sin(th);positions[i*3+2]=r*Math.cos(ph);}
  const partGeo = new THREE.BufferGeometry(); partGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const parts = new THREE.Points(partGeo, new THREE.PointsMaterial({ color:0xbb66ff, size:0.013, transparent:true, opacity:0.65 }));
  scene.add(parts);

  scene.add(new THREE.AmbientLight(0x110033,1.2));
  const dl=new THREE.DirectionalLight(0xaa44ff,1.6); dl.position.set(3,3,3); scene.add(dl);
  const pl=new THREE.PointLight(0x22d3ee,1.0,7); pl.position.set(-2.5,1,2); scene.add(pl);

  let t=0;
  (function animate(){
    requestAnimationFrame(animate); t+=0.009;
    mat.uniforms.time.value=t;
    sphere.rotation.y+=0.0038+Math.sin(t*.27)*.0015;
    sphere.rotation.x=Math.sin(t*.41)*.06;
    wire.rotation.y=sphere.rotation.y*.65;
    parts.rotation.y+=0.0012; parts.rotation.x=Math.sin(t*.19)*.04;
    const br=1.0+Math.sin(t*.72)*.018+Math.sin(t*1.47)*.007;
    sphere.scale.setScalar(br); core.scale.setScalar(br*.96); wire.scale.setScalar(br*1.005);
    const fy=Math.sin(t*.58)*.09+Math.sin(t*1.15)*.035;
    const fx=Math.sin(t*.38)*.025;
    [sphere,core,wire,ring,ring2,parts].forEach(o=>{o.position.y=fy;o.position.x=fx;});
    renderer.render(scene,camera);
  })();
}

// =============================================
// PARTICLES
// =============================================
function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width = p.style.height = (Math.random() * 2 + 1) + 'px';
    p.style.animationDuration = (Math.random() * 15 + 10) + 's';
    p.style.animationDelay    = (Math.random() * 15) + 's';
    p.style.background = Math.random() > 0.5 ? 'var(--purple2)' : 'var(--cyan)';
    container.appendChild(p);
  }
}

// =============================================
// DAILY LOG MODAL
// =============================================
function openDailyModal() {
  const today = todayStr();
  document.getElementById('modalDateInput').value = today;
  loadLogForDate(today);
  document.getElementById('dailyModal').classList.add('open');
}

function closeModal() {
  document.getElementById('dailyModal').classList.remove('open');
}

function onModalDateChange(dateStr) {
  loadLogForDate(dateStr);
}

function loadLogForDate(dateStr) {
  const log = allDailyLogs.find(l => l.date === dateStr) || null;
  if (log) {
    document.getElementById('todayWeight').value = log.weight > 0 ? log.weight : '';
    document.getElementById('calories').value = log.calories || '';
    document.getElementById('protein').value  = log.protein  || '';
    document.getElementById('carbs').value    = log.carbs    || '';
    document.getElementById('fat').value      = log.fat      || '';
    document.getElementById('water').value    = log.water    || '';
    const pr = log.prayers || {};
    document.getElementById('pFajr').checked    = !!pr.fajr;
    document.getElementById('pZuhr').checked    = !!pr.zuhr;
    document.getElementById('pAsr').checked     = !!pr.asr;
    document.getElementById('pMaghrib').checked = !!pr.maghrib;
    document.getElementById('pIsha').checked    = !!pr.isha;
    document.getElementById('pQuran').checked   = !!log.quran;
  } else {
    // No entry for this date — pre-fill weight with last known, leave rest blank
    const lastW = getLastKnownWeight(dateStr);
    document.getElementById('todayWeight').value = lastW != null ? lastW : '';
    document.getElementById('calories').value = '';
    document.getElementById('protein').value  = '';
    document.getElementById('carbs').value    = '';
    document.getElementById('fat').value      = '';
    document.getElementById('water').value    = '';
    document.getElementById('pFajr').checked    = false;
    document.getElementById('pZuhr').checked    = false;
    document.getElementById('pAsr').checked     = false;
    document.getElementById('pMaghrib').checked = false;
    document.getElementById('pIsha').checked    = false;
    document.getElementById('pQuran').checked   = false;
  }
}

function getLastKnownWeight(beforeDateStr) {
  const candidates = weightData.filter(w => w.date <= beforeDateStr)
                               .sort((a, b) => (a.date < b.date ? 1 : -1));
  return candidates.length ? candidates[0].weight : null;
}

async function submitDailyLog() {
  const dateStr    = document.getElementById('modalDateInput').value || todayStr();
  const weightVal  = parseFloat(document.getElementById('todayWeight').value);
  const weight     = (!weightVal || isNaN(weightVal))
    ? (getLastKnownWeight(dateStr) || 0)
    : +weightVal.toFixed(1);

  const prayers = {
    fajr:    document.getElementById('pFajr').checked,
    zuhr:    document.getElementById('pZuhr').checked,
    asr:     document.getElementById('pAsr').checked,
    maghrib: document.getElementById('pMaghrib').checked,
    isha:    document.getElementById('pIsha').checked,
  };
  const entry = {
    date:     dateStr,
    weight,
    calories: +document.getElementById('calories').value || 0,
    protein:  +document.getElementById('protein').value  || 0,
    carbs:    +document.getElementById('carbs').value    || 0,
    fat:      +document.getElementById('fat').value      || 0,
    water:    +parseFloat(document.getElementById('water').value || 0).toFixed(1),
    prayers,
    quran: document.getElementById('pQuran').checked,
  };

  await saveToApi('/api/daily-logs', entry);

  // Update in-memory allDailyLogs cache
  const logIdx = allDailyLogs.findIndex(l => l.date === dateStr);
  if (logIdx >= 0) allDailyLogs[logIdx] = entry; else allDailyLogs.push(entry);

  // Auto-log weight if provided
  if (entry.weight > 0) {
    const wEntry = { date: dateStr, weight: entry.weight };
    saveToApi('/api/weight', wEntry);
    const idx = weightData.findIndex(w => w.date === dateStr);
    if (idx >= 0) weightData[idx] = wEntry; else weightData.push(wEntry);
    weightData.sort((a, b) => (a.date < b.date ? -1 : 1));
    updateWeightStats();
    if (document.getElementById('body-page').classList.contains('active')) renderWeightChart();
  }

  // Update today's live state only when saving for today
  if (dateStr === todayStr()) {
    dailyLog = entry;
    updateNutritionBars(entry);
    renderSpiritPage();
  }

  closeModal();
  showToast('✓ Log saved');
}

// =============================================
// BODY PAGE
// =============================================
function updateNutritionBars(log) {
  if (!log) return;
  const goals = { calories:2500, protein:160, carbs:300, fat:80, water:3 };
  const v     = { calories: log.calories||0, protein: log.protein||0, carbs: log.carbs||0, fat: log.fat||0, water: log.water||0 };
  document.getElementById('calBar').style.width  = Math.min(100,(v.calories/goals.calories)*100)+'%';
  document.getElementById('protBar').style.width = Math.min(100,(v.protein/goals.protein)*100)+'%';
  document.getElementById('carbBar').style.width = Math.min(100,(v.carbs/goals.carbs)*100)+'%';
  document.getElementById('fatBar').style.width  = Math.min(100,(v.fat/goals.fat)*100)+'%';
  document.getElementById('waterBar').style.width= Math.min(100,(v.water/goals.water)*100)+'%';
  document.getElementById('calVal').textContent  = v.calories+' kcal';
  document.getElementById('protVal').textContent = v.protein+'g';
  document.getElementById('carbVal').textContent = v.carbs+'g';
  document.getElementById('fatVal').textContent  = v.fat+'g';
  document.getElementById('waterVal').textContent= v.water+'L';
}

function updateWeightStats() {
  if (!weightData.length) return;
  const curr  = weightData[weightData.length-1].weight;
  const start = weightData[0].weight;
  const delta = (curr - start).toFixed(1);
  document.getElementById('currentWeight').textContent = curr+' kg';
  document.getElementById('startWeight').textContent   = start+' kg';
  document.getElementById('weightDelta').textContent   = (delta>0?'+':'')+delta+' kg';
  const bmi = (curr/(1.76*1.76)).toFixed(1);
  const bmiEl = document.getElementById('bmiVal');
  const bmiCard = document.getElementById('bmiCard');
  if (bmiEl)   bmiEl.textContent   = bmi;
  if (bmiCard) bmiCard.textContent = bmi;
}

function renderWeightChart() {
  const canvas = document.getElementById('weightCanvas');
  if (!canvas) return;
  if (weightChart) { weightChart.destroy(); weightChart = null; }
  // Parse date string directly to avoid UTC→local timezone shift
  const labels = weightData.map(w => { const [,m,d] = w.date.split('-'); return `${+d}/${+m}`; });
  const values = weightData.map(w => w.weight);
  weightChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels.length ? labels : ['Start'],
      datasets: [{ label:'Weight (kg)', data: values.length ? values : [83.9],
        borderColor:'#a855f7', backgroundColor:'rgba(168,85,247,0.1)', borderWidth:2,
        pointBackgroundColor:'#7c3aed', pointBorderColor:'#a855f7', pointRadius:4, fill:true, tension:0.4 }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ display:false }, tooltip:{ backgroundColor:'#0d1428', borderColor:'#7c3aed', borderWidth:1, titleColor:'#a855f7', bodyColor:'#e2e8f0' } },
      scales:{
        x:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'#64748b', font:{ size:10 } } },
        y:{ grid:{ color:'rgba(255,255,255,0.05)' }, ticks:{ color:'#64748b', font:{ size:10 } } }
      }
    }
  });
}

// =============================================
// TODAY'S WORKOUT
// =============================================
function loadTodayWorkoutChecks() {
  const today = todayStr();
  const log = workoutLogs.find(w => w.date === today);
  todayWorkoutChecks = log ? (log.exercises || {}) : {};
}

function renderTodayWorkout() {
  const panel   = document.getElementById('todayWorkoutPanel');
  const title   = document.getElementById('todayWorkoutTitle');
  const content = document.getElementById('todayWorkoutContent');
  if (!panel || !content) return;

  const today = todayStr();
  const dayIdx = new Date().getDay(); // 0=Sun
  const plan   = WORKOUT_PLAN[dayIdx];

  if (!plan) {
    title.textContent = 'Today — Rest Day';
    content.innerHTML = `<div class="rest-day-msg">No workout scheduled today. Recover and recharge.</div>`;
    return;
  }

  title.textContent = `Today — ${plan.name}`;
  const doneCnt = plan.exercises.filter(ex => todayWorkoutChecks[ex.id]).length;

  content.innerHTML = `
    <div class="workout-meta">
      <span class="workout-muscles">${plan.muscles}</span>
      <span class="workout-duration">${plan.duration}</span>
      <span class="workout-progress-pill">${doneCnt}/${plan.exercises.length}</span>
    </div>
    <div class="exercise-list">
      ${plan.exercises.map(ex => {
        const done = !!todayWorkoutChecks[ex.id];
        return `
          <div class="exercise-item ${done ? 'done' : ''}" onclick="toggleExercise('${ex.id}', this)">
            <div class="exercise-check"></div>
            <div class="exercise-info">
              <div class="exercise-name">${ex.name}</div>
              <div class="exercise-meta">${ex.sets} · ${ex.eq} · rest ${ex.rest}</div>
            </div>
          </div>`;
      }).join('')}
    </div>
    <button class="submit-workout-btn" onclick="submitWorkoutLog()">⬡ Submit Workout</button>
  `;
}

function toggleExercise(id, el) {
  todayWorkoutChecks[id] = !todayWorkoutChecks[id];
  el.classList.toggle('done', todayWorkoutChecks[id]);
  // update pill count
  const dayIdx = new Date().getDay();
  const plan   = WORKOUT_PLAN[dayIdx];
  if (plan) {
    const done = plan.exercises.filter(ex => todayWorkoutChecks[ex.id]).length;
    const pill = document.querySelector('.workout-progress-pill');
    if (pill) pill.textContent = `${done}/${plan.exercises.length}`;
  }
}

async function submitWorkoutLog() {
  const dayIdx = new Date().getDay();
  const plan   = WORKOUT_PLAN[dayIdx];
  if (!plan) return;
  const today = todayStr();
  const entry = { date: today, day_name: plan.name, exercises: { ...todayWorkoutChecks } };
  await saveToApi('/api/workout-logs', entry);
  // update local cache
  const idx = workoutLogs.findIndex(w => w.date === today);
  if (idx >= 0) workoutLogs[idx] = entry; else workoutLogs.push(entry);
  renderWorkoutHeatmap();
  showToast('✓ Workout saved');
}

// =============================================
// WORKOUT CONTRIBUTION HEATMAP
// =============================================
function renderWorkoutHeatmap() {
  const container = document.getElementById('contributionGraph');
  if (!container) return;

  // Build 26 weeks × 7 days grid (last 6 months)
  const today    = new Date(); today.setHours(0,0,0,0);
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - (26 * 7 - 1));

  const cells = [];
  for (let i = 0; i < 26 * 7; i++) {
    const d = new Date(startDay); d.setDate(startDay.getDate() + i);
    const ds = localDateStr(d);
    const dow = d.getDay(); // 0=Sun
    const planned = !!WORKOUT_PLAN[dow];
    const log = workoutLogs.find(w => w.date === ds);
    let cls = 'hm-cell';
    if (!planned) cls += ' hm-rest';
    else if (!log) cls += ' hm-future'; // neutral for all unlogged days (past or future)
    else {
      const plan = WORKOUT_PLAN[dow];
      const total = plan ? plan.exercises.length : 1;
      const done  = Object.values(log.exercises||{}).filter(Boolean).length;
      const pct   = done / total;
      cls += pct >= 0.9 ? ' hm-full' : pct >= 0.5 ? ' hm-partial' : ' hm-missed';
    }
    cells.push(`<div class="${cls}" title="${ds}"></div>`);
  }

  // Wrap in week columns
  let html = '<div class="hm-grid">';
  for (let w = 0; w < 26; w++) {
    html += '<div class="hm-col">';
    for (let d = 0; d < 7; d++) html += cells[w * 7 + d];
    html += '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

// =============================================
// SPIRIT PAGE
// =============================================
const PRAYERS = [
  { id: 'fajr',    label: 'Fajr',    time: 'Pre-Dawn' },
  { id: 'zuhr',    label: 'Zuhr',    time: 'Midday'   },
  { id: 'asr',     label: 'Asr',     time: 'Afternoon'},
  { id: 'maghrib', label: 'Maghrib', time: 'Sunset'   },
  { id: 'isha',    label: 'Isha',    time: 'Night'    },
];

function renderSpiritPage() {
  renderPrayersGrid();
  renderQuranCard();
  renderSpiritSummary();
  renderPrayerHeatmap();
}

function renderPrayersGrid() {
  const grid = document.getElementById('prayersGrid');
  if (!grid) return;
  const pr = dailyLog?.prayers || {};
  grid.innerHTML = PRAYERS.map(p => `
    <div class="prayer-card ${pr[p.id] ? 'prayed' : ''}">
      <div class="prayer-check">${pr[p.id] ? '✓' : ''}</div>
      <div class="prayer-name">${p.label}</div>
      <div class="prayer-time">${p.time}</div>
    </div>
  `).join('');
}

function renderQuranCard() {
  const card = document.getElementById('quranCard');
  if (!card) return;
  const done = dailyLog?.quran || false;
  card.innerHTML = `
    <div class="quran-task-item ${done ? 'done' : ''}">
      <div class="exercise-check"></div>
      <div class="exercise-info">
        <div class="exercise-name">Read 1 page of the Quran</div>
        <div class="exercise-meta">Daily dhikr — consistency over quantity</div>
      </div>
    </div>
  `;
}

function renderSpiritSummary() {
  const el = document.getElementById('spiritSummary');
  if (!el) return;
  const pr = dailyLog?.prayers || {};
  const prayedCount = PRAYERS.filter(p => pr[p.id]).length;
  const quranDone   = dailyLog?.quran || false;
  const total = 6;
  const done  = prayedCount + (quranDone ? 1 : 0);
  const pct   = Math.round((done / total) * 100);
  el.innerHTML = `
    <div class="spirit-stat">
      <div class="spirit-stat-val" style="color:var(--purple2)">${prayedCount}/5</div>
      <div class="spirit-stat-label">Prayers Today</div>
    </div>
    <div class="spirit-stat">
      <div class="spirit-stat-val" style="color:var(--cyan)">${quranDone ? '✓' : '○'}</div>
      <div class="spirit-stat-label">Quran</div>
    </div>
    <div class="spirit-stat">
      <div class="spirit-stat-val" style="color:var(--success)">${pct}%</div>
      <div class="spirit-stat-label">Completion</div>
    </div>
  `;
}

function renderPrayerHeatmap() {
  const container = document.getElementById('prayerHeatmap');
  if (!container) return;
  if (prayerView === 'year') {
    renderYearlyPrayerView(container);
  } else {
    const monthKey = prayerView.replace('month:', '');
    renderMonthlyPrayerView(container, monthKey);
  }
  loadAllLogsForHeatmap();
}

function renderYearlyPrayerView(container) {
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let html = '<div class="ph-year-grid">';
  for (let m = 0; m < 12; m++) {
    const ym = `${now.getFullYear()}-${String(m+1).padStart(2,'0')}`;
    const isCurrent = m === now.getMonth();
    html += `<div class="ph-month-box${isCurrent ? ' ph-month-current' : ''}" id="phm-${ym}"
               onclick="drillIntoMonth('${ym}')" title="${months[m]} ${now.getFullYear()}">
               <div class="ph-month-label">${months[m]}</div>
             </div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

function renderMonthlyPrayerView(container, yearMonth) {
  const [yr, mo] = yearMonth.split('-').map(Number);
  const daysInMonth = new Date(yr, mo, 0).getDate();
  const monthName = new Date(yr, mo - 1, 1).toLocaleDateString('en', { month: 'long', year: 'numeric' });
  let html = `
    <div class="ph-month-header">
      <button class="ph-back-btn" onclick="returnToYearView()">← Year</button>
      <span class="ph-month-title">${monthName}</span>
    </div>
    <div class="ph-day-labels-row">${['S','M','T','W','T','F','S'].map(d=>`<div class="ph-weekday">${d}</div>`).join('')}</div>
  `;
  // Offset first day of month
  const firstDow = new Date(yr, mo - 1, 1).getDay();
  html += '<div class="ph-month-grid">';
  for (let i = 0; i < firstDow; i++) html += '<div class="ph-day-box ph-day-empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${yr}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    html += `<div class="ph-day-box" id="phc-${ds}" title="${ds}"><div class="ph-day-num">${d}</div></div>`;
  }
  html += '</div>';
  container.innerHTML = html;
}

function drillIntoMonth(monthKey) {
  prayerView = `month:${monthKey}`;
  renderPrayerHeatmap();
}

function returnToYearView() {
  prayerView = 'year';
  renderPrayerHeatmap();
}

function loadAllLogsForHeatmap() {
  const logs = allDailyLogs;
  if (prayerView === 'year') {
    // Aggregate per month: avg prayers per logged day
    const monthData = {};
    for (const log of logs) {
      const ym = log.date.substring(0, 7);
      if (!monthData[ym]) monthData[ym] = { total: 0, sum: 0 };
      const pr = log.prayers || {};
      const count = PRAYERS.filter(p => pr[p.id]).length + (log.quran ? 1 : 0);
      monthData[ym].total++;
      monthData[ym].sum += count;
    }
    for (const [ym, data] of Object.entries(monthData)) {
      const box = document.getElementById(`phm-${ym}`);
      if (!box) continue;
      const avg = data.total ? data.sum / data.total : 0;
      box.classList.remove('ph-none','ph-low','ph-high','ph-full');
      if      (avg >= 5) box.classList.add('ph-full');
      else if (avg >= 3) box.classList.add('ph-high');
      else if (avg >= 1) box.classList.add('ph-low');
      else               box.classList.add('ph-none');
    }
  } else {
    // Color individual day boxes
    for (const log of logs) {
      const cell = document.getElementById(`phc-${log.date}`);
      if (!cell) continue;
      const pr    = log.prayers || {};
      const count = PRAYERS.filter(p => pr[p.id]).length + (log.quran ? 1 : 0);
      cell.classList.remove('ph-none','ph-low','ph-high','ph-full');
      if      (count >= 5) cell.classList.add('ph-full');
      else if (count >= 3) cell.classList.add('ph-high');
      else if (count >= 1) cell.classList.add('ph-low');
      else                 cell.classList.add('ph-none');
    }
  }
}

async function togglePrayer(id, cardEl) {
  if (!dailyLog) dailyLog = { date: todayStr(), prayers: {}, quran: false };
  if (!dailyLog.prayers) dailyLog.prayers = {};
  dailyLog.prayers[id] = !dailyLog.prayers[id];
  const done = dailyLog.prayers[id];
  cardEl.classList.toggle('prayed', done);
  cardEl.querySelector('.prayer-check').textContent = done ? '✓' : '';
  renderSpiritSummary();
  saveToApi('/api/daily-logs', dailyLog);
}

async function toggleQuran(el) {
  if (!dailyLog) dailyLog = { date: todayStr(), prayers: {}, quran: false };
  dailyLog.quran = !dailyLog.quran;
  el.classList.toggle('done', dailyLog.quran);
  renderSpiritSummary();
  saveToApi('/api/daily-logs', dailyLog);
}

// =============================================
// UNIVERSITY PAGE
// =============================================
function renderUniversity() {
  const subjects    = Object.keys(UNIVERSITY_DATA);
  const tabsEl      = document.getElementById('subjectTabs');
  const contentsEl  = document.getElementById('subjectContents');

  tabsEl.innerHTML = subjects.map((s,i) => `
    <button class="subject-tab ${i===0?'active':''}" onclick="switchSubject('${s}',this)">${s}</button>
  `).join('');

  contentsEl.innerHTML = subjects.map((s,i) => {
    const topicsData = UNIVERSITY_DATA[s];
    const topics     = Object.keys(topicsData);
    const allItems   = topics.flatMap(t => topicsData[t]);
    const total      = allItems.length;
    const done       = allItems.filter(item => progress[`uni:${s}:${item.name}`]?.completed).length;
    const pct        = total ? Math.round((done/total)*100) : 0;
    const circ       = 2 * Math.PI * 30;
    const offset     = circ - (pct/100)*circ;

    return `
      <div class="subject-content ${i===0?'active':''}" id="subject-${s.replace(/\s+/g,'_')}">
        <div class="subject-header">
          <div class="subject-prog-circle">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="6" cx="40" cy="40" r="30"/>
              <circle fill="none" stroke="var(--purple2)" stroke-width="6" cx="40" cy="40" r="30"
                stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
                stroke-linecap="round" style="transition:stroke-dashoffset 0.5s ease"/>
            </svg>
            <div class="prog-text">
              <span class="prog-pct">${pct}%</span>
              <span class="prog-count">${done}/${total}</span>
            </div>
          </div>
          <div>
            <div style="font-family:'Orbitron',monospace;font-size:1.2rem;font-weight:700;color:var(--text)">${s}</div>
            <div style="font-size:0.8rem;color:var(--text3);margin-top:0.3rem">${topics.length} topics · ${total} items</div>
          </div>
        </div>
        <div class="topics-grid">
          ${topics.map(topic => {
            const items     = topicsData[topic];
            const topicDone = items.filter(item => progress[`uni:${s}:${item.name}`]?.completed).length;
            return `
              <div class="topic-section">
                <div class="topic-header" onclick="toggleTopic(this)">
                  <div class="topic-name">${topic}</div>
                  <div class="topic-count">${topicDone}/${items.length}</div>
                  <span style="color:var(--text3);font-size:0.8rem">▾</span>
                </div>
                <div class="topic-items">
                  ${items.map(item => {
                    const key  = `uni:${s}:${item.name}`;
                    const done = progress[key]?.completed;
                    return `
                      <div class="topic-item ${done?'done':''}" onclick="toggleProgress('${key}',this,'${s}')">
                        <div class="item-check"></div>
                        <span class="item-name">${item.name}</span>
                        <span class="item-type type-${item.type.toLowerCase()}">${item.type}</span>
                      </div>`;
                  }).join('')}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');
}

function switchSubject(name, btn) {
  document.querySelectorAll('.subject-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.subject-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(`subject-${name.replace(/\s+/g,'_')}`);
  if (el) el.classList.add('active');
}

function toggleTopic(header) {
  const items = header.nextElementSibling;
  items.style.display = items.style.display === 'none' ? '' : 'none';
  header.querySelector('span:last-child').textContent = items.style.display === 'none' ? '▸' : '▾';
}

function toggleProgress(key, el, subject) {
  const newVal = !(progress[key]?.completed || false);
  progress[key] = { completed: newVal };
  el.classList.toggle('done', newVal);

  const topicSection = el.closest('.topic-section');
  if (topicSection) {
    const all  = topicSection.querySelectorAll('.topic-item');
    const done = topicSection.querySelectorAll('.topic-item.done').length;
    const ctr  = topicSection.querySelector('.topic-count');
    if (ctr) ctr.textContent = `${done}/${all.length}`;
  }
  updateSubjectProgress(subject);
  saveToApi(`/api/progress/${encodeURIComponent(key)}`, { completed: newVal });
}

function updateSubjectProgress(subject) {
  const topicsData = UNIVERSITY_DATA[subject];
  const allItems   = Object.values(topicsData).flat();
  const total      = allItems.length;
  const done       = allItems.filter(item => progress[`uni:${subject}:${item.name}`]?.completed).length;
  const pct        = total ? Math.round((done/total)*100) : 0;
  const contentEl  = document.getElementById(`subject-${subject.replace(/\s+/g,'_')}`);
  if (!contentEl) return;
  const circle  = contentEl.querySelector('circle:last-child');
  const pctEl   = contentEl.querySelector('.prog-pct');
  const countEl = contentEl.querySelector('.prog-count');
  if (circle) { const circ=2*Math.PI*30; circle.setAttribute('stroke-dashoffset', circ-(pct/100)*circ); }
  if (pctEl)   pctEl.textContent   = pct+'%';
  if (countEl) countEl.textContent = `${done}/${total}`;
}

// =============================================
// WEALTH / ICT PAGE
// =============================================
function renderWealth() {
  const playlists  = Object.keys(ICT_DATA);
  const sidebar    = document.getElementById('playlistSidebar');
  const totalVids  = playlists.reduce((s,pl) => s + ICT_DATA[pl].length, 0);
  const doneVids   = playlists.reduce((s,pl) => s + ICT_DATA[pl].filter(v => progress[`ict:${pl}:${v.num}`]?.completed).length, 0);
  document.getElementById('ictPctDisplay').textContent = totalVids ? Math.round(doneVids/totalVids*100)+'%' : '0%';

  sidebar.innerHTML = playlists.map((pl,i) => {
    const videos = ICT_DATA[pl];
    const done   = videos.filter(v => progress[`ict:${pl}:${v.num}`]?.completed).length;
    const pct    = videos.length ? Math.round(done/videos.length*100) : 0;
    return `
      <div class="playlist-item" onclick="selectPlaylist('${pl.replace(/'/g,"\\'")}',this)" id="pl-${i}">
        <div class="playlist-name">${pl}</div>
        <div class="playlist-meta">
          <span class="playlist-count">${done}/${videos.length} videos</span>
          <div class="playlist-prog"><div class="playlist-prog-fill" style="width:${pct}%"></div></div>
        </div>
      </div>`;
  }).join('');
}

function selectPlaylist(pl, el) {
  document.querySelectorAll('.playlist-item').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  activePlaylist = pl;
  renderVideos(pl);
}

function renderVideos(pl) {
  const videos = ICT_DATA[pl];
  const done   = videos.filter(v => progress[`ict:${pl}:${v.num}`]?.completed).length;
  document.getElementById('videosPanel').innerHTML = `
    <div class="playlist-title-bar">
      <div class="playlist-title-text">${pl}</div>
      <div class="playlist-stats">${done}/${videos.length} completed</div>
    </div>
    ${videos.map(v => {
      const key      = `ict:${pl}:${v.num}`;
      const isDone   = progress[key]?.completed;
      const hasNotes = progress[key]?.notes;
      const plEsc    = pl.replace(/'/g,"\\'");
      return `
        <div class="video-item ${isDone?'done':''}" id="video-${key.replace(/[^a-zA-Z0-9]/g,'_')}">
          <div class="video-num">${v.num}</div>
          <div class="video-title video-title-clickable" onclick="openNotes('${plEsc}','${v.num}')">${v.title}${hasNotes?' 📝':''}</div>
          <div class="video-duration">${v.duration}</div>
          <div class="video-check" onclick="toggleVideoProgress('${plEsc}','${v.num}',this.closest('.video-item'))"></div>
        </div>`;
    }).join('')}
  `;
}

function toggleVideoProgress(pl, num, el) {
  const key    = `ict:${pl}:${num}`;
  const current= progress[key]?.completed || false;
  const notes  = progress[key]?.notes || '';
  const newVal = !current;
  progress[key] = { completed: newVal, notes };
  el.classList.toggle('done', newVal);
  renderWealthCounts(pl);
  saveToApi(`/api/progress/${encodeURIComponent(key)}`, { completed: newVal, notes });
}

function renderWealthCounts(pl) {
  const playlists = Object.keys(ICT_DATA);
  const plIdx     = playlists.indexOf(pl);
  if (plIdx >= 0) {
    const plEl = document.getElementById(`pl-${plIdx}`);
    if (plEl) {
      const vids = ICT_DATA[pl];
      const done = vids.filter(v => progress[`ict:${pl}:${v.num}`]?.completed).length;
      const pct  = vids.length ? Math.round(done/vids.length*100) : 0;
      plEl.querySelector('.playlist-count').textContent      = `${done}/${vids.length} videos`;
      plEl.querySelector('.playlist-prog-fill').style.width  = pct+'%';
    }
  }
  const totalVids = playlists.reduce((s,p) => s+ICT_DATA[p].length, 0);
  const doneVids  = playlists.reduce((s,p) => s+ICT_DATA[p].filter(v => progress[`ict:${p}:${v.num}`]?.completed).length, 0);
  document.getElementById('ictPctDisplay').textContent = totalVids ? Math.round(doneVids/totalVids*100)+'%' : '0%';
}

function openNotes(pl, num) {
  const key   = `ict:${pl}:${num}`;
  currentNoteKey = key;
  const video = ICT_DATA[pl].find(v => v.num === num);
  document.getElementById('notesVideoTitle').textContent = video ? video.title : 'Notes';
  document.getElementById('notesTextarea').value         = progress[key]?.notes || '';
  document.getElementById('notesSidebar').classList.add('open');
}

function closeNotes() {
  document.getElementById('notesSidebar').classList.remove('open');
}

async function saveNotes() {
  if (!currentNoteKey) return;
  const notes = document.getElementById('notesTextarea').value;
  progress[currentNoteKey] = { ...(progress[currentNoteKey]||{}), notes };
  await saveToApi(`/api/progress/${encodeURIComponent(currentNoteKey)}`, progress[currentNoteKey]);
  closeNotes();
  if (activePlaylist) renderVideos(activePlaylist);
  showToast('✓ Notes saved');
}

// =============================================
// API / STORAGE HELPERS
// =============================================
async function saveToApi(path, data) {
  try {
    await fetch(`http://localhost:3000${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // localStorage fallback
    if (path.startsWith('/api/progress/')) {
      const stored = JSON.parse(localStorage.getItem('hprogress') || '{}');
      stored[decodeURIComponent(path.split('/').pop())] = data;
      localStorage.setItem('hprogress', JSON.stringify(stored));
      progress = stored;
    } else if (path === '/api/daily-logs') {
      const arr = JSON.parse(localStorage.getItem('hlogs') || '[]');
      const idx = arr.findIndex(i => i.date === data.date);
      if (idx >= 0) arr[idx] = data; else arr.push(data);
      localStorage.setItem('hlogs', JSON.stringify(arr));
    } else if (path === '/api/weight') {
      const arr = JSON.parse(localStorage.getItem('hweights') || '[]');
      const idx = arr.findIndex(i => i.date === data.date);
      if (idx >= 0) arr[idx] = data; else arr.push(data);
      localStorage.setItem('hweights', JSON.stringify(arr));
    } else if (path === '/api/workout-logs') {
      const arr = JSON.parse(localStorage.getItem('hworkout_logs') || '[]');
      const idx = arr.findIndex(i => i.date === data.date);
      if (idx >= 0) arr[idx] = data; else arr.push(data);
      localStorage.setItem('hworkout_logs', JSON.stringify(arr));
    }
  }
}

// =============================================
// TOAST
// =============================================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
