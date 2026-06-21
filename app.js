const { useState, useEffect, useMemo, useRef } = React;

// ---------- static content ----------

const TASKS = [
  {
    id: "handbook",
    title: "Read the FAA Glider Flying Handbook",
    note: "The free book everything is built on. Start with how gliders fly, the parts, and basic aerodynamics.",
    link: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/glider_handbook",
    linkLabel: "Open the handbook",
  },
  {
    id: "iacra",
    title: "Register for IACRA and save your FTN",
    note: "You can do this part on your own. You are already old enough for the student certificate at 14.",
    link: "https://iacra.faa.gov",
    linkLabel: "Go to IACRA",
  },
  {
    id: "studytool",
    title: "Start a written exam study tool",
    note: "Pick one and begin logging practice scores in the Written Exam tracker below.",
    link: "https://gliderpilotsgroundschool.com",
    linkLabel: "See study options",
  },
  {
    id: "sgs",
    title: "Memorize the SGS 2-33 airspeeds and limits",
    note: "The Schweizer 2-33 is the trainer you will fly. Walk in already knowing your aircraft.",
    link: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/glider_handbook",
    linkLabel: "Reference material",
  },
  {
    id: "ssa",
    title: "Join the SSA youth membership",
    note: "45 dollars per year. Unlocks scholarships, the magazine, and training videos.",
    link: "https://www.ssa.org",
    linkLabel: "Join the SSA",
  },
  {
    id: "skyvector",
    title: "Learn Denver area airspace on SkyVector",
    note: "Get comfortable with the airspace and chart symbols you will need for your cross country plan.",
    link: "https://skyvector.com",
    linkLabel: "Open SkyVector",
  },
];

const CHANNELS = [
  { name: "Chess In The Air", desc: "Technical cross country soaring out of Boulder, close to home." },
  { name: "Stefan Langer", desc: "German pilot. Cross country, contests, new gliders, and glider camping." },
  { name: "Ben Hirashima", desc: "Technical cross country soaring out of California." },
  { name: "Balleka", desc: "Fun cross country soaring out of the UK." },
  { name: "Flying Simon", desc: "Short fun vlogs about cross country soaring. Helps run WeGlide." },
  { name: "Juliet Sierra", desc: "German pilot sharing unique flights around the world." },
  { name: "Pure Glide", desc: "Tim from New Zealand. Instructional videos plus accident analysis." },
  { name: "Soaring Society of Boulder", desc: "Great local instructional resource." },
  { name: "SoaringSafety", desc: "The safety foundation channel. Demos of key maneuvers." },
  { name: "Bill Palmer", desc: "Warner Springs instructor. Built for new students." },
];

const FUN = [
  { name: "Condor 2 soaring simulator", desc: "The sim real pilots train on. Practice thermalling from your desk.", link: "https://www.condorsoaring.com" },
  { name: "Microsoft Flight Simulator", desc: "Has gliders and real terrain. Great for getting the feel.", link: "https://www.flightsimulator.com" },
  { name: "WeGlide", desc: "Watch real flights replayed in 3D with photos and GPS tracks.", link: "https://www.weglide.org" },
  { name: "OnlineContest (OLC)", desc: "Browse flight traces and competitions from pilots worldwide.", link: "https://www.onlinecontest.org" },
  { name: "r/gliding", desc: "The soaring community. Questions, stories, and gear talk.", link: "https://www.reddit.com/r/gliding" },
  { name: "Chess in the Air blog", desc: "Deep cross country writing from a Boulder pilot.", link: "https://chessintheair.com" },
];

const MILESTONES = [
  { title: "Student pilot certificate", meta: "Eligible now at 14", state: "now" },
  { title: "Ground study and written exam", meta: "Do this while you wait", state: "focus" },
  { title: "First solo", meta: "Allowed before you turn 16", state: "next" },
  { title: "Private glider license", meta: "Requires age 16 · January 2028", state: "locked" },
];

const POWERED_TASKS = [
  {
    id: "airplane-handbook",
    title: "Read the FAA Airplane Flying Handbook",
    note: "This handbook covers basic airplane aerodynamics, systems, and safe flying techniques.",
    link: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_flying_handbook",
    linkLabel: "Open the handbook",
  },
  {
    id: "medical",
    title: "Schedule a medical exam or BasicMed appointment",
    note: "A valid FAA medical or BasicMed is required before you can solo in an airplane.",
    link: "https://www.faa.gov/pilots/medical",
    linkLabel: "Check medical options",
  },
  {
    id: "iacra-airplane",
    title: "Register for IACRA and save your FTN",
    note: "Create your FAA profile and prepare for your student pilot certificate application.",
    link: "https://iacra.faa.gov",
    linkLabel: "Go to IACRA",
  },
  {
    id: "groundschool",
    title: "Start a PPL ground school course",
    note: "Ground school is the fastest way to build the knowledge you need for the written exam.",
    link: "https://www.faasafety.gov",
    linkLabel: "Browse FAA safety courses",
  },
  {
    id: "vspeeds",
    title: "Memorize airplane V-speeds and limits",
    note: "Know the important airspeeds for takeoff, landing, and emergencies before your first flight.",
    link: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_flying_handbook",
    linkLabel: "Review V-speeds",
  },
  {
    id: "sectional",
    title: "Study sectional charts and local airspace",
    note: "You need to be comfortable with controlled airspace, airports, and navigation before cross-country flights.",
    link: "https://skyvector.com",
    linkLabel: "Open SkyVector",
  },
];

const POWERED_CHANNELS = [
  { name: "FlightChops", desc: "Reality-based training flights, mistakes, and real-world airplane flying." },
  { name: "Captain Joe", desc: "Calm airplane tutorials, trip reports, and real IFR planning." },
  { name: "MZeroA Flight Training", desc: "Step-by-step private pilot training and exam prep." },
  { name: "Pilot Workshops", desc: "Practical instruction on maneuvers, landings, and weather." },
  { name: "Nerdbird", desc: "Flight training content with an emphasis on proficiency and safe habits." },
  { name: "Just Plane English", desc: "Big-picture airplane flying and transition training videos." },
  { name: "Airplane GEEKs", desc: "A pilot community focused on learning and inspiration." },
  { name: "Steveo1kinevo", desc: "Utility flying, plane camping, and real pilot stories." },
  { name: "The Finer Points", desc: "Detailed training maneuvers and airplane skill-building." },
  { name: "FlyWithLukas", desc: "Clean, modern airplane training and flight planning videos." },
];

const POWERED_FUN = [
  { name: "X-Plane 12", desc: "A high-fidelity airplane simulator for practicing procedures and navigation.", link: "https://www.x-plane.com" },
  { name: "Microsoft Flight Simulator", desc: "Fly real airports and terrain in a highly polished sim.", link: "https://www.flightsimulator.com" },
  { name: "ForeFlight", desc: "Study flight planning tools and weather briefing workflows.", link: "https://www.foreflight.com" },
  { name: "AOPA Air Safety Institute", desc: "Free safety courses and scenario-based training.", link: "https://www.aopa.org/safety" },
  { name: "Redbird Flight", desc: "Simulator training resources used by real flight schools.", link: "https://redbirdflight.com" },
  { name: "PilotWorkshops", desc: "Short lessons on real-world instrument and cross-country flying.", link: "https://www.pilotworkshops.com" },
];

const POWERED_MILESTONES = [
  { title: "Student pilot certificate", meta: "Eligible now at 16", state: "now" },
  { title: "Ground school and written exam", meta: "Study while you train", state: "focus" },
  { title: "First solo", meta: "Solo after your instructor signs you off", state: "next" },
  { title: "Private pilot checkride", meta: "Ready when you meet FAA requirements", state: "locked" },
];

const POWERED_BUDGET_GOAL = 12000;
const poweredYtSearch = (name) =>
  "https://www.youtube.com/results?search_query=" + encodeURIComponent(name + " powered flight");

const GLIDER_RESOURCES = [
  {
    name: "Glider Pilots Ground School",
    meta: "Book and live course · about 30 dollars",
    link: "https://gliderpilotsgroundschool.com",
  },
  {
    name: "Dauntless GroundSchool",
    meta: "App, covers PGL · about 60 to 70 dollars",
    link: "https://apps.apple.com/us/app/faa-private-pilot-prep/id552933297",
  },
  {
    name: "Schedule the real test",
    meta: "faa.psiexams.com · when you are ready",
    link: "https://faa.psiexams.com",
  },
];

const POWERED_RESOURCES = [
  {
    name: "Sporty's Pilot Shop",
    meta: "PPL training materials, videos, and prep books.",
    link: "https://www.sportys.com",
  },
  {
    name: "King Schools",
    meta: "FAA test prep and pilot training courses for airplane certificates.",
    link: "https://www.kingschools.com",
  },
  {
    name: "FAA Airman Certification Standards",
    meta: "Study the checkride standards for Private Pilot Airplane.",
    link: "https://www.faa.gov/training_testing/testing/acs/",
  },
];

const BUDGET_GOAL = 6000;
const ytSearch = (name) =>
  "https://www.youtube.com/results?search_query=" + encodeURIComponent(name + " glider soaring");

function bezier(t, p0, p1, p2) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}
function bezierAngle(t, p0, p1, p2) {
  const mt = 1 - t;
  const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function FlightPath({ pct }) {
  const P0 = { x: 18, y: 158 };
  const P1 = { x: 150, y: 150 };
  const P2 = { x: 302, y: 30 };
  const t = Math.max(0, Math.min(1, pct / 100));

  const n = 60;
  const fullPts = [];
  for (let i = 0; i <= n; i++) fullPts.push(bezier(i / n, P0, P1, P2));
  const done = [];
  for (let i = 0; i <= n; i++) done.push(bezier((i / n) * t, P0, P1, P2));
  const plane = bezier(t, P0, P1, P2);
  const ang = bezierAngle(t, P0, P1, P2);

  const toStr = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 320 180" className="flightsvg" role="img" aria-label="Your climb toward the license">
      <defs>
        <linearGradient id="lift" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#44d07b" />
          <stop offset="1" stopColor="#ffb454" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="14" x2="306" y1={40 + i * 36} y2={40 + i * 36} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}

      <polyline points={toStr(fullPts)} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
      <polyline points={toStr(done)} fill="none" stroke="url(#lift)" strokeWidth="3.4" strokeLinecap="round" />

      <circle cx={P0.x} cy={P0.y} r="3" fill="#8da2b8" />
      <circle cx={P2.x} cy={P2.y} r="4" fill={t >= 1 ? "#44d07b" : "rgba(255,180,84,0.5)"} />

      <g transform={`translate(${plane.x} ${plane.y}) rotate(${ang})`} filter="url(#glow)" className="glider">
        <ellipse cx="0" cy="0" rx="11" ry="1.9" fill="#eaf1f8" />
        <path d="M 3 0 L -9 -11 M 3 0 L -9 11" stroke="#eaf1f8" strokeWidth="2" strokeLinecap="round" />
        <path d="M -9 0 L -12 -4 M -9 0 L -12 4" stroke="#ffb454" strokeWidth="2" strokeLinecap="round" />
        <circle cx="9" cy="0" r="1.6" fill="#ffb454" />
      </g>
    </svg>
  );
}

function Eyebrow({ children }) {
  return <div className="eyebrow">{children}</div>;
}

function Ring({ pct, label }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, pct / 100)));
  return (
    <div className="chip">
      <svg width="42" height="42" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
        <circle
          cx="21" cy="21" r={r} fill="none" stroke="#44d07b" strokeWidth="4"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform="rotate(-90 21 21)" style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div>
        <div className="chipPct">{Math.round(pct)}%</div>
        <div className="chipLabel">{label}</div>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState("glider");
  const [loaded, setLoaded] = useState(false);
  const [tasks, setTasks] = useState({});
  const [scores, setScores] = useState([]);
  const [saved, setSaved] = useState(0);

  const [scoreInput, setScoreInput] = useState("");
  const [savedInput, setSavedInput] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const saveTimer = useRef(null);

  const storageKey = page === "powered" ? "powered-flight-prep-v1" : "glider-prep-v1";

  useEffect(() => {
    setLoaded(false);
    (async () => {
      try {
        const storage = window.storage ?? window.localStorage;
        const raw = storage.get ? await storage.get(storageKey) : storage.getItem(storageKey);
        const value = raw && raw.value ? raw.value : raw;
        if (value) {
          const d = JSON.parse(value);
          setTasks(d.tasks || {});
          setScores(Array.isArray(d.scores) ? d.scores : []);
          setSaved(typeof d.saved === "number" ? d.saved : 0);
          setSavedInput(d.saved ? String(d.saved) : "");
        } else {
          setTasks({});
          setScores([]);
          setSaved(0);
          setSavedInput("");
        }
      } catch (e) {
      } finally {
        setLoaded(true);
      }
    })();
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        const storage = window.storage ?? window.localStorage;
        const payload = JSON.stringify({ tasks, scores, saved });
        if (storage.set) {
          await storage.set(storageKey, payload, false);
        } else {
          storage.setItem(storageKey, payload);
        }
        setJustSaved(true);
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => setJustSaved(false), 1100);
      } catch (e) {
      }
    })();
  }, [tasks, scores, saved, loaded, storageKey]);

  const currentTasks = page === "powered" ? POWERED_TASKS : TASKS;
  const currentChannels = page === "powered" ? POWERED_CHANNELS : CHANNELS;
  const currentFun = page === "powered" ? POWERED_FUN : FUN;
  const currentMilestones = page === "powered" ? POWERED_MILESTONES : MILESTONES;
  const currentResources = page === "powered" ? POWERED_RESOURCES : GLIDER_RESOURCES;
  const currentBudgetGoal = page === "powered" ? POWERED_BUDGET_GOAL : BUDGET_GOAL;
  const currentYtSearch = page === "powered" ? poweredYtSearch : ytSearch;

  const tasksDone = useMemo(() => currentTasks.filter((t) => tasks[t.id]).length, [tasks, currentTasks]);
  const taskFrac = tasksDone / currentTasks.length;
  const scores90 = useMemo(() => scores.filter((s) => s.score >= 90).length, [scores]);
  const writtenFrac = Math.min(scores90, 3) / 3;
  const budgetFrac = Math.min(saved / currentBudgetGoal, 1);
  const overall = Math.round((taskFrac * 0.5 + writtenFrac * 0.3 + budgetFrac * 0.2) * 100);

  const subline =
    overall >= 100 ? "Cruise altitude. You are ready to fly."
    : overall >= 67 ? "High and fast. Almost at cruise."
    : overall >= 34 ? "Climbing well. Stay in the lift."
    : overall > 0 ? "Off the ground. Keep the nose up."
    : page === "powered"
      ? "Ready the radios and charts. Start the airplane prep."
      : "Wheels still chocked. Pick a task and start your climb.";

  const toggle = (id) => setTasks((p) => ({ ...p, [id]: !p[id] }));

  const addScore = () => {
    const v = Math.round(Number(scoreInput));
    if (!scoreInput || isNaN(v) || v < 0 || v > 100) return;
    const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setScores((p) => [{ id: Date.now(), score: v, date }, ...p]);
    setScoreInput("");
  };
  const removeScore = (id) => setScores((p) => p.filter((s) => s.id !== id));

  const commitSaved = () => {
    const v = Math.max(0, Math.round(Number(savedInput) || 0));
    setSaved(v);
    setSavedInput(String(v));
  };
  const quickAdd = (amt) => {
    const v = Math.max(0, saved + amt);
    setSaved(v);
    setSavedInput(String(v));
  };

  const lessonsCovered = Math.floor(saved / (page === "powered" ? 400 : 350));
  const remaining = Math.max(0, currentBudgetGoal - saved);

  return (
    <div className="wrap">
      <div className="savepill" data-on={justSaved}>Progress saved</div>

      <header className="head">
        <div className="pageTabs">
          <button className={"tab" + (page === "glider" ? " active" : "")} onClick={() => setPage("glider")}>Glider Prep</button>
          <button className={"tab" + (page === "powered" ? " active" : "")} onClick={() => setPage("powered")}>Powered Flight</button>
        </div>
        <div className="badge">
          <span className="badgeDot" /> {page === "powered" ? "Mile High Powered Flight · Airplane prep" : "Mile High Gliding · Waitlist prep"}
        </div>
        <h1>{page === "powered" ? "Powered Flight Prep Dashboard" : "Glider Prep Dashboard"}</h1>
        <p className="sub">
          {page === "powered"
            ? "Build airplane knowledge, medical readiness, and flight training momentum before your first PPL lesson."
            : "Every task you finish is altitude in the bank. Build the knowledge now so your real lessons are faster, cheaper, and a lot more fun."}
        </p>
      </header>

      <section className="hero">
        <div className="heroTop">
          <div>
            <Eyebrow>Overall readiness</Eyebrow>
            <div className="bigpct">{overall}<span>%</span></div>
            <div className="bigsub">{subline}</div>
          </div>
          <div className="chips">
            <Ring pct={taskFrac * 100} label="Tasks" />
            <Ring pct={writtenFrac * 100} label="Written" />
            <Ring pct={budgetFrac * 100} label="Budget" />
          </div>
        </div>
        <FlightPath pct={overall} />
        <div className="heroFoot">
          <span>{page === "powered" ? "Engine start" : "Wheels up"}</span>
          <span>{page === "powered" ? "Private pilot license" : "Private glider license"}</span>
        </div>
      </section>

      <section className="card">
        <Eyebrow>Priority checklist</Eyebrow>
        <h2>Six things to start now</h2>
        <p className="lead">{tasksDone} of {currentTasks.length} done. Tap a row to check it off. Your progress is saved automatically.</p>
        <div className="tasks">
          {currentTasks.map((t) => {
            const on = !!tasks[t.id];
            return (
              <div key={t.id} className={"task" + (on ? " on" : "")}> 
                <button className="box" onClick={() => toggle(t.id)} aria-pressed={on} aria-label={"Mark " + t.title}>
                  {on && (
                    <svg viewBox="0 0 24 24" width="15" height="15"><path d="M5 13l4 4L19 7" fill="none" stroke="#06121f" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </button>
                <div className="taskBody" onClick={() => toggle(t.id)}>
                  <div className="taskTitle">{t.title}</div>
                  <div className="taskNote">{t.note}</div>
                </div>
                <a className="taskLink" href={t.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  {t.linkLabel}
                  <svg viewBox="0 0 24 24" width="13" height="13"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <Eyebrow>Written exam tracker</Eyebrow>
        <h2>{page === "powered" ? "Private Pilot Airplane (PPA)" : "Private Pilot Glider (PGL)"}</h2>
        <div className="facts">
          <div><b>60</b><span>questions</span></div>
          <div><b>70%</b><span>to pass</span></div>
          <div><b>24 mo</b><span>score valid</span></div>
          <div><b>$175</b><span>test fee</span></div>
        </div>
        <p className="lead">
          Your goal is three practice scores at 90 percent or higher. Hit that and you are ready for the real one.
        </p>

        <div className="goalrow">
          <div className="goalbar">
            <div className="goalfill" style={{ width: `${(Math.min(scores90, 3) / 3) * 100}%` }} />
          </div>
          <div className="goalcount">{Math.min(scores90, 3)} / 3</div>
        </div>

        <div className="entry">
          <input
            className="in" type="number" min="0" max="100" inputMode="numeric"
            placeholder="Log a practice score" value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addScore()}
          />
          <button className="btn" onClick={addScore}>Add score</button>
        </div>

        {scores.length > 0 && (
          <div className="scorelist">
            {scores.map((s) => (
              <div key={s.id} className="scoreitem">
                <span className={"dot " + (s.score >= 90 ? "good" : "low")} />
                <b>{s.score}%</b>
                <span className="scoredate">{s.date}</span>
                <button className="rm" onClick={() => removeScore(s.id)} aria-label="Remove score">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="reslinks">
          {currentResources.map((r) => (
            <a key={r.name} href={r.link} target="_blank" rel="noopener noreferrer" className="rescard">
              <div className="resname">{r.name}</div>
              <div className="resmeta">{r.meta}</div>
            </a>
          ))}
        </div>
      </section>

      {page === "powered" && (
        <section className="card">
          <Eyebrow>FAA requirements</Eyebrow>
          <h2>Powered pilot minimums</h2>
          <p className="lead">These are the FAA-required totals and milestones for the Private Pilot Airplane certificate.</p>
          <div className="reqgrid">
            <div><b>40</b><span>flight hours minimum</span></div>
            <div><b>20</b><span>dual instruction hours</span></div>
            <div><b>10</b><span>solo flight hours</span></div>
            <div><b>3</b><span>cross-country hours</span></div>
            <div><b>3</b><span>night flying hours</span></div>
            <div><b>3</b><span>instrument training hours</span></div>
            <div><b>1</b><span>checkride with examiner</span></div>
            <div><b>16</b><span>minimum age in years</span></div>
          </div>
        </section>
      )}

      <section className="card">
        <Eyebrow>Budget tracker</Eyebrow>
        <h2>The climb to ${currentBudgetGoal.toLocaleString()} dollars</h2>
        <p className="lead">Full path to a private {page === "powered" ? "pilot airplane" : "glider"} license runs about {currentBudgetGoal.toLocaleString()} dollars. Lessons cost roughly 250 to 450 dollars each.</p>

        <div className="moneyhead">
          <div className="moneybig">${saved.toLocaleString()}<span> saved</span></div>
          <div className="moneyrem">${remaining.toLocaleString()} to go</div>
        </div>
        <div className="goalbar tall">
          <div className="goalfill amber" style={{ width: `${budgetFrac * 100}%` }} />
        </div>
        <div className="moneynote">
          That covers about <b>{lessonsCovered}</b> {lessonsCovered === 1 ? "lesson" : "lessons"} so far.
        </div>

        <div className="entry">
          <input
            className="in" type="number" min="0" inputMode="numeric"
            placeholder="Set total saved" value={savedInput}
            onChange={(e) => setSavedInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitSaved()}
          />
          <button className="btn" onClick={commitSaved}>Update</button>
        </div>
        <div className="quick">
          <button onClick={() => quickAdd(25)}>+ $25</button>
          <button onClick={() => quickAdd(50)}>+ $50</button>
          <button onClick={() => quickAdd(100)}>+ $100</button>
        </div>
      </section>

      <section className="card">
        <Eyebrow>Your flight plan</Eyebrow>
        <h2>Milestones to the license</h2>
        <div className="timeline">
          {currentMilestones.map((m, i) => (
            <div key={i} className={"mile " + m.state}>
              <div className="mileNode">
                {m.state === "locked" ? (
                  <svg viewBox="0 0 24 24" width="13" height="13"><path d="M6 11V8a6 6 0 0112 0v3M5 11h14v9H5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : m.state === "now" ? (
                  <svg viewBox="0 0 24 24" width="13" height="13"><path d="M5 13l4 4L19 7" fill="none" stroke="#06121f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <span className="nodeDot" />
                )}
              </div>
              <div className="mileBody">
                <div className="mileTitle">{m.title}</div>
                <div className="mileMeta">{m.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <Eyebrow>Watch and learn</Eyebrow>
        <h2>Channels worth your time</h2>
        <p className="lead">Soaking these up while you wait builds real instinct. Each opens the creator on YouTube.</p>
        <div className="ytgrid">
          {currentChannels.map((c) => (
            <a key={c.name} className="yt" href={currentYtSearch(c.name)} target="_blank" rel="noopener noreferrer">
              <div className="ytname">{c.name}</div>
              <div className="ytdesc">{c.desc}</div>
            </a>
          ))}
        </div>

        <div className="divider" />

        <Eyebrow>Optional but fun</Eyebrow>
        <h3 className="h3">Not required, just awesome</h3>
        <div className="ytgrid">
          {currentFun.map((f) => (
            <a key={f.name} className="yt fun" href={f.link} target="_blank" rel="noopener noreferrer">
              <div className="ytname">{f.name}</div>
              <div className="ytdesc">{f.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <footer className="foot">
        Built for the climb. Keep the nose up and the airspeed alive.
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
