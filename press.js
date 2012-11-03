(function(window, undefined){
  "use strict";
  var CELLS = [], 
      WORDS = [],
      INDICE= [],
      MUSTHAVE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  function decompose(word) {
    word = word.toUpperCase();
    var freq = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var A = "A".charCodeAt(0);
    for (var i=0, l=word.length; i<l; i++) {
      var n = word.charCodeAt(i) - A;
      if (0 <= n && n < 26) freq[n]++;
    }
    return freq;
  }

  function covered(src, tgt) {
    for (var i=0; i<26; i++) {
      if (src[i] < tgt[i]) {
        return false;
      }
    }
    return true;
  }

  function parse(words) {
    var groups = words.split(";");
    var res = [];
    for (var i=0, l=groups.length; i<l; i++) {
      var anagrams = groups[i].split(",");
      res.push(anagrams);
    }
    WORDS = res;
  }

  function find(letters) {
    var freq = decompose(letters), indice = [];
    for (var i=0, l=WORDS.length; i<l; i++) {
      var k = decompose(WORDS[i][0]);
      if (k > freq) break;
      if (covered(freq, k)) indice.push(i);
    }
    INDICE = indice;
    filter(MUSTHAVE);
  }

  function filter(musthave) {
    var words = [];
    for (var i=0,il=INDICE.length; i<il; i++) {
      var idx = INDICE[i];
      if (covered(decompose(WORDS[idx][0]), musthave)) {
        var anagrams = WORDS[idx];
        for (var j=0,jl=anagrams.length; j<jl; j++)
          words.push(anagrams[j]);
      }
    }
    words.sort(function(x, y) {
      if (x.length != y.length) { return y.length - x.length; }
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    msg(words.join(" "));
  }

  function $(id) {
    return window.document.getElementById(id);
  }

  function drawGrid(e) {
    var l = letters();
    letters(l);
    window.location.hash = l;
    for (var i=0; i<5; i++) {
      for (var j=0; j<5; j++) {
        var pos = i*5 + j;
        CELLS[pos].innerText = pos < l.length ? l[pos] : "";
      }
    }

    if (l.length < 25) {
      clear();
    } else {
      find(l);
    }
  }

  function clear() {
    msg();
    INDICE = [];
    MUSTHAVE = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (var i=0; i<5; i++) {
      for (var j=0; j<5; j++) {
        var pos = i*5 + j;
        var el = CELLS[pos];
        if (el.className != "cell") el.className = "cell";
      }
    }
  }

  function toggleCell(e) {
    e.preventDefault();
    var el = e.srcElement;
    var i = parseInt(el.id[1], 10);
    var j = parseInt(el.id[2], 10);
    var idx = el.innerText.charCodeAt(0) - "A".charCodeAt(0);
    if (el.className == "cell") {
        el.className = "cell yellow";
        MUSTHAVE[idx]++;
    } else {
        el.className = "cell";
        MUSTHAVE[idx]--;
    }
    filter(MUSTHAVE);
  }

  function msg(str) {
    $("msgbox").innerText = typeof str == "undefined" ? "" : str;
  }



  function get(path, success) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) success(xhr);
    };
    xhr.open("GET", path, true);
    xhr.send();
  }

  function letters(v) {
    var el = $("letters");
    if (typeof v == "string") el.value = v.slice(0, 25).toUpperCase();
    return el.value.slice(0, 25).toUpperCase();
  }

  function init() {
    for (var i=0; i<5; i++) {
      for (var j=0; j<5; j++) {
        var el = $("c"+i+j);
        el.addEventListener("click", toggleCell, false);
        el.addEventListener("touchstart", toggleCell, false);
        CELLS.push(el);
      }
    }

    letters(window.location.hash.slice(1));
    drawGrid();
    $("letters").addEventListener("input", drawGrid, false);

    msg("(loading...)");
    get("words.txt", function(xhr){ 
      msg("(analyzing...)");
      parse(xhr.responseText);
      msg();
      var s = letters();
      if (s.length == 25) find(s);
    });
  }

  init();
})(window);
