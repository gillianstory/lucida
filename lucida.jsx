import { useState, useRef, useEffect } from "react";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Italiana&family=Poiret+One&display=swap";
document.head.appendChild(fontLink);

const NAVY   = "#09172A";
const NAVY2  = "#0D1E38";
const GOLDW  = "#E2B94E";
const GOLD   = "#D4A843";
const GOLDD  = "rgba(226,185,78,0.75)";
const GOLDDD = "rgba(226,185,78,0.28)";
const BORDER = "rgba(226,185,78,0.28)";
const TEXT   = "#F2EAD8";
const TEXTD  = "rgba(242,234,216,0.82)";
const TEXTDD = "rgba(242,234,216,0.55)";
const DIMMER = "rgba(242,234,216,0.12)";
const CRIMSON= "#8B1A2A";
const DISPLAY= "'Italiana', Georgia, serif";
const BODY   = "'Poiret One', 'Palatino Linotype', Georgia, serif";

const TYPES = {
  idea:    { label:"Idea",    color:"#E2B94E" },
  quote:   { label:"Quote",   color:"#D4B896" },
  visual:  { label:"Visual",  color:"#7DC0D4" },
  sound:   { label:"Sound",   color:"#9BAED4" },
  music:   { label:"Music",   color:"#C98C9A" },
  writing: { label:"Writing", color:"#9ABF9A" },
};

const DEFAULT_FEELINGS = ["electric","inspired","tender","curious","restless","joyful","melancholy","grateful"];

const QUOTES = [
  "The world is full of magic things, patiently waiting for our senses to grow sharper. — W.B. Yeats",
  "Art enables us to find ourselves and lose ourselves at the same time. — Thomas Merton",
  "Everything you can imagine is real. — Pablo Picasso",
  "To create one's own world takes courage. — Georgia O'Keeffe",
  "The most beautiful thing we can experience is the mysterious. — Einstein",
  "There is no greater agony than bearing an untold story inside you. — Maya Angelou",
  "The earth has music for those who listen. — Shakespeare",
  "Beauty is the illumination of your soul. — John O'Donohue",
  "Notice everything. Most of it is beautiful.",
  "Lucida: the brightest star in any constellation.",
];

const INIT_CONS = [
  { id:"c1", name:"The In-Between Hours", desc:"3am light, the blue moment before dawn, golden hour on a Tuesday", ids:[3,4,5] },
  { id:"c2", name:"Women Who Don't Apologise", desc:"Power, beauty, intention — figures who own their space", ids:[1,6,8] },
];

const INIT_SPARKS = [
  { id:1,  type:"visual",  content:"The way afternoon light hit the water glass — refraction patterns crawling up the wall like something alive.", reflection:"Ordinary objects doing extraordinary things, all the time.", context:"Kitchen, Tuesday afternoon", date:"2026-04-08", feeling:"inspired",   cids:["c2"], grad:"linear-gradient(135deg,#1a3a5c,#2d6a8a,#1a3a5c)" },
  { id:2,  type:"quote",   content:"The scariest moment is always just before you start. — Stephen King", reflection:"I needed to hear this today.", context:"", date:"2026-04-07", feeling:"curious",   cids:[], grad:"" },
  { id:3,  type:"sound",   content:"Leaves in the wind outside the back window — that specific rustling, the world exhaling.", reflection:"I could have listened for an hour.", context:"Early morning, still half asleep", date:"2026-04-06", feeling:"tender",   cids:["c1"], grad:"" },
  { id:4,  type:"music",   content:"Clair de Lune — Debussy", reflection:"How does something this old feel this immediate?", context:"Driving home in the rain", date:"2026-04-05", feeling:"melancholy", cids:["c1"], grad:"" },
  { id:5,  type:"idea",    content:"A painting series: the in-between hours. 3am light, the blue moment before dawn, golden hour on an ordinary Tuesday.", reflection:"What if each painting came with a sound?", context:"Couldn't sleep, 3am", date:"2026-04-03", feeling:"electric",  cids:["c1"], grad:"" },
  { id:6,  type:"writing", content:"First line: 'She kept all the doors in the house slightly open, just in case.'", reflection:"In case of what? I don't know yet. That's the story.", context:"", date:"2026-04-01", feeling:"curious",   cids:["c2"], grad:"" },
  { id:7,  type:"visual",  content:"Teal feathers shot through with gold — the way nature does maximalism better than any designer.", reflection:"Everything I want my paintings to feel like.", context:"AGO, third floor", date:"2026-03-28", feeling:"electric",  cids:[], grad:"linear-gradient(145deg,#1a5c4a,#2d8a6a,#c9a84c)" },
  { id:8,  type:"quote",   content:"She is not afraid of the wolf. She chose to sit beside him.", reflection:"This is the character I keep painting.", context:"", date:"2026-03-25", feeling:"inspired",  cids:["c2"], grad:"" },
  { id:9,  type:"music",   content:"Barber's Adagio for Strings", reflection:"Some music makes time stop. This is one of those.", context:"Late night, alone", date:"2026-03-22", feeling:"melancholy", cids:["c1"], grad:"" },
  { id:10, type:"visual",  content:"The fairy in the moonlit forest — gold spiraling up toward a crescent moon. Three sessions and I still don't know how I made it.", reflection:"Sometimes your hand knows before your mind does.", context:"Studio, 11pm", date:"2026-03-18", feeling:"tender",   cids:[], grad:"linear-gradient(160deg,#0d3348,#1a6a7a,#c9a84c)" },
  { id:11, type:"idea",    content:"What if the six del Toro rooms were recreated with my own obsessions? Fairy tales, the in-between hours, women who don't apologise, music that breaks you open.", reflection:"This is the app. This is what Lucida is.", context:"Reading about the AGO exhibit", date:"2026-03-15", feeling:"electric",  cids:["c1","c2"], grad:"" },
  { id:12, type:"writing", content:"'The refraction of light on a glass of water is more interesting than most conversations I've had this week.'", reflection:"", context:"Tuesday morning", date:"2026-03-10", feeling:"restless",  cids:[], grad:"" },
];

const WEEK_LABELS = ["M","T","W","T","F","S","S"];
const RANGE_DAYS  = { week:7, month:30, "3month":90, "6month":180, year:365 };
const RANGE_LABELS= { week:"This week", month:"This month", "3month":"Last 3 months", "6month":"Last 6 months", year:"This year" };

function getMonday() {
  const d=new Date(); const day=d.getDay();
  const diff=d.getDate()-day+(day===0?-6:1);
  const m=new Date(d); m.setDate(diff); return m;
}
function getWeekDays() {
  const mon=getMonday();
  return Array.from({length:7},(_,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return d.toLocaleDateString("en-CA"); });
}
function daysAgo(n) { const d=new Date(); d.setDate(d.getDate()-n); return d.toLocaleDateString("en-CA"); }

async function doTranscribe(b64) {
  try {
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:b64}},{type:"text",text:"Transcribe all text in this image exactly as written. Return only the text."}]}]})});
    const d=await r.json(); return d.content?.[0]?.text||"";
  } catch { return ""; }
}

async function doReflection(sparks, range) {
  try {
    const txt=sparks.slice(0,15).map(s=>s.content).join("\n");
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,messages:[{role:"user",content:`Based on these creative sparks from the past ${range}, write a short poetic reflection (3-5 sentences) about what this person seems to be noticing and feeling. Be specific, poetic, personal. No preamble.\n\n${txt}`}]})});
    const d=await r.json(); return d.content?.[0]?.text||"";
  } catch { return ""; }
}

async function doConstellationInsight(sparks) {
  try {
    const txt=sparks.map(s=>`[${s.type}] ${s.content}`).join("\n");
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,messages:[{role:"user",content:`These sparks of inspiration were drawn together randomly. Find the hidden connections — the thread that links them across different senses and forms. Write 2-3 poetic sentences revealing what they share. Be specific and surprising. No preamble.\n\n${txt}`}]})});
    const d=await r.json(); return d.content?.[0]?.text||"";
  } catch { return ""; }
}

function MoonSVG({size,opacity,color}) {
  return (
    <svg width={size||18} height={size||18} viewBox="0 0 24 24" fill="none" style={{display:"inline-block",verticalAlign:"middle",flexShrink:0}}>
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8A9.04 9.04 0 0 0 12 3z" fill={color||GOLDW} opacity={opacity||0.9}/>
    </svg>
  );
}

function TypeIcon({type,color,size}) {
  const c=color||TYPES[type].color; const s=size||20;
  if (type==="idea")    return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2L13.8 8.8L21 7L15.5 12L21 17L13.8 15.2L12 22L10.2 15.2L3 17L8.5 12L3 7L10.2 8.8Z" stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"/></svg>;
  if (type==="quote")   return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 12C6 9.5 7.5 7.5 10 7C9 9 9.5 11 11 12C11 13.7 9.7 15 8 15C6.9 15 6 14.1 6 13V12Z" fill={c} opacity="0.95"/><path d="M14 12C14 9.5 15.5 7.5 18 7C17 9 17.5 11 19 12C19 13.7 17.7 15 16 15C14.9 15 14 14.1 14 13V12Z" fill={c} opacity="0.95"/></svg>;
  if (type==="visual")  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.3" fill="none"/><line x1="12" y1="2" x2="12" y2="5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="22" stroke={c} strokeWidth="1.3" strokeLinecap="round"/><line x1="2" y1="12" x2="5" y2="12" stroke={c} strokeWidth="1.3" strokeLinecap="round"/><line x1="19" y1="12" x2="22" y2="12" stroke={c} strokeWidth="1.3" strokeLinecap="round"/><line x1="4.2" y1="4.2" x2="6.3" y2="6.3" stroke={c} strokeWidth="1.3" strokeLinecap="round"/><line x1="17.7" y1="17.7" x2="19.8" y2="19.8" stroke={c} strokeWidth="1.3" strokeLinecap="round"/><line x1="19.8" y1="4.2" x2="17.7" y2="6.3" stroke={c} strokeWidth="1.3" strokeLinecap="round"/><line x1="6.3" y1="17.7" x2="4.2" y2="19.8" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>;
  if (type==="sound")   return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M2 12C3.5 12 3.5 7 5 7C6.5 7 6.5 17 8 17C9.5 17 9.5 7 11 7C12.5 7 12.5 17 14 17C15.5 17 15.5 7 17 7C18.5 7 18.5 17 20 17C21.5 17 21.5 12 22 12" stroke={c} strokeWidth="1.3" strokeLinecap="round" fill="none"/></svg>;
  if (type==="music")   return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 18V6L19 4V16" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6.5" cy="18" r="2.5" stroke={c} strokeWidth="1.3" fill="none"/><circle cx="16.5" cy="16" r="2.5" stroke={c} strokeWidth="1.3" fill="none"/></svg>;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 16C5 13 7 11 9 12C8 14 8 16 9.5 16C10.5 16 11 15 11 14C11 12 9.5 11 8 11" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none"/><path d="M11 14C11 12 12.5 10.5 14 11C13.2 12.5 13.5 14.5 14.5 15C15.2 15.4 16 14.8 16 14C16 12.5 14.5 11.5 13 11" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none"/><path d="M16 14C16 12 17.5 10.5 19 11C18.5 12.5 19 14 19.5 14.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none"/><path d="M9 12L9 8C9 7 9.5 6.5 10.5 7" stroke={c} strokeWidth="1.2" strokeLinecap="round" fill="none"/></svg>;
}

function SortIcon({color}) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <line x1="0" y1="1" x2="18" y2="1" stroke={color||GOLDD} strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="3" y1="7" x2="18" y2="7" stroke={color||GOLDD} strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="7" y1="13" x2="18" y2="13" stroke={color||GOLDD} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function GoldLine() {
  return <div style={{height:"1px",background:`linear-gradient(to right,transparent,${GOLDW},transparent)`,opacity:0.65}}/>;
}

function PBtn({onClick,children,disabled,small,muted}) {
  const bg=muted?"rgba(201,168,76,0.2)":(disabled?GOLDDD:GOLDW);
  const col=muted?GOLDW:(disabled?"rgba(226,185,78,0.4)":NAVY);
  return <button onClick={onClick} disabled={disabled} style={{padding:small?"8px 18px":"12px 26px",fontFamily:BODY,fontSize:small?"14px":"15px",letterSpacing:"0.1em",cursor:disabled?"default":"pointer",borderRadius:"3px",background:bg,border:muted?`1px solid ${BORDER}`:"none",color:col,transition:"all 0.2s",whiteSpace:"nowrap"}}>{children}</button>;
}

function GBtn({onClick,children,small,danger}) {
  return <button onClick={onClick} style={{padding:small?"8px 16px":"12px 20px",fontFamily:BODY,fontSize:small?"14px":"15px",letterSpacing:"0.08em",cursor:"pointer",borderRadius:"3px",background:"transparent",border:`1px solid ${danger?"rgba(139,26,42,0.5)":BORDER}`,color:danger?"#D4707F":TEXTD,transition:"all 0.2s"}}>{children}</button>;
}

function Lbl({children,center}) {
  return <p style={{margin:"0 0 12px",fontSize:"11px",letterSpacing:"0.3em",textTransform:"uppercase",color:GOLDD,fontFamily:BODY,textAlign:center?"center":"left"}}>{children}</p>;
}

const ISty={width:"100%",background:"rgba(9,23,42,0.85)",border:`1px solid ${BORDER}`,borderRadius:"3px",color:TEXT,fontFamily:BODY,outline:"none",boxSizing:"border-box",transition:"border-color 0.25s"};

export default function Lucida() {
  const [tab, setTab]               = useState("home");
  const [sparks, setSparks]         = useState(INIT_SPARKS);
  const [cons, setCons]             = useState(INIT_CONS);
  const [feelings, setFeelings]     = useState(DEFAULT_FEELINGS);
  const [rediscover, setRediscover] = useState(INIT_SPARKS[2]);
  const [openSpark, setOpenSpark]   = useState(null);
  const [editMode, setEditMode]     = useState(false);
  const [editData, setEditData]     = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);
  const [openCon, setOpenCon]       = useState(null);
  const [showNewCon, setShowNewCon] = useState(false);
  const [newConName, setNewConName] = useState("");
  const [newConDesc, setNewConDesc] = useState("");
  const [randCon, setRandCon]       = useState(null);
  const [showRand, setShowRand]     = useState(false);
  const [randInsight, setRandInsight]     = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [filter, setFilter]         = useState("all");
  const [feelingFilter, setFeelingFilter] = useState(null);
  const [sort, setSort]             = useState("random");
  const [showSort, setShowSort]     = useState(false);
  const [search, setSearch]         = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [storyText, setStoryText]   = useState("");
  const [storyRange, setStoryRange] = useState("month");
  const [loadingStory, setLoadingStory] = useState(false);
  const [shareOpen, setShareOpen]   = useState(false);
  const [storyShareOpen, setStoryShareOpen] = useState(false);
  const [customFeeling, setCustomFeeling] = useState("");
  const [showFeelingInput, setShowFeelingInput] = useState(false);
  const [newSpark, setNewSpark]     = useState({type:"idea",content:"",feeling:"inspired",reflection:"",context:"",image:null,audio:null,musicLink:"",cids:[]});
  const [step, setStep]             = useState(1);
  const [saved, setSaved]           = useState(false);
  const [savedId, setSavedId]       = useState(null);
  const [showTag, setShowTag]       = useState(false);
  const [recording, setRecording]   = useState(false);
  const [recSecs, setRecSecs]       = useState(0);
  const [audioURL, setAudioURL]     = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const [conTooltip, setConTooltip] = useState(null);
  const [capturedDays, setCapturedDays] = useState({});
  const [weekDays]                  = useState(getWeekDays());
  const [seed]                      = useState(Math.random());

  const mediaRef=useRef(null); const timerRef=useRef(null); const chunksRef=useRef([]);
  const imgRef=useRef(); const audioRef=useRef(); const transRef=useRef();

  useEffect(()=>{ return ()=>{ if(timerRef.current) clearInterval(timerRef.current); }; },[]);

  const blank={type:"idea",content:"",feeling:"inspired",reflection:"",context:"",image:null,audio:null,musicLink:"",cids:[]};

  function goCapture(type) { setNewSpark({...blank,type}); setStep(1); setAudioURL(null); setSaved(false); setShowTag(false); setTab("capture"); }
  const canSave=newSpark.content.trim()||newSpark.audio||newSpark.musicLink.trim();

  function doSave() {
    if(!canSave)return;
    const id=Date.now(); const today=new Date().toLocaleDateString("en-CA");
    const s={id,...newSpark,date:today,grad:""};
    setSparks(p=>[s,...p]);
    newSpark.cids.forEach(cid=>setCons(p=>p.map(c=>c.id===cid?{...c,ids:[...c.ids,id]}:c)));
    setCapturedDays(p=>({...p,[today]:true}));
    setSavedId(id); setSaved(true);
    setTimeout(()=>{ setSaved(false); setShowTag(true); },900);
  }

  function finishCapture() { setShowTag(false); setSavedId(null); setRediscover(sparks[Math.floor(Math.random()*sparks.length)]); setTab("home"); }

  function tagSaved(cid) {
    if(!savedId)return;
    setSparks(p=>p.map(s=>{ if(s.id!==savedId)return s; const has=s.cids.includes(cid); return{...s,cids:has?s.cids.filter(i=>i!==cid):[...s.cids,cid]}; }));
    setCons(p=>p.map(c=>{ if(c.id!==cid)return c; const has=c.ids.includes(savedId); return{...c,ids:has?c.ids.filter(i=>i!==savedId):[...c.ids,savedId]}; }));
  }

  function toggleConSpark(sid,cid) {
    setSparks(p=>p.map(s=>{ if(s.id!==sid)return s; const has=s.cids.includes(cid); return{...s,cids:has?s.cids.filter(i=>i!==cid):[...s.cids,cid]}; }));
    setCons(p=>p.map(c=>{ if(c.id!==cid)return c; const has=c.ids.includes(sid); return{...c,ids:has?c.ids.filter(i=>i!==sid):[...c.ids,sid]}; }));
    setOpenSpark(prev=>{ if(!prev||prev.id!==sid)return prev; const has=prev.cids.includes(cid); return{...prev,cids:has?prev.cids.filter(i=>i!==cid):[...prev.cids,cid]}; });
  }

  function doDelete(id) { setSparks(p=>p.filter(s=>s.id!==id)); setCons(p=>p.map(c=>({...c,ids:c.ids.filter(i=>i!==id)}))); setOpenSpark(null); setDelConfirm(null); }

  function saveEdit() {
    if(!editData)return;
    setSparks(p=>p.map(s=>s.id===editData.id?editData:s));
    cons.forEach(c=>{
      const wasIn=c.ids.includes(editData.id); const nowIn=editData.cids.includes(c.id);
      if(wasIn&&!nowIn) setCons(p=>p.map(x=>x.id===c.id?{...x,ids:x.ids.filter(i=>i!==editData.id)}:x));
      if(!wasIn&&nowIn) setCons(p=>p.map(x=>x.id===c.id?{...x,ids:[...x.ids,editData.id]}:x));
    });
    setOpenSpark(editData); setEditMode(false);
  }

  function createCon() { if(!newConName.trim())return; setCons(p=>[...p,{id:`c${Date.now()}`,name:newConName.trim(),desc:newConDesc.trim(),ids:[]}]); setNewConName(""); setNewConDesc(""); setShowNewCon(false); }

  function saveRandCon() {
    if(!randCon)return;
    const name=`Constellation ${cons.length+1}`;
    const newC={id:`c${Date.now()}`,name,desc:"Saved from Random Constellation",ids:randCon.sparks.map(s=>s.id)};
    setCons(p=>[...p,newC]);
    randCon.sparks.forEach(s=>setSparks(p=>p.map(x=>x.id===s.id?{...x,cids:[...x.cids,newC.id]}:x)));
    setShowRand(false);
  }

  async function genRandom() { const picked=[...sparks].sort(()=>Math.random()-0.5).slice(0,5); const q=QUOTES[Math.floor(Math.random()*QUOTES.length)]; setRandCon({sparks:picked,quote:q}); setRandInsight(""); setShowRand(true); }
  async function getInsight() { if(!randCon)return; setLoadingInsight(true); const t=await doConstellationInsight(randCon.sparks); setRandInsight(t); setLoadingInsight(false); }

  async function loadStory() {
    setLoadingStory(true);
    const cutoff=daysAgo(RANGE_DAYS[storyRange]||30);
    const filtered=sparks.filter(s=>s.date>=cutoff);
    const rangeLabel={week:"week",month:"month","3month":"3 months","6month":"6 months",year:"year"}[storyRange];
    const t=await doReflection(filtered,rangeLabel);
    setStoryText(t); setLoadingStory(false);
  }

  async function startRec() {
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true}); chunksRef.current=[];
      const mr=new MediaRecorder(stream);
      mr.ondataavailable=e=>chunksRef.current.push(e.data);
      mr.onstop=()=>{ const blob=new Blob(chunksRef.current,{type:"audio/webm"}); const url=URL.createObjectURL(blob); setAudioURL(url); setNewSpark(n=>({...n,audio:url})); stream.getTracks().forEach(t=>t.stop()); };
      mr.start(); mediaRef.current=mr; setRecording(true); setRecSecs(0);
      timerRef.current=setInterval(()=>setRecSecs(s=>s+1),1000);
    } catch { alert("Microphone access needed."); }
  }

  function stopRec() { if(mediaRef.current&&recording){mediaRef.current.stop();setRecording(false);clearInterval(timerRef.current);} }
  function fmtTime(s){return`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;}
  function handleAudio(e){const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);setAudioURL(url);setNewSpark(n=>({...n,audio:url}));}
  function handleTrans(e){const f=e.target.files[0];if(!f)return;const reader=new FileReader();reader.onload=async ev=>{const b64=ev.target.result.split(",")[1];setTranscribing(true);const t=await doTranscribe(b64);setNewSpark(n=>({...n,content:t}));setTranscribing(false);};reader.readAsDataURL(f);}
  function handleImg(e){const f=e.target.files[0];if(!f)return;const reader=new FileReader();reader.onload=ev=>setNewSpark(n=>({...n,image:ev.target.result}));reader.readAsDataURL(f);}

  function addCustomFeeling(isEdit) {
    const m=customFeeling.trim().toLowerCase();
    if(!m||feelings.includes(m)){setCustomFeeling("");setShowFeelingInput(false);return;}
    setFeelings(p=>[...p,m]);
    if(isEdit) setEditData(d=>({...d,feeling:m})); else setNewSpark(n=>({...n,feeling:m}));
    setCustomFeeling(""); setShowFeelingInput(false);
  }

  // Navigate to gallery filtered by feeling
  function goToGalleryByFeeling(f) {
    setFeelingFilter(f);
    setFilter("all");
    setTab("gallery");
    setOpenCon(null);
  }

  function getItems() {
    let items=openCon?sparks.filter(s=>openCon.ids.includes(s.id)):[...sparks];
    if(filter!=="all") items=items.filter(s=>s.type===filter);
    if(feelingFilter) items=items.filter(s=>s.feeling===feelingFilter);
    if(search.trim()) items=items.filter(s=>(s.content+(s.reflection||"")+(s.context||"")).toLowerCase().includes(search.toLowerCase()));
    if(sort==="newest") items.sort((a,b)=>b.date.localeCompare(a.date));
    else if(sort==="oldest") items.sort((a,b)=>a.date.localeCompare(b.date));
    else items.sort(()=>seed-0.5);
    return items;
  }

  // Story range computed sparks
  const storyCutoff = daysAgo(RANGE_DAYS[storyRange]||30);
  const storySparks = sparks.filter(s=>s.date>=storyCutoff);
  const storyWeekDays = getWeekDays();
  const storyWeekDots = storyWeekDays.map(d=>sparks.some(s=>s.date===d));

  const byType=Object.keys(TYPES).map(t=>({type:t,count:storySparks.filter(s=>s.type===t).length})).sort((a,b)=>b.count-a.count);
  const byFeeling=feelings.map(f=>({feeling:f,count:storySparks.filter(s=>s.feeling===f).length})).sort((a,b)=>b.count-a.count).slice(0,6);

  const today=new Date().toLocaleDateString("en-CA");
  const weekDots=weekDays.map(d=>capturedDays[d]||sparks.some(s=>s.date===d));
  const weekCount=weekDots.filter(Boolean).length;
  const storyWeekCount=storyWeekDots.filter(Boolean).length;

  const capturePrompt={sound:"What did you hear?",music:"What's the music?",quote:"What are the words?",visual:"What did you see?",writing:"What did you write?",idea:"What caught you?"};

  function FeelingSection({value,onChange,isEdit}) {
    return (
      <div style={{marginBottom:"18px",textAlign:"center"}}>
        <Lbl center>The feeling</Lbl>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"center",marginBottom:"10px"}}>
          {feelings.map(f=>(
            <button key={f} onClick={()=>onChange(f)} style={{padding:"7px 14px",borderRadius:"20px",cursor:"pointer",fontFamily:BODY,fontSize:"15px",fontStyle:"italic",background:value===f?"rgba(226,185,78,0.12)":"transparent",border:`1px solid ${value===f?GOLDD:DIMMER}`,color:value===f?GOLDW:TEXTD,transition:"all 0.2s"}}>{f}</button>
          ))}
          {!showFeelingInput
            ?<button onClick={()=>setShowFeelingInput(true)} style={{padding:"7px 14px",borderRadius:"20px",cursor:"pointer",fontFamily:BODY,fontSize:"15px",background:"transparent",border:`1px dashed ${DIMMER}`,color:TEXTDD}}>+ Add</button>
            :<div style={{display:"flex",gap:"6px",alignItems:"center"}}>
               <input autoFocus value={customFeeling} onChange={e=>setCustomFeeling(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addCustomFeeling(isEdit);if(e.key==="Escape"){setShowFeelingInput(false);setCustomFeeling("");}}} placeholder="type a feeling..." style={{...ISty,fontSize:"14px",padding:"6px 12px",width:"140px",borderRadius:"20px",fontStyle:"italic"}}/>
               <button onClick={()=>addCustomFeeling(isEdit)} style={{background:"transparent",border:`1px solid ${BORDER}`,borderRadius:"20px",color:GOLDW,fontSize:"13px",padding:"6px 12px",cursor:"pointer",fontFamily:BODY}}>Add</button>
             </div>
          }
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:NAVY,fontFamily:BODY,color:TEXT,position:"relative",overflowX:"hidden"}}>

      {/* Atmosphere */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse 80% 50% at 10% 0%,rgba(20,50,85,0.55) 0%,transparent 55%),radial-gradient(ellipse 60% 70% at 90% 100%,rgba(15,30,65,0.6) 0%,transparent 55%)"}}/>
      {[[7,9],[91,5],[13,80],[87,68],[48,3],[67,33],[19,48],[59,13],[28,65],[78,44]].map(([x,y],i)=>(
        <div key={i} style={{position:"fixed",left:`${x}%`,top:`${y}%`,pointerEvents:"none",zIndex:0,color:GOLDW,fontSize:i%3===0?"5px":"7px",opacity:0.07+i*0.015}}>✦</div>
      ))}

      <div style={{position:"relative",zIndex:1,maxWidth:"640px",margin:"0 auto",padding:"0 22px 90px"}}>

        {/* HEADER */}
        <div style={{paddingTop:"44px",paddingBottom:"20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
            <MoonSVG size={17} opacity={0.95}/>
            <span style={{fontSize:"20px",letterSpacing:"0.38em",textTransform:"uppercase",color:GOLDW,fontFamily:DISPLAY}}>Lucida</span>
            <span style={{fontSize:"14px",color:TEXTDD,letterSpacing:"0.06em"}}>· Gillian</span>
          </div>
          <span style={{fontSize:"13px",color:TEXTDD}}>{new Date().toLocaleDateString("en-US",{month:"long",day:"numeric"})}</span>
        </div>
        <GoldLine/>

        {/* ══ HOME ══ */}
        {tab==="home" && (
          <div style={{paddingTop:"28px"}}>

            {/* Rediscover — fixed height scrollable */}
            {rediscover && (
              <div style={{marginBottom:"28px"}}>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"8px",marginBottom:"14px"}}>
                  <MoonSVG size={14} opacity={0.7}/>
                  <span style={{fontSize:"14px",letterSpacing:"0.32em",textTransform:"uppercase",color:GOLDD,fontFamily:DISPLAY}}>Rediscover</span>
                </div>
                <div style={{position:"relative",background:"linear-gradient(145deg,rgba(18,40,72,0.95),rgba(10,22,44,0.98))",borderRadius:"4px",overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,0.4)",border:`1px solid ${BORDER}`,cursor:"pointer",transition:"border-color 0.2s"}}
                  onClick={()=>setOpenSpark(rediscover)}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(226,185,78,0.5)"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                  <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 25% 35%,rgba(212,168,67,0.08) 0%,transparent 65%)",pointerEvents:"none"}}/>
                  <div style={{position:"absolute",top:"-15px",right:"-15px",opacity:0.06}}><MoonSVG size={90} opacity={1}/></div>
                  <div style={{padding:"16px 22px 0"}}><GoldLine/></div>
                  {/* Fixed height scrollable */}
                  <div style={{height:"220px",overflowY:"auto",padding:"16px 26px",scrollbarWidth:"none"}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{display:"flex",justifyContent:"center",gap:"10px",alignItems:"center",marginBottom:"14px"}}>
                        <TypeIcon type={rediscover.type}/>
                        <span style={{fontSize:"13px",color:TEXTDD}}>{rediscover.date}</span>
                        {rediscover.feeling && <span style={{fontSize:"13px",color:TEXTD,fontStyle:"italic"}}>· {rediscover.feeling}</span>}
                      </div>
                      {rediscover.grad && <div style={{width:"100%",height:"90px",background:rediscover.grad,borderRadius:"3px",marginBottom:"14px",opacity:0.7}}/>}
                      <p style={{margin:"0 0 12px",fontSize:"20px",lineHeight:1.82,color:TEXT,fontStyle:rediscover.type==="quote"?"italic":"normal"}}>
                        {rediscover.type==="quote"?`"${rediscover.content}"`:rediscover.content}
                      </p>
                      {rediscover.reflection && <p style={{margin:"0 0 10px",fontSize:"15px",color:TEXTD,fontStyle:"italic",lineHeight:1.7}}>"{rediscover.reflection}"</p>}
                      {rediscover.context && <p style={{margin:"0 0 10px",fontSize:"13px",color:TEXTDD}}>📍 {rediscover.context}</p>}
                      <p style={{margin:"8px 0 0",fontSize:"11px",color:GOLDD,letterSpacing:"0.2em",textTransform:"uppercase"}}>tap to open →</p>
                    </div>
                  </div>
                  <div style={{padding:"0 22px 16px"}}><GoldLine/></div>
                </div>
                <div style={{textAlign:"center",marginTop:"10px"}}>
                  <button onClick={e=>{e.stopPropagation();const o=sparks.filter(s=>s.id!==rediscover.id);setRediscover(o[Math.floor(Math.random()*o.length)]);}} style={{background:"transparent",border:"none",color:GOLDD,fontSize:"13px",letterSpacing:"0.22em",textTransform:"uppercase",cursor:"pointer",fontFamily:BODY,padding:0}}>another spark →</button>
                </div>
              </div>
            )}

            {/* Capture strip — tactile */}
            <div style={{marginBottom:"26px"}}>
              <GoldLine/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"8px",padding:"12px 0"}}>
                {Object.entries(TYPES).map(([key,t])=>(
                  <button key={key} onClick={()=>goCapture(key)} style={{padding:"14px 4px 12px",background:"linear-gradient(180deg,rgba(22,44,88,0.92) 0%,rgba(10,22,44,0.97) 100%)",border:`1px solid ${BORDER}`,borderRadius:"6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"7px",boxShadow:"0 3px 8px rgba(0,0,0,0.45),inset 0 1px 0 rgba(226,185,78,0.22)",transition:"all 0.15s",outline:"none"}}
                    onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 5px 14px rgba(0,0,0,0.55),inset 0 1px 0 rgba(226,185,78,0.38),0 0 12px rgba(226,185,78,0.14)";e.currentTarget.style.borderColor=t.color;e.currentTarget.style.transform="translateY(-1px)";}}
                    onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 3px 8px rgba(0,0,0,0.45),inset 0 1px 0 rgba(226,185,78,0.22)";e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.transform="translateY(0)";}}
                    onMouseDown={e=>e.currentTarget.style.transform="translateY(1px)"}
                    onMouseUp={e=>e.currentTarget.style.transform="translateY(-1px)"}>
                    <TypeIcon type={key} size={18}/>
                    <span style={{fontSize:"9px",letterSpacing:"0.12em",textTransform:"uppercase",color:TEXTD,fontFamily:BODY}}>{t.label}</span>
                  </button>
                ))}
              </div>
              <GoldLine/>
            </div>

            {/* Weekly streak */}
            <div style={{textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
                <MoonSVG size={14} opacity={0.8}/>
                <span style={{fontSize:"30px",color:GOLDW,fontFamily:DISPLAY,lineHeight:1}}>{weekCount}</span>
                <span style={{fontSize:"13px",color:TEXTDD,letterSpacing:"0.15em",textTransform:"uppercase"}}>days of inspiration</span>
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:"10px"}}>
                {weekDays.map((d,i)=>(
                  <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
                    <div style={{width:"22px",height:"22px",borderRadius:"50%",background:weekDots[i]?`radial-gradient(circle,${GOLDW},rgba(212,168,67,0.3))`:"rgba(242,234,216,0.07)",border:weekDots[i]?"none":`1px solid ${d===today?"rgba(226,185,78,0.5)":"rgba(242,234,216,0.15)"}`}}/>
                    <span style={{fontSize:"10px",color:TEXTDD}}>{WEEK_LABELS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ GALLERY ══ */}
        {tab==="gallery" && !openCon && (
          <div style={{paddingTop:"24px"}}>
            {/* Feeling filter active banner */}
            {feelingFilter && (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px",padding:"10px 14px",background:"rgba(226,185,78,0.08)",border:`1px solid ${BORDER}`,borderRadius:"3px"}}>
                <span style={{fontSize:"14px",color:GOLDW,fontStyle:"italic"}}>Feeling: {feelingFilter}</span>
                <button onClick={()=>setFeelingFilter(null)} style={{background:"transparent",border:"none",color:TEXTD,fontSize:"13px",cursor:"pointer",fontFamily:BODY,padding:0,letterSpacing:"0.1em"}}>Clear ×</button>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
              <p style={{margin:0,fontSize:"14px",color:TEXTDD,fontStyle:"italic"}}>{getItems().length} sparks</p>
              <div style={{display:"flex",gap:"14px",alignItems:"center"}}>
                {showSearch && <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...ISty,fontSize:"14px",padding:"7px 12px",width:"140px"}} onBlur={()=>{if(!search)setShowSearch(false);}}/>}
                <button onClick={()=>setShowSearch(s=>!s)} style={{background:"transparent",border:"none",color:showSearch?GOLDW:GOLDD,cursor:"pointer",fontSize:"18px",padding:"4px",display:"flex",alignItems:"center"}}>⌕</button>
                <div style={{position:"relative"}}>
                  <button onClick={()=>setShowSort(s=>!s)} style={{background:"transparent",border:"none",cursor:"pointer",padding:"4px",display:"flex",alignItems:"center"}}>
                    <SortIcon color={showSort?GOLDW:GOLDD}/>
                  </button>
                  {showSort && (
                    <div style={{position:"absolute",right:0,top:"100%",marginTop:"6px",background:NAVY2,border:`1px solid ${BORDER}`,borderRadius:"4px",zIndex:50,minWidth:"150px",overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,0.5)"}}>
                      <div style={{padding:"10px 16px 6px",borderBottom:`1px solid ${BORDER}`}}>
                        <p style={{margin:0,fontSize:"10px",letterSpacing:"0.25em",textTransform:"uppercase",color:GOLDD,fontFamily:BODY}}>Order by</p>
                      </div>
                      {[["random","✦ Random"],["newest","Newest first"],["oldest","Oldest first"]].map(([o,lbl])=>(
                        <button key={o} onClick={()=>{setSort(o);setShowSort(false);}} style={{display:"flex",alignItems:"center",gap:"10px",width:"100%",padding:"11px 16px",background:sort===o?"rgba(226,185,78,0.08)":"transparent",border:"none",color:sort===o?GOLDW:TEXTD,fontSize:"14px",cursor:"pointer",fontFamily:BODY,textAlign:"left"}}>
                          {sort===o && <span style={{color:GOLDW,fontSize:"10px"}}>●</span>}
                          {lbl}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filter buttons */}
            <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
              {[["all","All",GOLDD,null],...Object.entries(TYPES).map(([k,v])=>[k,v.label,v.color,k])].map(([key,lbl,color,typeKey])=>(
                <button key={key} onClick={()=>setFilter(key)} style={{padding:"8px 14px",cursor:"pointer",fontFamily:BODY,fontSize:"13px",letterSpacing:"0.08em",background:filter===key?"rgba(226,185,78,0.1)":"transparent",border:`1px solid ${filter===key?color:BORDER}`,borderRadius:"3px",color:filter===key?color:TEXTD,transition:"all 0.2s",display:"flex",alignItems:"center",gap:"6px"}}>
                  {typeKey && <TypeIcon type={typeKey} color={color} size={14}/>}
                  {lbl}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              {getItems().map((spark,i)=>{
                const large=!!spark.grad||(spark.type==="quote"&&spark.content.length>120)||spark.content.length>200||i%8===0;
                const sparkCons=cons.filter(c=>spark.cids.includes(c.id));
                return (
                  <div key={spark.id} style={{gridColumn:large?"1 / -1":"auto",cursor:"pointer"}} onClick={()=>{setOpenSpark(spark);setEditMode(false);}}>
                    <div style={{padding:large?"22px":"15px",background:"linear-gradient(135deg,rgba(16,32,58,0.96),rgba(9,23,42,0.99))",border:`1px solid ${BORDER}`,borderLeft:`2px solid ${TYPES[spark.type].color}`,borderRadius:"4px",boxShadow:"0 2px 12px rgba(0,0,0,0.35)",height:"100%",boxSizing:"border-box",position:"relative"}}>
                      {spark.grad && <div style={{width:"100%",height:large?"150px":"80px",background:spark.grad,borderRadius:"3px",marginBottom:"12px",opacity:0.75}}/>}
                      {spark.image && <img src={spark.image} alt="" style={{width:"100%",borderRadius:"3px",marginBottom:"12px",display:"block"}}/>}
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
                        <TypeIcon type={spark.type}/>
                        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                          {sparkCons.length>0 && (
                            <div style={{position:"relative"}}>
                              <button onClick={e=>{e.stopPropagation();setConTooltip(conTooltip===spark.id?null:spark.id);}} style={{background:"transparent",border:"none",cursor:"pointer",padding:"2px",color:GOLDW,fontSize:"13px",lineHeight:1}}>✦</button>
                              {conTooltip===spark.id && (
                                <div style={{position:"absolute",right:0,top:"100%",marginTop:"4px",background:NAVY2,border:`1px solid ${BORDER}`,borderRadius:"3px",padding:"8px 12px",zIndex:50,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(0,0,0,0.5)"}}>
                                  {sparkCons.map(c=><p key={c.id} style={{margin:"2px 0",fontSize:"13px",color:GOLDW,fontStyle:"italic"}}>✦ {c.name}</p>)}
                                </div>
                              )}
                            </div>
                          )}
                          <button onClick={e=>{e.stopPropagation();setOpenSpark(spark);setEditData({...spark});setEditMode(true);}} style={{background:"transparent",border:"none",color:TEXTDD,fontSize:"14px",cursor:"pointer",padding:"2px",lineHeight:1,transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color=TEXT} onMouseLeave={e=>e.target.style.color=TEXTDD}>✎</button>
                        </div>
                      </div>
                      <p style={{margin:"0 0 8px",fontSize:large?"17px":"15px",lineHeight:1.75,color:TEXT,fontStyle:spark.type==="quote"?"italic":"normal"}}>{spark.content}</p>
                      <div style={{display:"flex",gap:"8px",alignItems:"center",marginTop:"8px"}}>
                        <span style={{fontSize:"12px",color:TEXTDD}}>{spark.date}</span>
                        {spark.feeling && <span style={{fontSize:"12px",color:TEXTD,fontStyle:"italic"}}>· {spark.feeling}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {getItems().length===0 && <div style={{textAlign:"center",paddingTop:"60px"}}><MoonSVG size={36} opacity={0.25}/><p style={{color:TEXTD,fontStyle:"italic",marginTop:"16px",fontSize:"17px"}}>No sparks found.</p></div>}
          </div>
        )}

        {/* Constellation room */}
        {openCon && (tab==="gallery"||tab==="constellations") && (
          <div style={{paddingTop:"24px"}}>
            <button onClick={()=>setOpenCon(null)} style={{background:"transparent",border:"none",color:TEXTD,fontSize:"13px",letterSpacing:"0.18em",cursor:"pointer",fontFamily:BODY,padding:"0 0 20px",textTransform:"uppercase"}}>← Back</button>
            <div style={{textAlign:"center",marginBottom:"28px"}}>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                <MoonSVG size={20} opacity={0.85}/>
                <h2 style={{margin:0,fontSize:"26px",color:TEXT,fontWeight:"normal",letterSpacing:"0.04em",fontFamily:DISPLAY}}>{openCon.name}</h2>
              </div>
              {openCon.desc && <p style={{margin:"0 auto",fontSize:"16px",color:TEXTD,fontStyle:"italic",maxWidth:"420px",lineHeight:1.7}}>{openCon.desc}</p>}
              <p style={{margin:"10px 0 0",fontSize:"13px",color:TEXTDD}}>{openCon.ids.length} {openCon.ids.length===1?"spark":"sparks"}</p>
            </div>
            <GoldLine/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginTop:"20px"}}>
              {sparks.filter(s=>openCon.ids.includes(s.id)).map((spark,i)=>{
                const large=!!spark.grad||spark.content.length>150||i%5===0;
                return (
                  <div key={spark.id} style={{gridColumn:large?"1 / -1":"auto",cursor:"pointer"}} onClick={()=>setOpenSpark(spark)}>
                    <div style={{padding:large?"20px":"14px",background:"linear-gradient(135deg,rgba(16,32,58,0.96),rgba(9,23,42,0.99))",border:`1px solid ${BORDER}`,borderLeft:`2px solid ${TYPES[spark.type].color}`,borderRadius:"4px",height:"100%",boxSizing:"border-box"}}>
                      {spark.grad && <div style={{width:"100%",height:"100px",background:spark.grad,borderRadius:"3px",marginBottom:"10px",opacity:0.7}}/>}
                      <div style={{marginBottom:"8px"}}><TypeIcon type={spark.type}/></div>
                      <p style={{margin:"0 0 6px",fontSize:large?"16px":"14px",lineHeight:1.7,color:TEXT,fontStyle:spark.type==="quote"?"italic":"normal"}}>{spark.content}</p>
                      <span style={{fontSize:"12px",color:TEXTDD}}>{spark.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ CONSTELLATIONS ══ */}
        {tab==="constellations" && !openCon && (
          <div style={{paddingTop:"24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
              <p style={{margin:0,fontSize:"14px",color:TEXTDD,fontStyle:"italic"}}>{cons.length} constellations</p>
              <div style={{display:"flex",gap:"14px"}}>
                <button onClick={genRandom} style={{background:"transparent",border:"none",color:GOLDD,fontSize:"13px",letterSpacing:"0.15em",cursor:"pointer",fontFamily:BODY,padding:0,textTransform:"uppercase"}}>✦ Random</button>
                <button onClick={()=>setShowNewCon(true)} style={{background:"transparent",border:"none",color:GOLDD,fontSize:"13px",letterSpacing:"0.15em",cursor:"pointer",fontFamily:BODY,padding:0,textTransform:"uppercase"}}>+ New</button>
              </div>
            </div>
            {showNewCon && (
              <div style={{marginBottom:"22px",padding:"22px",background:"rgba(9,23,42,0.9)",border:`1px solid ${BORDER}`,borderRadius:"4px"}}>
                <Lbl center>New Constellation</Lbl>
                <input value={newConName} onChange={e=>setNewConName(e.target.value)} placeholder="Name this constellation..." style={{...ISty,fontSize:"16px",padding:"12px 15px",marginBottom:"10px",textAlign:"center"}}/>
                <input value={newConDesc} onChange={e=>setNewConDesc(e.target.value)} placeholder="A brief description... (optional)" style={{...ISty,fontSize:"15px",padding:"11px 15px",marginBottom:"16px",textAlign:"center"}}/>
                <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
                  <PBtn onClick={createCon} disabled={!newConName.trim()}>Create</PBtn>
                  <GBtn onClick={()=>setShowNewCon(false)}>Cancel</GBtn>
                </div>
              </div>
            )}
            {cons.map(c=>(
              <div key={c.id} style={{marginBottom:"12px",padding:"24px 26px",background:"linear-gradient(135deg,rgba(16,32,58,0.92),rgba(9,23,42,0.97))",border:`1px solid ${BORDER}`,borderRadius:"4px",cursor:"pointer",transition:"all 0.2s"}}
                onClick={()=>setOpenCon(c)}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(226,185,78,0.5)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <MoonSVG size={16} opacity={0.8}/>
                  <span style={{fontSize:"20px",color:TEXT,letterSpacing:"0.03em",flex:1,fontFamily:DISPLAY}}>{c.name}</span>
                  <span style={{fontSize:"13px",color:TEXTDD,whiteSpace:"nowrap",flexShrink:0}}>{c.ids.length} {c.ids.length===1?"spark":"sparks"}</span>
                </div>
                {c.desc && <p style={{margin:"8px 0 0 26px",fontSize:"15px",color:TEXTD,fontStyle:"italic",lineHeight:1.65}}>{c.desc}</p>}
              </div>
            ))}
            {cons.length===0 && <div style={{textAlign:"center",paddingTop:"60px"}}><MoonSVG size={36} opacity={0.25}/><p style={{color:TEXTD,fontStyle:"italic",marginTop:"16px"}}>No constellations yet.</p></div>}
          </div>
        )}

        {/* ══ STORY ══ */}
        {tab==="story" && (
          <div style={{paddingTop:"24px"}}>
            <div style={{textAlign:"center",marginBottom:"24px"}}>
              <MoonSVG size={28} opacity={0.75}/>
              <h2 style={{margin:"10px 0 4px",fontSize:"28px",color:TEXT,fontWeight:"normal",letterSpacing:"0.06em",fontFamily:DISPLAY}}>Your Story</h2>
            </div>

            {/* Range selector */}
            <div style={{display:"flex",gap:"8px",marginBottom:"22px",flexWrap:"wrap",justifyContent:"center"}}>
              {Object.entries(RANGE_LABELS).map(([key,lbl])=>(
                <button key={key} onClick={()=>{setStoryRange(key);setStoryText("");}} style={{padding:"8px 14px",borderRadius:"3px",cursor:"pointer",fontFamily:BODY,fontSize:"13px",letterSpacing:"0.08em",background:storyRange===key?"rgba(226,185,78,0.12)":"transparent",border:`1px solid ${storyRange===key?GOLD:BORDER}`,color:storyRange===key?GOLDW:TEXTD,transition:"all 0.2s"}}>{lbl}</button>
              ))}
            </div>

            {/* Reflection */}
            <div style={{marginBottom:"24px",padding:"24px 26px",background:"linear-gradient(145deg,rgba(18,40,72,0.92),rgba(10,22,44,0.97))",borderRadius:"4px",position:"relative"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 30% 40%,rgba(212,168,67,0.07) 0%,transparent 65%)",pointerEvents:"none"}}/>
              <GoldLine/>
              <div style={{position:"relative",padding:"18px 0 16px",textAlign:"center"}}>
                {storyText
                  ?<><p style={{margin:"0 0 20px",fontSize:"17px",lineHeight:1.9,color:TEXT,fontStyle:"italic"}}>{storyText}</p><div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}><GBtn onClick={()=>setStoryShareOpen(true)} small>✦ Share</GBtn><GBtn onClick={()=>setStoryText("")} small>Regenerate</GBtn></div></>
                  :<><p style={{margin:"0 0 16px",fontSize:"15px",color:TEXTD,lineHeight:1.75}}>Let Lucida write a poetic reflection on {RANGE_LABELS[storyRange].toLowerCase()}.</p><PBtn onClick={loadStory} disabled={loadingStory} small muted>{loadingStory?"Reading your sparks...":"Generate reflection"}</PBtn></>
                }
              </div>
              <GoldLine/>
            </div>

            {/* Stats — filtered by range */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px",marginBottom:"24px"}}>
              {[{v:storySparks.length,l:"sparks",c:GOLDW},{v:storyWeekCount,l:"days active",c:"#7DC0D4"},{v:cons.length,l:"constellations",c:"#9BAED4"}].map(s=>(
                <div key={s.l} style={{padding:"18px 14px",background:"rgba(16,32,58,0.85)",border:`1px solid ${BORDER}`,borderRadius:"4px",textAlign:"center"}}>
                  <p style={{margin:"0 0 4px",fontSize:"30px",color:s.c,fontWeight:"normal",fontFamily:DISPLAY}}>{s.v}</p>
                  <p style={{margin:0,fontSize:"11px",letterSpacing:"0.16em",textTransform:"uppercase",color:TEXTDD}}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Sparks by type — filtered */}
            <div style={{marginBottom:"24px"}}>
              <Lbl>Sparks by type</Lbl>
              {byType.filter(s=>s.count>0).map(s=>(
                <div key={s.type} style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px"}}>
                  <div style={{width:"22px",display:"flex",justifyContent:"center"}}><TypeIcon type={s.type}/></div>
                  <span style={{fontSize:"14px",color:TEXTD,width:"58px",textTransform:"capitalize"}}>{s.type}</span>
                  <div style={{flex:1,height:"4px",background:"rgba(242,234,216,0.08)",borderRadius:"2px",overflow:"hidden"}}>
                    <div style={{height:"100%",width:storySparks.length>0?`${(s.count/storySparks.length)*100}%`:"0%",background:`linear-gradient(to right,${TYPES[s.type].color},rgba(226,185,78,0.45))`,borderRadius:"2px"}}/>
                  </div>
                  <span style={{fontSize:"13px",color:TEXTDD,width:"18px",textAlign:"right"}}>{s.count}</span>
                </div>
              ))}
              {byType.every(s=>s.count===0) && <p style={{color:TEXTDD,fontStyle:"italic",fontSize:"14px"}}>No sparks in this period.</p>}
            </div>

            {/* Feelings — filtered, tappable → gallery */}
            <div style={{marginBottom:"24px"}}>
              <Lbl>Dominant feelings</Lbl>
              <p style={{margin:"-8px 0 12px",fontSize:"13px",color:TEXTDD,fontStyle:"italic"}}>Tap a feeling to see those sparks →</p>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                {byFeeling.filter(f=>f.count>0).map((f,i)=>(
                  <button key={f.feeling} onClick={()=>goToGalleryByFeeling(f.feeling)} style={{padding:"9px 16px",background:i===0?"rgba(226,185,78,0.12)":"rgba(16,32,58,0.85)",border:`1px solid ${i===0?GOLD:BORDER}`,borderRadius:"20px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontFamily:BODY,transition:"all 0.2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=GOLDD;e.currentTarget.style.background="rgba(226,185,78,0.12)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=i===0?GOLD:BORDER;e.currentTarget.style.background=i===0?"rgba(226,185,78,0.12)":"rgba(16,32,58,0.85)";}}>
                    <span style={{fontSize:"15px",color:i===0?GOLDW:TEXTD,fontStyle:"italic"}}>{f.feeling}</span>
                    <span style={{fontSize:"13px",color:TEXTDD}}>×{f.count}</span>
                  </button>
                ))}
                {byFeeling.every(f=>f.count===0) && <p style={{color:TEXTDD,fontStyle:"italic",fontSize:"14px"}}>No feelings recorded in this period.</p>}
              </div>
            </div>

            {/* Week dots — always shows current week */}
            <div>
              <Lbl>This week at a glance</Lbl>
              <div style={{display:"flex",gap:"10px"}}>
                {weekDays.map((d,i)=>(
                  <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",flex:1}}>
                    <div style={{width:"100%",aspectRatio:"1",borderRadius:"50%",background:weekDots[i]?`radial-gradient(circle,${GOLDW},rgba(212,168,67,0.3))`:"rgba(242,234,216,0.07)",border:weekDots[i]?"none":"1px solid rgba(242,234,216,0.15)"}}/>
                    <span style={{fontSize:"10px",color:TEXTDD}}>{WEEK_LABELS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ CAPTURE ══ */}
        {tab==="capture" && !showTag && (
          <div style={{paddingTop:"24px"}}>
            {step===1 && (
              <div>
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center",marginBottom:"20px"}}>
                  {Object.entries(TYPES).map(([key,t])=>(
                    <button key={key} onClick={()=>setNewSpark(n=>({...n,type:key}))} style={{padding:"7px 12px",borderRadius:"3px",cursor:"pointer",fontFamily:BODY,fontSize:"14px",background:newSpark.type===key?"rgba(226,185,78,0.1)":"transparent",border:`1px solid ${newSpark.type===key?t.color:DIMMER}`,color:newSpark.type===key?t.color:TEXTD,display:"flex",alignItems:"center",gap:"6px",transition:"all 0.2s"}}>
                      <TypeIcon type={key} color={newSpark.type===key?t.color:TEXTD}/> {t.label}
                    </button>
                  ))}
                </div>
                <div style={{textAlign:"center",marginBottom:"22px"}}>
                  <TypeIcon type={newSpark.type}/>
                  <p style={{margin:"10px 0 0",fontSize:"22px",color:TEXTD,fontStyle:"italic"}}>{capturePrompt[newSpark.type]}</p>
                </div>

                {newSpark.type==="sound" && (
                  <div style={{marginBottom:"18px",padding:"18px",background:"rgba(9,23,42,0.85)",border:"1px solid rgba(155,174,212,0.3)",borderRadius:"4px"}}>
                    <div style={{display:"flex",gap:"10px",marginBottom:"12px",flexWrap:"wrap",alignItems:"center",justifyContent:"center"}}>
                      {!recording?<button onClick={startRec} style={{padding:"10px 20px",background:"transparent",border:"1px solid rgba(155,174,212,0.5)",borderRadius:"3px",color:"#9BAED4",fontSize:"15px",cursor:"pointer",fontFamily:BODY,display:"flex",alignItems:"center",gap:"8px"}}><span style={{width:"8px",height:"8px",borderRadius:"50%",background:CRIMSON,display:"inline-block"}}/>Record</button>
                        :<button onClick={stopRec} style={{padding:"10px 20px",background:"rgba(139,26,42,0.14)",border:"1px solid rgba(139,26,42,0.5)",borderRadius:"3px",color:"#D4707F",fontSize:"15px",cursor:"pointer",fontFamily:BODY,display:"flex",alignItems:"center",gap:"8px"}}><span style={{width:"8px",height:"8px",borderRadius:"1px",background:CRIMSON,display:"inline-block"}}/>Stop · {fmtTime(recSecs)}</button>}
                      <input ref={audioRef} type="file" accept="audio/*" onChange={handleAudio} style={{display:"none"}}/>
                      <button onClick={()=>audioRef.current.click()} style={{padding:"10px 16px",background:"transparent",border:`1px solid ${DIMMER}`,borderRadius:"3px",color:TEXTD,fontSize:"15px",cursor:"pointer",fontFamily:BODY}}>Upload</button>
                    </div>
                    {audioURL && <div style={{textAlign:"center"}}><audio controls src={audioURL} style={{width:"100%",marginBottom:"8px"}}/><button onClick={()=>{setAudioURL(null);setNewSpark(n=>({...n,audio:null}));}} style={{background:"transparent",border:"none",color:TEXTD,fontSize:"14px",cursor:"pointer",fontFamily:BODY,padding:0}}>remove ×</button></div>}
                    <textarea value={newSpark.content} onChange={e=>setNewSpark(n=>({...n,content:e.target.value}))} placeholder="Describe what you heard... (optional)" style={{...ISty,minHeight:"70px",fontSize:"16px",lineHeight:"1.7",padding:"13px",fontStyle:"italic",resize:"vertical",marginTop:"10px",textAlign:"center"}} onFocus={e=>e.target.style.borderColor="rgba(155,174,212,0.6)"} onBlur={e=>e.target.style.borderColor=BORDER}/>
                  </div>
                )}

                {newSpark.type==="music" && (
                  <div style={{marginBottom:"18px",padding:"18px",background:"rgba(9,23,42,0.85)",border:"1px solid rgba(201,140,154,0.3)",borderRadius:"4px"}}>
                    <input value={newSpark.content} onChange={e=>setNewSpark(n=>({...n,content:e.target.value}))} placeholder="Song name, artist..." style={{...ISty,fontSize:"17px",padding:"13px 15px",marginBottom:"10px",textAlign:"center"}} onFocus={e=>e.target.style.borderColor="rgba(201,140,154,0.6)"} onBlur={e=>e.target.style.borderColor=BORDER}/>
                    <input value={newSpark.musicLink} onChange={e=>setNewSpark(n=>({...n,musicLink:e.target.value}))} placeholder="Spotify / Apple Music link (optional)" style={{...ISty,fontSize:"15px",padding:"11px 15px",textAlign:"center"}} onFocus={e=>e.target.style.borderColor="rgba(201,140,154,0.6)"} onBlur={e=>e.target.style.borderColor=BORDER}/>
                    <p style={{margin:"8px 0 0",fontSize:"13px",color:TEXTDD,fontStyle:"italic",textAlign:"center"}}>Shazam it first, then paste the name here.</p>
                  </div>
                )}

                {newSpark.type==="quote" && (
                  <div style={{marginBottom:"18px"}}>
                    <div style={{marginBottom:"12px",padding:"16px 18px",background:"rgba(9,23,42,0.85)",border:`1px solid ${GOLDDD}`,borderRadius:"4px",textAlign:"center"}}>
                      <p style={{margin:"0 0 12px",fontSize:"15px",color:TEXTD,lineHeight:1.65}}>See words that stop you? Photograph them — Lucida transcribes instantly.</p>
                      <input ref={transRef} type="file" accept="image/*" capture="environment" onChange={handleTrans} style={{display:"none"}}/>
                      <button onClick={()=>transRef.current.click()} disabled={transcribing} style={{padding:"10px 20px",background:"transparent",border:`1px solid ${GOLDDD}`,borderRadius:"3px",color:transcribing?TEXTDD:GOLDW,fontSize:"15px",cursor:transcribing?"default":"pointer",fontFamily:BODY,display:"inline-flex",alignItems:"center",gap:"9px"}}>
                        {transcribing?<><span style={{display:"inline-block",width:"10px",height:"10px",border:`1px solid ${GOLDD}`,borderTopColor:GOLDW,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>Transcribing...</>:"📷 Photograph words"}
                      </button>
                    </div>
                    <textarea value={newSpark.content} onChange={e=>setNewSpark(n=>({...n,content:e.target.value}))} placeholder="Or type the words yourself..." style={{...ISty,minHeight:"120px",fontSize:"18px",lineHeight:"1.85",padding:"16px",fontStyle:"italic",resize:"vertical",textAlign:"center"}} onFocus={e=>e.target.style.borderColor=GOLDD} onBlur={e=>e.target.style.borderColor=BORDER}/>
                  </div>
                )}

                {!["sound","music","quote"].includes(newSpark.type) && (
                  <div style={{marginBottom:"18px"}}>
                    <textarea value={newSpark.content} onChange={e=>setNewSpark(n=>({...n,content:e.target.value}))} placeholder="Just begin..." style={{...ISty,minHeight:"140px",fontSize:"18px",lineHeight:"1.85",padding:"17px",fontStyle:"italic",resize:"vertical",textAlign:"center"}} onFocus={e=>e.target.style.borderColor=GOLDD} onBlur={e=>e.target.style.borderColor=BORDER}/>
                  </div>
                )}

                {newSpark.type!=="sound" && (
                  <div style={{marginBottom:"18px",textAlign:"center"}}>
                    <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} style={{display:"none"}}/>
                    {newSpark.image
                      ?<div style={{position:"relative",display:"inline-block"}}><img src={newSpark.image} alt="" style={{maxWidth:"100%",maxHeight:"200px",objectFit:"cover",borderRadius:"3px",display:"block",border:`1px solid ${BORDER}`}}/><button onClick={()=>setNewSpark(n=>({...n,image:null}))} style={{position:"absolute",top:"8px",right:"8px",background:"rgba(9,23,42,0.9)",border:`1px solid ${BORDER}`,borderRadius:"2px",color:TEXTD,fontSize:"13px",padding:"4px 8px",cursor:"pointer",fontFamily:BODY}}>remove</button></div>
                      :<button onClick={()=>imgRef.current.click()} style={{padding:"10px 18px",background:"transparent",border:`1px dashed ${DIMMER}`,borderRadius:"3px",color:TEXTD,fontSize:"15px",cursor:"pointer",fontFamily:BODY,transition:"all 0.2s"}} onMouseEnter={e=>{e.target.style.borderColor=GOLDD;e.target.style.color=TEXT;}} onMouseLeave={e=>{e.target.style.borderColor=DIMMER;e.target.style.color=TEXTD;}}>◈ Add image</button>
                    }
                  </div>
                )}

                <FeelingSection value={newSpark.feeling} onChange={f=>setNewSpark(n=>({...n,feeling:f}))} isEdit={false}/>
                <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
                  <PBtn onClick={()=>canSave&&setStep(2)} disabled={!canSave}>Reflect →</PBtn>
                  <GBtn onClick={doSave}>Just save it</GBtn>
                  <GBtn onClick={()=>setTab("home")}>Cancel</GBtn>
                </div>
              </div>
            )}

            {step===2 && (
              <div>
                <button onClick={()=>setStep(1)} style={{background:"transparent",border:"none",color:TEXTD,fontSize:"13px",letterSpacing:"0.18em",cursor:"pointer",fontFamily:BODY,padding:"0 0 24px",textTransform:"uppercase",display:"block",margin:"0 auto"}}>← back</button>
                <div style={{textAlign:"center",marginBottom:"24px"}}>
                  <Lbl center>Go a little deeper</Lbl>
                  <p style={{margin:0,fontSize:"21px",color:TEXTD,fontStyle:"italic"}}>Optional. Whatever feels true.</p>
                </div>
                <div style={{marginBottom:"18px"}}>
                  <Lbl center>Why did this move you?</Lbl>
                  <textarea value={newSpark.reflection} onChange={e=>setNewSpark(n=>({...n,reflection:e.target.value}))} placeholder="What did it remind you of?" style={{...ISty,minHeight:"100px",fontSize:"17px",lineHeight:"1.8",padding:"15px",fontStyle:"italic",resize:"vertical",textAlign:"center"}} onFocus={e=>e.target.style.borderColor=GOLDD} onBlur={e=>e.target.style.borderColor=BORDER}/>
                </div>
                <div style={{marginBottom:"28px"}}>
                  <Lbl center>Where were you?</Lbl>
                  <input value={newSpark.context} onChange={e=>setNewSpark(n=>({...n,context:e.target.value}))} placeholder="Walking home, couldn't sleep, Tuesday afternoon..." style={{...ISty,fontSize:"16px",padding:"13px 15px",textAlign:"center"}} onFocus={e=>e.target.style.borderColor=GOLDD} onBlur={e=>e.target.style.borderColor=BORDER}/>
                </div>
                <div style={{textAlign:"center"}}>
                  {saved?<div style={{display:"inline-flex",alignItems:"center",gap:"10px",color:GOLDW,fontSize:"18px",fontStyle:"italic",animation:"goldPulse 0.8s ease"}}><MoonSVG size={18} opacity={0.9}/>Preserved.</div>
                    :<PBtn onClick={doSave}>Preserve this spark</PBtn>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Constellation tagging */}
        {tab==="capture" && showTag && (
          <div style={{paddingTop:"40px",textAlign:"center"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:"10px",color:GOLDW,fontSize:"19px",fontStyle:"italic",marginBottom:"32px"}}>
              <MoonSVG size={20} opacity={0.9}/>Spark preserved
            </div>
            <GoldLine/>
            <div style={{padding:"28px 0"}}>
              <Lbl center>Add to a constellation?</Lbl>
              <p style={{margin:"0 0 20px",fontSize:"15px",color:TEXTDD,fontStyle:"italic"}}>Optional — you can always do this later.</p>
              <div style={{display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center",marginBottom:"24px"}}>
                {cons.map(c=>{ const tagged=sparks.find(s=>s.id===savedId)?.cids.includes(c.id); return (
                  <button key={c.id} onClick={()=>tagSaved(c.id)} style={{padding:"10px 18px",borderRadius:"3px",cursor:"pointer",fontFamily:BODY,fontSize:"15px",background:tagged?"rgba(226,185,78,0.12)":"transparent",border:`1px solid ${tagged?GOLDW:BORDER}`,color:tagged?GOLDW:TEXTD,display:"inline-flex",alignItems:"center",gap:"7px",transition:"all 0.2s"}}>
                    <MoonSVG size={12} opacity={0.75}/>{c.name}
                  </button>
                ); })}
              </div>
              <GoldLine/>
              <div style={{marginTop:"24px"}}><PBtn onClick={finishCapture}>Done</PBtn></div>
            </div>
          </div>
        )}
      </div>

      {/* ══ SPARK OVERLAY ══ */}
      {openSpark && (
        <div style={{position:"fixed",inset:0,background:"rgba(5,12,24,0.98)",zIndex:200,overflowY:"auto",padding:"40px 28px",backdropFilter:"blur(12px)"}} onClick={()=>{if(!editMode){setOpenSpark(null);setEditMode(false);}}}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:"560px",margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px"}}>
              <button onClick={()=>{setOpenSpark(null);setEditMode(false);}} style={{background:"transparent",border:"none",color:TEXTD,fontSize:"13px",letterSpacing:"0.18em",cursor:"pointer",fontFamily:BODY,padding:0,textTransform:"uppercase"}}>← Close</button>
              <div style={{display:"flex",gap:"12px"}}>
                {!editMode && <button onClick={()=>{setEditData({...openSpark});setEditMode(true);}} style={{background:"transparent",border:`1px solid ${BORDER}`,borderRadius:"3px",color:TEXTD,fontSize:"13px",letterSpacing:"0.12em",cursor:"pointer",fontFamily:BODY,padding:"7px 14px",textTransform:"uppercase"}}>Edit</button>}
                <button onClick={()=>setDelConfirm(openSpark.id)} style={{background:"transparent",border:"1px solid rgba(139,26,42,0.5)",borderRadius:"3px",color:"#D4707F",fontSize:"13px",letterSpacing:"0.12em",cursor:"pointer",fontFamily:BODY,padding:"7px 14px",textTransform:"uppercase"}}>Delete</button>
              </div>
            </div>
            {!editMode?(
              <div>
                <div style={{display:"flex",justifyContent:"center",gap:"10px",alignItems:"center",marginBottom:"20px"}}>
                  <TypeIcon type={openSpark.type}/>
                  <span style={{fontSize:"13px",color:TEXTDD}}>{openSpark.date}</span>
                  {openSpark.feeling && <span style={{fontSize:"13px",color:TEXTD,fontStyle:"italic"}}>· {openSpark.feeling}</span>}
                </div>
                {openSpark.grad && <div style={{width:"100%",height:"180px",background:openSpark.grad,borderRadius:"4px",marginBottom:"24px",opacity:0.75}}/>}
                {openSpark.image && <img src={openSpark.image} alt="" style={{width:"100%",borderRadius:"4px",marginBottom:"24px",display:"block"}}/>}
                {openSpark.audio && <audio controls src={openSpark.audio} style={{width:"100%",marginBottom:"24px"}}/>}
                <GoldLine/>
                <p style={{margin:"24px auto",fontSize:"22px",lineHeight:1.88,color:TEXT,fontStyle:openSpark.type==="quote"?"italic":"normal",textAlign:"center",maxWidth:"480px"}}>
                  {openSpark.type==="quote"?`"${openSpark.content}"`:openSpark.content}
                </p>
                <GoldLine/>
                {openSpark.reflection && <p style={{margin:"20px 0 0",fontSize:"17px",color:TEXTD,fontStyle:"italic",textAlign:"center",lineHeight:1.78,borderLeft:`2px solid ${GOLDDD}`,paddingLeft:"16px"}}>"{openSpark.reflection}"</p>}
                {openSpark.context && <p style={{margin:"14px 0 0",fontSize:"14px",color:TEXTDD,textAlign:"center"}}>📍 {openSpark.context}</p>}
                {openSpark.musicLink && <div style={{textAlign:"center",marginTop:"16px"}}><a href={openSpark.musicLink} target="_blank" rel="noopener noreferrer" style={{fontSize:"15px",color:TYPES.music.color,textDecoration:"none",fontStyle:"italic"}}>♫ Open in music app →</a></div>}
                <div style={{marginTop:"28px",paddingTop:"20px",borderTop:`1px solid ${BORDER}`}}>
                  <Lbl center>Constellations</Lbl>
                  <div style={{display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"center"}}>
                    {cons.map(c=>(
                      <button key={c.id} onClick={()=>toggleConSpark(openSpark.id,c.id)} style={{padding:"7px 14px",borderRadius:"3px",cursor:"pointer",fontFamily:BODY,fontSize:"14px",background:openSpark.cids.includes(c.id)?"rgba(226,185,78,0.1)":"transparent",border:`1px solid ${openSpark.cids.includes(c.id)?GOLDW:DIMMER}`,color:openSpark.cids.includes(c.id)?GOLDW:TEXTD,display:"inline-flex",alignItems:"center",gap:"6px",transition:"all 0.2s"}}>
                        {openSpark.cids.includes(c.id)?"✦":"+"} {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{marginTop:"20px",paddingTop:"20px",borderTop:`1px solid ${BORDER}`,textAlign:"center"}}>
                  <button onClick={()=>setShareOpen(true)} style={{background:"transparent",border:`1px solid ${BORDER}`,borderRadius:"3px",color:GOLDD,fontSize:"13px",letterSpacing:"0.18em",cursor:"pointer",fontFamily:BODY,padding:"9px 20px",textTransform:"uppercase"}}>✦ Share this spark</button>
                </div>
              </div>
            ):(
              <div>
                <Lbl center>Edit spark</Lbl>
                <p style={{margin:"0 0 10px",fontSize:"11px",letterSpacing:"0.22em",textTransform:"uppercase",color:GOLDD,textAlign:"center"}}>Content</p>
                <textarea value={editData.content} onChange={e=>setEditData(d=>({...d,content:e.target.value}))} style={{...ISty,minHeight:"120px",fontSize:"17px",lineHeight:"1.8",padding:"15px",fontStyle:"italic",resize:"vertical",textAlign:"center",marginBottom:"14px"}}/>
                <p style={{margin:"0 0 10px",fontSize:"11px",letterSpacing:"0.22em",textTransform:"uppercase",color:GOLDD,textAlign:"center"}}>Reflection</p>
                <textarea value={editData.reflection||""} onChange={e=>setEditData(d=>({...d,reflection:e.target.value}))} placeholder="Why did this move you?" style={{...ISty,minHeight:"80px",fontSize:"15px",lineHeight:"1.7",padding:"13px",fontStyle:"italic",resize:"vertical",textAlign:"center",marginBottom:"14px"}}/>
                <p style={{margin:"0 0 10px",fontSize:"11px",letterSpacing:"0.22em",textTransform:"uppercase",color:GOLDD,textAlign:"center"}}>Context</p>
                <input value={editData.context||""} onChange={e=>setEditData(d=>({...d,context:e.target.value}))} placeholder="Where were you?" style={{...ISty,fontSize:"15px",padding:"12px 15px",textAlign:"center",marginBottom:"18px"}}/>
                <FeelingSection value={editData.feeling} onChange={f=>setEditData(d=>({...d,feeling:f}))} isEdit={true}/>
                <p style={{margin:"0 0 10px",fontSize:"11px",letterSpacing:"0.22em",textTransform:"uppercase",color:GOLDD,textAlign:"center"}}>Constellations</p>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"center",marginBottom:"22px"}}>
                  {cons.map(c=>(
                    <button key={c.id} onClick={()=>setEditData(d=>{ const has=d.cids.includes(c.id); return{...d,cids:has?d.cids.filter(i=>i!==c.id):[...d.cids,c.id]}; })} style={{padding:"7px 14px",borderRadius:"3px",cursor:"pointer",fontFamily:BODY,fontSize:"14px",background:editData.cids.includes(c.id)?"rgba(226,185,78,0.1)":"transparent",border:`1px solid ${editData.cids.includes(c.id)?GOLDW:DIMMER}`,color:editData.cids.includes(c.id)?GOLDW:TEXTD,display:"inline-flex",alignItems:"center",gap:"6px",transition:"all 0.2s"}}>
                      {editData.cids.includes(c.id)?"✦":"+"} {c.name}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:"12px",justifyContent:"center"}}>
                  <PBtn onClick={saveEdit}>Save changes</PBtn>
                  <GBtn onClick={()=>setEditMode(false)}>Cancel</GBtn>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delConfirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(5,12,24,0.97)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
          <div style={{maxWidth:"360px",width:"100%",padding:"32px",background:NAVY2,border:`1px solid ${BORDER}`,borderRadius:"4px",textAlign:"center"}}>
            <MoonSVG size={28} opacity={0.45}/>
            <p style={{margin:"16px 0 8px",fontSize:"19px",color:TEXT}}>Delete this spark?</p>
            <p style={{margin:"0 0 24px",fontSize:"15px",color:TEXTD,fontStyle:"italic"}}>This cannot be undone.</p>
            <div style={{display:"flex",gap:"12px",justifyContent:"center"}}>
              <GBtn onClick={()=>doDelete(delConfirm)} danger>Delete</GBtn>
              <PBtn onClick={()=>setDelConfirm(null)}>Keep it</PBtn>
            </div>
          </div>
        </div>
      )}

      {/* Share spark */}
      {shareOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(5,12,24,0.97)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}} onClick={()=>setShareOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:"400px",width:"100%",padding:"32px",background:NAVY2,border:`1px solid ${BORDER}`,borderRadius:"4px",textAlign:"center"}}>
            <MoonSVG size={24} opacity={0.75}/>
            <p style={{margin:"14px 0 8px",fontSize:"20px",color:TEXT}}>Share this spark</p>
            <p style={{margin:"0 0 24px",fontSize:"15px",color:TEXTD,fontStyle:"italic",lineHeight:1.7}}>Full sharing arrives when Lucida launches. For now, screenshot this moment.</p>
            <GBtn onClick={()=>setShareOpen(false)}>Close</GBtn>
          </div>
        </div>
      )}

      {/* Share story */}
      {storyShareOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(5,12,24,0.97)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}} onClick={()=>setStoryShareOpen(false)}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:"400px",width:"100%",padding:"32px",background:NAVY2,border:`1px solid ${BORDER}`,borderRadius:"4px",textAlign:"center"}}>
            <MoonSVG size={24} opacity={0.75}/>
            <p style={{margin:"14px 0 8px",fontSize:"20px",color:TEXT}}>Share your story</p>
            {storyText && <p style={{margin:"0 0 20px",fontSize:"16px",color:TEXTD,fontStyle:"italic",lineHeight:1.8,borderLeft:`2px solid ${GOLDDD}`,paddingLeft:"14px",textAlign:"left"}}>"{storyText}"</p>}
            <p style={{margin:"0 0 24px",fontSize:"15px",color:TEXTD,fontStyle:"italic",lineHeight:1.7}}>Full sharing arrives when Lucida launches. Screenshot this to share.</p>
            <GBtn onClick={()=>setStoryShareOpen(false)}>Close</GBtn>
          </div>
        </div>
      )}

      {/* Random constellation */}
      {showRand && randCon && (
        <div style={{position:"fixed",inset:0,background:"rgba(5,12,24,0.97)",zIndex:200,overflowY:"auto",padding:"40px 24px"}} onClick={()=>setShowRand(false)}>
          <div onClick={e=>e.stopPropagation()} style={{maxWidth:"580px",margin:"0 auto"}}>
            <button onClick={()=>setShowRand(false)} style={{background:"transparent",border:"none",color:TEXTD,fontSize:"13px",letterSpacing:"0.18em",cursor:"pointer",fontFamily:BODY,padding:"0 0 20px",textTransform:"uppercase"}}>← Back</button>
            <div style={{textAlign:"center",marginBottom:"24px"}}>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                <MoonSVG size={22} opacity={0.88}/>
                <h2 style={{margin:0,fontSize:"26px",color:TEXT,fontWeight:"normal",letterSpacing:"0.04em",fontFamily:DISPLAY}}>Random Constellation</h2>
              </div>
              <p style={{margin:"0 auto",fontSize:"15px",color:TEXTD,fontStyle:"italic",maxWidth:"420px",lineHeight:1.7}}>What connections do you see between these sparks?</p>
            </div>
            <div style={{margin:"0 0 20px",padding:"20px 24px",background:"rgba(226,185,78,0.06)",border:`1px solid ${BORDER}`,borderRadius:"4px"}}>
              <GoldLine/>
              <p style={{margin:"16px 0",fontSize:"18px",lineHeight:1.88,color:TEXT,fontStyle:"italic",textAlign:"center"}}>"{randCon.quote}"</p>
              <GoldLine/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"20px"}}>
              {randCon.sparks.map((spark,i)=>{
                const large=!!spark.grad||spark.content.length>150||i%4===0;
                return (
                  <div key={spark.id} style={{gridColumn:large?"1 / -1":"auto"}}>
                    <div style={{padding:large?"20px":"15px",background:"linear-gradient(135deg,rgba(16,32,58,0.96),rgba(9,23,42,0.99))",border:`1px solid ${BORDER}`,borderLeft:`2px solid ${TYPES[spark.type].color}`,borderRadius:"4px",height:"100%",boxSizing:"border-box"}}>
                      {spark.grad && <div style={{width:"100%",height:"80px",background:spark.grad,borderRadius:"3px",marginBottom:"10px",opacity:0.7}}/>}
                      <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"8px"}}>
                        <TypeIcon type={spark.type}/>
                        <span style={{fontSize:"13px",color:TEXTDD}}>{spark.date}</span>
                        {spark.feeling && <span style={{fontSize:"13px",color:TEXTD,fontStyle:"italic"}}>· {spark.feeling}</span>}
                      </div>
                      <p style={{margin:0,fontSize:large?"16px":"14px",lineHeight:1.78,color:TEXT,fontStyle:spark.type==="quote"?"italic":"normal"}}>{spark.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {randInsight && (
              <div style={{marginBottom:"20px",padding:"20px 22px",background:"rgba(226,185,78,0.07)",border:`1px solid ${BORDER}`,borderRadius:"4px"}}>
                <p style={{margin:"0 0 8px",fontSize:"11px",letterSpacing:"0.25em",textTransform:"uppercase",color:GOLDD}}>Lucida sees</p>
                <p style={{margin:0,fontSize:"16px",lineHeight:1.82,color:TEXT,fontStyle:"italic"}}>{randInsight}</p>
              </div>
            )}
            <div style={{display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center"}}>
              <PBtn onClick={genRandom}>Shuffle ✦</PBtn>
              {!randInsight && <PBtn onClick={getInsight} disabled={loadingInsight} muted>{loadingInsight?"Finding connections...":"Ask Lucida for insights"}</PBtn>}
              <GBtn onClick={saveRandCon}>Save as constellation</GBtn>
              <GBtn onClick={()=>setShowRand(false)}>Close</GBtn>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION — truly even */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100}}>
        <div style={{height:"1px",background:`linear-gradient(to right,transparent,${GOLDW},transparent)`,opacity:0.7}}/>
        <div style={{background:`linear-gradient(to top,${NAVY} 55%,rgba(9,23,42,0.97))`,backdropFilter:"blur(20px)"}}>
          <div style={{maxWidth:"640px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",width:"100%"}}>
            {[{id:"home",label:"Lucida"},{id:"gallery",label:"Gallery"},{id:"constellations",label:"Constellations"},{id:"story",label:"Story"}].map(t=>(
              <button key={t.id} onClick={()=>{setTab(t.id);setOpenCon(null);setShowSort(false);setShowSearch(false);setFeelingFilter(null);}} style={{padding:"14px 0 18px",background:"transparent",border:"none",cursor:"pointer",fontFamily:BODY,fontSize:"10px",letterSpacing:"0.06em",textTransform:"uppercase",color:tab===t.id?GOLDW:TEXTDD,transition:"color 0.25s",position:"relative",textAlign:"center",width:"100%",overflow:"hidden"}}>
                {tab===t.id && <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:"1px",background:GOLDW,opacity:0.9}}/>}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        textarea::placeholder, input::placeholder { color: rgba(242,234,216,0.22); font-style: italic; }
        div::-webkit-scrollbar { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes goldPulse { 0%{opacity:0;transform:scale(0.95);} 60%{opacity:1;transform:scale(1.02);} 100%{opacity:1;transform:scale(1);} }
        audio { accent-color: #E2B94E; }
      `}</style>
    </div>
  );
}
