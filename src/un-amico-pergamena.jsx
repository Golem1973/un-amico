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
body{min-height:100vh;font-family:'Lora',serif;background:#1a0e05;}
.app-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(ellipse at 30% 20%,rgba(80,40,10,0.8) 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,rgba(60,25,5,0.9) 0%,transparent 60%),#1a0e05;}
.card{width:100%;max-width:480px;border-radius:2px;overflow:hidden;display:flex;flex-direction:column;min-height:640px;max-height:94vh;animation:unfurl .7s cubic-bezier(.22,1,.36,1);position:relative;background:repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(139,100,40,0.03) 28px,rgba(139,100,40,0.03) 29px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(139,100,40,0.02) 40px,rgba(139,100,40,0.02) 41px),linear-gradient(160deg,#f2dda0 0%,#e8c870 15%,#f5e0a0 30%,#ddb84e 45%,#f0d888 60%,#e2c060 75%,#f5e0a0 90%,#d4a830 100%);box-shadow:0 0 0 1px rgba(100,60,10,0.6),0 0 0 3px rgba(80,45,5,0.4),0 0 0 5px rgba(60,30,0,0.3),0 30px 80px rgba(0,0,0,0.8),inset 0 0 80px rgba(139,90,20,0.2),inset 0 0 20px rgba(100,60,10,0.15);}
.card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 0% 0%,rgba(80,40,0,0.4) 0%,transparent 30%),radial-gradient(ellipse at 100% 0%,rgba(60,30,0,0.3) 0%,transparent 25%),radial-gradient(ellipse at 0% 100%,rgba(70,35,0,0.4) 0%,transparent 25%),radial-gradient(ellipse at 100% 100%,rgba(80,40,0,0.5) 0%,transparent 30%);pointer-events:none;z-index:10;}
.card::after{content:'';position:absolute;inset:8px;border:1px solid rgba(180,130,40,0.5);pointer-events:none;z-index:11;box-shadow:inset 0 0 0 2px rgba(220,170,60,0.2);}
@keyframes unfurl{from{opacity:0;transform:scaleY(.96) translateY(16px)}to{opacity:1;transform:none}}
.header{padding:24px 28px 18px;text-align:center;flex-shrink:0;position:relative;background:linear-gradient(180deg,rgba(15,8,2,0.97) 0%,rgba(20,10,3,0.95) 100%);border-bottom:1px solid rgba(180,130,40,0.6);box-shadow:0 4px 20px rgba(0,0,0,0.5);}
.header::after{content:'';position:absolute;bottom:-1px;left:20px;right:20px;height:1px;background:linear-gradient(90deg,transparent,rgba(220,170,60,0.8),transparent);}
.h-orn{font-size:.8rem;color:rgba(220,175,60,0.85);letter-spacing:.3em;margin-bottom:8px;font-family:'Cinzel',serif;}
.h-title{font-family:'Cinzel',serif;font-size:2.2rem;background:linear-gradient(180deg,#f0d060 0%,#c8960a 40%,#e8c040 70%,#a07010 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:.15em;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));}
.h-sub{font-family:'IM Fell English',serif;font-size:1rem;color:rgba(220,175,60,0.8);margin-top:6px;font-style:italic;letter-spacing:.05em;}
.online-row{display:flex;align-items:center;justify-content:center;gap:7px;margin-top:4px;}
.seal-dot{width:8px;height:8px;background:radial-gradient(circle at 35% 35%,#ff8080,#8b1a1a);border-radius:50%;animation:pulse 2s infinite;box-shadow:0 0 6px rgba(180,30,30,.5);}
@keyframes pulse{50%{box-shadow:0 0 10px rgba(180,30,30,.3);}}
.nav{display:flex;flex-shrink:0;background:rgba(15,8,2,0.85);border-bottom:1px solid rgba(140,100,30,0.5);}
.nav-btn{flex:1;padding:13px 4px;border:none;background:none;font-family:'Cinzel',serif;font-size:.75rem;color:rgba(180,130,40,0.6);cursor:pointer;transition:all .2s;border-bottom:2px solid transparent;letter-spacing:.06em;margin-bottom:-1px;}
.nav-btn.active{color:rgba(230,180,60,0.98);border-bottom-color:rgba(210,160,40,0.9);background:rgba(30,15,3,0.6);}
.body{flex:1;overflow-y:auto;position:relative;}
.body::-webkit-scrollbar{width:4px;}
.body::-webkit-scrollbar-thumb{background:linear-gradient(180deg,rgba(160,110,30,0.6),rgba(100,65,10,0.6));border-radius:2px;}
.onboard{padding:28px 22px;display:flex;flex-direction:column;gap:20px;}
.orn{text-align:center;font-family:'Cinzel',serif;font-size:.75rem;color:rgba(100,65,15,0.8);letter-spacing:.2em;}
.s-title{font-family:'Cinzel',serif;font-size:1.35rem;color:#1a0a00;text-align:center;letter-spacing:.08em;}
.s-sub{font-family:'IM Fell English',serif;font-size:1rem;color:#4a2a05;text-align:center;font-style:italic;margin-top:-12px;}
.pbox{background:linear-gradient(135deg,rgba(255,250,225,0.98),rgba(248,235,190,0.95));border:1px solid rgba(140,95,25,0.6);border-radius:1px;padding:18px 20px;font-family:'Lora',serif;font-size:1.05rem;color:#1a0a00;line-height:1.85;position:relative;box-shadow:inset 0 0 30px rgba(139,100,20,0.08),0 2px 8px rgba(80,40,0,0.15);}
.pbox::before{content:'';position:absolute;inset:4px;border:.5px solid rgba(180,130,40,0.25);pointer-events:none;}
.pbox strong{color:#0d0500;font-style:normal;}
.emergency{font-family:'IM Fell English',serif;font-size:.9rem;color:rgba(60,30,5,0.8);text-align:center;font-style:italic;line-height:1.6;}
.f-label{font-family:'Cinzel',serif;font-size:.75rem;color:rgba(80,45,5,0.9);letter-spacing:.1em;margin-bottom:6px;}
.f-input{width:100%;padding:11px 4px;border:none;border-bottom:1.5px solid rgba(120,80,20,0.6);background:transparent;font-family:'Lora',serif;font-size:1.1rem;color:#1a0800;outline:none;transition:border-color .2s;}
.f-input:focus{border-bottom-color:rgba(60,25,0,0.95);}
.f-input::placeholder{color:rgba(100,60,15,0.5);}
.btn-wax{width:100%;padding:16px;background:linear-gradient(180deg,#2a1208 0%,#1a0a04 100%);color:#f0c840;border:1px solid rgba(180,130,40,0.7);border-radius:1px;font-family:'Cinzel',serif;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .2s;letter-spacing:.12em;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 4px 12px rgba(0,0,0,0.4),inset 0 1px 0 rgba(200,150,40,0.15);}
.btn-wax:hover{background:linear-gradient(180deg,#3a1a0a 0%,#2a1008 100%);}
.btn-wax:disabled{opacity:.4;cursor:default;}
.wax-seal{width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e05050,#7a1010 60%,#4a0808 100%);display:flex;align-items:center;justify-content:center;font-size:.85rem;color:rgba(255,210,170,0.95);box-shadow:0 2px 6px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,150,100,0.3);flex-shrink:0;}
.btn-link{background:none;border:none;color:rgba(80,45,5,0.7);font-family:'IM Fell English',serif;font-size:1rem;cursor:pointer;text-align:center;font-style:italic;text-decoration:underline;}
.topic-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.topic-card{border:1px solid rgba(140,95,25,0.5);border-radius:1px;padding:16px 10px;cursor:pointer;transition:all .2s;background:rgba(255,248,210,0.7);text-align:center;display:flex;flex-direction:column;align-items:center;gap:5px;}
.topic-card:hover{background:rgba(255,242,180,0.9);}
.topic-card.selected{background:linear-gradient(135deg,#1a0a04,#2a1208);border-color:rgba(200,150,40,0.8);}
.topic-card.selected .t-name{color:#f0c840;}
.topic-card.selected .t-sub{color:rgba(200,150,40,0.75);}
.topic-card.wide{grid-column:1/-1;flex-direction:row;justify-content:center;gap:12px;}
.t-emoji{font-size:1.6rem;}
.t-name{font-family:'Cinzel',serif;font-size:.88rem;color:#1a0800;letter-spacing:.04em;}
.t-sub{font-family:'IM Fell English',serif;font-size:.85rem;color:#4a2a05;font-style:italic;}
.chat-area{padding:20px 16px 12px;display:flex;flex-direction:column;gap:14px;}
.letter-bubble{padding:16px 18px;border-radius:1px;font-family:'Lora',serif;font-size:1.05rem;line-height:1.9;animation:fadeIn .3s ease;position:relative;max-width:92%;}
@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
.letter-from{background:linear-gradient(135deg,rgba(255,250,220,0.98),rgba(248,232,175,0.95));border:1px solid rgba(140,95,25,0.5);align-self:flex-start;color:#1a0800;box-shadow:2px 3px 10px rgba(80,40,0,0.15),inset 0 0 20px rgba(200,150,30,0.06);}
.letter-from::before{content:'';position:absolute;inset:4px;border:.5px solid rgba(180,130,40,0.2);pointer-events:none;}
.letter-user{background:linear-gradient(135deg,#1a0a04,#2a1208);border:1px solid rgba(160,110,30,0.5);align-self:flex-end;color:#f0d060;box-shadow:-2px 3px 10px rgba(0,0,0,0.3);}
.topic-badge{align-self:center;background:rgba(20,10,3,0.75);border:1px solid rgba(160,120,40,0.6);border-radius:20px;padding:6px 18px;font-family:'Cinzel',serif;font-size:.75rem;color:rgba(210,160,50,0.9);letter-spacing:.08em;}
.typing-ink{display:flex;gap:5px;align-items:center;padding:14px 18px;background:rgba(255,248,210,0.8);border:1px solid rgba(140,95,25,0.4);border-radius:1px;align-self:flex-start;animation:fadeIn .25s ease;}
.qdot{width:7px;height:7px;background:rgba(120,75,15,0.8);border-radius:50%;animation:qdot 1.2s infinite;}
.qdot:nth-child(2){animation-delay:.2s}
.qdot:nth-child(3){animation-delay:.4s}
@keyframes qdot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}
.input-bar{padding:12px 16px 16px;border-top:1px solid rgba(140,95,25,0.4);background:rgba(235,210,140,0.35);display:flex;gap:10px;align-items:flex-end;flex-shrink:0;}
.quill-ta{flex:1;border:none;border-bottom:1.5px solid rgba(100,60,10,0.5);background:transparent;font-family:'Lora',serif;font-size:1.05rem;color:#1a0800;resize:none;outline:none;min-height:38px;max-height:100px;line-height:1.55;padding:4px 6px;}
.quill-ta::placeholder{color:rgba(100,60,15,0.45);}
.seal-send{width:46px;height:46px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#d04040,#7a0f0f 55%,#500808 100%);border:1px solid rgba(180,110,30,0.7);color:rgba(255,210,170,0.95);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;box-shadow:0 3px 10px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,150,100,0.3),inset 0 -1px 0 rgba(0,0,0,0.3);}
.seal-send:hover{transform:scale(1.08);}
.seal-send:disabled{opacity:.35;cursor:default;transform:none;}
.profile-section{padding:26px 24px;display:flex;flex-direction:column;gap:16px;}
.profile-card{background:rgba(255,245,200,0.7);border:1px solid rgba(140,95,25,0.5);border-radius:1px;padding:18px;display:flex;align-items:center;gap:14px;}
.profile-wax{width:52px;height:52px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#c03030,#7a0f0f 55%,#500808 100%);color:rgba(255,200,150,0.9);font-family:'Cinzel',serif;font-size:1.4rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:2px solid rgba(160,110,30,0.6);box-shadow:0 3px 10px rgba(0,0,0,0.3);}
.profile-name{font-family:'Cinzel',serif;font-size:1rem;color:#2a1500;letter-spacing:.05em;}
.profile-detail{font-family:'IM Fell English',serif;font-size:.8rem;color:#6b4010;margin-top:2px;font-style:italic;}
.info-box{background:rgba(255,245,200,0.6);border:1px solid rgba(140,95,25,0.4);border-radius:1px;padding:14px 16px;font-family:'IM Fell English',serif;font-size:.88rem;color:#4a2e08;line-height:1.7;}
.info-box strong{color:#1a0e05;}
.change-btn{width:100%;padding:11px;border:1px solid rgba(120,80,20,0.4);border-radius:1px;background:transparent;color:#4a2e08;font-family:'Cinzel',serif;font-size:.7rem;cursor:pointer;transition:all .2s;letter-spacing:.1em;}
.change-btn:hover{background:rgba(200,150,30,0.1);}
.donation-section{padding:26px 24px;display:flex;flex-direction:column;gap:16px;}
.donation-hero{background:rgba(255,245,200,0.7);border:1px solid rgba(140,95,25,0.5);border-radius:1px;padding:22px;text-align:center;}
.donation-icon{font-size:2.6rem;margin-bottom:10px;}
.donation-title{font-family:'Cinzel',serif;font-size:1.1rem;color:#2a1500;letter-spacing:.08em;margin-bottom:8px;}
.donation-text{font-family:'IM Fell English',serif;font-size:.88rem;color:#4a2e08;line-height:1.7;font-style:italic;}
.kofi-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px;background:linear-gradient(180deg,#8b1a1a,#5a0808);color:rgba(255,200,150,0.95);border:1px solid rgba(160,100,30,0.5);border-radius:1px;font-family:'Cinzel',serif;font-size:.75rem;font-weight:600;cursor:pointer;transition:all .15s;text-decoration:none;letter-spacing:.1em;box-shadow:0 4px 12px rgba(0,0,0,0.3);}
.kofi-btn:hover{background:linear-gradient(180deg,#a02020,#6a1010);transform:translateY(-1px);}
.donation-note{font-family:'IM Fell English',serif;font-size:.78rem;color:rgba(80,50,10,0.6);text-align:center;font-style:italic;line-height:1.6;}
.what-box{background:rgba(255,245,200,0.6);border:1px solid rgba(140,95,25,0.4);border-radius:1px;padding:16px;}
.what-title{font-family:'Cinzel',serif;font-size:.65rem;color:rgba(120,80,20,0.7);letter-spacing:.12em;margin-bottom:12px;text-align:center;}
.what-item{display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;font-family:'IM Fell English',serif;font-size:.86rem;color:#4a2e08;line-height:1.5;font-style:italic;}
`;

export default function UnAmico() {
  const [screen, setScreen]         = useState("welcome");
  const [activeTab, setActiveTab]   = useState("chat");
  const [userName, setUserName]     = useState("");
  const [userEmail, setUserEmail]   = useState("");
  const [friendName, setFriendName] = useState("");
  const [selectedTopic, setTopic]   = useState(null);
  const [messages, setMessages]     = useState([]);
  const [apiHistory, setApiHist]    = useState([]);
  const [inputVal, setInputVal]     = useState("");
  const [isTyping, setIsTyping]     = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const currentTopic = TOPICS.find(t => t.id === selectedTopic);
  const fName = friendName.trim() || "Leo";

  const startChat = () => {
    const topicLabel = currentTopic ? `${currentTopic.emoji} ${currentTopic.label}` : "Chiacchiere";
    const welcome = { role: "assistant", content: `Caro/a ${userName},\n\nho ricevuto la tua lettera con gioia. Hai scelto di parlare di "${topicLabel}" — ti ascolto con tutto il cuore.\n\nCome stai, davvero?\n\nCon affetto,\n${fName}` };
    setMessages([welcome]);
    setApiHist([welcome]);
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
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: SYSTEM_PROMPT(userName, fName, selectedTopic || "chiacchiere"), messages: newHist }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "...";
      const aMsg = { role: "assistant", content: reply };
      setMessages([...newMsgs, aMsg]);
      setApiHist([...newHist, aMsg]);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "La penna si è fermata un momento. Riprova tra poco 🪶" }]);
    } finally { setIsTyping(false); }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <>
      <style>{css}</style>
      <div className="app-wrap">
        <div className="card">
          <div className="header">
            <div className="h-orn">✦ ── ✦ ── ✦</div>
            <div className="h-title">{screen === "chat" ? fName : "Un Amico"}</div>
            {screen === "chat" ? <div className="online-row"><div className="seal-dot"/><div className="h-sub">in ascolto</div></div> : <div className="h-sub">Un posto dove non sei solo</div>}
          </div>

          {screen === "chat" && (
            <nav className="nav">
              {[["chat","✦ Lettere"],["profilo","✦ Profilo"],["sostieni","✦ Sostieni"]].map(([id,label]) => (
                <button key={id} className={`nav-btn${activeTab===id?" active":""}`} onClick={() => setActiveTab(id)}>{label}</button>
              ))}
            </nav>
          )}

          {screen === "welcome" && (
            <div className="body"><div className="onboard">
              <div className="orn">✦ ── ✦ ── ✦</div>
              <div className="s-title">Caro Lettore</div>
              <div className="pbox">Prima di iniziare, voglio essere onesto con te: sono un'app creata da una <strong>persona comune</strong>, non uno psicologo, medico o professionista della salute mentale.<br/><br/>Posso ascoltarti e farti compagnia — come farebbe un amico. Se stai attraversando una vera crisi, ti chiedo di parlare con qualcuno di fiducia.</div>
              <p className="emergency">⚠ In caso di emergenza: <strong>112</strong><br/>Telefono Amico: <strong>02-2327-2327</strong></p>
              <button className="btn-wax" onClick={() => setScreen("register")}><div className="wax-seal">🪶</div>Ho capito, continua</button>
              <div className="orn">✦ ── ✦ ── ✦</div>
            </div></div>
          )}

          {screen === "register" && (
            <div className="body"><div className="onboard">
              <div className="orn">✦ ── ✦ ── ✦</div>
              <div className="s-title">Chi sei?</div>
              <div className="s-sub">Due parole per conoscerti</div>
              <div><div className="f-label">IL TUO NOME *</div><input className="f-input" placeholder="Come ti chiami?" value={userName} onChange={e => setUserName(e.target.value)}/></div>
              <div><div className="f-label">EMAIL (facoltativa)</div><input className="f-input" type="email" placeholder="Per ricevere aggiornamenti..." value={userEmail} onChange={e => setUserEmail(e.target.value)}/></div>
              <div><div className="f-label">NOME DEL TUO AMICO</div><input className="f-input" placeholder="Es. Leo, Sofia, Marco… (default: Leo)" value={friendName} onChange={e => setFriendName(e.target.value)}/></div>
              <button className="btn-wax" disabled={!userName.trim()} onClick={() => setScreen("topic")}><div className="wax-seal">✦</div>Avanti</button>
              <div className="orn">✦ ── ✦ ── ✦</div>
            </div></div>
          )}

          {screen === "topic" && (
            <div className="body"><div className="onboard">
              <div className="orn">✦ ── ✦ ── ✦</div>
              <div className="s-title">Di cosa vuoi scrivere?</div>
              <div className="s-sub">Scegli il tuo argomento</div>
              <div className="topic-grid">
                {TOPICS.map(t => (
                  <button key={t.id} className={`topic-card${t.id==="chiacchiere"?" wide":""}${selectedTopic===t.id?" selected":""}`} onClick={() => setTopic(t.id)}>
                    <div className="t-emoji">{t.emoji}</div>
                    <div className="t-name">{t.label}</div>
                    <div className="t-sub">{t.sub}</div>
                  </button>
                ))}
              </div>
              <button className="btn-wax" disabled={!selectedTopic} onClick={startChat}><div className="wax-seal">✦</div>Scrivi la prima lettera</button>
              <button className="btn-link" onClick={() => setScreen("register")}>← Torna indietro</button>
              <div className="orn">✦ ── ✦ ── ✦</div>
            </div></div>
          )}

          {screen === "chat" && activeTab === "chat" && (
            <>
              <div className="body"><div className="chat-area">
                {currentTopic && <div className="topic-badge">✦ {currentTopic.emoji} {currentTopic.label} {currentTopic.sub} ✦</div>}
                {messages.map((m,i) => <div key={i} className={`letter-bubble ${m.role==="assistant"?"letter-from":"letter-user"}`} style={{whiteSpace:"pre-wrap"}}>{m.content}</div>)}
                {isTyping && <div className="typing-ink"><div className="qdot"/><div className="qdot"/><div className="qdot"/><span style={{fontSize:".78rem",color:"rgba(100,65,15,0.6)",fontFamily:"'IM Fell English',serif",fontStyle:"italic",marginLeft:6}}>sta scrivendo...</span></div>}
                <div ref={endRef}/>
              </div></div>
              <div className="input-bar">
                <textarea className="quill-ta" placeholder="Scrivi la tua lettera..." value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={handleKey} rows={1} onInput={e => { e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,90)+"px"; }}/>
                <button className="seal-send" disabled={!inputVal.trim()||isTyping} onClick={sendMessage}>✦</button>
              </div>
            </>
          )}

          {screen === "chat" && activeTab === "profilo" && (
            <div className="body"><div className="profile-section">
              <div className="orn">✦ ── ✦ ── ✦</div>
              <div className="profile-card">
                <div className="profile-wax">{userName[0]?.toUpperCase()}</div>
                <div>
                  <div className="profile-name">{userName}</div>
                  <div className="profile-detail">{userEmail || "Nessuna email fornita"}</div>
                  <div className="profile-detail">Corrisponde con: <em style={{color:"#2a1500"}}>{fName}</em></div>
                </div>
              </div>
              {currentTopic && <div className="info-box">Argomento: <strong>{currentTopic.emoji} {currentTopic.label} {currentTopic.sub}</strong></div>}
              <button className="change-btn" onClick={() => { setTopic(null); setScreen("topic"); }}>✦ Cambia argomento</button>
              <div className="info-box"><strong>Nota importante</strong><br/>Questa app è creata da una persona comune. In caso di vera difficoltà chiama il <strong>112</strong>.</div>
              <div className="orn">✦ ── ✦ ── ✦</div>
            </div></div>
          )}

          {screen === "chat" && activeTab === "sostieni" && (
            <div className="body"><div className="donation-section">
              <div className="orn">✦ ── ✦ ── ✦</div>
              <div className="donation-hero">
                <div className="donation-icon">☕</div>
                <div className="donation-title">Ti piace Un Amico?</div>
                <p className="donation-text">Questa app è nata da una persona comune, con la voglia di creare qualcosa di utile per chi si sente solo. Se ti ha fatto compagnia, una piccola donazione aiuta a tenerla in vita.</p>
              </div>
              <a className="kofi-btn" href={KOFI_LINK} target="_blank" rel="noopener noreferrer">☕ Offrimi un caffè su Ko-fi</a>
              <p className="donation-note">Nessun obbligo, solo gratitudine 🙏<br/>Ogni donazione è libera e anonima.</p>
              <div className="what-box">
                <div className="what-title">✦ A COSA SERVONO LE DONAZIONI ✦</div>
                {[["🔧","Mantenere i server attivi"],["✨","Aggiungere nuovi argomenti"],["🌍","Tradurre in altre lingue"],["💙","Tenere tutto gratuito"]].map(([icon,text]) => (
                  <div key={text} className="what-item"><span style={{fontSize:14}}>{icon}</span><span>{text}</span></div>
                ))}
              </div>
              <div className="orn">✦ ── ✦ ── ✦</div>
            </div></div>
          )}

        </div>
      </div>
    </>
  );
}
