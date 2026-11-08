/* Dependency-free 3D scene: orthographic camera, orbit controls, depth-sorted meshes. */
let cameraYaw=.7,cameraPitch=.65,cameraZoom=1,meshQueue=[],cameraCenter=[0,0];
function cameraPoint(p){const x=p[0]-16,y=p[1]-10,z=p[2]-4;const u=Math.cos(cameraYaw)*x-Math.sin(cameraYaw)*y,q=Math.sin(cameraYaw)*x+Math.cos(cameraYaw)*y;return [u,-q*Math.sin(cameraPitch)-z*Math.cos(cameraPitch),q*Math.cos(cameraPitch)-z*Math.sin(cameraPitch)];}
function project3D(p){const q=cameraPoint(p);return [cw/2+(q[0]-cameraCenter[0])*scale,ch/2-15+(q[1]-cameraCenter[1])*scale];}
function world3D(x,y,z=0){const u=(x-cw/2)/scale+cameraCenter[0],q=-((y-ch/2+15)/scale+cameraCenter[1]+(z-4)*Math.cos(cameraPitch))/Math.sin(cameraPitch);return [16+Math.cos(cameraYaw)*u+Math.sin(cameraYaw)*q,10-Math.sin(cameraYaw)*u+Math.cos(cameraYaw)*q];}
function mesh(points,color,edge='#80a4a52a'){meshQueue.push({points,color,edge,depth:points.reduce((n,p)=>n+cameraPoint(p)[2],0)/points.length});}
function box3D(x,y,z,w,d,h,color,top=color){const a=[x,y,z],b=[x+w,y,z],c=[x+w,y+d,z],d0=[x,y+d,z],e=[x,y,z+h],f=[x+w,y,z+h],g=[x+w,y+d,z+h],h0=[x,y+d,z+h];mesh([a,b,f,e],color);mesh([b,c,g,f],color);mesh([c,d0,h0,g],color);mesh([d0,a,e,h0],color);mesh([e,f,g,h0],top);}
function draw3D(){ctx.clearRect(0,0,cw,ch);const bounds=[];for(const x of [0,32])for(const y of [0,20])for(const z of [0,12])bounds.push(cameraPoint([x,y,z]));const min=[0,1].map(i=>Math.min(...bounds.map(p=>p[i]))),max=[0,1].map(i=>Math.max(...bounds.map(p=>p[i])));cameraCenter=min.map((v,i)=>(v+max[i])/2);scale=Math.min((cw-64)/(max[0]-min[0]),(ch-110)/(max[1]-min[1]))*cameraZoom;ox=0;oy=0;meshQueue=[];
 if(cfg.hall!=='simple'){drawComplexArchitecture();}else{
 mesh([[0,0,0],[32,0,0],[32,20,0],[0,20,0]],'#193640','#6e9598');
 // Cutaway: back enclosure is translucent; front enclosure remains open for seats.
 const farY=Math.cos(cameraYaw)>0?20:0,farX=Math.sin(cameraYaw)>0?32:0;
 mesh([[0,farY,0],[32,farY,0],[32,farY,12],[0,farY,12]],'#23434b80','#709b9b70');
 mesh([[farX,0,0],[farX,20,0],[farX,20,12],[farX,0,12]],'#25475080','#709b9b70');
 box3D(.4,.6,0,6.5,18.8,1,'#65543c','#b19059');
 for(let r=0;r<12;r++){const x=8+r*1.8,z=r*.32,w=r===11?2.2:1.8;box3D(x,2,0,w,16,Math.max(.02,z),'#334b4b',r%2?'#4d6260':'#465c59');}
 meshQueue.sort((a,b)=>b.depth-a.depth);for(const m of meshQueue)poly(m.points.map(project3D),m.color,m.edge,.7);meshQueue=[];
 if(simulation)for(const s of simulation.seats){const [x,y,z]=s.point,base=s.row*.32,color=heatColor(s.result),chosen=s.row===row&&s.col===col;box3D(x-.38,y-.17,base+.3,.65,.34,.16,'#354d50',chosen?'#ffe1a0':color);box3D(x+.22,y-.17,base+.35,.14,.34,.72,chosen?'#bd8d46':color,chosen?'#ffe1a0':color);}
 // Small orchestra platforms distinguish stage depth without external assets.
 for(let i=0;i<12;i++){const x=1.3+(i%3)*1.4,y=3+Math.floor(i/3)*4;box3D(x,y,1,.5,.65,.35,'#756347','#c0a778');}
 meshQueue.sort((a,b)=>b.depth-a.depth);for(const m of meshQueue)poly(m.points.map(project3D),m.color,m.edge,.7);
 for(let r=0;r<12;r++){const p=project3D([9+r*1.8,1.35,r*.32]);text(p[0],p[1],String.fromCharCode(65+r),'#b9c7bd',9,'center');}
}
 const stage=project3D([3,10,1.1]);text(stage[0],stage[1],'STAGE','#f4d69a',10,'center');
 if(simulation&&$('#showRays').checked)drawReadableRays();

 for(const p of cfg.panels){const color=p.enabled?(p.id===activePanel?'#f4cf8c':'#c4b38e'):'#7a8c89';poly(A.panelCorners(p).map(project3D),p.enabled?'#cda86638':'#8ba49b0b',color,p.id===activePanel?2:1);const center=project3D([p.x,p.y,p.z]);circle(...center,4,color);text(center[0]+8,center[1]-8,'P'+p.id,color,11);for(const corner of [A.panelCorners(p)[0],A.panelCorners(p)[2]])path([corner,[corner[0],corner[1],12]],'#8ba4a54a',.7,[2,4]);}
 if(simulation){const s=selected(),p=s.result.paths.find(p=>p.id===pathId);if(p){path(p.points,'#102c35',7);path(p.points,p.id==='direct'?'#ffe09c':'#8af6d3',3.5,p.id==='direct'?[9,5]:[]);drawPathArrow(p);for(let i=1;i<p.points.length-1;i++)circle(...project3D(p.points[i]),3,'#8af6d3');}const q=project3D(s.point);circle(...q,9,null,'#ffe0a2',2);text(q[0]+12,q[1]-10,s.id,'#ffe0a2',11);}
 const sp=project3D(cfg.source);circle(...sp,6,'#f1c373');circle(...sp,11,null,'#f1c37380');text(sp[0],sp[1]-17,'음원','#f1d69d',10,'center');
 if(window.Lesson?.active)window.Lesson.drawOverlay();
 text(18,ch-35,cfg.hall==='simple'?'계단식 객석 · 열마다 +0.32m · 마지막 열 바닥 +3.52m':'테라스·발코니 홀 · 중앙 192석 / 좌우 144석 / 상부 96석','#c6d6d0',10);text(18,ch-18,'느린 재생 · 대표 음선 최대 28개 / 빈 곳 드래그: 회전','#8facad',10);
 $('#timeVal').textContent=Math.round(elapsed)+' ms';$('#time').value=Math.round(elapsed);$('#heatLegend').innerHTML=heat==='early'?'−32 <span class="gradient"></span> −12 dB':heat==='c80'?'−12 <span class="gradient"></span> +8 dB':'10 <span class="gradient"></span> 95 ms';}

// Visual sampling only: the acoustic calculation still uses the original rays.
function soundArrow(tip,behind,color,large=false){const dx=tip[0]-behind[0],dy=tip[1]-behind[1],length=Math.hypot(dx,dy);if(length<2)return;const ux=dx/length,uy=dy/length,head=large?12:8,shaft=Math.min(large?42:30,length),base=[tip[0]-ux*head,tip[1]-uy*head];ctx.save();ctx.lineCap='round';ctx.strokeStyle='#102b34';ctx.lineWidth=large?8:6;ctx.beginPath();ctx.moveTo(tip[0]-ux*shaft,tip[1]-uy*shaft);ctx.lineTo(...base);ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=large?4.5:3;ctx.stroke();poly([tip,[base[0]-uy*head*.52,base[1]+ux*head*.52],[base[0]+uy*head*.52,base[1]-ux*head*.52]],color,'#102b34',1.2);ctx.restore();}
function drawReadableRays(){const traveled=elapsed/1000*A.ROOM.c,stride=Math.ceil(rays.length/(cw<500?18:28)),placed=[];ctx.save();for(let i=0;i<rays.length;i+=stride){const seg=rays[i].find(s=>traveled>=s.start&&traveled<=s.end);if(!seg||seg.energy<.06)continue;const t=(traveled-seg.start)/(seg.end-seg.start||1),delta=A.vec.sub(seg.b,seg.a),point=A.vec.add(seg.a,A.vec.mul(delta,t)),tip=project(point);if(placed.some(q=>Math.hypot(q[0]-tip[0],q[1]-tip[1])<25))continue;const previous=A.vec.add(seg.a,A.vec.mul(delta,Math.max(0,t-2.4/Math.max(.01,A.vec.len(delta)))));placed.push(tip);ctx.globalAlpha=Math.max(.4,Math.min(.95,seg.energy));soundArrow(tip,project(previous),seg.bounce===0?'#ffd48b':seg.scattered?'#c9a5ef':'#82ead0');}ctx.restore();}
function drawPathArrow(p){const travel=elapsed/1000*A.ROOM.c;let passed=0;for(let i=0;i<p.points.length-1;i++){const delta=A.vec.sub(p.points[i+1],p.points[i]),d=A.vec.len(delta);if(travel>=passed&&travel<=passed+d){const t=(travel-passed)/d,point=A.vec.add(p.points[i],A.vec.mul(delta,t)),previous=A.vec.add(p.points[i],A.vec.mul(delta,Math.max(0,t-3/d)));soundArrow(project(point),project(previous),'#fff3b0',true);break;}passed+=d;}}

function faceCorners(f){return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>A.vec.add(f.center,A.vec.add(A.vec.mul(f.u,x*f.w/2),A.vec.mul(f.v,y*f.h/2))));}
function flushMeshes(){meshQueue.sort((a,b)=>b.depth-a.depth);for(const m of meshQueue)poly(m.points.map(project3D),m.color,m.edge,.7);meshQueue=[];}
function drawComplexArchitecture(){mesh(HallShape.outline.map(p=>[...p,0]),'#294248','#809187');const faces=simulation.prepared.faces;for(const f of faces.filter(f=>f.id.startsWith('shell'))){const depth=cameraPoint(f.center)[2];if(depth>0){mesh(faceCorners(f),'#b6b3a340','#a7b8ac70');const corners=faceCorners(f);for(let z=2;z<12;z+=2){const a=[corners[0][0],corners[0][1],z],b=[corners[1][0],corners[1][1],z];path([a,b],'#aab49a30',1);}}}
for(const f of faces.filter(f=>f.id.startsWith('facet')))if(cameraPoint(f.center)[2]>0)mesh(faceCorners(f),'#b5bca580','#b0b8a76a');
box3D(.7,5.2,0,6.2,9.6,1,'#8d6f48','#c5a575');for(const b of HallShape.blocks())box3D(b.x,b.y,b.z,b.w,b.d,b.h,b.id.startsWith('main')?'#65716a':'#9a8970',b.id.startsWith('main')?'#768276':'#c3b392');flushMeshes();
// Seats face the stage rather than all sharing a single orientation.
for(const s of simulation.seats){const [x,y,z]=s.point,base=z-1.2,theta=Math.atan2(10-y,4-x),u=[Math.cos(theta),Math.sin(theta),0],v=[-Math.sin(theta),Math.cos(theta),0],point=(a,b,h)=>[x+u[0]*a+v[0]*b,y+u[1]*a+v[1]*b,base+h],color=s.row===row&&s.col===col?'#ffe1a0':heatColor(s.result);mesh([point(-.28,-.17,.45),point(.25,-.17,.45),point(.25,.17,.45),point(-.28,.17,.45)],color);mesh([point(-.28,-.17,.4),point(-.28,.17,.4),point(-.28,.17,1.02),point(-.28,-.17,1.02)],color,'#1d3a3e');}flushMeshes();
// Thin railing strokes and aisle lights are visual details, not extra acoustic planes.
for(const b of HallShape.blocks().filter(b=>!b.id.startsWith('main'))){const z=b.z+b.h;path([[b.x,b.y,z],[b.x+b.w,b.y,z]],'#f0d49a',1.4);for(let x=b.x+.4;x<b.x+b.w;x+=1.1)path([[x,b.y,z],[x,b.y,z+.38]],'#c9c7ad90',.8);}
for(let i=0;i<11;i++){const x=1.7+(i%3)*1.4,y=6.2+Math.floor(i/3)*2.1;box3D(x,y,1,.5,.65,.35,'#756347','#d3bd88');}flushMeshes();
for(const [p,label] of [[[17,10,1.8],'중앙 객석'],[[15,1.1,5.2],'측면 테라스'],[[28,10,7.1],'상부 발코니']]){const q=project3D(p);text(q[0],q[1]-12,label,'#ece2be',10,'center');}
}
function drawComplexFlat(){ctx.clearRect(0,0,cw,ch);scale=Math.min((cw-72)/32,(ch-70)/(view==='plan'?20:12));ox=(cw-32*scale)/2;oy=(ch-(view==='plan'?20:12)*scale)/2;poly(HallShape.outline.map(p=>project([...p,0])),'#233e45','#819c91');for(const b of HallShape.blocks()){if(view==='plan')poly([[b.x,b.y,b.z+b.h],[b.x+b.w,b.y,b.z+b.h],[b.x+b.w,b.y+b.d,b.z+b.h],[b.x,b.y+b.d,b.z+b.h]].map(project),'#74806a66','#b5bba3');else poly([[b.x,0,b.z],[b.x+b.w,0,b.z],[b.x+b.w,0,b.z+b.h],[b.x,0,b.z+b.h]].map(project),'#74806a66','#b5bba3');}for(const s of simulation.seats){if(view==='section'&&s.col!==col)continue;circle(...project(s.point),s.row===row&&s.col===col?6:3,heatColor(s.result),s.row===row&&s.col===col?'#ffe1a0':null,2);}if($('#showRays').checked)drawReadableRays();for(const p of cfg.panels)poly(A.panelCorners(p).map(project),'#d5b87525','#ddc386',2);const p=selected().result.paths.find(p=>p.id===pathId);if(p){path(p.points,'#ffe09c',3);drawPathArrow(p);}circle(...project(cfg.source),6,'#f1c373');text(18,24,view==='plan'?'평면 · 중앙 / 좌우 테라스 / 후면 발코니':'단면 · 선택 좌석 번호의 수음점 / 모든 구조면 투영','#bcd2c5',11);$('#timeVal').textContent=Math.round(elapsed)+' ms';$('#time').value=Math.round(elapsed);}
