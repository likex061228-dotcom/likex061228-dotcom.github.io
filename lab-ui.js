(function () {
  'use strict';
  const M=window.LikeLabModels;
  function runner(frame,change=()=>{}) {
    let active=false,id=0,last=0;
    function tick(now) {
      if(!active)return;
      const dt=last?Math.min((now-last)/1000,0.04):1/60;
      last=now;frame(dt,now);id=requestAnimationFrame(tick);
    }
    function stop(){active=false;cancelAnimationFrame(id);last=0;change(false);}
    function start(){if(active)return;active=true;last=0;change(true);id=requestAnimationFrame(tick);}
    const hidden=()=>{if(document.hidden)stop();};
    document.addEventListener('visibilitychange',hidden);
    return {start,stop,toggle(){active?stop():start();},get active(){return active;},destroy(){stop();document.removeEventListener('visibilitychange',hidden);}};
  }
  function set(node,attrs){Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,String(value)));}
  function signed(value){return(value>=0?'+':'')+value.toFixed(2);}
  function svg(tag,attrs){const node=document.createElementNS('http://www.w3.org/2000/svg',tag);set(node,attrs);return node;}
  window.LikeLabUI={M,runner,set,signed,svg};
})();
