(function () {
  var listEl = document.getElementById('pondering-list');
  var contentEl = document.getElementById('pondering-content');
  var titleEl = document.querySelector('title');
  var descEl = document.querySelector('meta[name="description"]');
  var h1El = document.querySelector('.title[data-title]');
  var ponderings = [];
  var currentId = null;

  function loadListing() {
    fetch('/ponderings/list')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        ponderings = data;
        renderList();
        var id = location.pathname.replace(/^\/ponderings\/?/, '');
        if (id) showPondering(id);
        else showList();
      });
  }

  function renderList() {
    listEl.innerHTML = '';
    ponderings.forEach(function (p) {
      var a = document.createElement('a');
      a.href = '/ponderings/' + p.id;
      a.className = 'outline-button pondering-list-item';
      a.textContent = p.title;
      listEl.appendChild(a);
    });
    showList();
  }

  function showList() {
    listEl.style.display = '';
    contentEl.style.display = 'none';
    document.title = 'Ponderings — James Chubbuck';
    if (descEl) descEl.content = 'Ponderings by James Chubbuck';
    if (h1El) h1El.textContent = 'PONDERINGS';
    currentId = null;
  }

  function showPondering(id) {
    var p = ponderings.filter(function (x) { return x.id === id; })[0];
    if (!p) { showList(); return; }
    currentId = id;

    if (h1El) h1El.textContent = p.shortTitle;

    fetch('/ponderings/' + encodeURIComponent(p.file))
      .then(function (r) { return r.text(); })
      .then(function (md) {
        contentEl.innerHTML = Markdown(md);
        if (titleEl) titleEl.textContent = p.title + ' — James Chubbuck';
        if (descEl) descEl.content = p.title + ' — ' + md.split('\n')[0].replace(/^#\s*/, '').substring(0, 160);
        listEl.style.display = 'none';
        contentEl.style.display = '';
        window.scrollTo(0, 0);
      });
  }

  window.addEventListener('popstate', function () {
    var id = location.pathname.replace(/^\/ponderings\/?/, '');
    if (id && id !== currentId) showPondering(id);
    else showList();
  });

  loadListing();
})();
