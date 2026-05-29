(function(){
  function buildTitle(el){
    var raw = (el.getAttribute('data-title') || '').trim();
    var mode = el.getAttribute('data-title-mode') || 'about';
    var parts = raw ? raw.split('|').filter(Boolean) : [];
    el.innerHTML = '';
    el.classList.remove('title--single', 'title-end-dropped');

    if (mode !== 'plain') {
      var about = document.createElement('span');
      about.className = 'title-about';
      about.textContent = 'ABOUT:';
      el.appendChild(about);
    }

    if (parts.length > 1) {
      var centerText = parts.slice(0, -1).join(' ');
      var endText = parts[parts.length - 1];
      var center = document.createElement('span');
      center.className = 'title-center';
      center.textContent = centerText;
      el.appendChild(center);
      var end = null;

      function ensureEnd(){
        if (!endText || end) return;
        end = document.createElement('span');
        end.className = 'title-end';
        end.textContent = endText;
        el.appendChild(end);
      }

      function fit(){
        if (!endText) return;
        ensureEnd();
        if (end && el.scrollWidth > el.clientWidth) {
          end.remove();
          end = null;
          el.classList.add('title-end-dropped');
        } else if (end) {
          el.classList.remove('title-end-dropped');
        }
      }

      fit();
      if (typeof ResizeObserver !== 'undefined') {
        var ro = new ResizeObserver(function(){fit();});
        ro.observe(el);
      } else {
        window.addEventListener('resize', fit);
      }
    } else {
      el.classList.add('title--single');
      var word = parts[0] || '';
      var center = document.createElement('span');
      center.className = 'title-center';
      center.textContent = word;
      el.appendChild(center);
    }
  }

  document.querySelectorAll('.title[data-title]').forEach(buildTitle);
})();
