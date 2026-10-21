(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./sim-tasks.js'):root.SimTasks);if(typeof module==='object'&&module.exports)module.exports=api;else root.EmbeddedSim=api;})(typeof window==='undefined'?globalThis:window,function(T){
'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const specs={
 balance:{speed:[.05,.6,.25],accel:[.05,.8,.3],kp:[0,8,1.5],kd:[0,2,.7],target:[-.08,.08,0],delay:[0,.3,.04],feed:[0,1,.7],trackGain:[5,70,35],visionTimeout:[.5,3.5,.5]},
 car:{speed:[.05,.65,.28],turn:[.3,3,1.3],threshold:[.2,.8,.3]},
 matrix:{tiltX:[-1,1,.65],tiltY:[-1,1,.35],friction:[.2,5,1.5],gravity:[5,40,20]}
};
function defaults(project){const values=Object.fromEntries(Object.entries(specs[project]).map(([k,v])=>[k,v[2]]));return {...values,scenario:project==='balance'?'loop':project==='car'?'avoid':'beads'};}
function raycast(origin,angle,obstacles,max=2.5){let best=max;const dx=Math.cos(angle),dy=Math.sin(angle);for(const o of obstacles){const ox=origin.x-o.x,oy=origin.y-o.y,b=ox*dx+oy*dy,c=ox*ox+oy*oy-o.r*o.r,d=b*b-c;if(c<=0)return 0;if(d>=0){const t=-b-Math.sqrt(d);if(t>=0)best=Math.min(best,t);}}for(const [axis,bounds,dir] of [['x',[0,4],dx],['y',[0,2.8],dy]])for(const value of bounds){const t=(value-origin[axis])/dir;if(t>0&&Number.isFinite(t))best=Math.min(best,t);}return best;}
function allowed(x,y,mode){return x>=0&&x<32&&y>=0&&y<8&&(mode!=='hourglass'||Math.abs(y-3.5)<=.6+Math.min(1,Math.abs(x-15.5)/13.5)*3);}
function initialParticles(mode){const list=[];if(mode==='beads'){for(let x=0;x<32;x++){const a=Math.floor(Math.random()*8),b=(a+1+Math.floor(Math.random()*7))%8;for(const y of [a,b])list.push({x,y,vx:0,vy:0,rx:0,ry:0,h:0,vh:0});}}else{for(const side of [0,1]){const cells=[];for(let x=side*16;x<(side+1)*16;x++)for(let y=0;y<8;y++)if(allowed(x,y,mode))cells.push({x,y});cells.sort((a,b)=>((a.x*11+a.y*7)%31)-((b.x*11+b.y*7)%31));for(const p of cells.slice(0,32))list.push({...p,vx:0,vy:0,rx:0,ry:0,h:0,vh:0});}}return list;}
function create(project,config=defaults(project)){
 const state={project,config:{...config},time:0,pose:{x:project==='balance'?2:.6,y:project==='balance'?.55:1.4,a:0},speed:0,omega:0,acceleration:0,trace:[],status:'就绪',obstacles:[{x:1.8,y:1.4,r:.23},{x:2.9,y:.7,r:.2}],source:{x:3.2,y:.65},manual:{v:0,w:0},front:2.5,left:2.5,right:2.5,phase:'drive',phaseAge:0,turnSign:-1,servoAngle:0,driveCommand:{v:0,w:0},contact:false,scans:0,collisions:0,ball:0,ballV:0,angle:0,observed:0,observedV:0,cameraAge:0,cameraClock:0,cameraQueue:[],visionLost:false,safeStop:false,brake:0,sensors:Array(8).fill(1),trackError:0,mics:[0,0],particles:project==='matrix'?initialParticles(config.scenario):[],particleTick:0};if(project==='balance'){if(['loop','req2','req4','req5','req6'].includes(config.scenario)){state.pose=T.point(0);sampleTrack(state);}else{state.pose={x:.7,y:1.4,a:0};state.sensors=[1,1,0,0,0,0,1,1];}}if(project==='balance'){state.progress=0;state.lastCourse=0;state.maxError=0;state.settleAge=0;state.events=[];state.ball=config.scenario==='req6'?config.target:0;state.observed=state.ball;}return state;
}
function trackDistance(x,y){return T.distance(x,y);}
function sampleTrack(s){const values=[];let sum=0,weight=0;for(let i=0;i<8;i++){const offset=(i-3.5)*.012,x=s.pose.x+Math.cos(s.pose.a)*.11-Math.sin(s.pose.a)*offset,y=s.pose.y+Math.sin(s.pose.a)*.11+Math.cos(s.pose.a)*offset,d=Math.abs(trackDistance(x,y)),signal=Math.exp(-d*d/.00008);values.push(d<.009?0:1);sum+=signal*offset;weight+=signal;}s.sensors=values;s.trackError=weight>.02?sum/weight:s.trackError;return weight;}
function carBlocked(s,x,y){return x<.14||x>3.86||y<.14||y>2.66||s.obstacles.some(o=>Math.hypot(x-o.x,y-o.y)<o.r+.13);}
function movePose(s,v,w,dt,collide=false){const old=s.speed;s.speed+=clamp(v-s.speed,-s.config.accel*dt||-1.2*dt,s.config.accel*dt||1.2*dt);s.acceleration=(s.speed-old)/dt;s.omega+=(w-s.omega)*Math.min(1,dt/.12);if(collide){s.speed=v;s.omega=w;}s.pose.a+=s.omega*dt;const x=s.pose.x+Math.cos(s.pose.a)*s.speed*dt,y=s.pose.y+Math.sin(s.pose.a)*s.speed*dt;
 if(collide&&carBlocked(s,x,y)){if(!s.contact)s.collisions++;s.contact=true;s.speed=0;s.acceleration=(s.speed-old)/dt;return;}
 s.pose.x=x;s.pose.y=y;
 if(collide)s.acceleration=(s.speed-old)/dt;
 if(collide&&!carBlocked(s,x+Math.cos(s.pose.a)*.003,y+Math.sin(s.pose.a)*.003))s.contact=false;
}
function balanceStep(s,dt){const c=s.config;s.brake=Math.max(0,s.brake-dt);s.cameraAge+=dt;s.cameraClock+=dt;if(s.cameraClock>=1/30){s.cameraClock-=1/30;if(!s.visionLost)s.cameraQueue.push({at:s.time+c.delay,x:Math.round(s.ball*10000)/10000});}while(s.cameraQueue.length&&s.cameraQueue[0].at<=s.time){const frame=s.cameraQueue.shift();s.observedV+=(clamp((frame.x-s.observed)*30,-.5,.5)-s.observedV)*.35;s.observed=frame.x;s.cameraAge=0;}s.safeStop=s.cameraAge>c.visionTimeout;
 let v=0,w=0;if(['loop','req2','req4','req5','req6'].includes(c.scenario)){const seen=sampleTrack(s);v=c.speed*(seen>.02?1:.4);w=clamp(c.trackGain*s.trackError,-2,2);}else if(c.scenario==='straight'){v=(s.time%14)<9?c.speed:0;}if(c.scenario==='req2'){const remaining=T.length-s.progress;v=Math.min(v,Math.sqrt(Math.max(0,2*c.accel*(remaining-.002))));}if(s.brake||s.safeStop)v=0;movePose(s,v,w,dt);
 const command=s.safeStop?0:clamp(c.kp*(s.observed-T.target(s))+c.kd*s.observedV-c.feed*s.acceleration/9.81,-.10,.10);
 s.angle+=clamp((command-s.angle)*dt/.07,-.65*dt,.65*dt);
 const acceleration=5/7*(-9.81*Math.sin(s.angle)-s.acceleration*Math.cos(s.angle)+s.omega*s.omega*s.ball)-.4*s.ballV;
 s.ballV+=acceleration*dt;s.ball+=s.ballV*dt;
 if(Math.abs(s.ball)>.118){s.ball=clamp(s.ball,-.118,.118);s.ballV=0;s.ballEscaped=true;}
 T.update(s,dt);s.status=s.completed?'任务结束 · 查看本次模型指标':s.ballEscaped?'小球到达管端边界，本次实验结束；请复位':s.safeStop?'视觉超时：底盘制动 / 执行端回零':s.brake?'外加制动扰动':c.scenario==='req3'?(s.outboundReached?'静止往返：稳定在 −5 cm':'静止往返：从中心前往 +5 cm'):c.scenario==='stationary'?'静止闭环平衡':c.scenario==='straight'?'直行加速—巡航—制动':'循迹行驶与小球平衡协同';
}
function observeCar(s){const origin={x:s.pose.x+Math.cos(s.pose.a)*.13,y:s.pose.y+Math.sin(s.pose.a)*.13};
 s.front=raycast(origin,s.pose.a,s.obstacles);s.left=raycast(origin,s.pose.a+Math.PI/3,s.obstacles);s.right=raycast(origin,s.pose.a-Math.PI/3,s.obstacles);
 const dir=Math.atan2(Math.sin(Math.atan2(s.source.y-s.pose.y,s.source.x-s.pose.x)-s.pose.a),Math.cos(Math.atan2(s.source.y-s.pose.y,s.source.x-s.pose.x)-s.pose.a));
 // Bounded qualitative virtual intensities, not calibrated acoustic pressure or ADC samples.
 s.mics=[.5+.325*Math.sin(dir),.5-.325*Math.sin(dir)];
 return s;
}
function carStep(s,dt){const c=s.config;observeCar(s);
 const mode=c.scenario;if(s.carMode!==mode){s.carMode=mode;s.phase=mode==='sound'?'soundSample':'drive';s.phaseAge=0;s.soundCommand={v:0,w:0};}
 s.phaseAge+=dt;let v=0,w=0;s.servoAngle=0;
 const enter=phase=>{s.phase=phase;s.phaseAge=0;};const due=t=>s.phaseAge+1e-10>=t;
 if(mode==='manual'){v=clamp(s.manual.v,-1,1)*c.speed;w=clamp(s.manual.w,-1,1)*c.turn;s.status=v||w?'手动指令 → 底盘运动':'手动停止';}
 else if(mode==='sound'){
  if(s.phase==='soundSample'&&due(.06)){const difference=s.mics[0]-s.mics[1];s.soundCommand=Math.abs(difference)>.05?{v:0,w:Math.sign(difference)*c.turn}:{v:c.speed,w:0};enter('soundPulse');}
  else if(s.phase==='soundPulse'&&due(.3))enter('soundSample');
  if(s.phase==='soundPulse'){v=s.soundCommand.v;w=s.soundCommand.w;}
  s.status=s.phase==='soundSample'?'停止 · 双路采样（虚拟强度）':w>0?'左侧较强 · 左转 300 ms':w<0?'右侧较强 · 右转 300 ms':'强度接近 · 前进 300 ms';
 }else{
  if(s.phase==='drive'&&(s.front<=c.threshold||s.contact)){enter('brake');s.scans++;}
  else if(s.phase==='brake'&&due(.1))enter('scanLeft');
  else if(s.phase==='scanLeft'&&due(.15)){s.scanLeft=s.left;enter('scanRight');}
  else if(s.phase==='scanRight'&&due(.15)){s.scanRight=s.right;enter('scanCenter');}
  else if(s.phase==='scanCenter'&&due(.05)){
   if(Math.max(s.scanLeft,s.scanRight)<=.2||Math.abs(s.scanLeft-s.scanRight)<1e-8||s.contact)enter('backup');
   else{s.turnSign=s.scanLeft>s.scanRight?1:-1;enter('turn');}
  }else if(s.phase==='turn'&&due(.4))enter('drive');
  else if(s.phase==='backup'&&due(.4))enter('backupStop');
  else if(s.phase==='backupStop'&&due(.1))enter('spin');
  else if(s.phase==='spin'&&due(.6))enter('drive');
  if(s.phase==='drive')v=c.speed;
  if(s.phase==='turn')w=s.turnSign*c.turn;
  if(s.phase==='backup')v=-c.speed;
  if(s.phase==='spin')w=-c.turn;
  if(s.phase==='scanLeft')s.servoAngle=Math.PI/3;
  if(s.phase==='scanRight')s.servoAngle=-Math.PI/3;
  s.status=({drive:'测距安全，前进',brake:'近障碍，停止',scanLeft:'舵机左扫',scanRight:'舵机右扫',scanCenter:'舵机回中，比较距离',turn:'较空旷侧转向 400 ms',backup:'死路后退 400 ms',backupStop:'后退后停止 100 ms',spin:'右旋脱困 600 ms'})[s.phase];
 }
 s.driveCommand={v,w};movePose(s,v,w,dt,true);
}
function impulse(s,all){if(s.project==='balance'){s.ballV+=.1;return;}if(s.project!=='matrix'||s.config.scenario==='hourglass')return;const count=all?64:16+Math.floor(Math.random()*25);for(let i=0;i<count;i++){const p=s.particles[(i*19)%64];if(p.h<.05){p.h=.01;p.vh=all?8+(i%5):7+(i%4);}}}
function particleStep(s,dt){const c=s.config,mode=c.scenario,occupied=new Set(s.particles.map(p=>p.x+','+p.y));const list=s.particleTick++%2?s.particles:[...s.particles].reverse();for(const p of list){p.vx+=(c.tiltX*c.gravity-c.friction*p.vx)*dt;p.vy+=((mode==='hourglass'?0:c.tiltY)*c.gravity-c.friction*p.vy)*dt;p.rx+=p.vx*dt;p.ry+=p.vy*dt;let dx=Math.abs(p.rx)>=1?Math.sign(p.rx):0,dy=Math.abs(p.ry)>=1?Math.sign(p.ry):0;if(dx||dy){const toward=p.y<3.5?1:-1,choices=mode==='hourglass'?[[dx,0],[dx,toward],[0,toward]]:[[dx,dy],[dx,0],[0,dy],[dx,dy||((s.particleTick+p.x)%2?1:-1)]];for(const [mx,my]of choices){if(!mx&&!my)continue;const x=p.x+mx,y=p.y+my,key=x+','+y;if(!allowed(x,y,mode)||occupied.has(key))continue;occupied.delete(p.x+','+p.y);p.x=x;p.y=y;occupied.add(key);break;}p.rx=0;p.ry=0;p.vx*=.72;p.vy*=.72;}if(p.h>0||p.vh>0){p.vh-=24*dt;p.h+=p.vh*dt;if(p.h<0){p.h=0;p.vh=p.vh<-.8?-p.vh*.18:0;}}}s.status=mode==='hourglass'?'长轴重力驱动 · 中央窄口流动':'倾斜惯性、碰撞占用与独立弹跳';}
function step(s,dt){if(s.ballEscaped||s.completed)return s;s.time+=dt;if(s.project==='balance')balanceStep(s,dt);else if(s.project==='car')carStep(s,dt);else particleStep(s,dt);s.traceClock=(s.traceClock||0)+dt;if(s.traceClock>=.05){s.traceClock=0;s.trace.push({t:s.time,speed:s.speed,acceleration:s.acceleration,angle:s.angle,a:s.project==='balance'?s.ball*100:s.project==='car'?s.front:s.particles.filter(p=>p.h>.1).length,b:s.project==='balance'?T.target(s)*100:s.project==='car'?s.config.threshold:64});if(s.trace.length>400)s.trace.shift();}return s;}
function serialize(s){return JSON.stringify({version:1,project:s.project,config:s.config,obstacles:s.obstacles,source:s.source},null,2);}
function parse(text){if(text.length>30000)throw Error('场景文件过大');const data=JSON.parse(text),keys=['version','project','config','obstacles','source'];if(!data||typeof data!=='object'||Object.keys(data).some(k=>!keys.includes(k))||!Object.hasOwn(specs,data.project)||(data.version!==undefined&&data.version!==1))throw Error('不支持的场景格式');const config=defaults(data.project);if(data.config&&typeof data.config!=='object')throw Error('配置格式错误');for(const [k,v]of Object.entries(data.config||{})){if(k==='scenario'){const modes={balance:['stationary','straight','loop','req2','req3','req4','req5','req6'],car:['manual','avoid','sound'],matrix:['beads','hourglass']};if(!modes[data.project].includes(v))throw Error('场景模式无效');config[k]=v;}else{const range=specs[data.project][k];if(!Object.hasOwn(specs[data.project],k)||!range||typeof v!=='number'||!Number.isFinite(v)||v<range[0]||v>range[1])throw Error('参数超出范围');config[k]=v;}}
const state=create(data.project,config);if(data.obstacles!==undefined){if(!Array.isArray(data.obstacles)||data.obstacles.length>12)throw Error('障碍物数量无效');state.obstacles=data.obstacles.map(o=>{if(!o||Object.keys(o).some(k=>!['x','y','r'].includes(k))||![o.x,o.y,o.r].every(Number.isFinite)||o.x<.2||o.x>3.8||o.y<.2||o.y>2.6||o.r<.08||o.r>.4)throw Error('障碍物无效');return{x:o.x,y:o.y,r:o.r};});}if(data.source){if(Object.keys(data.source).some(k=>!['x','y'].includes(k))||!Number.isFinite(data.source.x)||!Number.isFinite(data.source.y)||data.source.x<.2||data.source.x>3.8||data.source.y<.2||data.source.y>2.6)throw Error('声源位置无效');state.source={...data.source};}return state;}
return{tasks:T,specs,defaults,create,step,raycast,observeCar,impulse,serialize,parse,allowed,trackDistance};
});
