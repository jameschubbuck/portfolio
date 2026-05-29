(function () {
  var K =
    "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a".split(
      ",",
    );
  var idx = 0,
    konamiCount = 0;
  document.addEventListener("keydown", function (e) {
    if (e.key === K[idx]) {
      idx++;
      if (idx === K.length) {
        idx = 0;
        konamiCount++;
        var i = konamiCount % 2;
        var msg =
          i === 0
            ? "Using cheats doesn&#39;t mean we&#39;re not smart."
            : "You won the game!";
        var url =
          i === 0
            ? "https://youtu.be/QsWFbMc5t84?si=GmVHbdXDLbuYNtBJ"
            : "https://xkcd.com/391/";
        var ft = document.getElementById("footer-text");
        if (ft)
          ft.innerHTML =
            '<a href="' +
            url +
            '" target="_blank" class="footer-link link-blue">' +
            msg +
            "</a>";
      }
    } else {
      idx = 0;
    }
  });
  window.triggerReboot = function () {
    var ft = document.getElementById("footer-text");
    if (ft)
      ft.innerHTML =
        'there&#39;s always something <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank" class="footer-link link-blue">new</a>';
  };
})();
