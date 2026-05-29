(function () {
  var out = document.getElementById("terminal-output");
  var close = document.getElementById("terminal-close");
  if (!out || !close) return;

  var state = "initial";
  var runId = 0;
  var timers = [];
  var rafs = [];
  var is404 = !!document.querySelector('.main--404');
  var splashText = null;

  function scheduleTimeout(fn, ms) {
    var id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function scheduleRAF(fn) {
    var id = requestAnimationFrame(fn);
    rafs.push(id);
    return id;
  }

  function cancelScheduled() {
    timers.forEach(clearTimeout);
    rafs.forEach(cancelAnimationFrame);
    timers = [];
    rafs = [];
  }

  function newRun() {
    runId += 1;
    cancelScheduled();
    return runId;
  }

  function isActive(id) {
    return id === runId;
  }

  var T = (window.Terminal = {});
  T.clear = function () { out.innerHTML = ''; };
  T.delay = function (ms, id) {
    return new Promise(function (r) {
      if (!isActive(id)) return r();
      scheduleTimeout(function () {
        if (!isActive(id)) return r();
        r();
      }, ms);
    });
  };
  T.type = function (text, speed, id) {
    return new Promise(function (r) {
      if (!isActive(id)) return r();
      var line = document.createElement('div');
      line.className = 'terminal-line terminal-typed';
      out.appendChild(line);
      var t0 = performance.now();
      function tick(now) {
        if (!isActive(id)) return r();
        var el = (now || performance.now()) - t0;
        var c = Math.floor(el / (speed || 60));
        if (c < text.length) {
          line.innerHTML = text.substring(0, c + 1).replace(/(^|\s)\$/g, '$1<span class="text-green">$</span>');
          scheduleRAF(tick);
        } else { r(); }
      }
      scheduleRAF(tick);
    });
  };
  T.fadeIn = function (html, cls, id) {
    return new Promise(function (r) {
      if (!isActive(id)) return r();
      var line = document.createElement('div');
      line.className = 'terminal-line fade-in terminal-return' + (cls ? ' ' + cls : '');
      line.innerHTML = html;
      out.appendChild(line);
      scheduleTimeout(function () {
        if (!isActive(id)) return r();
        r();
      }, 300);
    });
  };
  T.append = function (html, id) {
    if (!isActive(id)) return;
    var line = document.createElement('div');
    line.className = 'terminal-line terminal-return';
    line.innerHTML = html;
    out.appendChild(line);
  };

  function reboot() {
    if (state === 'rebooting' || state === 'shutdown') return;
    state = 'rebooting';
    var id = newRun();
    if (window.triggerReboot) window.triggerReboot();
    T.clear();

    T.type('$ sudo reboot', 30, id)
      .then(function () { return T.delay(700, id); })
      .then(function () { return T.fadeIn('Rebooting system...', 'text-yellow', id); })
      .then(function () { return T.delay(500, id); })
      .then(function () { return T.fadeIn('[OK] Stopping user processes...', 'text-muted', id); })
      .then(function () { return T.delay(700, id); })
      .then(function () { return T.fadeIn('[OK] Saving system state...', 'text-muted', id); })
      .then(function () { return T.delay(800, id); })
      .then(function () { return T.fadeIn('[OK] Restarting kernel...', 'text-muted', id); })
      .then(function () { return T.delay(800, id); })
      .then(function () {
        return new Promise(function (r) {
          if (!isActive(id)) return r();
          var i = 3;
          var el = document.createElement('div');
          el.className = 'terminal-line text-yellow';
          out.appendChild(el);
          function tick() {
            if (!isActive(id)) return r();
            el.textContent = 'Rebooting in ' + i + '...';
            if (--i > 0) scheduleTimeout(tick, 1000);
            else scheduleTimeout(r, 1200);
          }
          tick();
        });
      })
      .then(function () {
        if (!isActive(id)) return;
        state = 'shutdown';
        glitch(id);
      });
  }

  function glitch(id) {
    if (!isActive(id)) return;
    var elms = Array.prototype.slice.call(out.children);
    if (!elms.length) return;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&?';
    var t0 = performance.now();
    function tick(now) {
      if (!isActive(id)) return;
      var iter = Math.floor((now - t0) / 30);
      var all = true;
      elms.forEach(function (el) {
        var txt = el.textContent;
        if (!txt.trim()) return;
        el.textContent = txt.split('').map(function (c) {
          if (c === ' ') return ' ';
          if (Math.random() < 0.01 + iter * 0.015) return ' ';
          if (Math.random() < 0.5) return chars[Math.floor(Math.random() * chars.length)];
          return c;
        }).join('');
        if (el.textContent.trim()) all = false;
      });
      if (all) {
        scheduleTimeout(function () {
          if (!isActive(id)) return;
          state = 'booted';
          if (is404) start404(newRun()); else start(newRun());
        }, 100);
      } else {
        scheduleRAF(tick);
      }
    }
    scheduleRAF(tick);
  }

  function start(id) {
    state = 'initial';
    T.clear();
    T.type('$ whoami', 80, id)
      .then(function () { return T.delay(200, id); })
      .then(function () { return T.fadeIn('james.chubbuck', '', id); })
      .then(function () { return T.delay(200, id); })
      .then(function () { return T.type('$ !$ --verbose', 40, id); })
      .then(function () { return T.delay(300, id); })
      .then(function () {
        return T.fadeIn('Inspiring engineer @ Stanford University. Reputedly competent programmer and avid <a href="https://www.gnu.org/gnu/manifesto.en.html" target="_blank" rel="noopener noreferrer" class="hover-underline link-blue">open source</a> enthusiast.', '', id);
      });
  }

  function start404(id) {
    state = 'initial';
    T.clear();
    T.type('$ http_status', 10, id)
      .then(function () { return T.delay(100, id); })
      .then(function () {
        return T.fadeIn('<a href="https://xkcd.com/1024/" target="_blank" class="hover-underline" style="color:var(--red)">Error: -41 Not Found</a>', '', id);
      })
      .then(function () { return T.delay(100, id); })
      .then(function () {
        T.append('<span class="text-green">$</span><span style="color:var(--fg)"> cat </span><a href="/txt/splashes.txt" target="_blank" class="hover-underline link-blue">splashes.txt</a>', id);
        return T.delay(50, id);
      })
      .then(function () { return T.fadeIn('"' + (splashText || '') + '"', 'text-muted', id); })
      .then(function () { return T.delay(100, id); })
      .then(function () { return T.type('$ cd ~', 10, id); })
      .then(function () { return T.delay(100, id); })
      .then(function () {
        if (!isActive(id)) return;
        var countdown = 3;
        var el = document.createElement('div');
        el.className = 'terminal-line';
        out.appendChild(el);
        function tick() {
          if (!isActive(id)) return;
          el.innerHTML = 'Redirecting <a href="/" class="hover-underline link-blue">home</a> in ' + countdown + '... [<span onclick="window.cancel404 && window.cancel404()" class="hover-underline link-blue" style="cursor:pointer">cancel</span>]';
          countdown--;
          if (countdown >= 0) scheduleTimeout(tick, 1000);
          if (countdown < 0) window.location.href = '/';
        }
        window.cancel404 = function () {
          el.innerHTML = 'E.T. phone <a href="/" class="hover-underline link-blue">home</a>?';
          countdown = -99;
        };
        tick();
      });
  }

  if (is404) {
    var asciiLeft = document.getElementById('ascii-left');
    var asciiRight = document.getElementById('ascii-right');
    Promise.all([
      fetch('/txt/lackeys.txt').then(function (r) { return r.text(); }),
      fetch('/txt/richard.txt').then(function (r) { return r.text(); }),
      fetch('/txt/splashes.txt').then(function (r) { return r.text(); }),
    ])
      .then(function (res) {
        if (asciiLeft) asciiLeft.textContent = res[0];
        if (asciiRight) asciiRight.textContent = res[1];
        var lines = res[2].trim().split('\n').filter(Boolean);
        if (lines.length) splashText = lines[Math.floor(Math.random() * lines.length)];
      })
      .catch(function () {})
      .then(function () {
        state = 'booted';
        start404(newRun());
      });
  } else {
    state = 'booted';
    start(newRun());
  }

  close.onclick = reboot;
  window.TerminalStart = start;
  window.TerminalReboot = reboot;
  window.Terminal404 = start404;
})();
