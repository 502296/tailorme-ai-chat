// public/tailorme-chat.js

// لو السكربت مستضاف على نفس الدومين اتركه فاضي ''

// ولو بتستخدمه من موقع خارجي لاحقًا غيّره إلى https://YOUR-APP.vercel.app

const API_BASE = '';



(function(){

  const btn = document.createElement('button');

  btn.textContent = 'Chat';

  Object.assign(btn.style, {

    position:'fixed', right:'18px', bottom:'18px', padding:'12px 16px',

    borderRadius:'24px', border:'none', boxShadow:'0 4px 14px rgba(0,0,0,.2)',

    cursor:'pointer', zIndex:9999

  });

  document.body.appendChild(btn);



  const panel = document.createElement('div');

  Object.assign(panel.style, {

    position:'fixed', right:'18px', bottom:'70px', width:'320px', height:'420px',

    background:'#111', color:'#eee', borderRadius:'14px',

    boxShadow:'0 10px 30px rgba(0,0,0,.35)', display:'none', zIndex:9999,

    overflow:'hidden', border:'1px solid #242424'

  });

  panel.innerHTML = `

    <div style="padding:10px 12px; background:#161616; font-weight:600;">TailorMe Assistant</div>

    <div id="tm-log" style="height:320px; overflow:auto; padding:10px 12px; font-size:14px;"></div>

    <div style="display:flex; gap:6px; padding:10px;">

      <input id="tm-input" placeholder="اكتب رسالتك / Write here / Escribe aquí..." style="flex:1; padding:10px; border-radius:10px; border:1px solid #333; background:#0b0b0b; color:#eee">

      <button id="tm-send" style="padding:10px 12px; border-radius:10px; border:1px solid #333;">Send</button>

    </div>`;

  document.body.appendChild(panel);



  btn.onclick = () => panel.style.display = (panel.style.display==='none'?'block':'none');



  const log = panel.querySelector('#tm-log');

  const input = panel.querySelector('#tm-input');

  const sendBtn = panel.querySelector('#tm-send');

  const history = [];



  function addBubble(text, who='user'){

    const b = document.createElement('div');

    b.style.margin = '8px 0'; b.style.whiteSpace = 'pre-wrap'; b.style.lineHeight = '1.35';

    b.style.background = who==='user' ? '#1e2a3a' : '#1c1c1c';

    b.style.padding = '10px'; b.style.borderRadius = '10px';

    b.textContent = text; log.appendChild(b); log.scrollTop = log.scrollHeight;

  }



  async function send(){

    const txt = (input.value || '').trim(); if(!txt) return;

    addBubble(txt,'user'); input.value='';

    try{

      const r = await fetch(`${API_BASE}/api/chat`, {

        method:'POST',

        headers:{'Content-Type':'application/json'},

        body: JSON.stringify({ history, userText: txt })

      });

      const data = await r.json();

      const reply = data.reply || '...';

      history.push({ role:'user', content: txt }, { role:'assistant', content: reply });

      addBubble(reply,'assistant');

    }catch(e){

      addBubble('عذرًا/Lo siento/Sorry — حدث خطأ. حاول مرة أخرى.','assistant');

    }

  }

  sendBtn.onclick = send;

  input.addEventListener('keydown', e => { if(e.key==='Enter') send(); });

})();
