import { useState, useEffect, useMemo, useRef } from "react";

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

const BUDGET_GOAL = 6000;
const ytSearch = (name) =>
  "https://www.youtube.com/results?search_query=" + encodeURIComponent(name + " glider soaring");

// ---------- helpers ----------

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

// ---------- hero flight path ----------

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

// ---------- small ui ----------

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

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [tasks, setTasks] = useState({});
  const [scores, setScores] = useState([]);
  const [saved, setSaved] = useState(0);

  const [scoreInput, setScoreInput] = useState("");
  const [savedInput, setSavedInput] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const storage = window.storage ?? window.localStorage;
        const raw = storage.get ? await storage.get("glider-prep-v1") : storage.getItem("glider-prep-v1");
        const value = raw && raw.value ? raw.value : raw;
        if (value) {
          const d = JSON.parse(value);
          setTasks(d.tasks || {});
          setScores(Array.isArray(d.scores) ? d.scores : []);
          setSaved(typeof d.saved === "number" ? d.saved : 0);
          setSavedInput(d.saved ? String(d.saved) : "");
        }
      } catch (e) {
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        const storage = window.storage ?? window.localStorage;
        const payload = JSON.stringify({ tasks, scores, saved });
        if (storage.set) {
          await storage.set("glider-prep-v1", payload, false);
        } else {
          storage.setItem("glider-prep-v1", payload);
        }
        setJustSaved(true);
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => setJustSaved(false), 1100);
      } catch (e) {
      }
    })();
  }, [tasks, scores, saved, loaded]);

  const tasksDone = useMemo(() => TASKS.filter((t) => tasks[t.id]).length, [tasks]);
  const taskFrac = tasksDone / TASKS.length;
  const scores90 = useMemo(() => scores.filter((s) => s.score >= 90).length, [scores]);
  const writtenFrac = Math.min(scores90, 3) / 3;
  const budgetFrac = Math.min(saved / BUDGET_GOAL, 1);
  const overall = Math.round((taskFrac * 0.5 + writtenFrac * 0.3 + budgetFrac * 0.2) * 100);

  const subline =
    overall >= 100 ? "Cruise altitude. You are ready to fly."
    : overall >= 67 ? "High and fast. Almost at cruise."
    : overall >= 34 ? "Climbing well. Stay in the lift."
    : overall > 0 ? "Off the ground. Keep the nose up."
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

  const lessonsCovered = Math.floor(saved / 350);
  const remaining = Math.max(0, BUDGET_GOAL - saved);

  return (
    <div className="wrap">
      <style>{css}</style>

      <div className="savepill" data-on={justSaved}>Progress saved</div>

      <header className="head">
        <div className="badge">
          <span className="badgeDot" /> Mile High Gliding · Waitlist prep
        </div>
        <h1>Glider Prep Dashboard</h1>
        <p className="sub">
          Every task you finish is altitude in the bank. Build the knowledge now so your real lessons are
          faster, cheaper, and a lot more fun.
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
          <span>Wheels up</span>
          <span>Private glider license</span>
        </div>
      </section>

      <section className="card">
        <Eyebrow>Priority checklist</Eyebrow>
        <h2>Six things to start now</h2>
        <p className="lead">{tasksDone} of {TASKS.length} done. Tap a row to check it off. Your progress is saved automatically.</p>
        <div className="tasks">
          {TASKS.map((t) => {
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
        <h2>Private Pilot Glider (PGL)</h2>
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
          <a href="https://gliderpilotsgroundschool.com" target="_blank" rel="noopener noreferrer" className="rescard">
            <div className="resname">Glider Pilots Ground School</div>
            <div className="resmeta">Book and live course · about 30 dollars</div>
          </a>
          <a href="https://apps.apple.com/us/app/faa-private-pilot-prep/id552933297" target="_blank" rel="noopener noreferrer" className="rescard">
            <div className="resname">Dauntless GroundSchool</div>
            <div className="resmeta">App, covers PGL · about 60 to 70 dollars</div>
          </a>
          <a href="https://faa.psiexams.com" target="_blank" rel="noopener noreferrer" className="rescard">
            <div className="resname">Schedule the real test</div>
            <div className="resmeta">faa.psiexams.com · when you are ready</div>
          </a>
        </div>
      </section>

      <section className="card">
        <Eyebrow>Budget tracker</Eyebrow>
        <h2>The climb to 6,000 dollars</h2>
        <p className="lead">Full path to a private glider license runs about 6,000 dollars. Lessons cost roughly 250 to 450 dollars each.</p>

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
          {MILESTONES.map((m, i) => (
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
          {CHANNELS.map((c) => (
            <a key={c.name} className="yt" href={ytSearch(c.name)} target="_blank" rel="noopener noreferrer">
              <div className="ytname">{c.name}</div>
              <div className="ytdesc">{c.desc}</div>
            </a>
          ))}
        </div>

        <div className="divider" />

        <Eyebrow>Optional but fun</Eyebrow>
        <h3 className="h3">Not required, just awesome</h3>
        <div className="ytgrid">
          {FUN.map((f) => (
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

const css = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }
.wrap {
  --ink:#eaf1f8; --muted:#90a6bd; --lift:#44d07b; --sun:#ffb454;
  --card:#0f2034; --card2:#13283f; --line:rgba(255,255,255,0.09);
  font-family:'Inter',system-ui,sans-serif;
  color:var(--ink);
  background:
    radial-gradient(120% 80% at 80% -10%, rgba(255,180,84,0.10), transparent 55%),
    radial-gradient(120% 90% at 0% 0%, rgba(68,208,123,0.08), transparent 50%),
    linear-gradient(180deg,#081325 0%,#060f1c 100%);
  min-height:100vh;
  padding:22px 16px 60px;
  max-width:760px; margin:0 auto;
}
@media (min-width:600px){ .wrap{ padding:34px 28px 70px; } }

.savepill{
  position:fixed; top:12px; left:50%; transform:translate(-50%,-24px);
  background:var(--lift); color:#06121f; font-weight:700; font-size:12px;
  padding:6px 14px; border-radius:999px; opacity:0; pointer-events:none;
  transition:transform .35s ease, opacity .35s ease; z-index:50;
  font-family:'Chakra Petch',sans-serif; letter-spacing:.3px;
}
.savepill[data-on="true"]{ opacity:1; transform:translate(-50%,0); }

.head{ margin-bottom:20px; }
.badge{
  display:inline-flex; align-items:center; gap:7px;
  font-family:'Chakra Petch',sans-serif; font-size:11px; letter-spacing:1.4px;
  text-transform:uppercase; color:var(--muted);
  border:1px solid var(--line); padding:6px 12px; border-radius:999px;
}
.badgeDot{ width:7px;height:7px;border-radius:50%;background:var(--lift); box-shadow:0 0 10px var(--lift); }
 h1{
  font-family:'Chakra Petch',sans-serif; font-weight:700;
  font-size:clamp(30px,8vw,44px); line-height:1.02; margin:14px 0 8px;
  letter-spacing:-0.5px;
}
.sub{ color:var(--muted); font-size:15px; line-height:1.55; max-width:54ch; margin:0; }

.eyebrow{
  font-family:'Chakra Petch',sans-serif; font-size:11px; letter-spacing:2px;
  text-transform:uppercase; color:var(--sun); margin-bottom:8px;
}

.hero{
  border:1px solid var(--line); border-radius:22px; padding:20px;
  background:linear-gradient(180deg, rgba(20,40,63,0.9), rgba(10,21,37,0.9));
  margin-bottom:16px; overflow:hidden;
}
.heroTop{ display:flex; justify-content:space-between; gap:16px; align-items:flex-start; flex-wrap:wrap; }
.bigpct{ font-family:'Chakra Petch',sans-serif; font-weight:700; font-size:clamp(48px,14vw,72px); line-height:.9; }
.bigpct span{ font-size:.4em; color:var(--muted); margin-left:4px; }
.bigsub{ color:var(--ink); opacity:.85; font-size:14px; margin-top:6px; max-width:30ch; }
.chips{ display:flex; flex-direction:column; gap:8px; }
.chip{ display:flex; align-items:center; gap:9px; background:rgba(255,255,255,0.04); border:1px solid var(--line); padding:6px 12px 6px 6px; border-radius:14px; }
.chipPct{ font-family:'Chakra Petch',sans-serif; font-weight:700; font-size:15px; line-height:1; }
.chipLabel{ font-size:11px; color:var(--muted); }
.flightsvg{ width:100%; height:auto; margin-top:14px; display:block; }
.glider{ animation:bob 4s ease-in-out infinite; transform-box:fill-box; }
.heroFoot{ display:flex; justify-content:space-between; font-size:11px; color:var(--muted); font-family:'Chakra Petch',sans-serif; letter-spacing:.5px; margin-top:4px; }

.card{
  border:1px solid var(--line); border-radius:20px; padding:20px;
  background:rgba(15,32,52,0.55); margin-bottom:16px;
}
h2{ font-family:'Chakra Petch',sans-serif; font-weight:600; font-size:22px; margin:2px 0 4px; letter-spacing:-.2px; }
.h3{ font-family:'Chakra Petch',sans-serif; font-weight:600; font-size:18px; margin:2px 0 10px; }
.lead{ color:var(--muted); font-size:14px; line-height:1.55; margin:6px 0 16px; }

.tasks{ display:flex; flex-direction:column; gap:10px; }
.task{
  display:flex; align-items:flex-start; gap:13px;
  background:rgba(255,255,255,0.02); border:1px solid var(--line);
  border-radius:14px; padding:13px; transition:border-color .2s, background .2s;
}
.task.on{ border-color:rgba(68,208,123,0.4); background:rgba(68,208,123,0.06); }
.box{
  flex:none; width:26px; height:26px; border-radius:8px; margin-top:1px;
  border:2px solid var(--muted); background:transparent; cursor:pointer;
  display:flex; align-items:center; justify-content:center; transition:all .18s;
}
.task.on .box{ background:var(--lift); border-color:var(--lift); }
.taskBody{ flex:1; cursor:pointer; min-width:0; }
.taskTitle{ font-weight:600; font-size:15px; }
.task.on .taskTitle{ color:var(--lift); }
.taskNote{ color:var(--muted); font-size:13px; line-height:1.5; margin-top:3px; }
.taskLink{
  flex:none; align-self:center; display:inline-flex; align-items:center; gap:5px;
  color:var(--sun); text-decoration:none; font-size:12.5px; font-weight:600;
  border:1px solid rgba(255,180,84,0.3); border-radius:10px; padding:7px 11px;
  white-space:nowrap; transition:background .2s;
}
.taskLink:hover{ background:rgba(255,180,84,0.12); }

.facts{ display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin:14px 0; }
.facts div{ background:rgba(255,255,255,0.03); border:1px solid var(--line); border-radius:12px; padding:11px 8px; text-align:center; }
.facts b{ display:block; font-family:'Chakra Petch',sans-serif; font-size:19px; }
.facts span{ font-size:11px; color:var(--muted); }

.goalrow{ display:flex; align-items:center; gap:12px; margin-bottom:16px; }
.goalbar{ flex:1; height:10px; background:rgba(255,255,255,0.07); border-radius:99px; overflow:hidden; }
.goalbar.tall{ height:14px; }
.goalfill{ height:100%; background:linear-gradient(90deg,#44d07b,#7be3a5); border-radius:99px; transition:width .6s ease; }
.goalfill.amber{ background:linear-gradient(90deg,#ffb454,#ffd08a); }
.goalcount{ font-family:'Chakra Petch',sans-serif; font-weight:700; font-size:14px; color:var(--lift); }

.entry{ display:flex; gap:9px; margin-top:6px; }
.in{
  flex:1; background:rgba(255,255,255,0.04); border:1px solid var(--line);
  border-radius:12px; padding:12px 14px; color:var(--ink); font-size:15px; font-family:inherit;
}
.in:focus{ outline:none; border-color:var(--sun); }
.in::placeholder{ color:var(--muted); }
.btn{
  background:var(--lift); color:#06121f; border:none; border-radius:12px;
  padding:0 18px; font-weight:700; font-size:14px; cursor:pointer; font-family:'Chakra Petch',sans-serif;
  transition:filter .2s;
}
.btn:hover{ filter:brightness(1.08); }

.scorelist{ display:flex; flex-wrap:wrap; gap:8px; margin-top:14px; }
.scoreitem{
  display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.03);
  border:1px solid var(--line); border-radius:11px; padding:8px 8px 8px 12px;
}
.scoreitem b{ font-family:'Chakra Petch',sans-serif; font-size:15px; }
.dot{ width:9px;height:9px;border-radius:50%; }
.dot.good{ background:var(--lift); box-shadow:0 0 8px rgba(68,208,123,.6); }
.dot.low{ background:var(--sun); }
.scoredate{ font-size:12px; color:var(--muted); }
.rm{ background:none; border:none; color:var(--muted); font-size:18px; line-height:1; cursor:pointer; padding:0 2px; }
.rm:hover{ color:#ff6b6b; }

.reslinks{ display:flex; flex-direction:column; gap:9px; margin-top:18px; }
.rescard{ display:block; text-decoration:none; color:var(--ink); border:1px solid var(--line); border-radius:13px; padding:13px 15px; background:rgba(255,255,255,0.02); transition:border-color .2s, background .2s; }
.rescard:hover{ border-color:var(--sun); background:rgba(255,180,84,0.06); }
.resname{ font-weight:600; font-size:14.5px; }
.resmeta{ font-size:12.5px; color:var(--muted); margin-top:2px; }

.moneyhead{ display:flex; justify-content:space-between; align-items:baseline; margin:4px 0 10px; }
.moneybig{ font-family:'Chakra Petch',sans-serif; font-weight:700; font-size:32px; line-height:1; }
.moneybig span{ font-size:.42em; color:var(--muted); font-weight:500; }
.moneyrem{ color:var(--sun); font-size:13px; font-weight:600; }
.moneynote{ color:var(--muted); font-size:13px; margin:12px 0 16px; }
.moneynote b{ color:var(--ink); font-family:'Chakra Petch',sans-serif; }
.quick{ display:flex; gap:9px; margin-top:11px; }
.quick button{
  flex:1; background:rgba(255,255,255,0.04); border:1px solid var(--line); color:var(--ink);
  border-radius:11px; padding:11px 0; font-weight:600; font-size:13px; cursor:pointer; font-family:'Chakra Petch',sans-serif;
  transition:background .2s;
}
.quick button:hover{ background:rgba(255,180,84,0.1); border-color:var(--sun); }

.timeline{ position:relative; padding-left:8px; }
.timeline:before{ content:""; position:absolute; left:20px; top:14px; bottom:14px; width:2px; background:var(--line); }
.mile{ display:flex; gap:16px; align-items:flex-start; padding:11px 0; position:relative; }
.mileNode{
  flex:none; width:26px; height:26px; border-radius:50%; z-index:1;
  display:flex; align-items:center; justify-content:center;
  border:2px solid var(--line); background:#0c1c2f; color:var(--muted);
}
.nodeDot{ width:8px; height:8px; border-radius:50%; background:var(--muted); }
.mile.now .mileNode{ background:var(--lift); border-color:var(--lift); }
.mile.focus .mileNode{ border-color:var(--sun); background:rgba(255,180,84,0.15); }
.mile.focus .nodeDot{ background:var(--sun); box-shadow:0 0 10px var(--sun); }
.mileTitle{ font-weight:600; font-size:15.5px; }
.mile.now .mileTitle{ color:var(--lift); }
.mile.focus .mileTitle{ color:var(--sun); }
.mile.locked .mileTitle{ color:var(--muted); }
.mileMeta{ font-size:12.5px; color:var(--muted); margin-top:2px; }

.ytgrid{ display:grid; grid-template-columns:1fr; gap:9px; }
@media (min-width:560px){ .ytgrid{ grid-template-columns:1fr 1fr; } }
.yt{ text-decoration:none; color:var(--ink); border:1px solid var(--line); border-radius:13px; padding:13px 15px; background:rgba(255,255,255,0.02); transition:transform .15s, border-color .2s, background .2s; }
.yt:hover{ transform:translateY(-2px); border-color:rgba(255,80,80,0.45); background:rgba(255,80,80,0.05); }
.yt.fun:hover{ border-color:var(--lift); background:rgba(68,208,123,0.06); }
.ytname{ font-weight:600; font-size:14.5px; }
.ytdesc{ font-size:12.5px; color:var(--muted); line-height:1.45; margin-top:3px; }

.divider{ height:1px; background:var(--line); margin:24px 0 18px; }

.foot{ text-align:center; color:var(--muted); font-size:12.5px; margin-top:24px; font-family:'Chakra Petch',sans-serif; letter-spacing:.4px; }

@keyframes bob{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-3px); } }
@media (prefers-reduced-motion:reduce){ .glider{ animation:none; } * { transition:none !important; } }
`;
