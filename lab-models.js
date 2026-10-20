(function (root, factory) {
  const models = factory();
  if (typeof module === 'object' && module.exports) module.exports = models;
  else root.LikeLabModels = models;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function balanceGeometry(angle, position) {
    const pivot = { x: 155, y: 216 };
    const end = { x: pivot.x + 350 * Math.cos(angle), y: pivot.y - 350 * Math.sin(angle) };
    const motor = { x: 520, y: 310 };
    const dx = end.x - motor.x, dy = end.y - motor.y;
    const d = Math.hypot(dx, dy), r = 40, rod = 100;
    const a = (r*r - rod*rod + d*d) / (2*d);
    const h = Math.sqrt(Math.max(0, r*r-a*a));
    const crank = { x: motor.x+a*dx/d+h*dy/d, y: motor.y+a*dy/d-h*dx/d };
    const t = (clamp(position, -1, 1)+1)/2;
    const ball = { x: pivot.x+t*(end.x-pivot.x)-10*Math.sin(angle), y: pivot.y+t*(end.y-pivot.y)-10*Math.cos(angle) };
    return { pivot, end, motor, crank, ball };
  }

  function createBalance(values = {}) {
    return { x: 0.48, v: 0, angle: 0, target: 0, time: 0, ...values };
  }

  function stepBalance(state, elapsed) {
    const dt = clamp(elapsed, 0, 0.04);
    const error = state.x-state.target;
    const command = clamp(error*0.22+state.v*0.24,-0.075,0.075);
    const angle = state.angle+(command-state.angle)*Math.min(1,dt/0.12);
    const acceleration = -5.5*Math.sin(angle)-0.4*state.v;
    let v=clamp(state.v+acceleration*dt,-1.2,1.2), x=state.x+v*dt;
    if (Math.abs(x)>0.93) { x=clamp(x,-0.93,0.93); v*=-0.2; }
    return { ...state, x, v, angle, time:state.time+dt };
  }

  function matrixCellAllowed(x,y,mode) {
    if(x<0||x>=32||y<0||y>=8)return false;
    if(mode!=='hourglass')return true;
    const halfWidth=0.6+Math.min(1,Math.abs(x-15.5)/13.5)*3;
    return Math.abs(y-3.5)<=halfWidth;
  }

  function createBeads(mode='beads') {
    if(mode==='beads')return Array.from({length:64},(_,i)=>({x:Math.floor(i/2),y:(Math.floor(i/2)*3+(i%2)*3)%8}));
    const left=[],right=[];
    for(let x=0;x<32;x++)for(let y=0;y<8;y++)if(matrixCellAllowed(x,y,mode))(x<16?left:right).push({x,y});
    const order=(a,b)=>((a.x*11+a.y*7)%31)-((b.x*11+b.y*7)%31);
    return [...left.sort(order).slice(0,32),...right.sort(order).slice(0,32)];
  }

  function stepBeads(beads,gx,gy,mode='beads',tick=0) {
    const next=beads.map(p=>({...p}));
    const occupied=new Set(next.map(p=>p.x+','+p.y));
    if(Math.abs(gx)<0.12&&Math.abs(gy)<0.12)return next;
    const order=Array.from({length:64},(_,i)=>i);
    if(tick%2)order.reverse();
    for(const i of order) {
      const p=next[i],sx=Math.abs(gx)<0.12?0:Math.sign(gx),sy=Math.abs(gy)<0.12?0:Math.sign(gy);
      let choices;
      if(mode==='hourglass') {
        if(!sx)continue;
        const center=p.y<3.5?1:-1;
        choices=[[sx,0],[sx,center],[0,center],[sx,-center]];
      } else if(Math.abs(gx)>=Math.abs(gy)) choices=[[sx,sy],[sx,0],[sx,tick%2?1:-1],[0,sy]];
      else choices=[[sx,sy],[0,sy],[tick%2?1:-1,sy],[sx,0]];
      for(const [dx,dy] of choices) {
        if(dx===0&&dy===0)continue;
        const x=p.x+dx,y=p.y+dy,key=x+','+y;
        if(!matrixCellAllowed(x,y,mode)||occupied.has(key))continue;
        occupied.delete(p.x+','+p.y); occupied.add(key); p.x=x; p.y=y; break;
      }
    }
    return next;
  }

  const workflowStages = [
    { name:'启动规划', code:'01 / PLAN', input:'比赛类型、题目资料、排版偏好', action:'明确规则与目标，记录偏好，建立计划和待办。', output:'plan.md · todo.md', checkpoint:'确认当届规则与任务边界', file:'1start-mathmodel' },
    { name:'分析建模', code:'02 / MODEL', input:'题目、数据与问题契约', action:'拆解子问题，检查数据，定义变量、假设、目标与约束。', output:'ANALYSIS_MODELING_REPORT.md', checkpoint:'模型与题意一致，约束和量纲可检查', file:'2analysis-modeling' },
    { name:'求解绘图', code:'03 / SOLVE', input:'建模报告与结构化数据', action:'实现求解代码，运行计算，验证约束，生成数据驱动图表。', output:'code/ · results/ · figures/ · RESULTS_REPORT.md', checkpoint:'数值来自实际计算，结果可复现', file:'3coding-visual' },
    { name:'结构图示', code:'04 / DIAGRAM', input:'模型结构和求解流程', action:'仅在确有需要时绘制技术路线、算法流程与非数据型概念图。', output:'DrawIO 源文件 · 流程图 PDF', checkpoint:'可选阶段；不替代计算结果图', file:'4drawio', optional:true },
    { name:'论文撰写', code:'05 / WRITE', input:'建模报告、结果报告与图表', action:'按比赛模板组织论文，选择 Typst 或 LaTeX，将有证据的结果写入章节。', output:'paper/ · 论文源文件', checkpoint:'正文、图表与引用保持一致', file:'5writing' },
    { name:'验证验收', code:'06 / VERIFY', input:'论文、代码、结果与引用', action:'检查数值一致性、复现、图表引用与编译；发现问题后返回对应阶段修订。', output:'VERIFY_REPORT.md · 修订清单', checkpoint:'人工审核后才能判断是否可提交', file:'6verity' }
  ];
  const nextWorkflowStage=index=>Math.min(5,index+1);
  function carDecision(mode,distance,source) {
    if(mode==='manual')return 'manual';
    if(mode==='avoid')return distance<0.27?'brake':'forward';
    return source < -0.15?'left':source >0.15?'right':'forward';
  }
  return { clamp,balanceGeometry,createBalance,stepBalance,matrixCellAllowed,createBeads,stepBeads,workflowStages,nextWorkflowStage,carDecision };
});
