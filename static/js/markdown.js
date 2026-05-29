(function () {
  window.Markdown = function (src) {
    var lines = src.split('\n');
    var html = '';
    var inParagraph = false;

    function closeParagraph() {
      if (inParagraph) { html += '</p>\n'; inParagraph = false; }
    }

    function renderInline(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" class="hover-underline link-blue">$1</a>');
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (/^#{1,6}\s/.test(line)) {
        closeParagraph();
        var level = line.match(/^(#+)/)[1].length;
        html += '<h' + level + '>' + renderInline(line.slice(level + 1)) + '</h' + level + '>\n';
      } else if (/^>\s/.test(line)) {
        closeParagraph();
        html += '<blockquote><p>' + renderInline(line.slice(2)) + '</p></blockquote>\n';
      } else if (/^["\u201C]/.test(line.trim()) && /["\u201D]$/.test(line.trim())) {
        closeParagraph();
        html += '<blockquote><p>' + renderInline(line.trim().slice(1, -1)) + '</p></blockquote>\n';
      } else if (/^---+$/.test(line)) {
        closeParagraph();
        html += '<hr>\n';
      } else if (line.trim() === '') {
        closeParagraph();
      } else {
        if (!inParagraph) { html += '<p>'; inParagraph = true; }
        else { html += '<br>\n'; }
        html += renderInline(line);
      }
    }
    closeParagraph();
    return html;
  };
})();
