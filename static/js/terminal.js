(function () {
  var out = document.getElementById("terminal-output");
  var close = document.getElementById("terminal-close");
  if (!out || !close) return;

  var state = "initial";
  var runId = 0;
  var timers = [];
  var rafs = [];

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
  T.clear = function () {
    out.innerHTML = "";
  };
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
      var line = document.createElement("div");
      line.className = "terminal-line terminal-typed";
      out.appendChild(line);
      var t0 = performance.now();
      function tick(now) {
        if (!isActive(id)) return r();
        var el = (now || performance.now()) - t0;
        var c = Math.floor(el / (speed || 60));
        if (c < text.length) {
          line.innerHTML = text
            .substring(0, c + 1)
            .replace(/(^|\s)\$/g, '$1<span class="text-green">$</span>');
          scheduleRAF(tick);
        } else {
          r();
        }
      }
      scheduleRAF(tick);
    });
  };
  T.fadeIn = function (html, cls, id) {
    return new Promise(function (r) {
      if (!isActive(id)) return r();
      var line = document.createElement("div");
      line.className =
        "terminal-line fade-in terminal-return" + (cls ? " " + cls : "");
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
    var line = document.createElement("div");
    line.className = "terminal-line terminal-return";
    line.innerHTML = html;
    out.appendChild(line);
  };

  function reboot() {
    if (state === "rebooting" || state === "shutdown") return;
    state = "rebooting";
    var id = newRun();
    if (window.triggerReboot) window.triggerReboot();
    T.clear();

    T.type("$ sudo reboot", 30, id)
      .then(function () {
        return T.delay(700, id);
      })
      .then(function () {
        return T.fadeIn("Rebooting system...", "text-yellow", id);
      })
      .then(function () {
        return T.delay(500, id);
      })
      .then(function () {
        return T.fadeIn("[OK] Stopping user processes...", "text-muted", id);
      })
      .then(function () {
        return T.delay(700, id);
      })
      .then(function () {
        return T.fadeIn("[OK] Saving system state...", "text-muted", id);
      })
      .then(function () {
        return T.delay(800, id);
      })
      .then(function () {
        return T.fadeIn("[OK] Restarting kernel...", "text-muted", id);
      })
      .then(function () {
        return T.delay(800, id);
      })
      .then(function () {
        return new Promise(function (r) {
          if (!isActive(id)) return r();
          var i = 3;
          var el = document.createElement("div");
          el.className = "terminal-line text-yellow";
          out.appendChild(el);
          function tick() {
            if (!isActive(id)) return r();
            el.textContent = "Rebooting in " + i + "...";
            if (--i > 0) {
              scheduleTimeout(tick, 1000);
            } else {
              scheduleTimeout(r, 1200);
            }
          }
          tick();
        });
      })
      .then(function () {
        if (!isActive(id)) return;
        state = "shutdown";
        glitch(id);
      });
  }

  function glitch(id) {
    if (!isActive(id)) return;
    var elms = Array.prototype.slice.call(out.children);
    if (!elms.length) return;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&?";
    var t0 = performance.now();
    function tick(now) {
      if (!isActive(id)) return;
      var iter = Math.floor((now - t0) / 30);
      var all = true;
      elms.forEach(function (el) {
        var txt = el.textContent;
        if (!txt.trim()) return;
        el.textContent = txt
          .split("")
          .map(function (c) {
            if (c === " ") return " ";
            if (Math.random() < 0.01 + iter * 0.015) return " ";
            if (Math.random() < 0.5)
              return chars[Math.floor(Math.random() * chars.length)];
            return c;
          })
          .join("");
        if (el.textContent.trim()) all = false;
      });
      if (all) {
        scheduleTimeout(function () {
          if (!isActive(id)) return;
          state = "booted";
          start();
        }, 100);
      } else {
        scheduleRAF(tick);
      }
    }
    scheduleRAF(tick);
  }

  function start() {
    var id = newRun();
    state = "initial";
    T.clear();
    T.type("$ whoami", 80, id)
      .then(function () {
        return T.delay(200, id);
      })
      .then(function () {
        return T.fadeIn("james.chubbuck", "", id);
      })
      .then(function () {
        return T.delay(200, id);
      })
      .then(function () {
        return T.type("$ !$ --verbose", 40, id);
      })
      .then(function () {
        return T.delay(300, id);
      })
      .then(function () {
        return T.fadeIn(
          'Inspiring engineer @ Stanford University. Reputedly competent programmer and avid <a href="https://www.gnu.org/gnu/manifesto.en.html" target="_blank" rel="noopener noreferrer" class="hover-underline">open source</a> enthusiast.',
          "",
          id,
        );
      });
  }

  close.onclick = reboot;
  start();
})();
