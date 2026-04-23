import { useState, useRef, useEffect } from "react";

const KOFI_LINK = "https://ko-fi.com/tuonome";

const TOPICS = [
  { id: "solitudine",  emoji: "🌙", label: "Solitudine",  sub: "e compagnia" },
  { id: "stress",      emoji: "🌊", label: "Stress",      sub: "e lavoro" },
  { id: "famiglia",    emoji: "🏡", label: "Famiglia",    sub: "e relazioni" },
  { id: "tristezza",   emoji: "🍂", label: "Tristezza",   sub: "e umore" },
  { id: "chiacchiere", emoji: "☀️", label: "Chiacchiere", sub: "e tutto il resto" },
];

const TOPIC_PROMPTS = {
  solitudine:  "L'utente vuole parlare di solitudine e compagnia. Sii particolarmente presente e caldo.",
  stress:      "L'utente vuole parlare di stress e lavoro. Ascolta, non dare soluzioni immediate.",
  famiglia:    "L'utente vuole parlare di famiglia e relazioni. Sii empatico e non giudicare.",
  tristezza:   "L'utente vuole parlare di tristezza o umore. Sii delicato e presente.",
  chiacchiere: "L'utente vuole fare due chiacchiere. Sii spontaneo, curioso, leggero.",
};

const SYSTEM_PROMPT = (name, friendName, topic) => `Sei "${friendName}", un amico autentico che parla italiano. Stai scrivendo una lettera a ${name}.

TEMA: ${TOPIC_PROMPTS[topic] || TOPIC_PROMPTS.chiacchiere}

STILE: Scrivi come se stessi componendo una lettera a mano — comincia con "Caro/a ${name}," e concludi con una firma calda. Usa un tono epistolare, caldo, letterario ma non artificioso.

REGOLE:
- Sei un amico comune, NON uno psicologo o medico.
- Se l'utente sembra in grave difficoltà, suggerisci di parlare con un professionista.
- Risposte di 3-5 frasi, stile lettera.
- Il tuo nome è ${friendName}.`;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=IM+Fell+English:ital@0;1&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

:root{
  --parch:   #f5e6c8;
  --parch-d: #ede0b0;
  --parch-dk:#d4c090;
  --ink:     #1a3a52;
  --ink-d:   #0d2235;
  --ink-l:   #2e6080;
  --gold:    #8a6a2a;
  --gold-l:  #c8a050;
  --gold-ll: #e8d090;
  --seal:    #8b1a1a;
  --seal-l:  #c02020;
  --text:    #2d1a00;
  --text-m:  #5a3a10;
  --text-l:  #8a6a30;
  --white:   #fffdf5;
}

body {
  background: #2a1a0a;
  font-family: 'Lora', serif;
  min-height: 100vh;
}

.app-wrap {
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #3a2510 0%, #1a0d05 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* ── CARD PERGAMENA ── */
.card {
  width: 100%;
  max-width: 460px;
  background: var(--parch);
  border-radius: 4px;
  border: 2px solid var(--gold);
  box-shadow:
    inset 0 0 40px rgba(139,106,42,0.15),
    0 0 0 4px rgba(139,106,42,0.2),
    0 20px 60px rgba(0,0,0,0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 620px;
  max-height: 92vh;
  animation: unfurl .6s cubic-bezier(.22,1,.36,1);
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid var(--gold-ll);
  border-radius: 2px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.5;
}

@keyframes unfurl {
  from { opacity:0; transform: scaleY(.95) translateY(10px); }
  to   { opacity:1; transform: none; }
}

/* ── HEADER ── */
.header {
  background: var(--ink-d);
  padding: 18px 24px 14px;
  text-align: center;
  border-bottom: 2px solid var(--gold);
  flex-shrink: 0;
  position: relative;
}

.header-ornament {
  font-size: .75rem;
  color: var(--gold-l);
  letter-spacing: .3em;
  margin-bottom: 6px;
  opacity: .8;
}

.header-title {
  font-family: 'Cinzel', serif;
  font-size: 1.6rem;
  color: var(--gold-l);
  letter-spacing: .12em;
  line-height: 1;
}

.header-sub {
  font-family: 'IM Fell English', serif;
  font-size: .78rem;
  color: rgba(200,160,80,.75);
  margin-top: 4px;
  font-style: italic;
  letter-spacing: .04em;
}

.online-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 3px;
}

.seal-dot {
  width: 7px; height: 7px;
  background: #e05050;
  border-radius: 50%;
  animation: pulse 2s infinite;
  box-shadow: 0 0 0 2px rgba(224,80,80,.25);
}

@keyframes pulse { 50% { box-shadow: 0 0 0 4px rgba(224,80,80,.1); } }

/* ── NAV ── */
.nav {
  display: flex;
  border-bottom: 2px solid var(--gold);
  flex-shrink: 0;
  background: var(--parch-d);
}

.nav-btn {
  flex: 1;
  padding: 9px 4px;
  border: none;
  background: none;
  font-family: 'Cinzel', serif;
  font-size: .65rem;
  font-weight: 400;
  color: var(--text-l);
  cursor: pointer;
  transition: all .2s;
  border-bottom: 2px solid transparent;
  letter-spacing: .06em;
  margin-bottom: -2px;
}

.nav-btn.active {
  color: var(--ink);
  border-bottom-color: var(--ink);
  background: var(--parch);
}

/* ── BODY ── */
.body { flex:1; overflow-y:auto; background: var(--parch); }
.body::-webkit-scrollbar { width:4px; }
.body::-webkit-scrollbar-thumb { background: var(--gold-ll); border-radius:2px; }

/* ── ONBOARD ── */
.onboard { padding: 28px 26px; display: flex; flex-direction: column; gap: 18px; }

.ornament-divider {
  text-align: center;
  font-size: .8rem;
  color: var(--gold-l);
  letter-spacing: .2em;
  margin: -4px 0;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  color: var(--ink);
  letter-spacing: .08em;
  text-align: center;
}

.section-sub {
  font-family: 'IM Fell English', serif;
  font-size: .85rem;
  color: var(--text-m);
  text-align: center;
  font-style: italic;
  margin-top: -10px;
}

.parch-box {
  background: var(--white);
  border: 1px solid var(--gold);
  border-radius: 3px;
  padding: 16px 18px;
  font-family: 'IM Fell English', serif;
  font-size: .9rem;
  color: var(--text-m);
  line-height: 1.7;
  position: relative;
}

.parch-box::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: .5px solid var(--gold-ll);
  border-radius: 2px;
  pointer-events: none;
}

.parch-box strong { color: var(--ink); font-style: normal; }

.emergency {
  font-family: 'IM Fell English', serif;
  font-size: .75rem;
  color: var(--text-l);
  text-align: center;
  font-style: italic;
  line-height: 1.6;
}

/* ── FIELD ── */
.f-label {
  font-family: 'Cinzel', serif;
  font-size: .68rem;
  color: var(--gold);
  letter-spacing: .1em;
  margin-bottom: 5px;
}

.f-input {
  width: 100%;
  padding: 9px 12px;
  border: none;
  border-bottom: 1px solid var(--gold);
  background: transparent;
  font-family: 'IM Fell English', serif;
  font-size: .95rem;
  color: var(--text);
  outline: none;
  transition: border-color .2s;
  font-style: italic;
}

.f-input:focus { border-bottom-color: var(--ink); }
.f-input::placeholder { color: var(--text-l); }

/* ── BOTTONE SIGILLO ── */
.btn-seal {
  width: 100%;
  padding: 12px;
  background: var(--ink-d);
  color: var(--gold-l);
  border: 1px solid var(--gold);
  border-radius: 3px;
  font-family: 'Cinzel', serif;
  font-size: .8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  letter-spacing: .1em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-seal:hover { background: var(--ink); }
.btn-seal:disabled { opacity: .4; cursor: default; }

.btn-link {
  background: none;
  border: none;
  color: var(--text-l);
  font-family: 'IM Fell English', serif;
  font-size: .85rem;
  cursor: pointer;
  text-align: center;
  font-style: italic;
  text-decoration: underline;
  text-decoration-color: var(--gold-ll);
}

/* ── TOPIC GRID ── */
.topic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.topic-card {
  border: 1px solid var(--gold);
  border-radius: 3px;
  padding: 12px 10px;
  cursor: pointer;
  transition: all .2s;
  background: var(--white);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  position: relative;
}

.topic-card:hover { background: var(--parch-d); }
.topic-card.selected { background: var(--ink-d); border-color: var(--gold-l); }
.topic-card.selected .t-name { color: var(--gold-l); }
.topic-card.selected .t-sub { color: rgba(200,160,80,.7); }
.topic-card.wide { grid-column: 1/-1; flex-direction: row; justify-content: center; gap: 10px; }

.t-emoji { font-size: 1.2rem; }
.t-name { font-family: 'Cinzel', serif; font-size: .78rem; color: var(--ink); letter-spacing: .04em; }
.t-sub { font-family: 'IM Fell English', serif; font-size: .72rem; color: var(--text-l); font-style: italic; }

/* ── CHAT ── */
.chat-area { padding: 20px 18px 12px; display: flex; flex-direction: column; gap: 14px; }

.letter-bubble {
  padding: 14px 16px;
  border-radius: 3px;
  font-family: 'IM Fell English', serif;
  font-size: .92rem;
  line-height: 1.8;
  animation: fadeIn .3s ease;
  position: relative;
  max-width: 88%;
}

@keyframes fadeIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }

.letter-from {
  background: var(--white);
  border: 1px solid var(--gold);
  align-self: flex-start;
  color: var(--text-m);
  font-style: italic;
}

.letter-from::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: .5px solid var(--gold-ll);
  border-radius: 2px;
  pointer-events: none;
}

.letter-user {
  background: var(--ink-d);
  border: 1px solid var(--gold);
  align-self: flex-end;
  color: var(--gold-ll);
  font-style: italic;
}

.topic-badge {
  align-self: center;
  background: var(--parch-d);
  border: 1px solid var(--gold);
  border-radius: 20px;
  padding: 4px 14px;
  font-family: 'Cinzel', serif;
  font-size: .65rem;
  color: var(--gold);
  letter-spacing: .08em;
}

.typing-quill {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 12px 16px;
  background: var(--white);
  border: 1px solid var(--gold);
  border-radius: 3px;
  align-self: flex-start;
  animation: fadeIn .25s ease;
}

.qdot {
  width: 6px; height: 6px;
  background: var(--gold-l);
  border-radius: 50%;
  animation: qdot 1.2s infinite;
}
.qdot:nth-child(2){animation-delay:.2s}
.qdot:nth-child(3){animation-delay:.4s}
@keyframes qdot{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}

/* ── INPUT ── */
.input-bar {
  padding: 10px 16px 14px;
  border-top: 1px solid var(--gold);
  background: var(--parch-d);
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-shrink: 0;
}

.quill-textarea {
  flex: 1;
  border: none;
  border-bottom: 1px solid var(--gold);
  background: transparent;
  font-family: 'IM Fell English', serif;
  font-size: .92rem;
  color: var(--text);
  resize: none;
  outline: none;
  min-height: 38px;
  max-height: 90px;
  line-height: 1.5;
  font-style: italic;
  padding: 4px 6px;
}

.quill-textarea::placeholder { color: var(--text-l); }

.seal-send {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--seal);
  border: 1px solid var(--gold);
  color: var(--gold-ll);
  font-size: .9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all .15s;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.15);
}

.seal-send:hover { background: var(--seal-l); transform: scale(1.06); }
.seal-send:disabled { opacity: .4; cursor: default; transform: none; }

/* ── PROFILO ── */
.profile-section { padding: 24px 24px; display: flex; flex-direction: column; gap: 16px; }

.profile-scroll {
  background: var(--white);
  border: 1px solid var(--gold);
  border-radius: 3px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-wax {
  width: 50px; height: 50px;
  border-radius: 50%;
  background: var(--seal);
  color: var(--gold-ll);
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--gold);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.15);
}

.profile-name { font-family: 'Cinzel', serif; font-size: .95rem; color: var(--ink); letter-spacing: .04em; }
.profile-detail { font-family: 'IM Fell English', serif; font-size: .78rem; color: var(--text-l); margin-top: 2px; font-style: italic; }

.info-scroll {
  background: var(--white);
  border: 1px solid var(--gold);
  border-radius: 3px;
  padding: 14px 16px;
  font-family: 'IM Fell English', serif;
  font-size: .85rem;
  color: var(--text-m);
  line-height: 1.65;
}

.info-scroll strong { color: var(--ink); }

.change-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--gold);
  border-radius: 3px;
  background: transparent;
  color: var(--ink);
  font-family: 'Cinzel', serif;
  font-size: .72rem;
  font-weight: 400;
  cursor: pointer;
  transition: all .2s;
  letter-spacing: .08em;
}

.change-btn:hover { background: var(--parch-d); }

/* ── DONAZIONI ── */
.donation-section { padding: 24px; display: flex; flex-direction: column; gap: 16px; }

.donation-hero {
  background: var(--white);
  border: 1px solid var(--gold);
  border-radius: 3px;
  padding: 20px;
  text-align: center;
}

.donation-icon { font-size: 2.4rem; margin-bottom: 8px; }
.donation-title { font-family: 'Cinzel', serif; font-size: 1.1rem; color: var(--ink); letter-spacing: .06em; margin-bottom: 6px; }
.donation-text { font-family: 'IM Fell English', serif; font-size: .85rem; color: var(--text-m); line-height: 1.65; font-style: italic; }

.kofi-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: #c0392b;
  color: var(--gold-ll);
  border: 1px solid var(--gold);
  border-radius: 3px;
  font-family: 'Cinzel', serif;
  font-size: .78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .15s;
  text-decoration: none;
  letter-spacing: .08em;
}

.kofi-btn:hover { background: #e74c3c; transform: translateY(-1px); }

.donation-note {
  font-family: 'IM Fell English', serif;
  font-size: .75rem;
  color: var(--text-l);
  text-align: center;
  font-style: italic;
  line-height: 1.6;
}

.what-scroll {
  background: var(--white);
  border: 1px solid var(--gold);
  border-radius: 3px;
  padding: 16px;
}

.what-title {
  font-family: 'Cinzel', serif;
  font-size: .68rem;
  color: var(--gold);
  letter-spacing: .1em;
  margin-bottom: 10px;
  text-align: center;
}

.what-item {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-bottom: 7px;
  font-family: 'IM Fell English', serif;
  font-size: .83rem;
  color: var(--text-m);
  line-height: 1.5;
  font-style: italic;
}
`;

export default function UnAmico() {
  const [screen, setScreen]         = useState("welcome");
  const [activeTab, setActiveTab]   = useState("chat");
  const [userName, setUserName]     = useState("");
  const [userEmail, setUserEmail]   = useState("");
  const [friendName, setFriendName] = useState("");
  const [selectedTopic, setTopic]   = useState(null);
  const [messages, setMessages]     = useState([]);
  const [apiHistory, setApiHistory] = useState([]);
  const [inputVal, setInputVal]     = useState("");
  const [isTyping, setIsTyping]     = useState(false);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const currentTopic = TOPICS.find(t => t.id === selectedTopic);
  const fName = friendName.trim() || "Leo";

  const startChat = () => {
    const topicLabel = currentTopic ? `${currentTopic.emoji} ${currentTopic.label}` : "Chiacchiere";
    const welcome = {
      role: "assistant",
      content: `Caro/a ${userName},\n\nho ricevuto la tua lettera con gioia. Hai scelto di parlare di "${topicLabel}" — ti ascolto con tutto il cuore.\n\nCome stai, davvero?\n\nCon affetto,\n${fName}`
    };
    setMessages([welcome]);
    setApiHistory([welcome]);
    setScreen("chat");
    setActiveTab("chat");
  };

  const sendMessage = async () => {
    if (!inputVal.trim() || isTyping) return;
    const userMsg = { role: "user", content: inputVal.trim() };
    setInputVal("");
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    const newHist = [...apiHistory, userMsg];
    setIsTyping(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT(userName, fName, selectedTopic || "chiacchiere"),
          messages: newHist,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "...";
      const aMsg = { role: "assistant", content: reply };
      setMessages([...newMsgs, aMsg]);
      setApiHistory([...newHist, aMsg]);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "La penna si è fermata un momento. Riprova tra poco 🪶" }]);
    } finally { setIsTyping(false); }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const headerTitle = screen === "chat" ? fName : "Un Amico";
  const headerSub   = screen === "chat" ? "in ascolto" : "Un posto dove non sei solo";

  return (
    <>
      <style>{css}</style>
      <div className="app-wrap">
        <div className="card">

          {/* HEADER */}
          <div className="header">
            <div className="header-ornament">✦ ─── ✦ ─── ✦</div>
            <div className="header-title">{headerTitle}</div>
            {screen === "chat"
              ? <div className="online-row"><div className="seal-dot" /><div className="header-sub">{headerSub}</div></div>
              : <div className="header-sub">{headerSub}</div>
            }
          </div>

          {/* NAV */}
          {screen === "chat" && (
            <nav className="nav">
              {[["chat","✦ Lettere"],["profilo","✦ Profilo"],["sostieni","✦ Sostieni"]].map(([id,label]) => (
                <button key={id} className={`nav-btn${activeTab===id?" active":""}`} onClick={() => setActiveTab(id)}>{label}</button>
              ))}
            </nav>
          )}

          {/* ── WELCOME ── */}
          {screen === "welcome" && (
            <div className="body">
              <div className="onboard">
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
                <div className="section-title">Caro Lettore</div>
                <div className="parch-box">
                  Prima di iniziare, voglio essere onesto con te: sono un'app creata da una <strong>persona comune</strong>, non uno psicologo, medico o professionista della salute mentale.<br /><br />
                  Posso ascoltarti e farti compagnia — come farebbe un amico. Se stai attraversando una vera crisi, ti chiedo di parlare con qualcuno di fiducia.
                </div>
                <p className="emergency">⚠ In caso di emergenza: <strong>112</strong><br />Telefono Amico: <strong>02-2327-2327</strong></p>
                <div className="btn-seal" onClick={() => setScreen("register")} style={{cursor:"pointer"}}>
                  <span>🪶</span> Ho capito, continua
                </div>
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
              </div>
            </div>
          )}

          {/* ── REGISTRAZIONE ── */}
          {screen === "register" && (
            <div className="body">
              <div className="onboard">
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
                <div className="section-title">Chi sei?</div>
                <div className="section-sub">Due parole per conoscerti</div>
                <div>
                  <div className="f-label">IL TUO NOME *</div>
                  <input className="f-input" placeholder="Come ti chiami?" value={userName} onChange={e => setUserName(e.target.value)} />
                </div>
                <div>
                  <div className="f-label">EMAIL <span style={{fontWeight:300,opacity:.7}}>(facoltativa)</span></div>
                  <input className="f-input" type="email" placeholder="Per ricevere aggiornamenti..." value={userEmail} onChange={e => setUserEmail(e.target.value)} />
                </div>
                <div>
                  <div className="f-label">NOME DEL TUO AMICO</div>
                  <input className="f-input" placeholder="Es. Leo, Sofia, Marco… (default: Leo)" value={friendName} onChange={e => setFriendName(e.target.value)} />
                </div>
                <button className="btn-seal" disabled={!userName.trim()} onClick={() => setScreen("topic")}>
                  <span>🪶</span> Avanti
                </button>
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
              </div>
            </div>
          )}

          {/* ── ARGOMENTO ── */}
          {screen === "topic" && (
            <div className="body">
              <div className="onboard">
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
                <div className="section-title">Di cosa vuoi scrivere?</div>
                <div className="section-sub">Scegli il tuo argomento</div>
                <div className="topic-grid">
                  {TOPICS.map(t => (
                    <button key={t.id}
                      className={`topic-card${t.id==="chiacchiere"?" wide":""}${selectedTopic===t.id?" selected":""}`}
                      onClick={() => setTopic(t.id)}>
                      <div className="t-emoji">{t.emoji}</div>
                      <div className="t-name">{t.label}</div>
                      <div className="t-sub">{t.sub}</div>
                    </button>
                  ))}
                </div>
                <button className="btn-seal" disabled={!selectedTopic} onClick={startChat}>
                  <span>🪶</span> Scrivi la prima lettera
                </button>
                <button className="btn-link" onClick={() => setScreen("register")}>← Torna indietro</button>
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
              </div>
            </div>
          )}

          {/* ── CHAT ── */}
          {screen === "chat" && activeTab === "chat" && (
            <>
              <div className="body">
                <div className="chat-area">
                  {currentTopic && (
                    <div className="topic-badge">✦ {currentTopic.emoji} {currentTopic.label} {currentTopic.sub} ✦</div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i}
                      className={`letter-bubble ${m.role==="assistant"?"letter-from":"letter-user"}`}
                      style={{whiteSpace:"pre-wrap"}}>
                      {m.content}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="typing-quill">
                      <div className="qdot"/><div className="qdot"/><div className="qdot"/>
                      <span style={{fontSize:".78rem",color:"var(--text-l)",fontFamily:"'IM Fell English',serif",fontStyle:"italic",marginLeft:4}}>sta scrivendo...</span>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>
              </div>
              <div className="input-bar">
                <textarea
                  ref={inputRef}
                  className="quill-textarea"
                  placeholder="Scrivi la tua lettera..."
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                  onInput={e => { e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,90)+"px"; }}
                />
                <button className="seal-send" disabled={!inputVal.trim()||isTyping} onClick={sendMessage} title="Sigilla e invia">✦</button>
              </div>
            </>
          )}

          {/* ── PROFILO ── */}
          {screen === "chat" && activeTab === "profilo" && (
            <div className="body">
              <div className="profile-section">
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
                <div className="profile-scroll">
                  <div className="profile-wax">{userName[0]?.toUpperCase()}</div>
                  <div>
                    <div className="profile-name">{userName}</div>
                    <div className="profile-detail">{userEmail || "Nessuna email fornita"}</div>
                    <div className="profile-detail">Corrisponde con: <em style={{color:"var(--ink)"}}>{fName}</em></div>
                  </div>
                </div>
                {currentTopic && (
                  <div className="info-scroll">Argomento scelto: <strong>{currentTopic.emoji} {currentTopic.label} {currentTopic.sub}</strong></div>
                )}
                <button className="change-btn" onClick={() => { setTopic(null); setScreen("topic"); }}>
                  ✦ Cambia argomento
                </button>
                <div className="info-scroll">
                  <strong>Nota importante</strong><br />
                  Questa app è creata da una persona comune. In caso di vera difficoltà chiama il <strong>112</strong>.
                </div>
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
              </div>
            </div>
          )}

          {/* ── SOSTIENI ── */}
          {screen === "chat" && activeTab === "sostieni" && (
            <div className="body">
              <div className="donation-section">
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
                <div className="donation-hero">
                  <div className="donation-icon">☕</div>
                  <div className="donation-title">Ti piace Un Amico?</div>
                  <p className="donation-text">Questa app è nata da una persona comune, con la voglia di creare qualcosa di utile per chi si sente solo. Se ti ha fatto compagnia, anche una piccola donazione aiuta a tenerla in vita.</p>
                </div>
                <a className="kofi-btn" href={KOFI_LINK} target="_blank" rel="noopener noreferrer">
                  ☕ Offrimi un caffè su Ko-fi
                </a>
                <p className="donation-note">Nessun obbligo, solo gratitudine 🙏<br />Ogni donazione è libera e anonima.</p>
                <div className="what-scroll">
                  <div className="what-title">✦ A COSA SERVONO LE DONAZIONI ✦</div>
                  {[["🔧","Mantenere i server attivi"],["✨","Aggiungere nuovi argomenti"],["🌍","Tradurre in altre lingue"],["💙","Tenere tutto gratuito"]].map(([icon,text]) => (
                    <div key={text} className="what-item"><span style={{fontSize:14}}>{icon}</span><span>{text}</span></div>
                  ))}
                </div>
                <div className="ornament-divider">✦ ─── ✦ ─── ✦</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
