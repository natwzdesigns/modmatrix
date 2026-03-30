/* CURSOR (desktop only) */
(function(){
  if(!window.matchMedia('(hover:hover)').matches) return;
  const dot=document.getElementById('cursor-dot'),ring=document.getElementById('cursor-ring');
  if(!dot||!ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  const lerp=(a,b,t)=>a+(b-a)*t;
  (function loop(){rx=lerp(rx,mx,.12);ry=lerp(ry,my,.12);ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button,.client-card,.pack-card,.filter-btn').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-grow'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-grow'));
  });
})();

/* HAMBURGER */
(function(){
  const btn=document.getElementById('hamburger');
  const menu=document.getElementById('mobile-menu');
  if(!btn||!menu) return;
  btn.addEventListener('click',e=>{
    e.stopPropagation();
    const open=menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    // animate spans
    const spans=btn.querySelectorAll('span');
    if(open){
      spans[0].style.transform='rotate(45deg) translate(4px,4px)';
      spans[1].style.opacity='0';
      spans[2].style.transform='rotate(-45deg) translate(4px,-4px)';
    } else {
      spans[0].style.transform='';
      spans[1].style.opacity='';
      spans[2].style.transform='';
    }
  });
  document.addEventListener('click',()=>{
    menu.classList.remove('open');
    btn.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='';});
  });
  menu.addEventListener('click',e=>e.stopPropagation());
})();

/* NAV SCROLL */
(function(){
  const nav=document.querySelector('nav');
  if(!nav) return;
  window.addEventListener('scroll',()=>nav.style.background=window.scrollY>40?'rgba(10,0,0,0.92)':'rgba(10,0,0,0.70)');
})();

/* PARTICLE CANVAS */
(function(){
  const canvas=document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let W,H,pts=[];
  const resize=()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;};
  resize(); window.addEventListener('resize',resize);
  class P{
    constructor(){this.reset();}
    reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.25;this.vy=(Math.random()-.5)*.25;this.r=Math.random()*1.2+.3;this.a=Math.random()*.35+.06;}
    step(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(200,0,0,${this.a})`;ctx.fill();}
  }
  for(let i=0;i<90;i++) pts.push(new P());
  function connect(){
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(160,0,0,${.1*(1-d/110)})`;ctx.lineWidth=.5;ctx.stroke();}
    }
  }
  (function tick(){ctx.clearRect(0,0,W,H);pts.forEach(p=>{p.step();p.draw();});connect();requestAnimationFrame(tick);})();
})();

/* REVEAL */
(function(){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
})();

/* GLITCH */
function glitchEl(el){
  const orig=el.dataset.text||el.textContent;
  const chars='@#$%!&?*<>[]|';
  let f=0;
  (function step(){
    if(f>14){el.textContent=orig;return;}
    el.textContent=orig.split('').map((c,i)=>i<f/1.8?c:(c===' '?' ':chars[Math.floor(Math.random()*chars.length)])).join('');
    f++;requestAnimationFrame(step);
  })();
}
document.querySelectorAll('[data-glitch]').forEach(el=>{
  el.dataset.text=el.textContent;
  el.addEventListener('mouseenter',()=>glitchEl(el));
});

/* 3D TILT (desktop) */
if(window.matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.client-card').forEach(card=>{
    card.style.transformStyle='preserve-3d';
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*10;
      const y=((e.clientY-r.top)/r.height-.5)*-10;
      card.style.transform=`translateY(-8px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
}

/* DISABLE RIGHT CLICK */
document.addEventListener('contextmenu', e => e.preventDefault());

/* DISABLE COMMON KEYBOARD SHORTCUTS */
document.addEventListener('keydown', e => {
  // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
    (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
    (e.ctrlKey && (e.key === 's' || e.key === 'S'))
  ) {
    e.preventDefault();
    return false;
  }
});
