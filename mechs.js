// Shared mechanism library: used by the video renderer and the 3D web page.
// Each entry: texts (sv/es), legend colours, camera, build(sc,key) -> {update(t)}
// Relies on globals: GROUND, cyl, bar, setBar, ext, pts, holeC, mat, sh
const MECH={};
function circInt(p0,r0,p1,r1){const dx=p1.x-p0.x,dy=p1.y-p0.y,d=Math.hypot(dx,dy);const a=(r0*r0-r1*r1+d*d)/(2*d);const h=Math.sqrt(Math.max(0,r0*r0-a*a));const mx=p0.x+a*dx/d,my=p0.y+a*dy/d;return[{x:mx+h*dy/d,y:my-h*dx/d},{x:mx-h*dy/d,y:my+h*dx/d}]}
function pinZ(r,len,c){const p=cyl(r,len,c===undefined?0xdedede:c,0.25,0.7);p.rotation.x=Math.PI/2;return p}
function pinX(r,len,c){const p=cyl(r,len,c===undefined?0xdedede:c,0.25,0.7);p.rotation.z=Math.PI/2;return p}
function boxM(w,h,d,c,rough,metal){return sh(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c,rough===undefined?0.45:rough,metal===undefined?0.7:metal)))}
function post(sc,x,z,yTop,yBot,c){const h=yTop-yBot;const p=boxM(14,h,14,c||0x3a424c);p.position.set(x,yBot+h/2,z);sc.add(p);return p}
function makeTrace(sc,n,color){const g=new THREE.BufferGeometry();const arr=new Float32Array(n*3);g.setAttribute('position',new THREE.BufferAttribute(arr,3));
 const l=new THREE.Points(g,new THREE.PointsMaterial({color,size:5,sizeAttenuation:true}));l.frustumCulled=false;sc.add(l);let count=0;
 return{push(x,y,z){if(count<n){arr[count*3]=x;arr[count*3+1]=y;arr[count*3+2]=z;count++}else{arr.copyWithin(0,3);arr[(n-1)*3]=x;arr[(n-1)*3+1]=y;arr[(n-1)*3+2]=z}g.attributes.position.needsUpdate=true;g.setDrawRange(0,count)}}}
function flameMesh(sc){const f=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),new THREE.MeshBasicMaterial({color:0xffa53a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));sc.add(f);return f}
const ez=x=>x<0?0:x>1?1:x*x*(3-2*x);

// ---------------- 1. Kolvmotor ----------------
MECH.kolv={c:['#4C9BE8','#2BB673','#E8743B','#F2B53A'],
 sv:{n:'Kolvmotor',d:'Bränslet exploderar ovanför kolven och trycker ner den. Vevstaken gör om kolvens upp-och-ner-rörelse till rotation, och svänghjulet håller farten jämn mellan explosionerna.',s:'Vev 30 · vevstake 95 · slaglängd 60',u:'Finns i bilar, motorcyklar, gräsklippare och båtmotorer.',l:['Kolv','Vevstake','Vevaxel','Tändning'],
  subs:[[0,'Hjärtat i nästan varje bil'],[6,'Explosionen trycker ner kolven'],[12,'Vevstaken gör om rörelsen till rotation'],[19,'Svänghjulet jämnar ut varven'],[25,'En fyrtaktsmotor tänder vartannat varv']]},
 es:{n:'Motor de pistón',d:'El combustible explota encima del pistón y lo empuja hacia abajo. La biela convierte el movimiento de subida y bajada en rotación, y el volante mantiene la velocidad estable entre explosiones.',s:'Manivela 30 · biela 95 · carrera 60',u:'Está en coches, motos, cortacéspedes y motores de barco.',l:['Pistón','Biela','Cigüeñal','Encendido']},
 cam:{target:[0,75,0],dist:660,elev:0.22,az:Math.PI/2-0.6,sweep:0.75},
 build(sc,key){GROUND(sc,-90);const r=30,L=95;
  const fill=new THREE.DirectionalLight(0xffffff,1.0);fill.position.set(-80,60,600);sc.add(fill);
  const fw=new THREE.Group();sc.add(fw);
  const disc=pinZ(72,14,0x5f666e);disc.position.z=-36;fw.add(disc);
  const mk=boxM(56,8,2,0xffffff,0.3,0.2);mk.position.set(36,0,-28.5);fw.add(mk);
  fw.add(pinZ(8,100,0xE8743B));
  const web=boxM(r+26,22,8,0xE8743B,0.3,0.85);web.position.set(r/2,0,-8);fw.add(web);
  const cw=sh(new THREE.Mesh(new THREE.CylinderGeometry(34,34,8,40,1,false,Math.PI*1.25,Math.PI*0.5),mat(0xE8743B,0.3,0.85)));cw.rotation.x=Math.PI/2;cw.position.z=-8;fw.add(cw);
  const cp=pinZ(6,18,0xdedede);cp.position.set(r,0,0);fw.add(cp);
  const rod=bar(14,10,0x2BB673);sc.add(rod);
  const piston=cyl(26,36,0x4C9BE8,0.28,0.85);sc.add(piston);
  const wp=pinZ(5,40,0xdedede);sc.add(wp);
  const wallL=boxM(8,120,60,0x8d949c,0.45,0.85);wallL.position.set(-31,118,0);sc.add(wallL);
  const wallR=boxM(8,120,60,0x8d949c,0.45,0.85);wallR.position.set(31,118,0);sc.add(wallR);
  const back=boxM(70,120,6,0x5f666e,0.5,0.8);back.position.set(0,118,-31);sc.add(back);
  const head=boxM(90,14,66,0x8d949c,0.45,0.85);head.position.set(0,185,0);sc.add(head);
  const plug=cyl(6,24,0xe8e8e8,0.3,0.2);plug.position.set(0,202,0);sc.add(plug);
  const crankcase=boxM(110,10,80,0x3a424c);crankcase.position.set(0,-80,-10);sc.add(crankcase);
  [-1,1].forEach(s=>{const b=boxM(12,70,12,0x3a424c);b.position.set(s*50,-45,-48);sc.add(b)});
  const fl=flameMesh(sc);const pl=new THREE.PointLight(0xff9a3a,0,300,1.5);pl.position.set(0,165,40);sc.add(pl);
  return{update(t){const th=2.4*t+Math.PI/2;fw.rotation.z=th-Math.PI/2+Math.PI/2;fw.rotation.z=th;
   const P={x:r*Math.cos(th),y:r*Math.sin(th)};const yp=P.y+Math.sqrt(L*L-P.x*P.x);
   setBar(rod,P,{x:0,y:yp},6);piston.position.set(0,yp+8,0);wp.position.set(0,yp,0);
   const top=yp+26,ph=((th-Math.PI/2)%(4*Math.PI)+4*Math.PI)%(4*Math.PI),I=ph<0.9?Math.pow(1-ph/0.9,1.5):0;
   fl.material.opacity=0.85*I;fl.scale.set(24,Math.max(2,(178-top)/2),24);fl.position.set(0,(top+178)/2,0);pl.intensity=4000*I}}}};

// ---------------- 2. Skotskt ok ----------------
MECH.ok={c:['#E8743B','#4C9BE8','#9aa0a6'],
 sv:{n:'Skotskt ok',d:'En tapp på en roterande skiva glider i ett spår i oket. Oket kan bara röra sig åt sidan, så rotationen blir en jämn fram-och-tillbaka-rörelse som följer en exakt sinuskurva.',s:'Tapp på radie 35 · slaglängd 70 · x = r · cos θ',u:'Används i ventilställdon, pumpar och vissa kompressorer.',l:['Drivskiva','Ok med spår','Styrningar'],
  subs:[[0,'Gör rotation till fram-och-tillbaka-rörelse'],[6,'Tappen glider upp och ner i okets spår'],[12,'Oket kan bara röra sig åt sidan'],[19,'Rörelsen följer en exakt sinuskurva'],[25,'Enklare än en vevstake – men slits snabbare']]},
 es:{n:'Yugo escocés',d:'Un perno en un disco giratorio se desliza por la ranura del yugo. El yugo solo puede moverse de lado, así que la rotación se convierte en un vaivén que sigue una curva sinusoidal exacta.',s:'Perno a radio 35 · carrera 70 · x = r · cos θ',u:'Se usa en actuadores de válvulas, bombas y algunos compresores.',l:['Disco motriz','Yugo ranurado','Guías']},
 cam:{target:[0,0,0],dist:470,elev:0.3,az:Math.PI/2-0.5,sweep:0.7},
 build(sc,key){GROUND(sc,-80);const fill=new THREE.DirectionalLight(0xffffff,0.9);fill.position.set(0,80,600);sc.add(fill);
  const dg=new THREE.Group();sc.add(dg);const d=pinZ(48,12,0xE8743B);d.position.z=-14;dg.add(d);
  const mk=boxM(40,6,2,0xffffff,0.3,0.2);mk.position.set(-22,0,-7.5);dg.add(mk);
  const pn=pinZ(6,24,0xdedede);pn.position.set(35,0,0);dg.add(pn);const sh_=pinZ(7,60,0xb8bec6);sh_.position.z=-40;dg.add(sh_);
  const yg=new THREE.Group();sc.add(yg);
  const fr=new THREE.Shape();fr.moveTo(-18,-62);fr.lineTo(18,-62);fr.lineTo(18,62);fr.lineTo(-18,62);fr.closePath();
  const hl=new THREE.Path();hl.moveTo(-7,-47);hl.lineTo(-7,47);hl.lineTo(7,47);hl.lineTo(7,-47);hl.closePath();fr.holes.push(hl);
  const frame=sh(new THREE.Mesh(ext(fr,12,0.8),mat(0x4C9BE8,0.3,0.8)));yg.add(frame);
  [-1,1].forEach(s=>{const rd=pinX(6,170,0x4C9BE8);rd.position.set(s*(18+85),0,0);yg.add(rd)});
  const tip=sh(new THREE.Mesh(new THREE.SphereGeometry(9,24,16),mat(0xF2B53A,0.4,0.3)));tip.position.set(18+170+6,0,0);yg.add(tip);
  [-1,1].forEach(s=>{const g=pinX(13,30,0x9aa0a6);g.position.set(s*150,0,0);sc.add(g);post(sc,s*150,0,-12,-80,0x3a424c)});
  const st=post(sc,0,-40,-40,-80,0x3a424c);
  return{update(t){const th=2.0*t;dg.rotation.z=th;yg.position.x=35*Math.cos(th)}}}};

// ---------------- 3. Kardanknut ----------------
MECH.kardan={c:['#E8743B','#2BB673','#4C9BE8'],
 sv:{n:'Kardanknut',d:'Kopplar ihop två axlar som står i vinkel mot varandra. Korset i mitten har fyra tappar och låter båda gaffarna vrida sig, men den utgående axeln går omväxlande lite fortare och lite långsammare.',s:'Vinkel 30° · kors med 4 tappar',u:'Sitter i kardanaxeln på bilar och lastbilar, ofta två knutar efter varandra.',l:['Ingående axel','Kors','Utgående axel'],
  subs:[[0,'Kopplar ihop två axlar som står snett'],[6,'Korset i mitten har fyra tappar'],[12,'Båda gaffarna kan vrida sig runt korset'],[19,'Utgående axeln varierar lite i fart'],[25,'Sitter i kardanaxeln på bilar och lastbilar']]},
 es:{n:'Junta cardán',d:'Une dos ejes que forman un ángulo. La cruceta del centro tiene cuatro muñones y deja girar las dos horquillas, pero el eje de salida va alternando un poco más rápido y un poco más lento.',s:'Ángulo 30° · cruceta de 4 muñones',u:'Está en el árbol de transmisión de coches y camiones, a menudo con dos juntas seguidas.',l:['Eje de entrada','Cruceta','Eje de salida']},
 cam:{target:[0,20,0],dist:480,elev:0.4,az:1.2,sweep:'full'},
 build(sc,key){GROUND(sc,-80);const beta=Math.PI/6;
  function yoke(c,sign){const g=new THREE.Group();
   const s=pinX(9,150,c);s.position.x=sign*(26+75);g.add(s);
   const base=boxM(10,62,22,c,0.3,0.85);base.position.x=sign*26;g.add(base);
   [-1,1].forEach(k=>{const pr=boxM(26,7,20,c,0.3,0.85);pr.position.set(sign*13,k*27,0);g.add(pr);
    const boss=cyl(8,9,c,0.3,0.85);boss.position.set(0,k*27,0);g.add(boss)});
   const m=boxM(30,3,2,0xffffff,0.3,0.2);m.position.set(sign*120,0,9.5);g.add(m);return g}
  const yin=yoke(0xE8743B,-1),yout=yoke(0x4C9BE8,1);sc.add(yin);sc.add(yout);
  const cross=new THREE.Group();sc.add(cross);cross.add(pinX(5,64,0x2BB673));const cy=cyl(5,64,0x2BB673,0.3,0.85);cross.add(cy);cross.add(boxM(16,16,16,0x2BB673,0.3,0.85));
  const d2=new THREE.Vector3(Math.cos(beta),Math.sin(beta),0);
  const b1=boxM(26,20,30,0x5f666e);b1.position.set(-150,0,0);sc.add(b1);post(sc,-150,0,-10,-80);
  const b2=boxM(26,20,30,0x5f666e);b2.position.copy(d2.clone().multiplyScalar(150));b2.rotation.z=beta;sc.add(b2);post(sc,b2.position.x,0,b2.position.y-10,-80);
  const a=new THREE.Vector3(1,0,0),M=new THREE.Matrix4();
  return{update(t){const th=1.5*t;const u1=new THREE.Vector3(0,Math.cos(th),Math.sin(th));
   const u2=new THREE.Vector3().crossVectors(d2,u1).normalize();
   M.makeBasis(a,u1,new THREE.Vector3().crossVectors(a,u1));yin.quaternion.setFromRotationMatrix(M);
   M.makeBasis(u1,u2,new THREE.Vector3().crossVectors(u1,u2));cross.quaternion.setFromRotationMatrix(M);
   M.makeBasis(d2,u2,new THREE.Vector3().crossVectors(d2,u2));yout.quaternion.setFromRotationMatrix(M)}}}};

// ---------------- 4. Oldhamkoppling ----------------
MECH.oldham={c:['#E8743B','#2BB673','#4C9BE8'],
 sv:{n:'Oldhamkoppling',d:'Kopplar två parallella axlar som inte ligger i linje. Mittskivan glider i två spår som står i kors, och dess centrum rör sig i en liten cirkel, dubbelt så fort som axlarna.',s:'Förskjutning 18 · utväxling 1 : 1',u:'Används i pumpar, skrivare och spiralkompressorer i värmepumpar.',l:['Ingående nav','Mittskiva','Utgående nav'],
  subs:[[0,'Två axlar som inte ligger i linje'],[6,'Mittskivan glider i två spår i kors'],[12,'Mitten rör sig i en liten cirkel'],[19,'Utgående axeln får exakt samma fart'],[25,'Uppkallad efter ingenjören John Oldham']]},
 es:{n:'Acoplamiento Oldham',d:'Une dos ejes paralelos que no están alineados. El disco central se desliza en dos ranuras cruzadas y su centro describe un pequeño círculo, al doble de velocidad que los ejes.',s:'Desplazamiento 18 · relación 1 : 1',u:'Se usa en bombas, impresoras y compresores scroll de bombas de calor.',l:['Cubo de entrada','Disco central','Cubo de salida']},
 cam:{target:[9,0,0],dist:520,elev:0.35,az:0.75,sweep:'full'},
 build(sc,key){GROUND(sc,-70);const e=18;
  const gin=new THREE.Group();gin.position.set(0,0,-30);sc.add(gin);
  gin.add(pinZ(42,14,0xE8743B));const tin=boxM(80,13,14,0xE8743B,0.3,0.85);tin.position.z=14;gin.add(tin);
  const sin_=pinZ(9,130,0xb8bec6);sin_.position.z=-70;gin.add(sin_);const m1=boxM(3,20,2,0xffffff,0.3,0.2);m1.position.set(0,30,-7.5);gin.add(m1);
  const gout=new THREE.Group();gout.position.set(e,0,30);sc.add(gout);
  gout.add(pinZ(42,14,0x4C9BE8));const tout=boxM(13,80,14,0x4C9BE8,0.3,0.85);tout.position.z=-14;gout.add(tout);
  const so=pinZ(9,130,0xb8bec6);so.position.z=70;gout.add(so);const m2=boxM(3,20,2,0xffffff,0.3,0.2);m2.position.set(0,30,7.5);gout.add(m2);
  const mid=new THREE.Group();sc.add(mid);const md=pinZ(40,24,0x2BB673);mid.add(md);
  const g1=boxM(84,15,3,0x0f5a3a,0.6,0.3);g1.position.z=-11;mid.add(g1);const g2=boxM(15,84,3,0x0f5a3a,0.6,0.3);g2.position.z=11;mid.add(g2);
  [[0,-110],[e,110]].forEach(([x,z])=>{const b=boxM(30,24,24,0x5f666e);b.position.set(x,0,z);sc.add(b);post(sc,x,z,-12,-70)});
  return{update(t){const th=1.6*t;gin.rotation.z=th;gout.rotation.z=th;mid.rotation.z=th;
   mid.position.set(e*Math.cos(th)*Math.cos(th),e*Math.cos(th)*Math.sin(th),0)}}}};

// ---------------- 5. Kuggstång och drev ----------------
MECH.kugg={c:['#E8743B','#4C9BE8','#2BB673'],
 sv:{n:'Kuggstång och drev',d:'Drevet är ett runt kugghjul och kuggstången ett rakt. När drevet snurrar skjuts stången i sidled, ett kuggsteg för varje kugge.',s:'Drev 16 kuggar · modul 4 · ett varv = 2π · 32',u:'Sitter i bilens styrning och i kuggstångsbanor som klättrar uppför berg.',l:['Drev','Kuggstång','Ratt'],
  subs:[[0,'Gör rotation till rak rörelse'],[6,'Varje kugge skjuter stången ett steg'],[12,'Vrid ratten – stången flyttas i sidled'],[19,'Så fungerar bilens styrning'],[25,'Även tåg som klättrar uppför berg använder den']]},
 es:{n:'Piñón y cremallera',d:'El piñón es una rueda dentada redonda y la cremallera una recta. Al girar el piñón, la cremallera se desplaza de lado, un paso por cada diente.',s:'Piñón 16 dientes · módulo 4 · una vuelta = 2π · 32',u:'Está en la dirección de los coches y en trenes de cremallera que suben montañas.',l:['Piñón','Cremallera','Volante']},
 cam:{target:[0,-20,40],dist:560,elev:0.3,az:-1.1,sweep:0.7},
 build(sc,key){GROUND(sc,-90);const m=4,Z=16,rp=m*Z/2,p=Math.PI*m;
  const pg=new THREE.Group();sc.add(pg);
  const ps=new THREE.Shape(pts(rp,m,Z,false,-Math.PI/2));ps.holes.push(holeC(7));pg.add(sh(new THREE.Mesh(ext(ps,18),mat(0xE8743B))));
  const col=pinZ(7,170,0xb8bec6);col.position.z=80;pg.add(col);
  const wheel=sh(new THREE.Mesh(new THREE.TorusGeometry(56,6,16,64),mat(0x2BB673,0.4,0.3)));wheel.position.z=165;pg.add(wheel);
  [0,1,2].forEach(k=>{const a=k*2*Math.PI/3+Math.PI/2;const sp=boxM(52,8,5,0x2BB673,0.4,0.3);sp.position.set(28*Math.cos(a),28*Math.sin(a),165);sp.rotation.z=a;pg.add(sp)});
  pg.add((()=>{const h=pinZ(12,10,0x2BB673);h.position.z=165;return h})());
  const yr=-rp-1.15*m,yt=-rp+m,K=17,o=[];o.push(new THREE.Vector2(K*p,yr-16));o.push(new THREE.Vector2(K*p,yr));
  for(let k=K-1;k>=-K;k--){const xc=(k+0.5)*p;[[0.5,yr],[0.30,yr],[0.22,-rp-0.1*m],[0.12,yt],[-0.12,yt],[-0.22,-rp-0.1*m],[-0.30,yr],[-0.5,yr]].forEach(q=>o.push(new THREE.Vector2(xc+q[0]*p,q[1])))}
  o.push(new THREE.Vector2(-K*p,yr-16));
  const rack=new THREE.Group();sc.add(rack);rack.add(sh(new THREE.Mesh(ext(new THREE.Shape(o),18),mat(0x4C9BE8,0.3,0.85))));
  [-1,1].forEach(s=>{const b=boxM(30,10,30,0x5f666e);b.position.set(s*120,yr-21,0);sc.add(b);post(sc,s*120,0,yr-26,-90)});
  return{update(t){const th=2.0*Math.sin(0.9*t);pg.rotation.z=th;rack.position.x=rp*th}}}};

// ---------------- 6. Kamaxel ----------------
MECH.kam={c:['#E8743B','#4C9BE8','#F2B53A'],
 sv:{n:'Kamaxel',d:'Varje kam har en nock som lyfter sin ventil en gång per varv. Fjädern trycker tillbaka den. Kammarna sitter förskjutna så att ventilerna öppnas i rätt ordning.',s:'Grundcirkel 18 · lyft 14 · 4 kammar',u:'Styr ventilerna i bilmotorn och snurrar hälften så fort som vevaxeln.',l:['Kamaxel','Ventillyftare','Fjädrar'],
  subs:[[0,'Kamaxeln bestämmer när ventilerna öppnas'],[6,'Nocken lyfter ventilen en gång per varv'],[12,'Fjädern trycker tillbaka den'],[19,'Kammarna sitter förskjutna'],[25,'Snurrar hälften så fort som vevaxeln']]},
 es:{n:'Árbol de levas',d:'Cada leva tiene un saliente que levanta su válvula una vez por vuelta. El muelle la devuelve. Las levas están desfasadas para que las válvulas se abran en el orden correcto.',s:'Círculo base 18 · alzada 14 · 4 levas',u:'Controla las válvulas del motor del coche y gira a la mitad de velocidad que el cigüeñal.',l:['Árbol de levas','Empujadores','Muelles']},
 cam:{target:[0,40,0],dist:640,elev:0.3,az:0.85,sweep:'full'},
 build(sc,key){GROUND(sc,-60);const rb=18,h=14,w=1.15;
  const rf=f=>{f=Math.atan2(Math.sin(f),Math.cos(f));return rb+(Math.abs(f)<w?h*0.5*(1+Math.cos(Math.PI*f/w)):0)};
  const cp=[];for(let i=0;i<180;i++){const f=i/180*2*Math.PI;cp.push(new THREE.Vector2(rf(f)*Math.cos(f),rf(f)*Math.sin(f)))}
  const cs=new THREE.Shape(cp);cs.holes.push(holeC(6));const cg=ext(cs,16);
  const G=new THREE.Group();G.rotation.y=Math.PI/2;sc.add(G);const shaft=new THREE.Group();G.add(shaft);
  shaft.add(pinZ(6,230,0xE8743B));
  const pos=[-66,-22,22,66],ph=[0,Math.PI,Math.PI/2,3*Math.PI/2],cams=[];
  pos.forEach((z,i)=>{const c=sh(new THREE.Mesh(cg,mat(0xE8743B,0.3,0.85)));c.position.z=z;c.rotation.z=ph[i];shaft.add(c);cams.push(c)});
  const gear=sh(new THREE.Mesh(ext(new THREE.Shape(pts(30,3,20,false)),10),mat(0xc9a227,0.35,0.9)));gear.position.z=105;shaft.add(gear);
  const hc=[];const helix=new THREE.CatmullRomCurve3(Array.from({length:120},(_,i)=>new THREE.Vector3(7*Math.cos(i/119*5*2*Math.PI),70*i/119,7*Math.sin(i/119*5*2*Math.PI))));
  const sg=new THREE.TubeGeometry(helix,240,1.2,8,false);
  const fol=pos.map(z=>{const g=new THREE.Group();sc.add(g);const b=cyl(14,12,0x4C9BE8,0.3,0.85);b.position.y=6;g.add(b);
   const st=cyl(3.5,90,0xb8bec6,0.25,0.9);st.position.y=57;g.add(st);const ret=cyl(12,3,0x4C9BE8,0.3,0.85);ret.position.y=40;g.add(ret);
   const spr=new THREE.Mesh(sg,mat(0xF2B53A,0.4,0.6));spr.castShadow=true;sc.add(spr);return{g,spr,x:z}});
  const plate=boxM(200,8,46,0x5f666e,0.5,0.8);plate.position.set(0,112,0);sc.add(plate);
  [-100,100].forEach(x=>{const b=boxM(16,22,30,0x5f666e);b.position.set(x,0,0);sc.add(b);post(sc,x,0,-11,-60)});
  [-100,100].forEach(x=>post(sc,x,-30,108,-60));
  return{update(t){const th=1.8*t;shaft.rotation.z=th;
   fol.forEach((f,i)=>{let mx=-1e9;for(let k=0;k<180;k++){const a=k/180*2*Math.PI;const y=rf(a)*Math.sin(a+th+ph[i]);if(y>mx)mx=y}
    f.g.position.set(f.x,mx,0);const bot=mx+40;f.spr.position.set(f.x,bot,0);f.spr.scale.set(1,(108-bot)/70,1)})}}}};

// ---------------- 7. Spärrhjul ----------------
MECH.sparr={c:['#4C9BE8','#E8743B','#2BB673'],
 sv:{n:'Spärrhjul',d:'Den rörliga spärren skjuter hjulet en kugge i taget när spaken går fram. När spaken går tillbaka glider spärren över kuggarna, och den fasta spärren hindrar hjulet från att backa.',s:'16 sågtandade kuggar · 22,5° per steg',u:'Finns i spärrnycklar, cykelnav, vinschar och urverk.',l:['Spärrhjul','Spak med spärr','Fast spärr'],
  subs:[[0,'Snurrar åt ett håll – aldrig tillbaka'],[6,'Spärren skjuter hjulet en kugge i taget'],[12,'På vägen tillbaka glider den över kuggarna'],[19,'Den fasta spärren hindrar hjulet att backa'],[25,'Finns i spärrnycklar och cykelnav']]},
 es:{n:'Trinquete',d:'El trinquete móvil empuja la rueda un diente cada vez que la palanca avanza. Al volver, se desliza sobre los dientes, y el trinquete fijo impide que la rueda retroceda.',s:'16 dientes de sierra · 22,5° por paso',u:'Está en llaves de carraca, bujes de bicicleta, cabrestantes y relojes.',l:['Rueda dentada','Palanca con trinquete','Trinquete fijo']},
 cam:{target:[0,15,0],dist:470,elev:0.28,az:Math.PI/2-0.4,sweep:0.6},
 build(sc,key){GROUND(sc,-90);const fill=new THREE.DirectionalLight(0xffffff,0.9);fill.position.set(0,80,600);sc.add(fill);
  const Z=16,p=2*Math.PI/Z,rt=62,rr=50,eps=0.05;
  const fr=x=>x-Math.floor(x);const rf=f=>rt-(rt-rr)*fr(f/p);
  const o=[];for(let k=0;k<Z;k++){for(let i=0;i<=12;i++){const f=k*p+(i/12)*(p-0.002);o.push(new THREE.Vector2(rf(f)*Math.cos(f),rf(f)*Math.sin(f)))}}
  const ws=new THREE.Shape(o);ws.holes.push(holeC(9));
  const A=new THREE.Group();A.rotation.z=Math.PI/2-p/2;sc.add(A);
  const wheel=new THREE.Group();A.add(wheel);wheel.add(sh(new THREE.Mesh(ext(ws,14),mat(0x4C9BE8,0.3,0.85))));
  const wm=boxM(36,5,2,0xffffff,0.3,0.2);wm.position.set(-20,0,8);wheel.add(wm);
  A.add(pinZ(9,60,0xb8bec6));
  const lever=new THREE.Group();lever.position.z=16;A.add(lever);
  const lb=boxM(100,14,6,0xE8743B,0.3,0.85);lb.position.x=50;lever.add(lb);const knob=cyl(9,30,0xE8743B,0.4,0.4);knob.position.set(100,0,8);knob.rotation.x=Math.PI/2;lever.add(knob);
  const dp=bar(9,10,0xE8743B);A.add(dp);const dpp=pinZ(4,26,0xdedede);A.add(dpp);
  const hp=bar(9,10,0x2BB673);A.add(hp);const hpp=pinZ(4,20,0xdedede);A.add(hpp);
  const H=Math.PI/2+0.2,piv=a=>({x:100*Math.cos(a-0.34),y:100*Math.sin(a-0.34)});
  const bp=boxM(260,260,6,0x2a313a,0.7,0.3);bp.position.set(0,0,-14);bp.rotation.z=-(Math.PI/2-p/2);A.add(bp);post(sc,0,-14,-130,-90);
  return{update(t){const Tc=1.2,n=Math.floor(t/Tc),u=t/Tc-n;const push=u<0.45?ez(u/0.45):1,ret=u>0.55?ez((u-0.55)/0.45):0;
   const al=-eps+p*(push-ret),W=n*p+p*push;wheel.rotation.z=W;lever.rotation.z=al;
   const tipR=rf(al-W)+2,T={x:tipR*Math.cos(al),y:tipR*Math.sin(al)},P=piv(al);setBar(dp,P,T,4);dpp.position.set(P.x,P.y,4);
   const hR=rf(H-W)+2,TH={x:hR*Math.cos(H),y:hR*Math.sin(H)},PH=piv(H);setBar(hp,PH,TH,0);hpp.position.set(PH.x,PH.y,0)}}}};

// ---------------- 8. Snabbretur ----------------
MECH.retur={c:['#E8743B','#4C9BE8','#2BB673','#F2B53A'],
 sv:{n:'Snabbreturmekanism',d:'Veven vrider en slitsad hävarm som skjuter släden fram och tillbaka. Arbetsslaget går långsamt och returen snabbt, eftersom veven går en längre väg under arbetsslaget.',s:'Vev 40 · avstånd 90 · tidskvot ≈ 1,8 : 1',u:'Användes i korthyvlar som hyvlar metall.',l:['Vev','Slitsad hävarm','Släde','Verktyg'],
  subs:[[0,'Långsamt framåt – snabbt tillbaka'],[6,'Veven vrider en slitsad hävarm'],[12,'Hävarmen skjuter släden med verktyget'],[19,'Returen tar bara drygt halva tiden'],[25,'Användes i hyvelmaskiner för metall']]},
 es:{n:'Retorno rápido',d:'La manivela mueve una palanca ranurada que empuja el carro adelante y atrás. La carrera de trabajo es lenta y el retorno rápido, porque la manivela recorre un camino más largo durante el trabajo.',s:'Manivela 40 · distancia 90 · relación de tiempos ≈ 1,8 : 1',u:'Se usaba en limadoras para trabajar metal.',l:['Manivela','Palanca ranurada','Carro','Herramienta']},
 cam:{target:[-40,20,15],dist:700,elev:0.22,az:Math.PI/2-0.5,sweep:0.65},
 build(sc,key){GROUND(sc,-130);const fill=new THREE.DirectionalLight(0xffffff,0.9);fill.position.set(0,80,600);sc.add(fill);
  const r=40,P={x:0,y:-90},Lv=200,Lk=45,YR=120;
  const cg=new THREE.Group();sc.add(cg);const cd=pinZ(55,10,0xE8743B);cd.position.z=-16;cg.add(cd);const cm=boxM(40,5,2,0xffffff,0.3,0.2);cm.position.set(-25,0,-10.5);cg.add(cm);
  const cpn=pinZ(6,24,0xdedede);cpn.position.set(r,0,-4);cg.add(cpn);const csh=pinZ(8,40,0xb8bec6);csh.position.z=-38;cg.add(csh);
  const l1=bar(7,10,0x4C9BE8),l2=bar(7,10,0x4C9BE8);sc.add(l1);sc.add(l2);const cap=bar(26,10,0x4C9BE8);sc.add(cap);
  const blk=boxM(24,16,12,0x9aa0a6,0.3,0.85);sc.add(blk);
  const pp=pinZ(7,30,0xdedede);pp.position.set(P.x,P.y,0);sc.add(pp);post(sc,0,-6,P.y-10,-130);
  const link=bar(9,8,0x9aa0a6);sc.add(link);const tpn=pinZ(5,40,0xdedede);sc.add(tpn);
  const ram=new THREE.Group();ram.position.z=30;sc.add(ram);const rb=boxM(220,24,30,0x2BB673,0.3,0.7);rb.position.x=-50;ram.add(rb);
  const tool=boxM(10,22,12,0xF2B53A,0.3,0.6);tool.position.set(-155,-22,0);ram.add(tool);
  const toolMat=tool.material;
  [-1,1].forEach(s=>{const g=boxM(40,6,40,0x5f666e);g.position.set(-10,YR+s*16,30);sc.add(g)});
  const work=boxM(140,30,40,0x8a6a45,0.8,0.1);work.position.set(-140,YR-50,30);sc.add(work);post(sc,-140,30,YR-65,-130,0x3a424c);
  let lastX=null;
  return{update(t){const th=1.3*t;cg.rotation.z=th;const C={x:r*Math.cos(th),y:r*Math.sin(th)};
   const dx=C.x-P.x,dy=C.y-P.y,dl=Math.hypot(dx,dy),ux=dx/dl,uy=dy/dl,nx=-uy*9,ny=ux*9;
   const T={x:P.x+Lv*ux,y:P.y+Lv*uy};setBar(l1,{x:P.x+nx,y:P.y+ny},{x:T.x+nx,y:T.y+ny},0);setBar(l2,{x:P.x-nx,y:P.y-ny},{x:T.x-nx,y:T.y-ny},0);
   setBar(cap,{x:T.x-ux*4,y:T.y-uy*4},{x:T.x+ux*4,y:T.y+uy*4},0);
   blk.position.set(C.x,C.y,0);blk.rotation.z=Math.atan2(uy,ux);
   const xr=T.x+Math.sqrt(Math.max(0,Lk*Lk-(YR-T.y)*(YR-T.y)));setBar(link,T,{x:xr,y:YR},15);tpn.position.set(T.x,T.y,10);
   ram.position.x=xr;ram.position.y=YR;const v=lastX===null?0:xr-lastX;lastX=xr;
   toolMat.emissive.setHex(v<-0.01?0x7a3d00:0x000000)}}}};

// ---------------- 9. Watts länk ----------------
MECH.watt={c:['#4C9BE8','#E8743B','#2BB673','#F2B53A'],
 sv:{n:'Watts länk',d:'Två hävarmar och en kort länk emellan. Hävarmarnas ändar rör sig i bågar, men länkens mittpunkt går nästan helt rakt. James Watt tog patent på den 1784 för att styra kolvstången i sina ångmaskiner.',s:'Hävarmar 110 · länk 50 · nästan rak bana',u:'Används än i dag i bakaxelns hjulupphängning på vissa bilar.',l:['Hävarmar','Länk','Kolvstång','Bana'],
  subs:[[0,'James Watts uppfinning från 1784'],[6,'Två hävarmar och en kort länk'],[12,'Ändarna rör sig i bågar'],[19,'Men mittpunkten går nästan helt rakt'],[25,'Den styrde kolvstången i ångmaskinen']]},
 es:{n:'Mecanismo de Watt',d:'Dos palancas y un eslabón corto entre ellas. Los extremos de las palancas se mueven en arcos, pero el punto medio del eslabón va casi en línea recta. James Watt lo patentó en 1784 para guiar el vástago de sus máquinas de vapor.',s:'Palancas 110 · eslabón 50 · trayectoria casi recta',u:'Todavía se usa en la suspensión trasera de algunos coches.',l:['Palancas','Eslabón','Vástago','Trayectoria']},
 cam:{target:[0,40,0],dist:640,elev:0.15,az:Math.PI/2-0.4,sweep:0.6},
 build(sc,key){GROUND(sc,-120);const fill=new THREE.DirectionalLight(0xffffff,0.9);fill.position.set(0,80,600);sc.add(fill);
  const L=110,c=50,A={x:-110,y:25},B={x:110,y:-25};
  const la=bar(12,10,0x4C9BE8),lb=bar(12,10,0x4C9BE8),cp=bar(12,10,0xE8743B),rod=bar(8,8,0x2BB673);[la,lb,cp,rod].forEach(m=>sc.add(m));
  const pins=[0,1,2,3].map(()=>{const q=pinZ(5,34,0xdedede);sc.add(q);return q});
  post(sc,A.x,-10,A.y-6,-120);post(sc,B.x,-10,B.y-6,-120);
  const cylb=boxM(50,70,40,0x5f666e,0.5,0.8);cylb.position.set(0,215,10);sc.add(cylb);
  const tr=makeTrace(sc,400,0xF2B53A);const dot=sh(new THREE.Mesh(new THREE.SphereGeometry(5,16,12),mat(0xF2B53A,0.4,0.3)));sc.add(dot);
  return{update(t){const al=0.42*Math.sin(1.4*t);const C={x:A.x+L*Math.cos(al),y:A.y+L*Math.sin(al)};
   const s=circInt(B,L,C,c);const g={x:C.x,y:C.y-c};const D=Math.hypot(s[0].x-g.x,s[0].y-g.y)<Math.hypot(s[1].x-g.x,s[1].y-g.y)?s[0]:s[1];
   const M={x:(C.x+D.x)/2,y:(C.y+D.y)/2};setBar(la,A,C,0);setBar(lb,B,D,0);setBar(cp,C,D,10);setBar(rod,M,{x:M.x,y:M.y+170},10);
   [A,B,C,D].forEach((q,i)=>pins[i].position.set(q.x,q.y,5));dot.position.set(M.x,M.y,16);tr.push(M.x,M.y,18)}}}};

// ---------------- 10. Peaucellier ----------------
MECH.peau={c:['#4C9BE8','#2BB673','#E8743B','#F2B53A'],
 sv:{n:'Peaucelliers länk',d:'Den första länkmekanismen som ritar en helt rak linje med bara leder och stänger. Fransmannen Charles-Nicolas Peaucellier publicerade den 1864. Punkten längst ut är en spegling av veven genom en cirkel.',s:'Armar 150 · romb 60 · vev 60 · rak linje vid x = 157,5',u:'Löste ett problem som James Watt bara kunde komma nära.',l:['Långa armar','Romb','Vev','Rak linje'],
  subs:[[0,'Ritar en helt rak linje'],[6,'Bara leder och stänger – inget glid'],[12,'Uppfunnen av Charles Peaucellier 1864'],[19,'Punkten längst ut går exakt rakt'],[25,'Watt kom nära – Peaucellier löste det']]},
 es:{n:'Inversor de Peaucellier',d:'El primer mecanismo de barras que traza una línea recta exacta solo con articulaciones y barras. El francés Charles-Nicolas Peaucellier lo publicó en 1864. El punto exterior es la inversión de la manivela respecto a un círculo.',s:'Brazos 150 · rombo 60 · manivela 60 · recta en x = 157,5',u:'Resolvió un problema al que James Watt solo pudo acercarse.',l:['Brazos largos','Rombo','Manivela','Línea recta']},
 cam:{target:[80,0,0],dist:560,elev:0.2,az:Math.PI/2-0.4,sweep:0.6},
 build(sc,key){GROUND(sc,-120);const fill=new THREE.DirectionalLight(0xffffff,0.9);fill.position.set(0,80,600);sc.add(fill);
  const O={x:0,y:0},Q={x:60,y:0},a=60,l=150,s=60;
  const oa=bar(10,8,0x4C9BE8),ob=bar(10,8,0x4C9BE8),ca=bar(9,8,0x2BB673),ad=bar(9,8,0x2BB673),db=bar(9,8,0x2BB673),bc=bar(9,8,0x2BB673),qc=bar(11,8,0xE8743B);
  [oa,ob,ca,ad,db,bc,qc].forEach(m=>sc.add(m));
  const pins=[0,1,2,3].map(()=>{const q=pinZ(4.5,40,0xdedede);sc.add(q);return q});
  post(sc,0,-44,-6,-120);post(sc,60,-44,-6,-120);const pO=pinZ(6,46,0xdedede);pO.position.set(0,0,-21);sc.add(pO);const pQ=pinZ(6,28,0xdedede);pQ.position.set(60,0,-32);sc.add(pQ);
  const tr=makeTrace(sc,400,0xF2B53A);const dot=sh(new THREE.Mesh(new THREE.SphereGeometry(6,16,12),mat(0xF2B53A,0.4,0.3)));sc.add(dot);
  return{update(t){const ph=1.2*Math.sin(1.2*t);const C={x:Q.x+a*Math.cos(ph),y:Q.y+a*Math.sin(ph)};
   const ab=circInt(O,l,C,s);const A=ab[0],B=ab[1],D={x:A.x+B.x-C.x,y:A.y+B.y-C.y};
   setBar(oa,O,A,-12);setBar(ob,O,B,-12);setBar(ca,C,A,0);setBar(bc,B,C,0);setBar(ad,A,D,0);setBar(db,D,B,0);setBar(qc,Q,C,-26);
   [A,B,C,D].forEach((q,i)=>pins[i].position.set(q.x,q.y,-10));dot.position.set(D.x,D.y,10);tr.push(D.x,D.y,12)}}}};
