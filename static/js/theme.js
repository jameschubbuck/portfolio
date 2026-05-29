(function(){
var KEY='theme',D='dark',L='light';
function get(){
var t=localStorage.getItem(KEY);
if(!t)t=window.matchMedia('(prefers-color-scheme:'+D+')').matches?D:L;
return t;
}
function set(t){
localStorage.setItem(KEY,t);
document.documentElement.classList.toggle(D,t===D);
updateBtn(t);
}
function updateBtn(t){
var btn=document.getElementById('theme-toggle');
if(!btn)return;
if(btn.hasAttribute('data-theme-text')){
btn.textContent=t===D?L:D;
}else{
btn.innerHTML=t===D
?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}
}
set(get());
var btn=document.getElementById('theme-toggle');
if(btn)btn.onclick=function(){
set(document.documentElement.classList.contains(D)?L:D);
};
})();
