(function(){
var out=document.getElementById('terminal-output');
var splash=document.getElementById('splash-404');
if(!out||!splash)return;
var text=splash.textContent||'';
var cancelled=false,countdown=null,countdownEl=null;
var delay=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var type=function(t,s){
 return new Promise(function(r){
 var e=document.createElement('div');e.className='terminal-line';out.appendChild(e);
 var i=0,t0=performance.now();
 (function tick(n){
 var el=(n||performance.now())-t0,c=Math.floor(el/(s||60));
 if(c<t.length){e.innerHTML=t.substring(0,c+1).replace(/(^|\s)\$/g,'$1<span class="text-green">$</span>');requestAnimationFrame(tick)}else r()
 })(performance.now());
 });
};
var fadeIn=function(h,c){
 return new Promise(function(r){
 var e=document.createElement('div');e.className='terminal-line fade-in'+(c?' '+c:'');
 e.innerHTML=h;out.appendChild(e);
 e.addEventListener('animationend',function(){r()},{once:true});
 });
};
type('$ http_status',10).then(function(){return delay(100)})
.then(function(){return fadeIn('<a href="https://xkcd.com/1024/" target="_blank" class="hover-underline" style="color:var(--red)">Error: -41 Not Found</a>')})
.then(function(){return delay(100)})
.then(function(){var d=document.createElement('div');d.className='terminal-line';d.innerHTML='<span class="text-green">$</span><span style="color:var(--fg)"> cat </span><a href="/splashes.txt" target="_blank" class="hover-underline" style="color:var(--blue)">splashes.txt</a>';out.appendChild(d);return delay(50)})
.then(function(){return fadeIn('"'+text+'"','text-muted')})
.then(function(){return delay(100)})
.then(function(){return type('$ cd ~',10)})
.then(function(){return delay(100)})
.then(function(){countdown=3;tick()});
function tick(){
if(!cancelled&&countdown!==null){
if(!countdownEl){countdownEl=document.createElement('div');countdownEl.className='terminal-line';out.appendChild(countdownEl)}
countdownEl.innerHTML='Redirecting <a href="/" class="hover-underline" style="color:var(--blue)">home</a> in '+countdown+'... [<span onclick="cancel404()" class="hover-underline" style="color:var(--blue);cursor:pointer">cancel</span>]';
countdown--;
if(countdown>=0)setTimeout(tick,1000);
}
}
window.cancel404=function(){cancelled=true;countdown=null;if(countdownEl)countdownEl.innerHTML='E.T. phone <a href="/" class="hover-underline" style="color:var(--blue)">home</a>?';};
})();
