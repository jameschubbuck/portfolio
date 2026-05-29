(function () {
  var cursor = document.createElement('img');
  cursor.src = '/cursors/arrow.png';
  cursor.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:40px;height:40px;top:0;left:0;display:none;image-rendering:pixelated;will-change:transform';
  document.body.appendChild(cursor);
  document.documentElement.style.cursor = 'none';
  document.body.style.cursor = 'none';

  var visible = true;

  function show() { visible = true; cursor.style.display = 'block'; }
  function hide() { visible = false; cursor.style.display = 'none'; }

  function isHoverLift(t) {
    while (t) {
      if (t.classList && t.classList.contains('hover-lift')) return true;
      t = t.parentElement;
    }
    return false;
  }

  document.addEventListener('mouseleave', hide);
  document.addEventListener('mouseout', function (e) { if (!e.relatedTarget) hide(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) hide(); });

  document.addEventListener('mousemove', function (e) {
    if (!visible) show();
    if (isHoverLift(e.target)) { hide(); return; }
    cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
  });
})();
