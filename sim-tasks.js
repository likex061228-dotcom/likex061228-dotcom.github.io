(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SimTasks=api;})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const length=3+Math.PI,half=Math.PI/2;
// Clockwise course: AB/CD = 1.5 m; BC/DA = semicircles of radius 0.5 m.
function point(s){s=((s%length)+length)%length;if(s<1.5)return{x:1.25+s,y:.9,a:0};s-=1.5;if(s<half){const a=-Math.PI/2+s*2;return{x:2.75+.5*Math.cos(a),y:1.4+.5*Math.sin(a),a:a+Math.PI/2};}s-=half;if(s<1.5)return{x:2.75-s,y:1.9,a:Math.PI};s-=1.5;const a=Math.PI/2+s*2;return{x:1.25+.5*Math.cos(a),y:1.4+.5*Math.sin(a),a:a+Math.PI/2};}
function distance(x,y){return Math.hypot(x-Math.max(1.25,Math.min(2.75,x)),y-1.4)-.5;}
function progress(x,y){if(x>=1.25&&x<=2.75)return y<1.4?x-1.25:1.5+half+2.75-x;if(x>2.75)return 1.5+(Math.atan2(y-1.4,x-2.75)+Math.PI/2)*.5;let a=Math.atan2(y-1.4,x-1.25);if(a<0)a+=Math.PI*2;return 3+half+(a-Math.PI/2)*.5;}
const criteria={
 req2:{name:'要求 2 · 循迹一圈并停在 A',limit:20,goal:length,ball:false,summary:'顺时针一圈 ≤20 s；停车偏差 ≤2 cm。'},
 req3:{name:'要求 3 · 中心 → +5 → −5 cm',limit:5,goal:0,ball:true,summary:'中心出发，先到 +5 cm 再回 −5 cm；≤5 s，端点误差 ≤1 cm。'},
 req4:{name:'要求 4 · A→B 行驶平衡',limit:8,goal:1.5,ball:true,summary:'A→B 为 1.5 m；≤8 s，球相对中心误差 ≤1 cm。'},
 req5:{name:'要求 5 · 整圈中心平衡',limit:30,goal:length,ball:true,summary:'顺时针通过 A 完成一圈；≤30 s，全程中心误差 ≤1 cm。'},
 req6:{name:'要求 6 · 整圈指定位置',limit:30,goal:length,ball:true,summary:'小球初始放在指定位置，绕行一圈 ≤30 s；全程目标误差 ≤1 cm。'}
};
function target(s){return s.config.scenario==='req3'?(s.outboundReached?-.05:.05):s.config.scenario==='req4'||s.config.scenario==='req5'?0:s.config.target;}
function update(s,dt){const task=criteria[s.config.scenario];if(!task)return;const q=progress(s.pose.x,s.pose.y);let delta=q-s.lastCourse;if(delta<-length/2)delta+=length;if(delta>length/2)delta-=length;if(Math.abs(delta)<.15)s.progress+=delta;s.lastCourse=q;if(task.goal&&Math.abs(distance(s.pose.x,s.pose.y))>.21&&!s.offTrack){s.offTrack=true;s.events.push({t:s.time,text:'车体参考点明显偏离路线；本模型任务记为未满足'});}s.maxError=Math.max(s.maxError,Math.abs(s.ball-target(s)));if(s.config.scenario==='req3'){
 if(!s.outboundReached&&Math.abs(s.ball-.05)<=.008&&Math.abs(s.ballV)<.035){s.outboundReached=true;s.outboundAt=s.time;s.events.push({t:s.time,text:'到达 +5 cm，目标切换至 −5 cm'});}
 if(s.outboundReached&&Math.abs(s.ball+.05)<=.01&&Math.abs(s.ballV)<.02)s.settleAge+=dt;else s.settleAge=0;
 if(s.settleAge>=.35)s.completed=true;
 }else if(s.config.scenario==='req2'){if(s.progress>=length-.005&&Math.abs(s.speed)<.008){s.completed=true;s.stopError=Math.hypot(s.pose.x-point(0).x,s.pose.y-point(0).y);}}else if(s.progress>=task.goal)s.completed=true;
 if(s.completed){s.events.push({t:s.time,text:'任务轨迹结束；指标仅为模型计算'});s.taskResult=!s.offTrack&&s.time<=task.limit&&(s.config.scenario==='req3'?Math.abs(s.ball+.05)<=.01:(!task.ball||s.maxError<=.01))&&(s.config.scenario!=='req2'||s.stopError<=.02);}
}
return{length,point,distance,progress,criteria,target,update};
});
