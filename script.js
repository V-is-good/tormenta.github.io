const menuButton=document.querySelector(".menu");
const nav=document.querySelector(".header nav");
menuButton?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuButton?.setAttribute("aria-expanded","false");}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("contactForm")?.addEventListener("submit",async event=>{
 event.preventDefault();
 const form=event.currentTarget;
 const button=form.querySelector('button[type="submit"]');
 const feedback=form.querySelector('.feedback');
 const data=Object.fromEntries(new FormData(form).entries());
 feedback.className='feedback';
 feedback.textContent='Enviando tu solicitud...';
 button.disabled=true;
 try{
  const response=await fetch('/api/send-quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.error||'No se pudo enviar la solicitud. Inténtalo de nuevo.');
  feedback.classList.add('success');
  feedback.textContent='¡Solicitud enviada! El equipo de Tormenta Studio podrá responderte por correo.';
  form.reset();
 }catch(error){
  feedback.classList.add('error');
  feedback.textContent=error.message||'No se pudo enviar. Inténtalo más tarde.';
 }finally{button.disabled=false;}
});

(()=>{const c=document.getElementById("matrixRain");if(!c)return;const x=c.getContext("2d");let w,h,cols=[],font=15,last=0;const chars="アカサタナハマヤラワ0123456789PS<>/{}";
function size(){const d=Math.min(devicePixelRatio||1,1.6);w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0);cols=Array.from({length:Math.ceil(w/font)},()=>Math.random()*-h/font)}
function draw(t){requestAnimationFrame(draw);if(t-last<48)return;last=t;x.fillStyle="rgba(9,6,17,.075)";x.fillRect(0,0,w,h);x.font=font+"px monospace";cols.forEach((y,i)=>{x.fillStyle=Math.random()>.975?"rgba(231,208,255,.9)":"rgba(181,119,255,.78)";x.fillText(chars[Math.floor(Math.random()*chars.length)],i*font,y*font);if(y*font>h&&Math.random()>.975)cols[i]=0;else cols[i]+=.55+Math.random()*.42})}
addEventListener("resize",size,{passive:true});size();requestAnimationFrame(draw)})();

(()=>{const c=document.getElementById("constellation");if(!c)return;const x=c.getContext("2d");let w,h,pts=[],mouse={x:-999,y:-999};const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
function size(){const d=Math.min(devicePixelRatio||1,1.6);w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0);const n=Math.min(105,Math.max(38,Math.floor(w*h/12500)));pts=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.24,vy:(Math.random()-.5)*.24,r:Math.random()*1.5+.6}))}
addEventListener("pointermove",e=>{mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});addEventListener("pointerleave",()=>{mouse.x=-999;mouse.y=-999});addEventListener("resize",size,{passive:true});size();
function frame(){requestAnimationFrame(frame);x.clearRect(0,0,w,h);for(let i=0;i<pts.length;i++){const p=pts[i];if(!reduced){p.x+=p.vx;p.y+=p.vy;const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);if(d<145&&d>0){const f=(145-d)/145*.055;p.vx+=dx/d*f;p.vy+=dy/d*f}p.vx=Math.max(-.65,Math.min(.65,p.vx));p.vy=Math.max(-.65,Math.min(.65,p.vy));if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1}
for(let j=i+1;j<pts.length;j++){const q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<125){x.strokeStyle=`rgba(169,112,255,${(1-d/125)*.22})`;x.lineWidth=.7;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}
x.beginPath();x.arc(p.x,p.y,Math.hypot(p.x-mouse.x,p.y-mouse.y)<145?2.2:p.r,0,Math.PI*2);x.fillStyle="rgba(207,169,255,.96)";x.fill()}}frame()})();

(()=>{
 const c=document.getElementById("lightningCanvas");
 if(!c)return;
 const x=c.getContext("2d");
 let w=0,h=0,dpr=1,bolts=[],last=0,next=1000;
 function resize(){
  dpr=Math.min(devicePixelRatio||1,1.7);w=innerWidth;h=innerHeight;
  c.width=w*dpr;c.height=h*dpr;x.setTransform(dpr,0,0,dpr,0,0);
 }
 function branch(x0,y0,x1,y1,depth=0){
  const dx=x1-x0,dy=y1-y0,dist=Math.hypot(dx,dy);
  if(depth>7||dist<15)return;
  const segments=Math.max(2,Math.floor(dist/28));
  let pts=[{x:x0,y:y0}];
  for(let i=1;i<segments;i++){
   const t=i/segments;
   pts.push({x:x0+dx*t+(Math.random()-.5)*Math.min(45,dist*.16),y:y0+dy*t});
  }
  pts.push({x:x1,y:y1});
  for(let i=0;i<pts.length-1;i++){
   const a=pts[i],b=pts[i+1];
   bolts.push({a,b,life:1,wide:depth===0?2.6:1.05});
   if(depth<3&&Math.random()<(depth===0?.52:.24)){
    const bx=b.x+(Math.random()-.5)*130,by=b.y+35+Math.random()*100;
    branch(b.x,b.y,bx,by,depth+1);
   }
  }
 }
 function strike(){
  bolts=[];
  const sx=w*(.12+Math.random()*.76),sy=-10;
  const ex=sx+(Math.random()-.5)*Math.min(w*.48,520),ey=h*(.42+Math.random()*.55);
  branch(sx,sy,ex,ey);
  if(Math.random()>.48)branch(sx+w*(Math.random()-.5)*.18,sy,ex+(Math.random()-.5)*160,ey*.78);
  last=performance.now();
 }
 function frame(t){
  requestAnimationFrame(frame);
  x.clearRect(0,0,w,h);
  if(t>next){strike();next=t+1400+Math.random()*3200;}
  const age=t-last,flash=age<190?1-age/240:0;
  if(flash>0){x.fillStyle=`rgba(190,125,255,${flash*.095})`;x.fillRect(0,0,w,h);}
  for(const b of bolts){
   const alpha=Math.max(0,1-age/520);
   x.beginPath();x.moveTo(b.a.x,b.a.y);x.lineTo(b.b.x,b.b.y);
   x.strokeStyle=`rgba(170,75,255,${alpha*.58})`;x.lineWidth=b.wide*7;x.shadowBlur=28;x.shadowColor="#a000ff";x.stroke();
   x.beginPath();x.moveTo(b.a.x,b.a.y);x.lineTo(b.b.x,b.b.y);
   x.strokeStyle=`rgba(255,244,255,${alpha})`;x.lineWidth=b.wide;x.shadowBlur=24;x.shadowColor="#d18cff";x.stroke();
  }
  x.shadowBlur=0;
  if(age>650)bolts=[];
 }
 addEventListener("resize",resize,{passive:true});resize();next=650;requestAnimationFrame(frame);
})();
