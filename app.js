const BRAND = "Jeweler of Frogtown";
const N = 9;

let soundOn = true;

function makeSlots(){
  return Array.from({length:N}, (_,i)=>{
    const slot = String(i+1).padStart(2,"0");
    return { id:`locked-${slot}`, name:`Catalog Slot ${slot}` };
  });
}

let slots = makeSlots();

function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function playTick(){
  if(!soundOn) return;
  try{
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!AudioContext) return;
    if(!window._ctx) window._ctx = new AudioContext();
    const ctx = window._ctx;
    if(ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.05);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.07);
  }catch{}
}

function render(){
  document.getElementById("yr").textContent = new Date().getFullYear();
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  slots.forEach(s=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="frame">
        <div class="thumb">
          <div class="sigil">⟡</div>
          <div class="sealed">SEALED</div>
          <div class="slot">${s.name}</div>
        </div>
        <div class="meta">
          <div class="name">${s.name}</div>
          <div class="pills">
            <span class="pill">—</span>
            <span class="pill rarity">archived</span>
            <span class="pill">LOCKED</span>
          </div>
        </div>
        <div class="price">—</div>
      </div>
    `;
    card.addEventListener("mouseenter", playTick);
    card.addEventListener("touchstart", playTick, { passive:true });
    grid.appendChild(card);
  });
}

document.getElementById("shuffle").addEventListener("click", ()=>{
  playTick();
  slots = shuffle(slots);
  render();
});

document.getElementById("sfx").addEventListener("click", (e)=>{
  playTick();
  soundOn = !soundOn;
  e.currentTarget.setAttribute("aria-pressed", soundOn ? "true":"false");
  e.currentTarget.textContent = soundOn ? "SFX: ON" : "SFX: OFF";
});

render();
