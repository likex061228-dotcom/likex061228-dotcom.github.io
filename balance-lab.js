(function () {
  'use strict';
  const {M,runner,set,signed}=window.LikeLabUI;
  let sceneCount=0;
  const partNotes={
    camera:['上方摄像头','摄像头固定在支架上，俯视水管中的小球，将图像位置转换为控制器可用的位置反馈。'],
    pipe:['单端固定的水管','左端是固定铰接点，整段水管绕这里转动。右端高度变化时，水管倾角随之变化。'],
    motor:['步进电机与连杆','步进电机带动曲柄和连杆，升降水管右端；示意中的曲柄半径与连杆长度保持不变。'],
    chassis:['四轮车底盘','底盘承载上方机构，驱动轮负责小车运动；小球平衡控制与底盘循迹是相互配合的两个任务。'],
    sensors:['底部光电传感器','传感器安装在车底，读取地面黑线位置，为小车循迹提供反馈；它不负责检测水管中的球。']
  };
  function mount(host,{compact=false}={}) {
    const uid='balance-'+(++sceneCount),abort=new AbortController();
    const options={signal:abort.signal};
    let state=M.createBalance(),trail=[],selected='camera',clock=0;
    host.classList.add(compact?'balance-compact':'balance-full');
    host.innerHTML=`<div class="${compact?'compact-scene':'lab-workspace'}"><div class="lab-visual balance-visual"><div class="lab-scene-top mono"><span>01 / BALL & BEAM</span><span class="scene-status">● READY</span></div>
    <svg class="balance-svg" viewBox="0 0 700 475" role="img" aria-label="左端固定、右端由步进电机连杆升降的水管，上方是摄像头，下方为四轮底盘和光电循迹传感器">
    <defs><linearGradient id="${uid}-ball" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f1fff8"/><stop offset=".42" stop-color="#aacdc2"/><stop offset="1" stop-color="#348d77"/></linearGradient><linearGradient id="${uid}-fov" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#7fe3c1" stop-opacity=".16"/><stop offset="1" stop-color="#7fe3c1" stop-opacity=".015"/></linearGradient></defs>
    <path d="M95 337V77Q95 64 109 64H591Q605 64 605 77V337" class="camera-rig"/><path d="M91 337H128M570 337H609" class="structure-line"/>
    <path class="camera-field" d="M350 100L155 233L510 233Z" fill="url(#${uid}-fov)"/><path d="M350 100L155 233M350 100L510 233" class="fov-edge"/>
    <g class="camera-part"><rect x="325" y="67" width="50" height="28" rx="5" class="hardware-fill"/><rect x="338" y="95" width="24" height="8" rx="3" class="hardware-fill"/><circle cx="350" cy="84" r="8" class="lens-ring"/><circle cx="350" cy="84" r="3" fill="#7fe3c1"/></g>
    <path class="camera-ray" stroke="#7fe3c1" stroke-dasharray="4 5" opacity=".65"/><circle class="vision-ring" r="15" fill="none" stroke="#7fe3c1" stroke-dasharray="3 4"/>
    <path d="M155 222V332M144 332H168" class="fixed-support"/><circle cx="155" cy="216" r="8" class="pivot-joint"/><circle cx="155" cy="216" r="3" fill="#7fe3c1"/>
    <g class="pipe-assembly"><path d="M155 216H505" class="pipe-body"/><path d="M155 211H505" class="pipe-highlight"/><path d="M155 222H505" class="pipe-bottom"/><path class="target-marker" d="M330 200V229" stroke="#f7c78a" stroke-dasharray="3 3"/><circle cx="505" cy="216" r="5" class="endpoint-joint"/></g>
    <circle class="physical-ball" r="10" fill="url(#${uid}-ball)"/>
    <rect x="495" y="285" width="50" height="50" rx="5" class="stepper-body"/><path d="M500 296H540M500 323H540" class="motor-fins"/><circle cx="520" cy="310" r="15" class="motor-disc"/><line class="crank-arm" stroke="#f7c78a" stroke-width="6" stroke-linecap="round"/><line class="connecting-rod" stroke="#b8d8ca" stroke-width="5" stroke-linecap="round"/><circle class="crank-joint" r="4" fill="#f7c78a"/>
    <rect x="116" y="337" width="465" height="29" rx="7" class="chassis-deck"/><path d="M125 349H572" class="structure-line"/><rect x="246" y="322" width="94" height="15" rx="3" class="controller-board"/><text x="257" y="333" class="svg-micro">STM32F407</text>
    <g class="wheel" transform="translate(177 377)"><circle r="25" class="wheel-tire"/><circle r="14" class="wheel-hub"/><path d="M-18-14L-5-20M-23-2L-9-8M-20 11L-6 5M-9 21L5 15M7 22L19 16M10-16L22-10" class="wheel-treads"/></g>
    <g class="wheel" transform="translate(521 377)"><circle r="25" class="wheel-tire"/><circle r="14" class="wheel-hub"/><path d="M-18-14L-5-20M-23-2L-9-8M-20 11L-6 5M-9 21L5 15M7 22L19 16M10-16L22-10" class="wheel-treads"/></g>
    <path d="M299 367V393" class="structure-line"/><rect x="269" y="392" width="62" height="12" rx="3" class="sensor-board"/><g class="bottom-sensors">${Array.from({length:8},(_,i)=>`<circle cx="${275+i*7}" cy="398" r="2" fill="#7fe3c1"/>`).join('')}</g><path d="M275 408L267 430M325 408L333 430" class="sensor-rays"/>
    <path d="M80 435H620" class="ground-line"/><path class="track-line" d="M180 435H490" stroke="#7fe3c1" stroke-opacity=".45" stroke-width="5"/>
    <g class="diagram-labels"><path d="M383 82H426"/><text x="434" y="85">上方摄像头</text><path d="M155 228H66V202"/><text x="35" y="193">固定铰接端</text><path d="M546 305H627"/><text x="573" y="288">步进电机</text><path d="M579 348H647"/><text x="586" y="369">车底盘</text><path d="M334 399H429"/><text x="437" y="403">底部光电传感器</text><text x="466" y="185" fill="#f7c78a">升降端</text></g>
    </svg>
    <div class="lab-scene-caption"><span>左端固定铰接 · 右端曲柄连杆升降</span><span>侧视结构示意 / 不按比例</span></div>
    ${compact?'':`<div class="part-picker" role="group" aria-label="查看硬件部件">${Object.entries(partNotes).map(([key,[name]])=>`<button type="button" data-part="${key}" aria-pressed="${key===selected}">${name}</button>`).join('')}</div><div class="part-explanation"><strong>${partNotes.camera[0]}</strong><p>${partNotes.camera[1]}</p></div>`}</div>
    ${compact?'':`<aside class="lab-panel"><div class="section-label">TRY THE FEEDBACK LOOP</div><h3>移动目标，观察闭环如何响应。</h3><p class="lab-lead">摄像头看球的位置，控制器调节水管右端高度，让球向目标靠近。</p><label class="lab-range-label" for="${uid}-target">目标位置 <output class="target-value">0.00</output></label><input id="${uid}-target" class="target-input" type="range" min="-70" max="70" step="5" value="0"><div class="range-extents"><span>靠近固定端</span><span>靠近升降端</span></div><div class="readout-grid"><div><small>球位置 / 归一化</small><strong class="ball-readout">+0.48</strong></div><div><small>右端状态</small><strong class="height-readout">水平</strong></div></div><div class="trace-panel"><div class="trace-label"><span>位置反馈示意</span><span class="mono">x / target</span></div><svg viewBox="0 0 260 74" class="feedback-trace" aria-hidden="true"><path d="M0 37H260" class="trace-mid"/><path class="target-trace" stroke="#f7c78a" stroke-dasharray="4 4" fill="none"/><path class="position-trace" stroke="#7fe3c1" fill="none" stroke-width="1.7"/></svg></div><div class="loop-flow"><span data-loop="camera">视觉采集</span><b>→</b><span data-loop="control">计算偏差</span><b>→</b><span data-loop="motor">单端升降</span></div><p class="demo-limit">浏览器简化模型；参数、曲线和响应不代表实物测量或原固件表现。</p></aside>`}</div>
    <div class="lab-toolbar"><button class="lab-button accent play-balance" type="button">▶ ${compact?'体验闭环':'开始演示'}</button><button class="lab-button disturb-balance" type="button">推一下小球</button>${compact?'<button class="lab-button ghost" data-project="balance" type="button">打开完整实验台 ↗</button>':'<button class="lab-button reset-balance" type="button">复位</button><span class="lab-helper">先开始，再拖动目标或施加扰动。</span>'}</div>`;
    const q=selector=>host.querySelector(selector);
    if(!compact)host.prepend(q('.lab-toolbar'));
    const play=q('.play-balance');
    const animation=runner((dt)=>{state=M.stepBalance(state,dt);clock+=dt;trail.push({x:state.x,target:state.target});if(trail.length>220)trail.shift();draw();},active=>{play.textContent=active?'Ⅱ 暂停演示':'▶ '+(compact?'体验闭环':'开始演示');q('.scene-status').textContent=active?'● RUNNING':'● PAUSED';});
    function draw() {
      const g=M.balanceGeometry(state.angle,state.x);
      set(q('.pipe-assembly'),{transform:`rotate(${-state.angle*180/Math.PI} 155 216)`});
      set(q('.physical-ball'),{cx:g.ball.x,cy:g.ball.y});
      set(q('.vision-ring'),{cx:g.ball.x,cy:g.ball.y});
      set(q('.camera-ray'),{d:`M350 104L${g.ball.x} ${g.ball.y-16}`});
      set(q('.crank-arm'),{x1:520,y1:310,x2:g.crank.x,y2:g.crank.y});
      set(q('.connecting-rod'),{x1:g.crank.x,y1:g.crank.y,x2:g.end.x,y2:g.end.y});
      set(q('.crank-joint'),{cx:g.crank.x,cy:g.crank.y});
      const targetX=155+(state.target+1)/2*350;
      set(q('.target-marker'),{d:`M${targetX} 199V229`});
      if(!compact) {
        q('.ball-readout').textContent=signed(state.x);
        q('.height-readout').textContent=Math.abs(state.angle)<0.006?'接近水平':state.angle>0?'右端抬高 ↑':'右端降低 ↓';
        const points=trail.map((p,i)=>`${i*260/219},${37-p.x*30}`).join(' ');
        set(q('.position-trace'),{d:points?'M'+points.replaceAll(' ','L'):''});
        set(q('.target-trace'),{d:`M0 ${37-state.target*30}H260`});
        const stage=['camera','control','motor'][Math.floor(clock*1.7)%3];
        host.querySelectorAll('[data-loop]').forEach(node=>node.classList.toggle('active',node.dataset.loop===stage&&animation.active));
      }
    }
    play.addEventListener('click',()=>animation.toggle(),options);
    q('.disturb-balance').addEventListener('click',()=>{state={...state,v:state.x>0?-0.7:0.7};if(!animation.active)animation.start();},options);
    q('.reset-balance')?.addEventListener('click',()=>{animation.stop();state=M.createBalance();trail=[];clock=0;q('.target-input').value='0';q('.target-value').textContent='0.00';draw();},options);
    q('.target-input')?.addEventListener('input',event=>{state={...state,target:Number(event.target.value)/100};q('.target-value').textContent=signed(state.target);draw();},options);
    host.querySelectorAll('[data-part]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.part;host.querySelectorAll('[data-part]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));q('.part-explanation strong').textContent=partNotes[selected][0];q('.part-explanation p').textContent=partNotes[selected][1];q('.balance-svg').dataset.highlight=selected;},options));
    draw();
    const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)animation.stop();},{threshold:0});observer.observe(host);
    const destroy=()=>{observer.disconnect();abort.abort();animation.destroy();};
    destroy.pause=()=>animation.stop();
    return destroy;
  }
  window.LikeBalanceLab={mount};
})();
