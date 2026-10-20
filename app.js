'use strict';

const projects = {
  balance: {
    index: '01 / CONTROL & VISION', title: '车载平衡滚球运动控制系统',
    tags: ['省级三等奖', 'STM32F407', 'MaixCAM', 'PD 控制'],
    intro: '河北省电子设计竞赛 H 题项目。在小车运动与循迹的同时，通过视觉位置反馈调节水管一端高度，让球的位置控制与底盘运动协同工作。',
    sections: [
      ['问题与目标', '将视觉检测、平衡平台和小车循迹整合为一个系统。单个模块能够工作之后，还需要处理通信、控制节拍、任务切换与停车收尾。'],
      ['系统如何连接', 'MaixCAM 输出球的位置；STM32F407 接收坐标并执行 PD 控制；水管左端固定铰接，右端由步进电机通过曲柄连杆升降；摄像头位于水管上方，光电循迹传感器位于底盘下方。红外巡线、直流电机与姿态传感器共同参与底盘控制。'],
      ['实现中的重点', '将视觉串口数据、控制计算和执行机构连成闭环，组织不同任务下的菜单与状态切换，并处理停止后的平台复位。具体控制逻辑可从 main.c、pid.c 和视觉脚本阅读。'],
      ['项目收获', '一次从器件、算法走向系统联调的实践。比起只看某个模块，更需要关注各部分连接之后的反馈和相互影响。']
    ],
    flow: '视觉检测 → 位置反馈 → PD 控制 → 水管单端升降 → 再次观测',
    source: 'balance-source.zip', size: '约 7.3 MB',
    note: '省级三等奖由项目作者提供。源码为整理快照，未在本次整理中重新编译或进行硬件验证；不将任务要求中的时间、误差阈值表述为实测成绩。'
  },
  smartcar: {
    index: '02 / EMBEDDED & ROBOTICS', title: 'STM32 循声避障小车',
    tags: ['STM32F103', 'Bluetooth', 'HC-SR04', 'INMP441'],
    intro: '从一辆可以遥控的小车开始，逐步加入距离感知和声音方向判断，探索传感器输入如何转化成运动行为。',
    sections: [
      ['三个工作模式', '蓝牙手动遥控、超声波自动避障、实验性循声模式。程序使用明确的模式切换，把不同控制逻辑组织到同一个小车工程中。'],
      ['感知与执行', 'HC-SR04 用于测距，舵机用于扫描；定时器产生电机 PWM。双 INMP441 麦克风通过两路采样累加值的比较，进行简化的左右方向判断。'],
      ['源码从哪里开始', 'Core/Src/main.c 包含模式切换、蓝牙指令、运动控制、避障与循声处理。CubeMX 配置和 Keil 工程随源码包提供。'],
      ['实践与边界', '把输入、决策和执行连起来，理解模式之间的切换与外设协同。双麦克风部分属于探索性实现，不代表经过标定的精密声源定位。']
    ],
    flow: '蓝牙 / 距离 / 声音 → 模式判断 → 运动指令 → PWM 与电机',
    source: 'smartcar-source.zip', size: '约 2.4 MB',
    note: '包内保留 MCU 主工程与驱动依赖，排除了个人 IDE 状态、编译产物与历史日志。本次未重新执行固件编译和上板测试。'
  },
  matrix: {
    index: '03 / MOTION & LIGHT', title: '点阵滚动与重力互动',
    tags: ['8 × 32 LED', 'MPU6050', 'MAX7219', '64 颗光点'],
    intro: '用姿态传感器读取动作，让光点在点阵里滚动、堆积和弹跳。从简单的显示器件出发，尝试更直接、更有趣的交互。',
    sections: [
      ['从动作到画面', 'STM32F103C8T6 读取 MPU6050 数据，再通过四片级联 MAX7219 驱动 8×32 LED 点阵。将倾斜与运动转换为光点的移动和显示刷新。'],
      ['主要效果', '普通珠盘模式包含64颗光点，支持倾斜滚动、堆积、摇动弹跳与轻弹效果。倒扣保持并及时翻回可切换固定横向沙漏模式。'],
      ['代码结构', 'motion.c 与 mpu6050.c 负责运动采集，bead_engine.c 处理光点，hourglass.c 处理沙漏模式，max7219.c 负责显示输出。'],
      ['一个小小的说明', '原文件夹沿用 chang_OLED 名称，但当前主工程使用的是 MAX7219 LED 点阵。沙漏是视觉互动效果，并非校准过的计时器。']
    ],
    flow: '姿态采集 → 动作处理 → 光点运动 → 点阵刷新',
    source: 'matrix-source.zip', size: '约 0.9 MB',
    note: '网页演示保留 32×8 格点与64颗光点，交互效果为原理示意，不是原固件仿真或硬件录像。源码包未包含原始测试视频、桌面截图或备份；本次未重新进行固件编译与硬件验证。'
  },
  workflow: {
    index: '04 / TOOLS & METHODS', title: '数学建模竞赛工作流',
    tags: ['AI 辅助', '分阶段技能', 'Typst / LaTeX', '可复现思路'],
    intro: '把一次复杂的数学建模任务拆成有输入、有产物、有检查的阶段。让分析、代码、图表与论文之间的关系更清晰。',
    sections: [
      ['工作流的起点', '入口阶段记录竞赛偏好、排版引擎、计划与待办。之后按阶段推进分析建模、计算求解和论文准备。'],
      ['六个环节', '启动规划 → 赛题分析与建模 → 编程与数据图表 → 必要的概念流程图 → 论文撰写 → 验证验收。数据型图表与非数据型图示分别处理。'],
      ['让结果有据可查', '阶段报告连接代码输出、图表和论文；验证阶段检查数值一致性、复现、引用与编译。工具帮助组织过程，参赛者负责判断与审核。'],
      ['包内包含什么', '六个阶段技能、共享建模规范及文本排版模板。需要相应的代理与 Python、绘图、DrawIO、Typst 或 LaTeX 环境；部分模板的图片资源需另行准备。']
    ],
    flow: '计划 → 建模 → 求解 → 图示 → 写作 → 验收',
    source: 'mathmodel-workflow.zip', size: '约 0.3 MB',
    note: '此包是工作流与文本模板快照，不是一次已完成的比赛结果。使用时遵循该届竞赛关于 AI、网络和学术诚信的规则；第三方模板适用其原有许可。'
  }
};

const dialog = document.getElementById('project-dialog');
const dialogContent = document.getElementById('dialog-content');
let previousFocus = null;
let disposeLab = null;
let currentProject = null;
const heroLab = window.LikeBalanceLab.mount(document.getElementById('hero-lab'), {compact:true});
const previewHost = document.createElement('div');
const disposePreview = window.LikeBalanceLab.mount(previewHost, {compact:true});
const previewSvg = previewHost.querySelector('.balance-svg').cloneNode(true);
document.getElementById('balance-card-preview').append(previewSvg);
disposePreview();

function textElement(tag,text,className) {
  const node=document.createElement(tag);node.textContent=text;
  if(className)node.className=className;
  return node;
}

function sourceLink(project) {
  const link=document.createElement('a');
  link.className='primary';link.href=project.source;link.download=project.source;
  link.textContent='下载项目源码 ↓';return link;
}

function renderProjectTab(tab) {
  if(disposeLab){disposeLab();disposeLab=null;}
  const panel=document.getElementById('project-panel');
  panel.replaceChildren();
  panel.setAttribute('aria-labelledby','project-tab-'+tab);
  document.querySelectorAll('[data-project-tab]').forEach(button=>{
    const selected=button.dataset.projectTab===tab;
    button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;
  });
  const project=projects[currentProject];
  if(tab==='lab') {
    const mount=document.createElement('div');mount.className='project-lab';panel.append(mount);
    const mounts={balance:window.LikeBalanceLab.mount,smartcar:window.LikeProjectLabs.mountCar,matrix:window.LikeProjectLabs.mountMatrix,workflow:window.LikeProjectLabs.mountWorkflow};
    disposeLab=mounts[currentProject](mount);
  } else if(tab==='notes') {
    const notes=document.createElement('div');notes.className='project-notes';
    notes.append(textElement('div',project.flow,'detail-flow'));
    project.sections.forEach(([heading,text])=>notes.append(textElement('h3',heading),textElement('p',text)));
    notes.append(textElement('p',project.note,'disclaimer'));panel.append(notes);
  } else {
    const source=document.createElement('div');source.className='project-source-panel';
    source.append(textElement('h3','从这里，继续读代码。'),textElement('p','下载包内包含独立说明与代码入口导航。网页交互演示与原始项目源码分别整理，方便理解原理与继续动手。'));
    const box=document.createElement('div');box.className='source-filebox';
    box.append(textElement('strong',project.source),textElement('p','ZIP · '+project.size+' · 内含项目 README'));
    source.append(box,sourceLink(project),textElement('p',project.note,'disclaimer'));panel.append(source);
  }
}

function openProject(slug,trigger) {
  if(!projects[slug])return;
  heroLab.pause();
  if(disposeLab){disposeLab();disposeLab=null;}
  previousFocus=trigger;currentProject=slug;
  const project=projects[slug];
  document.getElementById('dialog-index').textContent=project.index+' / PROJECT LAB';
  dialogContent.replaceChildren();
  const heading=document.createElement('div');heading.className='project-dialog-heading';
  const title=textElement('h2',project.title);title.id='dialog-title';
  const tags=document.createElement('div');tags.className='detail-tags';
  project.tags.forEach(text=>tags.append(textElement('span',text)));
  heading.append(title,tags);dialogContent.append(heading,textElement('p',project.intro,'project-summary'));
  const tabs=document.createElement('div');tabs.className='project-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','项目内容');
  [['lab','交互演示'],['notes','项目解析'],['source','源码与说明']].forEach(([key,name])=>{
    const button=textElement('button',name);button.type='button';button.id='project-tab-'+key;
    button.dataset.projectTab=key;button.setAttribute('role','tab');button.setAttribute('aria-controls','project-panel');
    button.addEventListener('click',()=>renderProjectTab(key));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const keys=['lab','notes','source'],i=keys.indexOf(key);
      const next=event.key==='Home'?0:event.key==='End'?2:(i+(event.key==='ArrowRight'?1:2))%3;
      renderProjectTab(keys[next]);document.getElementById('project-tab-'+keys[next]).focus();
    });tabs.append(button);
  });
  const panel=document.createElement('div');panel.id='project-panel';panel.className='project-tab-panel';panel.setAttribute('role','tabpanel');panel.tabIndex=0;
  dialogContent.append(tabs,panel);dialog.showModal();document.documentElement.style.overflow='hidden';renderProjectTab('lab');dialog.scrollTop=0;
}

document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-project]');
  if(trigger){event.preventDefault();openProject(trigger.dataset.project,trigger);}
});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  const box=dialog.getBoundingClientRect();
  if(event.target===dialog&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))dialog.close();
});
dialog.addEventListener('close',()=>{
  if(dialog.open)return;
  if(disposeLab){disposeLab();disposeLab=null;}
  document.documentElement.style.overflow='';previousFocus?.focus({preventScroll:true});
});

document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  let visible=0;
  document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)visible++;});
  document.querySelector('.filter-status').textContent=`SHOWING ${String(visible).padStart(2,'0')} / 04`;
}));

const matrix=document.getElementById('matrix');
const occupied=new Set(window.LikeLabModels.createBeads().map(p=>p.x+','+p.y));
for(let y=0;y<8;y++)for(let x=0;x<32;x++){
  const pixel=document.createElement('span');pixel.className='pixel'+(occupied.has(x+','+y)?' on':'');matrix.append(pixel);
}
