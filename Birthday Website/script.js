const stages = [1,2,3,4,5,6].map(n=>document.getElementById('stage-'+n));
function showStage(n){
  stages.forEach((s,i)=>{ if(i+1===n) s.classList.remove('hidden'); else s.classList.add('hidden'); });
  window.scrollTo(0,0);
}

// particles
const particleBox = document.querySelector('.bg-particles');
for(let i=0;i<18;i++){
  const sp=document.createElement('span');
  const size=4+Math.random()*8;
  sp.style.width=size+'px'; sp.style.height=size+'px';
  sp.style.left=Math.random()*100+'%'; sp.style.top=Math.random()*100+'%';
  sp.style.background=Math.random()>.5?'#f23478':'#ffd4e6';
  sp.style.animationDelay=Math.random()*8+'s';
  particleBox.appendChild(sp);
}

// NO button escape
const noBtn=document.getElementById('noBtn');
const yesBtn=document.getElementById('yesBtn');
let noMoving=false;
function handleNoButton(e){
  if(noMoving) return;
  const rect=noBtn.getBoundingClientRect();
  const container=stage1Rect();
  const x=e.clientX|| (e.touches&&e.touches[0].clientX);
  const y=e.clientY|| (e.touches&&e.touches[0].clientY);
  if(x==null) return;
  const dx=x-(rect.left+rect.width/2);
  const dy=y-(rect.top+rect.height/2);
  const dist=Math.hypot(dx,dy);
  if(dist<90){
    noMoving=true;
    const maxX=window.innerWidth-noBtn.offsetWidth-20;
    const maxY=window.innerHeight-noBtn.offsetHeight-20;
    let nx=Math.random()*maxX;
    let ny=Math.random()*maxY;
    // avoid YES
    const yr=yesBtn.getBoundingClientRect();
    if(Math.abs(nx-yr.left)<120 && Math.abs(ny-yr.top)<60){ nx=(nx+200)%maxX; }
    noBtn.style.position='fixed';
    noBtn.style.left=nx+'px';
    noBtn.style.top=ny+'px';
    noBtn.style.transition='left .3s ease,top .3s ease';
    setTimeout(()=>noMoving=false,320);
  }
}
function stage1Rect(){return document.getElementById('stage-1').getBoundingClientRect();}
document.addEventListener('mousemove',handleNoButton);
document.addEventListener('touchmove',handleNoButton,{passive:true});
document.addEventListener('touchstart',handleNoButton,{passive:true});
yesBtn.addEventListener('click',()=>{ sparkles(); showStage(2); });

function sparkles(){
  for(let i=0;i<12;i++){
    const s=document.createElement('div');
    s.style.position='fixed';s.style.left='50%';s.style.top='50%';
    s.style.width='6px';s.style.height='6px';s.style.borderRadius='50%';
    s.style.background='#f23478';s.style.pointerEvents='none';s.style.zIndex=999;
    document.body.appendChild(s);
    const ang=Math.random()*Math.PI*2; const r=60+Math.random()*60;
    s.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(ang)*r}px,${Math.sin(ang)*r}px)`,opacity:0}],{duration:700,easing:'ease-out'});
    setTimeout(()=>s.remove(),720);
  }
}

// Stage 2 balloons
const balloonArea=document.getElementById('balloonArea');
const balloonMsg=document.getElementById('balloonMsg');
const finalBalloonMsg=document.getElementById('finalBalloonMsg');
const continue2=document.getElementById('continue2');
let popped=0;
function popBalloon(balloon){
  if(balloon.classList.contains('pop')) return;
  balloon.classList.add('pop');
  const msg=balloon.getAttribute('data-msg');
  confetti(balloon.getBoundingClientRect());
  setTimeout(()=>{
    balloon.remove();
    balloonMsg.textContent=msg;
    balloonMsg.classList.add('show');
    popped++;
    if(popped===4){
      setTimeout(()=>{
        balloonMsg.classList.remove('show');
        balloonArea.innerHTML='<div class="final-balloon-msg show">You make life beautiful 💗</div>';
        continue2.classList.remove('hidden');
        softConfetti();
      },900);
    }
  },320);
}
balloonArea.addEventListener('click',e=>{
  const b=e.target.closest('.balloon');
  if(b) popBalloon(b);
});
// touch
balloonArea.addEventListener('touchend',e=>{
  const t=e.changedTouches[0];
  const el=document.elementFromPoint(t.clientX,t.clientY);
  const b=el&&el.closest('.balloon');
  if(b) popBalloon(b);
});
document.getElementById('back2').addEventListener('click',()=>showStage(1));
continue2.addEventListener('click',()=>showStage(3));

// Stage3
const cakeWrap=document.getElementById('cakeWrap');
const wishText=document.getElementById('wishText');
const continue3=document.getElementById('continue3');
let wished=false;
function makeWish(){
  if(wished) return;
  wished=true;
  document.querySelectorAll('.flame').forEach(f=>{ f.style.opacity='0'; f.style.transition='opacity .6s'; });
  sparkles();
  setTimeout(()=>wishText.classList.remove('hidden'),400);
  setTimeout(()=>continue3.classList.remove('hidden'),900);
}
cakeWrap.addEventListener('click',makeWish);
cakeWrap.addEventListener('touchend',makeWish);
document.getElementById('back3').addEventListener('click',()=>showStage(2));
continue3.addEventListener('click',()=>showStage(4));

// Stage4 gallery
const photos=[
  {src:'assets/photos/first.jpeg', caption:'Your smile, my favorite view 💗'},
  {src:'assets/photos/second.jpeg', caption:'A little moment worth remembering ✨'},
  {src:'assets/photos/third.jpeg', caption:'Just you being you. 🌷'},
  {src:'assets/photos/fourth.jpeg', caption:" I'd die for those eyes of yours, btw. 🫠❤️"},
  {src:'assets/photos/fiffth.jpeg', caption:'Fav one 💕'},
];
let gi=0;
const gImg=document.getElementById('gImg');
const gCaption=document.getElementById('gCaption');
const gCounter=document.getElementById('gCounter');
const gDots=document.getElementById('gDots');
function renderPhoto(i){
  gi=(i+photos.length)%photos.length;
  const p=photos[gi];
  gImg.onerror=()=>{ gImg.src=''; gImg.style.background='linear-gradient(135deg,#ffd4e6,#f7a8c8)'; gImg.alt='Add your photo here'; };
  gImg.src=p.src;
  gCaption.textContent=p.caption||'';
  gCounter.textContent=String(gi+1).padStart(2,'0')+' / '+String(photos.length).padStart(2,'0');
  gDots.innerHTML='';
  photos.forEach((_,k)=>{
    const d=document.createElement('span');
    if(k===gi) d.classList.add('active');
    d.addEventListener('click',()=>renderPhoto(k));
    gDots.appendChild(d);
  });
}
document.getElementById('gPrev').addEventListener('click',()=>renderPhoto(gi-1));
document.getElementById('gNext').addEventListener('click',()=>renderPhoto(gi+1));
// swipe
let sx=0;
const gFrame=document.getElementById('gFrame');
gFrame.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});
gFrame.addEventListener('touchend',e=>{
  const ex=e.changedTouches[0].clientX;
  if(ex-sx>40) renderPhoto(gi-1);
  else if(sx-ex>40) renderPhoto(gi+1);
},{passive:true});
// keyboard
document.addEventListener('keydown',e=>{
  if(document.getElementById('stage-4').classList.contains('hidden')) return;
  if(e.key==='ArrowLeft') renderPhoto(gi-1);
  if(e.key==='ArrowRight') renderPhoto(gi+1);
});
document.getElementById('back4').addEventListener('click',()=>showStage(3));
document.getElementById('continue4').addEventListener('click',()=>showStage(5));
renderPhoto(0);

// Stage5 envelope
const envelope=document.getElementById('envelope');
const flap=envelope.querySelector('.env-flap');
const seal=envelope.querySelector('.env-seal');
const letterCard=document.getElementById('letterCard');
const letterContent=document.getElementById('letterContent');
const continue5=document.getElementById('continue5');
let opened=false;
const letterLines=[
  {type:'greet',text:'To Soumitaa 💗'},
  {type:'p',text:'Happy 19th birthday, Moon! 🌙🎂❤️'},
  {type:'p',text:'May this new chapter bring you endless happiness and beautiful memories.'},
  {type:'p',text:'Never stop being the sweet nd amazing person you are. 🫶🏻'},
  {type:'p',text:'Keep smiling because your smile genuinely makes things better.'},
  {type:'p',text:"And those eyes of yours!! I'd die for them. 🥹❤️"},
  {type:'p',text:'I hope life gives you all the little things your heart wishes for.'},
  {type:'p',text:'Stay magical, Soumitaaaaa! You deserve all the love in the universe. ✨💗'},
];
function openEnvelope(){
  if(opened) return;
  opened=true;
  flap.classList.add('open');
  seal.classList.add('hide');
  sparkles();
  setTimeout(()=>{
    letterCard.classList.remove('hidden');
    // hide envelope and heading
    envelopeWrap.style.display='none';
    const h2=document.querySelector('#stage-5 .heading');
    if(h2) h2.style.display='none';
    revealLetter();
  },700);
}
envelope.addEventListener('click',openEnvelope);
envelope.addEventListener('touchend',openEnvelope);
function revealLetter(){
  letterContent.innerHTML='';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){
    letterLines.forEach(l=>{
      const el=document.createElement(l.type==='greet'?'div':'p');
      if(l.type==='greet') el.className='greet';
      el.textContent=l.text;
      letterContent.appendChild(el);
    });
    continue5.classList.remove('hidden');
    return;
  }
  let i=0;
  function next(){
    if(i>=letterLines.length){ continue5.classList.remove('hidden'); return; }
    const l=letterLines[i++];
    const el=document.createElement(l.type==='greet'?'div':'p');
    if(l.type==='greet') el.className='greet';
    letterContent.appendChild(el);
    // typewriter
    let j=0; const txt=l.text;
    const id=setInterval(()=>{
      el.textContent=txt.slice(0,j++);
      if(j>txt.length){ clearInterval(id); setTimeout(next,350); }
    },22);
  }
  next();
}
document.getElementById('back5').addEventListener('click',()=>showStage(4));
continue5.addEventListener('click',()=>showStage(6));

// Stage6
document.getElementById('replayBtn').addEventListener('click',resetExperience);
function resetExperience(){
  // restore balloons
  const area=document.getElementById('balloonArea');
  area.innerHTML='';
  const colors=[['b-blue','You make life beautiful 💗'],['b-pink','Your smile makes ordinary days special ✨'],['b-mint','You deserve all the happiness in the world 🌷'],['b-lav','Never forget how special you are 💕']];
  colors.forEach(([c,m])=>{
    const d=document.createElement('div');
    d.className='balloon '+c;
    d.setAttribute('data-msg',m);
    area.appendChild(d);
  });
  popped=0;
  balloonMsg.textContent=''; balloonMsg.classList.remove('show');
  finalBalloonMsg.classList.add('hidden');
  continue2.classList.add('hidden');
  // cake
  wished=false;
  document.querySelectorAll('.flame').forEach(f=>{ f.style.opacity='1'; });
  wishText.classList.add('hidden');
  continue3.classList.add('hidden');
  // gallery
  renderPhoto(0);
  // envelope
  opened=false;
  flap.classList.remove('open');
  seal.classList.remove('hide');
  envelopeWrap.style.display='';
  const h2r=document.querySelector('#stage-5 .heading');
  if(h2r) h2r.style.display='';
  letterCard.classList.add('hidden');
  letterContent.innerHTML='';
  continue5.classList.add('hidden');
  showStage(1);
  // reset no btn
  noBtn.style.position=''; noBtn.style.left=''; noBtn.style.top=''; noBtn.style.transition='';
}

// confetti helpers
function confetti(rect){
  const n=24;
  for(let i=0;i<n;i++){
    const c=document.createElement('div');
    c.style.position='fixed';
    c.style.left=(rect.left+rect.width/2)+'px';
    c.style.top=(rect.top+rect.height/2)+'px';
    c.style.width='8px';c.style.height='8px';
    c.style.background=['#f23478','#ffd700','#b388ff','#6fe0b3','#ff7eb3'][i%5];
    c.style.pointerEvents='none';c.style.zIndex=999;
    document.body.appendChild(c);
    const ang=Math.random()*Math.PI*2; const r=40+Math.random()*80;
    c.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${Math.cos(ang)*r}px,${Math.sin(ang)*r}px) rotate(360deg)`,opacity:0}],{duration:900,easing:'ease-out'});
    setTimeout(()=>c.remove(),920);
  }
}
function softConfetti(){
  const n=60;
  for(let i=0;i<n;i++){
    const c=document.createElement('div');
    c.style.position='fixed';
    c.style.left=Math.random()*100+'vw';
    c.style.top='-10px';
    c.style.width='8px';c.style.height='12px';
    c.style.background=['#f23478','#ffd700','#b388ff','#6fe0b3','#ff7eb3','#fff'][i%6];
    c.style.pointerEvents='none';c.style.zIndex=999;
    document.body.appendChild(c);
    c.animate([{transform:'translateY(0) rotate(0)',opacity:1},{transform:`translateY(${window.innerHeight+20}px) rotate(720deg)`,opacity:0.2}],{duration:2500+Math.random()*1500,easing:'cubic-bezier(.2,.8,.2,1)'});
    setTimeout(()=>c.remove(),4200);
  }
}
// final screen confetti on show
// trigger confetti when stage6 becomes visible
const s6=document.getElementById('stage-6');
const mo=new MutationObserver(()=>{ if(!s6.classList.contains('hidden')) softConfetti(); });
mo.observe(s6,{attributes:true,attributeFilter:['class']});

// auto-start music on first interaction
function tryAutoPlay(){
  if(bgMusic.paused){
    bgMusic.play().then(()=>{ musicBtn.textContent='♫'; }).catch(()=>{});
  }
  document.removeEventListener('click',tryAutoPlay);
  document.removeEventListener('touchstart',tryAutoPlay);
}
document.addEventListener('click',tryAutoPlay);
document.addEventListener('touchstart',tryAutoPlay);
const bgMusic=document.getElementById('bgMusic');
musicBtn.addEventListener('click',()=>{
  if(bgMusic.paused){ bgMusic.play().catch(()=>{}); musicBtn.textContent='♫'; }
  else { bgMusic.pause(); musicBtn.textContent='♪'; }
});

// keyboard escape for NO not needed
window.addEventListener('resize',()=>{});
showStage(1);
