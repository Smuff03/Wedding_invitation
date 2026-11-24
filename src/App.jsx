import { useEffect, useRef, useState } from 'react';
import { INFO, EVENTS, STORY } from './data.js';

/* ---------- helpers ---------- */
function petals(n) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.className = 'pet';
    p.textContent = ['🌸', '🌹', '🏵️'][i % 3];
    p.style.cssText = `left:${Math.random() * 100}vw;font-size:${14 + Math.random() * 12}px;animation-duration:${5 + Math.random() * 5}s;animation-delay:${Math.random() * 3}s`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 11000);
  }
}
function useReveal(threshold = 0.5) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}
function Typed({ text, start, delay = 0 }) {
  const [s, setS] = useState('');
  useEffect(() => {
    if (!start) return;
    let i = 0, t;
    const go = () => { setS(text.slice(0, ++i)); if (i < text.length) t = setTimeout(go, 170); };
    t = setTimeout(go, delay);
    return () => clearTimeout(t);
  }, [start]);
  return <h2 className="nm">{s}</h2>;
}
function Dots({ scRef, n }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = scRef.current;
    const u = () => setK(Math.round(el.scrollLeft / (el.scrollWidth / n)));
    el.addEventListener('scroll', u, { passive: true });
    return () => el.removeEventListener('scroll', u);
  }, []);
  const go = j => scRef.current.scrollTo({ left: j * scRef.current.scrollWidth / n, behavior: 'smooth' });
  return <div className="dots">{Array.from({ length: n }, (_, j) => <i key={j} className={j === k ? 'on' : ''} onClick={() => go(j)} />)}</div>;
}
const Mar = ({ pos, d = 0 }) => <span className="mar" style={{ ...pos, animationDelay: d + 's' }}>🌼</span>;
const Rose = ({ pos, e = '🌹' }) => <span className="rose" style={pos}>{e}</span>;

/* ---------- Page 1: opening book ---------- */
function Book({ onOpen }) {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const tap = () => {
    if (open) return;
    setOpen(true); petals(16); onOpen();
    setTimeout(() => setGone(true), 1500);
  };
  return (
    <div id="book" className={gone ? 'gone' : ''}>
      <p className="sml pf" style={{ marginBottom: 18, color: 'var(--wine)' }}>You are invited</p>
      <div className={'bk' + (open ? ' open' : '')} onClick={tap}>
        <div className="pgs">🌹</div>
        <div className="cov">
          <div className="in" />
          <div className="ganesh gold" style={{ fontSize: 56 }}>🕉</div>
          <p className="pf gold" style={{ fontSize: 15, marginTop: 8 }}>॥ श्री गणेशाय नमः ॥</p>
          <h2 className="pf gold" style={{ fontSize: 22, marginTop: 20 }}>{INFO.groom} &amp; {INFO.bride}</h2>
        </div>
      </div>
      <Rose pos={{ left: '8%', top: '12%' }} /><Rose pos={{ right: '7%', top: '18%', fontSize: 38 }} />
      <Rose pos={{ left: '12%', bottom: '12%', fontSize: 38 }} /><Rose pos={{ right: '10%', bottom: '10%' }} />
      <p className="sml" style={{ marginTop: 34, color: 'var(--wine)', animation: 'tw 2s infinite' }}>Tap the book to open</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="pg" style={{ padding: 0, color: '#fff', background: '#000' }}>
      <div id="hero" />
      <div style={{ position: 'relative', padding: 20 }}>
        <div className="ganesh gold">🕉</div>
        <p className="sml">We are getting married</p>
        <h1 className="gold" style={{ fontSize: 'clamp(40px,12vw,56px)', margin: '14px 0' }}>{INFO.groom}<br /><i style={{ fontSize: '.6em' }}>&amp;</i><br />{INFO.bride}</h1>
        <p className="sml">02 · 01 · 2027</p>
        <p className="sml" style={{ marginTop: 40, animation: 'tw 2s infinite' }}>Scroll ↓</p>
      </div>
    </section>
  );
}

/* ---------- Page 2 ---------- */
function Invite() {
  const [ref, seen] = useReveal();
  return (
    <section className="pg" id="p2" ref={ref}>
      <Mar pos={{ left: '10%' }} /><Mar pos={{ left: '30%' }} d={.5} /><Mar pos={{ right: '30%' }} d={1} /><Mar pos={{ right: '10%' }} d={1.5} />
      <div className="border">
        <div className="ganesh gold">🕉</div>
        <p className="sml">Together with their families</p>
        <Typed text={INFO.groom} start={seen} />
        <p>Son of<br /><b>{INFO.groomParents[0]}</b> &amp; <b>{INFO.groomParents[1]}</b></p>
        <div className="amp gold">&amp;</div>
        <Typed text={INFO.bride} start={seen} delay={1400} />
        <p>Daughter of<br /><b>{INFO.brideParents[0]}</b> &amp; <b>{INFO.brideParents[1]}</b></p>
        <p className="pf" style={{ fontStyle: 'italic', marginTop: 12, lineHeight: 1.6, color: 'var(--wine)' }}>
          request the pleasure of your company as we begin our journey of love and togetherness. Your blessings will make our day complete.
        </p>
      </div>
    </section>
  );
}

/* ---------- Page 3 ---------- */
function useCountdown(target) {
  const calc = () => Math.max(0, Math.floor((new Date(target) - Date.now()) / 1000));
  const [s, setS] = useState(calc);
  useEffect(() => { const t = setInterval(() => setS(calc()), 1000); return () => clearInterval(t); }, []);
  return [['Days', Math.floor(s / 86400)], ['Hrs', Math.floor(s % 86400 / 3600)], ['Min', Math.floor(s % 3600 / 60)], ['Sec', s % 60]];
}
function addToCalendar() {
  const f = d => new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding//EN', 'BEGIN:VEVENT',
    'UID:sagar-shrutika-2027@wedding', 'DTSTAMP:' + f(new Date()),
    'DTSTART:' + f(INFO.weddingStart), 'DTEND:' + f(INFO.weddingEnd),
    `SUMMARY:${INFO.groom} & ${INFO.bride} Wedding`,
    'LOCATION:River Trail Adventure Camp\\, Ambole\\, Pali\\, Sudhagad\\, Raigad',
    'DESCRIPTION:Muhurat 5:55 PM. Reception from 8:00 PM.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'Sagar-Shrutika-Wedding.ics';
  document.body.appendChild(a); a.click(); a.remove();
}
function SaveDate() {
  const [open, setOpen] = useState(false);
  const [dy, setDy] = useState(0);
  const y0 = useRef(null);
  const cd = useCountdown(INFO.muhurat);
  const openIt = () => { if (open) return; setOpen(true); setDy(0); petals(18); };
  return (
    <section className="pg" id="p3">
      <Rose pos={{ left: -6, top: 30 }} /><Rose pos={{ right: -6, top: 30 }} />
      <div className="ganesh gold">🕉</div>
      <h2 className="pf gold" style={{ fontSize: 34 }}>Save the Date</h2>
      <p className="sml">{open ? 'Save the date' : 'Pull the tassel'}</p>
      <div className="scrollwrap">
        <div className="rod" />
        <div className={'paper border' + (open ? ' on' : '')}>
          <div>
            <h3 className="pf" style={{ fontSize: 20 }}>Saturday</h3>
            <h2 className="pf gold" style={{ fontSize: 36 }}>2 January 2027</h2>
            <p className="sml" style={{ margin: '6px 0' }}>Muhurat · 5:55 PM</p>
            <div className="cd">{cd.map(([l, v]) => <div key={l}>{String(v).padStart(2, '0')}<small>{l}</small></div>)}</div>
            <button className="btn" onClick={addToCalendar}>📅 Add to Calendar</button>
          </div>
        </div>
        <div className="rod" style={{ height: 10 }} />
        <div className="tas" style={{ transform: `translateY(${dy}px)` }}
          onClick={openIt}
          onPointerDown={e => { y0.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={e => {
            if (y0.current == null) return;
            const d = Math.max(0, Math.min(60, e.clientY - y0.current));
            setDy(d); if (d > 35) { y0.current = null; openIt(); }
          }}
          onPointerUp={() => { y0.current = null; if (!open) setDy(0); }}>
          <i /><b>🏵️</b>
        </div>
        {!open && <span className="fing">👆</span>}
      </div>
    </section>
  );
}

/* ---------- Page 4 ---------- */
function Functions() {
  const sc = useRef(null);
  return (
    <section className="pg" id="p4">
      <h2 className="pf gold" style={{ fontSize: 32 }}>Wedding Functions</h2>
      <p className="sml" style={{ marginBottom: 6 }}>Swipe →</p>
      <div className="car" ref={sc}>
        {EVENTS.map(e => (
          <div className="ev" key={e.n} style={{ background: `linear-gradient(160deg,${e.c},#2b0a12)` }}>
            <div className="ic">{e.i}</div>
            <h3 className="pf">{e.n}</h3>
            <p>📅 {e.d}</p><p>🕒 {e.t}</p>
            <p>📍 {INFO.venue}, Ambole, Pali</p>
            <p>👗 Dress code: {e.dr}</p>
            <p><span className="sw" style={{ background: e.c }} />Theme: {e.cn}</p>
            <p style={{ fontStyle: 'italic', opacity: .85 }}>{e.note}</p>
          </div>
        ))}
      </div>
      <Dots scRef={sc} n={EVENTS.length} />
    </section>
  );
}

/* ---------- Page 5 ---------- */
function Story() {
  const sc = useRef(null);
  return (
    <section className="pg" id="p5">
      <h2 className="pf gold" style={{ fontSize: 32 }}>Our Story</h2>
      <p className="sml" style={{ marginBottom: 14 }}>Swipe through our moments</p>
      <div className="gal" ref={sc}>
        {STORY.map(([k, cap]) => (
          <div className="sl" key={k}><img loading="lazy" alt={cap} src={`/images/${k}.jpg`} /><p>{cap}</p></div>
        ))}
      </div>
      <Dots scRef={sc} n={STORY.length} />
    </section>
  );
}

/* ---------- Page 6 ---------- */
function Reception() {
  const [ref, seen] = useReveal();
  useEffect(() => { if (seen) petals(8); }, [seen]);
  return (
    <section className="pg" id="p6" ref={ref}>
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} className="spk" style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%`, fontSize: 8 + (i % 5) * 3, animationDelay: (i % 7) * .3 + 's' }}>✦</span>
      ))}
      <Rose pos={{ left: '6%', top: '6%' }} /><Rose pos={{ right: '6%', top: '6%' }} />
      <Rose pos={{ left: '6%', bottom: '6%' }} e="🌷" /><Rose pos={{ right: '6%', bottom: '6%' }} e="🌷" />
      <div className={'rv' + (seen ? ' in' : '')}>
        <div className="ganesh">🕉</div>
        <p className="sml">Celebrate with us at the</p>
        <h2 className="pf gold" style={{ fontSize: 42, margin: '10px 0' }}>Grand Reception</h2>
        <div className="border" style={{ padding: '18px 22px', display: 'inline-block' }}>
          <p className="pf" style={{ fontSize: 20 }}>Saturday, 2 January 2027</p>
          <p style={{ margin: '6px 0' }}>8:00 PM – 11:00 PM</p>
          <p className="sml">{INFO.venue}<br />Ambole, Pali, Sudhagad, Raigad</p>
        </div>
        <p className="pf" style={{ fontStyle: 'italic', marginTop: 18 }}>Dinner, dance and celebrations</p>
      </div>
    </section>
  );
}

/* ---------- Page 7 ---------- */
function Location() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(INFO.address); }
    catch { const x = document.createElement('textarea'); x.value = INFO.address; document.body.appendChild(x); x.select(); try { document.execCommand('copy'); } catch {} x.remove(); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <section className="pg" id="p7">
      <h2 className="pf gold" style={{ fontSize: 32 }}>Wedding Location</h2>
      <div className="loc border" style={{ marginTop: 14 }}>
        <h3 className="pf" style={{ fontSize: 22, color: 'var(--wine)' }}>{INFO.venue}</h3>
        <p style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.5 }}>{INFO.address}</p>
        <a className="map" href={INFO.mapsLink} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 300 170">
            <path d="M0 120 Q80 90 150 125 T300 100 V170 H0Z" fill="#b8d8e8" />
            <path d="M-10 40 Q100 70 310 20" stroke="#fff" strokeWidth="8" fill="none" />
            <path d="M60 0 Q90 80 40 170" stroke="#f1d98a" strokeWidth="5" fill="none" />
            <circle cx="230" cy="55" r="20" fill="#cfe3b5" /><circle cx="40" cy="60" r="14" fill="#cfe3b5" />
          </svg>
          <i className="pin">📍</i><span>Tap to open in Google Maps</span>
        </a>
        <a className="btn" href={INFO.directionsLink} target="_blank" rel="noopener noreferrer">🧭 Get Directions</a>
        <button className="btn" onClick={copy}>{copied ? '✔ Copied!' : '📋 Copy Address'}</button>
      </div>
    </section>
  );
}

/* ---------- Page 8 ---------- */
function Closing() {
  const [ref, seen] = useReveal();
  useEffect(() => { if (seen) petals(8); }, [seen]);
  return (
    <section className="pg" id="p8" ref={ref}>
      <Mar pos={{ left: '12%' }} /><Mar pos={{ left: '32%' }} d={.7} /><Mar pos={{ right: '32%' }} d={1.2} /><Mar pos={{ right: '12%' }} d={.3} />
      <Rose pos={{ left: '4%', bottom: '6%' }} /><Rose pos={{ right: '4%', bottom: '6%' }} />
      <div className={'rv' + (seen ? ' in' : '')}>
        <div className="ganesh gold" style={{ fontSize: 54 }}>🕉</div>
        <h2 className="pf" style={{ fontSize: 30, color: 'var(--wine)', margin: '18px 0', lineHeight: 1.35 }}>WE CAN'T WAIT TO CELEBRATE WITH YOU!</h2>
        <p className="pf gold" style={{ fontSize: 26 }}>{INFO.groom} &amp; {INFO.bride}</p>
        <p style={{ marginTop: 22, fontSize: 13 }}>With love,<br />the <b>Telange</b> and <b>Khade</b> families</p>
      </div>
    </section>
  );
}

/* ---------- App ---------- */
export default function App() {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [hasMusic, setHasMusic] = useState(true);
  useEffect(() => { document.body.style.overflow = 'hidden'; }, []);
  const start = () => {
    document.body.style.overflow = '';
    audio.current?.play().then(() => setPlaying(true)).catch(() => {}); // browsers need a tap first
  };
  const toggle = () => {
    const a = audio.current;
    if (a.paused) a.play().then(() => setPlaying(true)); else { a.pause(); setPlaying(false); }
  };
  return (
    <>
      <audio ref={audio} src={INFO.music} loop preload="auto" onError={() => setHasMusic(false)} />
      <Book onOpen={start} />
      {hasMusic && <button className="mus" onClick={toggle} aria-label="Toggle music">{playing ? '🔊' : '🔇'}</button>}
      <Hero /><Invite /><SaveDate /><Functions /><Story /><Reception /><Location /><Closing />
    </>
  );
}
