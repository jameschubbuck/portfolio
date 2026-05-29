(function() {
  var max = 2;
  document.querySelectorAll('a:not(.footer-nav-link), button, [role="button"]').forEach(function(btn) {
    btn.classList.add('hover-lift');
    btn.addEventListener('mousemove', function(e) {
      var r = btn.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      btn.style.transform = 'translate(' + (x * max * 2) + 'px,' + (y * max * 2) + 'px) scale(1.05)';
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = '';
    });
  });
})();
