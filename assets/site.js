/* Shreelekha Basavaraja Sangapur: site script.
   Content comes from the /content/*.json files, which you edit at /admin. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.dataset.page;
  var SECTIONS = ['mind', 'movement', 'bahja', 'travel'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function qs(n) { return new URLSearchParams(location.search).get(n); }
  function md(s) {
    if (!s) return '';
    if (window.marked && window.marked.parse) return window.marked.parse(String(s));
    return '<p>' + esc(s).replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
  }
  function cssVar(n) { return getComputedStyle(root).getPropertyValue(n).trim(); }
  function rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join(''); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function list(a) { return Array.isArray(a) ? a : []; }

  /* ---------- Cartoon placeholders (used whenever no photo is uploaded) ---------- */
  var TONES = { sea: 'p1', hills: 'p2', mountains: 'p3', road: 'p4', city: 'p5', desk: 'p6', chart: 'p7', person: 'pa' };
  var S = {
    p1: '<rect width="400" height="300" fill="#F6CFAE"/><circle cx="270" cy="110" r="52" fill="#FBE0C2"/><circle cx="270" cy="110" r="32" fill="#FFF3DC"/><path d="M0 175 Q200 166 400 175 V300 H0Z" fill="#C98E6F"/><g stroke="#F6D7B8" stroke-width="4" stroke-linecap="round" opacity=".75"><path d="M235 194 H305"/><path d="M248 212 H292"/><path d="M228 232 H312"/></g><g transform="translate(100 186)"><path d="M-24 0 H24 L15 11 H-15Z" fill="#4A3530"/><path d="M0 0 V-28 L17 -2Z" fill="#FFF3DC"/></g><path d="M250 300 L262 252 Q285 232 310 242 Q330 222 362 240 Q392 246 400 262 V300Z" fill="#4A3530"/><g fill="none" stroke="#6E4F45" stroke-width="2.5" stroke-linecap="round"><path d="M120 80 q7 -6 14 0 q7 -6 14 0"/><path d="M162 102 q5 -5 10 0 q5 -5 10 0"/></g>',
    p2: '<rect width="400" height="300" fill="#E4EEDD"/><circle cx="320" cy="70" r="26" fill="#FFF5DE"/><g fill="#FFFFFF" opacity=".95"><ellipse cx="90" cy="72" rx="36" ry="12"/><ellipse cx="114" cy="62" rx="22" ry="13"/></g><ellipse cx="110" cy="260" rx="240" ry="110" fill="#A7BB9D"/><ellipse cx="340" cy="290" rx="230" ry="105" fill="#7E9875"/><rect x="236" y="150" width="10" height="46" rx="3" fill="#6B5040"/><circle cx="241" cy="140" r="26" fill="#657D60"/><circle cx="224" cy="157" r="16" fill="#657D60"/><circle cx="259" cy="157" r="16" fill="#5B7457"/>',
    p3: '<rect width="400" height="300" fill="#DDE6EF"/><circle cx="80" cy="70" r="20" fill="#FFF6E6"/><path d="M-10 300 L110 110 L190 220 L260 90 L410 300Z" fill="#8FA4B8"/><path d="M110 110 L131 143 L118 138 L104 150 L94 136Z" fill="#FFFFFF"/><path d="M260 90 L285 128 L268 123 L253 136 L240 122Z" fill="#FFFFFF"/><path d="M0 300 L0 240 Q120 210 220 240 T400 230 V300Z" fill="#50657A"/>',
    p4: '<rect width="400" height="300" fill="#F8E8CC"/><circle cx="310" cy="72" r="28" fill="#FFF6E3"/><path d="M0 170 Q100 140 200 165 T400 155 V300 H0Z" fill="#E2C28E"/><path d="M0 220 Q120 190 240 215 T400 205 V300 H0Z" fill="#C99E5F"/><path d="M150 300 C170 250 230 230 250 200 C262 182 250 175 238 170" fill="none" stroke="#6B5A4E" stroke-width="26" stroke-linecap="round"/><path d="M150 300 C170 250 230 230 250 200 C262 182 250 175 238 170" fill="none" stroke="#FFF6E8" stroke-width="2.5" stroke-dasharray="8 8"/><g transform="translate(205 236) rotate(-28)"><rect x="-20" y="-11" width="40" height="16" rx="5" fill="#B65A36"/><rect x="-11" y="-21" width="22" height="12" rx="4" fill="#B65A36"/><rect x="-8" y="-19" width="16" height="7" rx="2" fill="#F8E8CC"/><circle cx="-11" cy="6" r="5" fill="#2A2522"/><circle cx="11" cy="6" r="5" fill="#2A2522"/></g>',
    p5: '<rect width="400" height="300" fill="#F2D6CC"/><circle cx="200" cy="170" r="60" fill="#FBE8DC"/><g fill="#9B5E52"><rect x="20" y="150" width="50" height="150"/><rect x="80" y="110" width="40" height="190"/><rect x="250" y="130" width="46" height="170"/><rect x="306" y="170" width="70" height="130"/></g><g fill="#7A4A40"><rect x="130" y="180" width="60" height="120"/><rect x="200" y="200" width="44" height="100"/></g><g fill="#F8D9B8"><rect x="30" y="165" width="8" height="10"/><rect x="50" y="190" width="8" height="10"/><rect x="90" y="130" width="8" height="10"/><rect x="104" y="160" width="8" height="10"/><rect x="262" y="150" width="8" height="10"/><rect x="278" y="185" width="8" height="10"/><rect x="320" y="190" width="8" height="10"/><rect x="345" y="215" width="8" height="10"/><rect x="146" y="200" width="8" height="10"/><rect x="214" y="222" width="8" height="10"/></g>',
    p6: '<rect width="400" height="300" fill="#F5EADB"/><rect x="0" y="210" width="400" height="90" fill="#E2CBAB"/><g transform="translate(90 150)"><path d="M0 60 L60 50 L60 0 L0 10Z" fill="#FFFDF9"/><path d="M60 50 L120 60 L120 10 L60 0Z" fill="#F6EFE3"/><path d="M0 60 L60 50 L120 60 L120 65 L60 55 L0 65Z" fill="#B65A36"/><g stroke="#D9C7AE" stroke-width="2"><path d="M10 22 L50 15"/><path d="M10 32 L50 25"/><path d="M10 42 L44 36"/><path d="M70 15 L110 22"/><path d="M70 25 L110 32"/></g></g><rect x="280" y="160" width="40" height="52" rx="6" fill="#9C7843"/><path d="M300 160 C290 130 270 128 266 110 C286 112 298 128 300 160 C302 124 318 112 336 108 C330 130 312 138 300 160Z" fill="#657D60"/>',
    p7: '<rect width="400" height="300" fill="#E6ECF2"/><rect x="40" y="40" width="320" height="220" rx="16" fill="#FFFDF9"/><g fill="#9DB0C2"><rect x="80" y="170" width="30" height="60" rx="4"/><rect x="130" y="140" width="30" height="90" rx="4"/><rect x="180" y="110" width="30" height="120" rx="4"/></g><path d="M236 206 C258 120 290 214 322 92" fill="none" stroke="#B65A36" stroke-width="5" stroke-linecap="round"/><circle cx="322" cy="92" r="7" fill="#B65A36"/><g fill="#50657A"><circle cx="70" cy="64" r="5"/><circle cx="88" cy="64" r="5"/><circle cx="106" cy="64" r="5"/></g>',
    pa: '<rect width="400" height="300" fill="#F0DFC0"/><circle cx="200" cy="124" r="46" fill="#C08B6E"/><path d="M152 118 Q156 66 204 68 Q252 72 250 122 Q238 94 202 96 Q170 98 152 118Z" fill="#2A2522"/><path d="M106 300 Q112 196 200 190 Q288 196 294 300Z" fill="#657D60"/><circle cx="184" cy="128" r="4" fill="#2A2522"/><circle cx="216" cy="128" r="4" fill="#2A2522"/><path d="M188 146 Q200 154 212 146" fill="none" stroke="#2A2522" stroke-width="3" stroke-linecap="round"/>'
  };
  function cartoon(tone) { var t = TONES[tone] || tone; if (!S[t]) t = 'p1'; return '<svg class="cartoon" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + S[t] + '</svg>'; }
  function ph(img, tone, cls, label, alt) {
    var lab = label ? ' data-label="' + esc(label) + '"' : '';
    var inner = img ? '<img src="' + esc(img) + '" alt="' + esc(alt || '') + '" loading="lazy">' : cartoon(tone);
    return '<div class="ph ' + (cls || '') + '"' + lab + '>' + inner + '</div>';
  }

  /* ---------- Living background ---------- */
  var PAL = { all: ['--terracotta', '--slate', '--sage', '--sand'], mind: ['--slate', '--slate', '--terracotta'], movement: ['--sage', '--sage', '--sand'], bahja: ['--terracotta', '--sand', '--sand'], travel: ['--terracotta', '--sand', '--slate'] };
  var ACC = { all: '--terracotta', mind: '--slate', movement: '--sage', bahja: '--sand', travel: '--terracotta' };
  var LINK = { all: 110, mind: 150, movement: 70, bahja: 0, travel: 120 };
  function Field(box) {
    var self = this;
    this.box = box; this.cv = $('canvas', box); this.ctx = this.cv.getContext('2d');
    this.mode = box.dataset.mode; this.pts = []; this.ripples = []; this.ptr = { x: -999, y: -999, on: false };
    this.visible = true; this.raf = null; this.t = 0;
    this.loop = function () { if (!self.visible || document.hidden) { self.raf = null; return; } self.step(); self.paint(); self.raf = requestAnimationFrame(self.loop); };
    if (window.ResizeObserver) new ResizeObserver(function () { self.resize(); }).observe(box); else window.addEventListener('resize', function () { self.resize(); });
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; self.start(); }).observe(box);
    box.addEventListener('pointermove', function (e) { var r = self.cv.getBoundingClientRect(); self.ptr.x = e.clientX - r.left; self.ptr.y = e.clientY - r.top; self.ptr.on = true; if (reduce) self.paint(); });
    box.addEventListener('pointerleave', function () { self.ptr.on = false; if (reduce) self.paint(); });
    box.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button, a')) return;
      var r = self.cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      self.pts.forEach(function (p) { var dx = p.x - x, dy = p.y - y, d = Math.sqrt(dx * dx + dy * dy) || 1; if (d < 220) { var f = (1 - d / 220) * 5; p.vx += dx / d * f; p.vy += dy / d * f; } });
      self.ripples.push({ x: x, y: y, r: 4, a: .5 }); if (reduce) self.paint();
    });
    document.addEventListener('visibilitychange', function () { self.start(); });
    this.resize(); this.start();
  }
  Field.prototype.resize = function () {
    var w = this.box.clientWidth, h = this.box.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!w || !h) return;
    this.w = w; this.h = h; this.cv.width = w * dpr; this.cv.height = h * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(36, Math.min(120, Math.round(w * h / 9500)));
    while (this.pts.length < n) { var bx = (Math.random() - .5) * .5, by = (Math.random() - .5) * .5; this.pts.push({ x: Math.random() * w, y: Math.random() * h, vx: bx, vy: by, bx: bx, by: by, r: 1.8 + Math.random() * 2.6, c: Math.floor(Math.random() * 4), ph: Math.random() * 6.28 }); }
    this.pts.length = n;
    this.pts.forEach(function (p) { p.x = Math.min(p.x, w); p.y = Math.min(p.y, h); });
    this.colors(); if (reduce || !this.raf) this.paint();
  };
  Field.prototype.colors = function () { this.cols = PAL[this.mode].map(function (n) { return rgb(cssVar(n)); }); this.ink = rgb(cssVar('--ink')); this.acc = rgb(cssVar(ACC[this.mode])); };
  Field.prototype.setMode = function (m) { this.mode = m; this.colors(); if (reduce) this.paint(); };
  Field.prototype.start = function () { if (reduce) { this.paint(); return; } if (!this.raf && this.visible) this.raf = requestAnimationFrame(this.loop); };
  Field.prototype.step = function () {
    var w = this.w, h = this.h, m = this.mode, t = (this.t += 16), ptr = this.ptr;
    this.pts.forEach(function (p) {
      var tbx = p.bx + (m === 'movement' ? .8 : 0);
      p.vx += (tbx - p.vx) * .03; p.vy += (p.by - p.vy) * .03;
      if (m === 'movement') p.vy += Math.sin(p.x * .012 + t * .0012 + p.ph) * .06;
      if (ptr.on) { var dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy; if (d2 < 19600) { var d = Math.sqrt(d2) || 1, f = (1 - d / 140) * .7; p.vx += dx / d * f; p.vy += dy / d * f; } }
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10; if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
    });
    this.ripples = this.ripples.filter(function (r) { r.r += 5; r.a *= .94; return r.a > .02; });
  };
  Field.prototype.paint = function () {
    if (!this.w || !this.cols) return;
    var c = this.ctx, pts = this.pts, m = this.mode, t = this.t, ink = this.ink, acc = this.acc, cols = this.cols, ptr = this.ptr, link = LINK[m], la = m === 'mind' ? .32 : .2;
    c.clearRect(0, 0, this.w, this.h); c.lineWidth = 1;
    if (link) for (var i = 0; i < pts.length; i++) for (var j = i + 1; j < pts.length; j++) {
      var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d2 = dx * dx + dy * dy;
      if (d2 < link * link) { c.strokeStyle = rgba(ink, (1 - Math.sqrt(d2) / link) * la); c.beginPath(); c.moveTo(pts[i].x, pts[i].y); c.lineTo(pts[j].x, pts[j].y); c.stroke(); }
    }
    if (ptr.on && m !== 'bahja') pts.forEach(function (p) { var dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.sqrt(dx * dx + dy * dy); if (d < 180) { c.strokeStyle = rgba(acc, (1 - d / 180) * .55); c.beginPath(); c.moveTo(ptr.x, ptr.y); c.lineTo(p.x, p.y); c.stroke(); } });
    pts.forEach(function (p) {
      var col = cols[p.c % cols.length], r = p.r, a = .85;
      if (m === 'bahja') { var s = .5 + .5 * Math.sin(t * .003 + p.ph); r = p.r * (.6 + 1.1 * s); a = .3 + .65 * s; if (ptr.on) { var dx = p.x - ptr.x, dy = p.y - ptr.y, d = Math.sqrt(dx * dx + dy * dy); if (d < 160) { r *= 1 + (1 - d / 160) * 1.4; a = Math.min(1, a + .3); } } }
      c.fillStyle = rgba(col, a); c.beginPath(); c.arc(p.x, p.y, r, 0, 6.2832); c.fill();
    });
    this.ripples.forEach(function (rp) { c.strokeStyle = rgba(acc, rp.a); c.lineWidth = 2; c.beginPath(); c.arc(rp.x, rp.y, rp.r, 0, 6.2832); c.stroke(); });
  };
  var fields = [];
  function startFields() { fields = $$('.field-box').map(function (b) { return new Field(b); }); }

  /* ---------- Shared pieces ---------- */
  function pageHead(mode, title, lede, extra) {
    return '<header class="page-head field-box" data-mode="' + mode + '"><canvas aria-hidden="true"></canvas><div class="page-fade"></div><div class="page-copy"><h1>' + esc(title) + (extra || '') + '</h1>' + (lede ? '<p class="lede">' + esc(lede) + '</p>' : '') + '</div></header>';
  }
  function header(site, current) {
    var s = site.sections;
    return '<div class="wrap"><a class="brand" href="/"><span class="full">' + esc(site.name) + '</span><span class="short">' + esc(site.short || site.name) + '</span><span>.</span></a>' +
      '<nav class="nav" aria-label="Main">' + SECTIONS.map(function (k) { return '<a href="/' + k + '/"' + (k === current ? ' aria-current="page"' : '') + '>' + esc(s[k].label) + '</a>'; }).join('') +
      (site.email ? '<a class="hello" href="mailto:' + esc(site.email) + '">Say hello</a>' : '') +
      '<button class="theme" id="themeBtn" aria-pressed="false" aria-label="Dark mode"><span class="track"><span class="knob"></span></span><span class="tlabel">Light</span></button></nav></div>';
  }
  function footer(site) {
    var links = [['Instagram', site.instagram], ['GitHub', site.github], ['LinkedIn', site.linkedin]].filter(function (l) { return l[1]; });
    return '<div class="wrap"><div><p class="big">Let’s talk.</p><p>' + (site.email ? '<a href="mailto:' + esc(site.email) + '">' + esc(site.email) + '</a>' : '') + '</p></div><div class="links">' +
      links.map(function (l) { return '<a href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + l[0] + '</a>'; }).join('') + '</div></div>';
  }
  function bindTheme() {
    var btn = $('#themeBtn');
    function sync() { var dark = root.getAttribute('data-theme') === 'dark'; btn.setAttribute('aria-pressed', dark ? 'true' : 'false'); $('.tlabel', btn).textContent = dark ? 'Dark' : 'Light'; fields.forEach(function (f) { f.colors(); if (reduce) f.paint(); }); }
    btn.addEventListener('click', function () { var n = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', n); try { localStorage.setItem('theme', n); } catch (e) {} sync(); });
    sync();
  }
  // Accordions and flip cards work anywhere on the site
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.tl-btn');
    if (b) { var open = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', open ? 'false' : 'true'); b.nextElementSibling.hidden = open; b.parentNode.classList.toggle('open', !open); return; }
    var f = e.target.closest('.flip');
    if (f) f.setAttribute('aria-pressed', f.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  });
  function timeline(items, labelKey) {
    return '<ol class="timeline">' + list(items).map(function (d, i) {
      var open = i === 0;
      return '<li' + (open ? ' class="open"' : '') + '><button class="tl-btn" aria-expanded="' + open + '"><span class="yr">' + esc(d[labelKey]) + '</span><span class="tt">' + esc(d.title) + '</span><span class="pm" aria-hidden="true"></span></button><div class="tl-body"' + (open ? '' : ' hidden') + '>' + md(d.details) + '</div></li>';
    }).join('') + '</ol>';
  }
  function tabs(container, onPick) {
    var btns = $$('.tab', container);
    btns.forEach(function (b) { b.addEventListener('click', function () { btns.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); }); onPick(b.dataset.v); }); });
  }

  /* Lightbox for photo series */
  var lb = null;
  function lightbox(photos, title, start, opener) {
    if (!lb) {
      document.body.insertAdjacentHTML('beforeend', '<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer"><div class="lb-frame"><div id="lbImg"></div><div class="lb-bar"><p><span id="lbTitle"></span><br><small id="lbCount"></small></p><div class="lb-ctrl"><button id="lbPrev">Previous</button><button id="lbNext">Next</button><button id="lbClose">Close</button></div></div></div></div>');
      lb = { el: $('#lightbox'), i: 0, photos: [], opener: null };
      var close = function () { lb.el.classList.remove('open'); if (lb.opener) lb.opener.focus(); };
      var step = function (d) { var n = lb.photos.length; lb.i = (lb.i + d + n) % n; paint(); };
      lb.close = close; lb.step = step;
      $('#lbPrev').addEventListener('click', function () { step(-1); });
      $('#lbNext').addEventListener('click', function () { step(1); });
      $('#lbClose').addEventListener('click', close);
      lb.el.addEventListener('click', function (e) { if (e.target === lb.el) close(); });
      document.addEventListener('keydown', function (e) { if (!lb.el.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
    }
    function paint() {
      var p = lb.photos[lb.i];
      $('#lbImg').innerHTML = ph(p.image, p.tone, 'lb-img', '', p.caption || title);
      $('#lbTitle').textContent = p.caption || title;
      $('#lbCount').textContent = 'Photo ' + (lb.i + 1) + ' of ' + lb.photos.length;
    }
    lb.photos = photos; lb.i = start || 0; lb.opener = opener; paint();
    lb.el.classList.add('open'); $('#lbNext').focus();
  }

  /* ======================= HOME ======================= */
  var ICON = {
    mind: '<svg class="thumb" viewBox="0 0 120 84" aria-hidden="true"><rect width="120" height="84" fill="#50657A"/><rect x="16" y="20" width="52" height="7" rx="3.5" fill="#C9D5E0"/><rect x="28" y="36" width="64" height="7" rx="3.5" fill="#94A9BC"/><rect x="28" y="52" width="40" height="7" rx="3.5" fill="#C9D5E0"/></svg>',
    movement: '<svg class="thumb" viewBox="0 0 120 84" aria-hidden="true"><rect width="120" height="84" fill="#657D60"/><circle cx="60" cy="42" r="26" fill="#A6BF9F"/><circle cx="60" cy="42" r="14" fill="#DCE8D8"/></svg>',
    bahja: '<svg class="thumb" viewBox="0 0 120 84" aria-hidden="true"><rect width="120" height="84" fill="#2A2522"/><circle cx="84" cy="30" r="12" fill="#F6D3A4"/><path d="M0 84 L34 46 L58 66 L78 52 L120 84Z" fill="#6B5A50"/></svg>',
    travel: '<svg class="thumb" viewBox="0 0 120 84" aria-hidden="true"><rect width="120" height="84" fill="#C7A574"/><path d="M14 64 C40 20, 70 70, 104 24" fill="none" stroke="#FFF6E8" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/><circle cx="104" cy="24" r="7" fill="#B65A36"/></svg>'
  };
  var GLYPH = {
    mind: '<path d="M34 28 L14 50 L34 72 M66 28 L86 50 L66 72" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>',
    movement: '<circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="50" cy="50" r="22" fill="currentColor"/>',
    bahja: '<rect x="10" y="26" width="80" height="56" rx="10" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="50" cy="54" r="15" fill="none" stroke="currentColor" stroke-width="6"/><rect x="34" y="16" width="22" height="12" rx="3" fill="currentColor"/>',
    travel: '<path d="M50 90 C30 64 20 50 20 38 A30 30 0 0 1 80 38 C80 50 70 64 50 90Z" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="50" cy="38" r="10" fill="currentColor"/>'
  };
  var PEEK = { mind: 'chart', movement: 'hills', bahja: 'sea', travel: 'road' };
  function renderHome(site) {
    var s = site.sections;
    $('#main').innerHTML = '<div class="wrap">' +
      '<div class="hero field-box" data-mode="all"><canvas aria-hidden="true"></canvas><div class="hero-fade"></div><div class="hero-copy">' +
        '<h1>' + esc(site.hero_title) + '</h1><p>' + esc(site.intro) + '</p>' +
        '<p class="ask" id="askLabel">' + esc(site.ask) + '</p><div class="choices" role="group" aria-labelledby="askLabel">' +
        SECTIONS.map(function (k) { return '<button class="choice" data-key="' + k + '" aria-pressed="false">' + esc(s[k].picker) + '</button>'; }).join('') +
        '</div><div class="answer" id="answer" aria-live="polite"></div></div>' +
        '<p class="field-hint">Move your cursor or tap the background. Each choice changes how it moves.</p></div>' +
      '<section class="block" aria-labelledby="exploreTitle"><div class="sec-head"><div><h2 id="exploreTitle">Explore</h2><p class="lede">Four corners of one life. Each has its own page.</p></div></div><nav class="doors" aria-label="Sections">' +
        SECTIONS.map(function (k) { return '<a class="door" href="/' + k + '/" data-c="' + k + '" data-key="' + k + '"><span class="name">' + esc(s[k].label) + '</span><p class="what">' + esc(s[k].blurb) + '</p>' + ICON[k] + '</a>'; }).join('') +
      '</nav></section>' +
      (list(site.now).length ? '<section class="block" aria-labelledby="nowTitle"><div class="sec-head"><h2 id="nowTitle">Right now</h2></div><div class="now">' +
        list(site.now).map(function (n) { return '<a class="now-card" href="' + esc(n.link || '#') + '"><h3>' + esc(n.heading) + '</h3><p>' + esc(n.text) + '</p></a>'; }).join('') + '</div></section>' : '') +
      '</div>';
    startFields();
    var hero = fields[0], answer = $('#answer'), choices = $$('.choice');
    choices.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.key, again = b.getAttribute('aria-pressed') === 'true';
        choices.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        if (again) { root.removeAttribute('data-pick'); answer.innerHTML = ''; hero.setMode('all'); return; }
        b.setAttribute('aria-pressed', 'true'); root.setAttribute('data-pick', k);
        answer.innerHTML = '<div class="answer-card"><svg class="glyph" viewBox="0 0 100 100" aria-hidden="true">' + GLYPH[k] + '</svg><h3>' + esc(s[k].label) + '</h3><p>' + esc(s[k].blurb) + '</p><a class="go-btn" href="/' + k + '/">' + esc(s[k].cta) + '</a></div>';
        hero.setMode(k); fields.forEach(function (f) { f.colors(); });
      });
    });
    // photo preview that follows the cursor over the Explore list
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
      document.body.insertAdjacentHTML('beforeend', '<div class="peek ph" id="peek" aria-hidden="true"></div>');
      var peek = $('#peek'), on = false, tx = 0, ty = 0, px = 0, py = 0, raf = null;
      var loop = function () { px += (tx - px) * .18; py += (ty - py) * .18; var rot = Math.max(-8, Math.min(8, (tx - px) * .06)); peek.style.transform = 'translate3d(' + (px + 24) + 'px,' + (py - 90) + 'px,0) rotate(' + rot + 'deg)'; raf = on ? requestAnimationFrame(loop) : null; };
      $$('.door').forEach(function (d) {
        d.addEventListener('mouseenter', function (e) { peek.innerHTML = cartoon(PEEK[d.dataset.key]); peek.classList.add('show'); if (!on) { px = tx = e.clientX; py = ty = e.clientY; } on = true; if (!raf) raf = requestAnimationFrame(loop); });
        d.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
        d.addEventListener('mouseleave', function () { on = false; peek.classList.remove('show'); });
      });
    }
  }

  /* ======================= MIND ======================= */
  var TYPE_NAMES = { project: 'Project', writing: 'Writing', video: 'Video', course: 'Course', certificate: 'Certificate' };
  function renderMind(site, d) {
    var c = d.current || {}, lib = list(d.library);
    var types = ['all'].concat(Object.keys(TYPE_NAMES).filter(function (t) { return lib.some(function (x) { return x.type === t; }); }));
    $('#main').innerHTML = '<div class="wrap">' + pageHead('mind', site.sections.mind.label, d.intro) +
      '<section class="block"><div class="feature">' + ph(c.image, 'chart', '', c.image ? '' : 'Figure from your research', c.title) +
        '<div><span class="kicker">' + esc(c.kicker) + '</span><h3>' + esc(c.title) + '</h3>' + md(c.text) + (c.since ? '<p>' + esc(c.since) + '</p>' : '') +
        (c.link_url ? '<a class="text-link" href="' + esc(c.link_url) + '">' + esc(c.link_label || 'Read more') + '</a>' : '') + '</div></div></section>' +
      '<section class="block"><div class="sec-head"><div><h2>Journey</h2><p class="lede">Tap a step to open it.</p></div></div>' + timeline(d.journey, 'year') + '</section>' +
      '<section class="block"><div class="sec-head"><div><h2>Library</h2><p class="lede">Projects, writing, concept videos, courses and certificates.</p></div>' +
        '<div class="tabs" role="tablist" aria-label="Filter library" id="libTabs">' + types.map(function (t, i) { return '<button class="tab" role="tab" aria-selected="' + (i === 0) + '" data-v="' + t + '">' + (t === 'all' ? 'All' : TYPE_NAMES[t]) + '</button>'; }).join('') + '</div></div>' +
        '<ul class="library" id="library">' + lib.map(function (x) {
          var href = (x.body || x.video_url) ? '/post/?from=mind&id=' + encodeURIComponent(x.id) : (x.link || '');
          var cover = '<div class="thumb-wrap">' + ph(x.image, x.tone || 'desk', '', '', x.title) + (x.type === 'video' ? '<span class="play" aria-hidden="true"></span>' : '') + '</div>';
          var body = '<div class="body"><span class="type">' + esc(TYPE_NAMES[x.type] || x.type) + (x.meta ? ', ' + esc(x.meta) : '') + '</span><h3>' + esc(x.title) + '</h3><p>' + esc(x.summary) + '</p></div>';
          var inner = href ? '<a class="cover-link" href="' + esc(href) + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '') + '>' + cover + body + '</a>' : cover + body;
          return '<li class="lib-item" data-t="' + esc(x.type) + '">' + inner + '</li>';
        }).join('') + '</ul></section></div>';
    tabs($('#libTabs'), function (v) { $$('#library .lib-item').forEach(function (li) { li.hidden = !(v === 'all' || li.dataset.t === v); }); });
    startFields();
  }

  /* ======================= MOVEMENT ======================= */
  function renderMovement(site, d) {
    var strands = list(d.strands), b = d.breathing || {};
    var phases = [{ name: 'Breathe in', secs: +b.inhale || 4, scale: 1 }, { name: 'Hold', secs: +b.hold || 0, scale: 1 }, { name: 'Breathe out', secs: +b.exhale || 6, scale: .5 }].filter(function (p) { return p.secs > 0; });
    var roundsTarget = +b.rounds || 5;
    var fill = ['hills', 'desk', 'sea'];
    $('#main').innerHTML = '<div class="wrap">' + pageHead('movement', site.sections.movement.label, d.intro) + '<div class="mv-grid"><div>' +
      '<section class="block"><div class="sec-head"><h2>Practice</h2></div><div class="tabs" role="tablist" aria-label="Practice" id="strandTabs">' +
        strands.map(function (s, i) { return '<button class="tab" role="tab" aria-selected="' + (i === 0) + '" data-v="' + i + '">' + esc(s.label) + '</button>'; }).join('') + '</div>' +
        strands.map(function (s, i) {
          var photos = list(s.photos);
          var strip = [0, 1, 2].map(function (j) { return ph(photos[j], j === 0 ? s.tone : fill[j], '', j === 0 && !photos[0] ? s.label + ' photo' : '', s.label); }).join('');
          return '<div class="strand" data-v="' + i + '"' + (i ? ' hidden' : '') + '>' + md(s.text) + '<ul class="chips">' + list(s.chips).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul><div class="strip">' + strip + '</div></div>';
        }).join('') + '</section>' +
      '<section class="block"><div class="two-col"><div><h2>Certifications</h2><ul class="rows">' + list(d.certifications).map(function (c) { return '<li><div><b>' + esc(c.name) + '</b><small>' + esc(c.detail) + '</small></div><span>' + esc(c.year) + '</span></li>'; }).join('') + '</ul></div>' +
        '<div><h2>Events</h2><ul class="rows">' + list(d.events).map(function (e) { return '<li><div><b>' + esc(e.title) + '</b><small>' + esc(e.place) + '</small></div><span>' + esc(e.date) + '</span></li>'; }).join('') + '</ul></div></div></section>' +
      '<section class="block"><div class="sec-head"><div><h2>People I’ve learnt from</h2><p class="lede">Tap a card to see what each person taught me.</p></div></div><div class="people">' +
        list(d.people).map(function (p) { return '<button class="flip" aria-pressed="false"><span class="flip-in"><span class="face">' + ph(p.image, 'person', '', '', p.name) + '<b>' + esc(p.name) + '</b><span class="s">' + esc(p.role) + '</span></span><span class="face back"><b>What I learnt</b><p>' + esc(p.lesson) + '</p></span></span></button>'; }).join('') + '</div></section>' +
      (list(d.thoughts).length ? '<section class="block"><div class="sec-head"><h2>Thoughts</h2></div><ul class="rows">' + list(d.thoughts).map(function (t) { var inner = '<div><b>' + esc(t.title) + '</b><small>' + esc(t.summary) + '</small></div><span>Read</span>'; return '<li>' + (t.body ? '<a href="/post/?from=movement&id=' + encodeURIComponent(t.id) + '" style="display:contents;text-decoration:none">' + inner + '</a>' : inner) + '</li>'; }).join('') + '</ul></section>' : '') +
      '</div><aside class="aside block" aria-labelledby="brTitle"><div class="breathe"><h3 id="brTitle">Take a minute</h3><p>' + (function (t) { return t.charAt(0).toUpperCase() + t.slice(1); })(phases.map(function (p) { return p.name.split(' ').pop().toLowerCase() + ' for ' + p.secs; }).join(', ')) + '. ' + roundsTarget + ' rounds.</p>' +
        '<div class="orb-stage"><div class="orb-ring" aria-hidden="true"></div><div class="orb" id="orb" aria-hidden="true"></div><div class="cue" id="cue" aria-live="polite"><strong>Ready</strong><span>&nbsp;</span></div></div>' +
        '<div class="btn-row"><button class="btn" id="breatheBtn">Start</button><button class="btn ghost" id="breatheReset">Reset</button></div><div class="rounds" id="rounds" aria-live="polite"></div></div></aside></div></div>';
    tabs($('#strandTabs'), function (v) { $$('.strand').forEach(function (el) { el.hidden = el.dataset.v !== v; }); });
    // breathing guide
    var orb = $('#orb'), cue = $('#cue'), btn = $('#breatheBtn'), roundsEl = $('#rounds');
    var running = false, idx = 0, left = 0, timer = null, rounds = 0;
    function setCue(a, n) { cue.innerHTML = '<strong></strong><span></span>'; $('strong', cue).textContent = a; $('span', cue).textContent = n; }
    function phase() { var p = phases[idx]; left = p.secs; orb.style.transitionDuration = (reduce ? 0 : p.secs) + 's'; orb.style.transform = 'scale(' + (reduce ? .8 : p.scale) + ')'; setCue(p.name, left); }
    function stop() { running = false; btn.textContent = 'Start'; clearInterval(timer); timer = null; }
    function tick() { left -= 1; if (left > 0) { $('span', cue).textContent = left; return; } idx += 1; if (idx >= phases.length) { idx = 0; rounds += 1; roundsEl.textContent = rounds === 1 ? '1 round done' : rounds + ' rounds done'; if (rounds >= roundsTarget) { stop(); setCue('Well done', ''); roundsEl.textContent = rounds + ' rounds done. Notice how you feel.'; return; } } phase(); }
    btn.addEventListener('click', function () { if (running) { stop(); setCue('Paused', ''); return; } if (rounds >= roundsTarget) { rounds = 0; roundsEl.textContent = ''; } running = true; btn.textContent = 'Pause'; phase(); timer = setInterval(tick, 1000); });
    $('#breatheReset').addEventListener('click', function () { stop(); idx = 0; rounds = 0; roundsEl.textContent = ''; orb.style.transitionDuration = '.8s'; orb.style.transform = 'scale(.5)'; setCue('Ready', '\u00a0'); });
    startFields();
  }

  /* ======================= BAHJA ======================= */
  function renderBahja(site, d) {
    var st = d.story || {}, series = list(d.series);
    $('#main').innerHTML = '<div class="wrap">' + pageHead('bahja', site.sections.bahja.label, d.intro, d.arabic ? '<span class="ar" lang="ar">' + esc(d.arabic) + '</span>' : '') +
      '<section class="block"><div class="story"><div class="story-photo" id="storyPhoto">' + ph(st.image, st.tone || 'sea', 'fill', '', st.caption) +
        list(st.hotspots).map(function (h, i) { return '<button class="hotspot" style="left:' + (+h.x || 50) + '%;top:' + (+h.y || 50) + '%" aria-expanded="false" data-i="' + i + '"><span class="sr">' + esc(h.title) + '</span></button>'; }).join('') +
        '<div class="note" id="note" role="dialog" aria-label="Photo note"><button class="close" aria-label="Close note">×</button><h4 id="noteTitle"></h4><p id="noteText"></p></div></div>' +
        '<div class="story-copy"><h3>' + esc(st.title) + '</h3><p>Tap the glowing dots to open the story behind the picture.</p>' + md(st.caption) + '</div></div></section>' +
      '<section class="block"><div class="sec-head"><div><h2>Series</h2><p class="lede">Open a series to view it full screen. Use the arrow keys to move through it.</p></div></div><div class="series">' +
        series.map(function (s, i) { var n = list(s.photos).length; return '<button class="serie" data-i="' + i + '">' + ph(s.cover || (list(s.photos)[0] || {}).image, s.tone, '', '', s.title) + '<b>' + esc(s.title) + '</b><br><span>' + esc(s.subtitle) + (n ? ', ' + n + ' photos' : '') + '</span></button>'; }).join('') +
      '</div></section>' +
      '<section class="block"><div class="cta-band">' + ph('', 'road') + '<div><h3>Want to go where these were taken?</h3><p>Every trip lives on the Travel map, with full itineraries.</p></div><a class="go-btn" href="/travel/">Open the travel map</a></div></section></div>';
    // hotspots
    var photo = $('#storyPhoto'), note = $('#note'), current = null, spots = $$('.hotspot'), hs = list(st.hotspots);
    function closeNote() { note.classList.remove('open'); spots.forEach(function (s) { s.setAttribute('aria-expanded', 'false'); }); current = null; }
    spots.forEach(function (spot) {
      spot.addEventListener('click', function (e) {
        e.stopPropagation(); if (current === spot) { closeNote(); return; }
        var h = hs[+spot.dataset.i]; spots.forEach(function (s) { s.setAttribute('aria-expanded', s === spot ? 'true' : 'false'); });
        $('#noteTitle').textContent = h.title; $('#noteText').textContent = h.text;
        var x = +h.x || 50, y = +h.y || 50, pw = photo.clientWidth, phh = photo.clientHeight, nw = Math.min(280, pw - 24);
        var left = (x / 100) * pw + 24; if (left + nw > pw - 12) left = (x / 100) * pw - nw - 24;
        note.style.left = Math.max(12, left) + 'px'; note.style.top = Math.max(12, Math.min((y / 100) * phh - 30, phh - 170)) + 'px';
        note.classList.add('open'); current = spot;
      });
    });
    $('.close', note).addEventListener('click', closeNote);
    note.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { if (current) closeNote(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && current) { var s = current; closeNote(); s.focus(); } });
    // series lightbox
    $$('.serie').forEach(function (b) {
      b.addEventListener('click', function () {
        var s = series[+b.dataset.i], photos = list(s.photos).map(function (p) { return { image: p.image, caption: p.caption, tone: s.tone }; });
        if (!photos.length) photos = ['sea', 'hills', 'mountains', 'road', 'city', 'desk'].map(function (t) { return { tone: t, caption: s.title + ' (placeholder)' }; });
        lightbox(photos, s.title, 0, b);
      });
    });
    startFields();
  }

  /* ======================= TRAVEL ======================= */
  var TYPE_LABEL = { itinerary: 'Itinerary', roadtrip: 'Road trip', place: 'Place to visit' };
  var TYPE_COLOR = { itinerary: '--terracotta', roadtrip: '--sand', place: '--sage' };
  function pinSVG(color) { return '<svg viewBox="-15 -40 30 41" aria-hidden="true"><path d="M0 0 C-8 -11 -13 -18 -13 -25 A13 13 0 1 1 13 -25 C13 -18 8 -11 0 0Z" fill="' + color + '" stroke="rgba(0,0,0,.18)"/><circle cx="0" cy="-25" r="5" fill="#FFFDF9"/></svg>'; }
  function pointsOf(it) { return it.type === 'roadtrip' ? list(it.stops).map(function (s) { return [+s.lat, +s.lng]; }) : [[+it.lat, +it.lng]]; }
  function validItem(it) { return it && it.id && (it.type === 'roadtrip' ? list(it.stops).length >= 2 : isFinite(+it.lat) && isFinite(+it.lng)); }
  function tagHTML(type) { return '<span class="tag k-' + type + '" style="display:inline-block;font-size:.9rem;font-weight:700;color:var(--surface);background:var(' + TYPE_COLOR[type] + ');border-radius:999px;padding:1px 10px">' + TYPE_LABEL[type] + '</span>'; }
  function tripHref(it) { return '/trip/?id=' + encodeURIComponent(it.id); }

  function renderTravel(site, d) {
    var items = list(d.items).filter(validItem), BY = {};
    items.forEach(function (it) { BY[it.id] = it; });
    var areas = []; items.forEach(function (it) { if (it.area && areas.indexOf(it.area) === -1) areas.push(it.area); });
    $('#main').innerHTML = '<div class="wrap">' + pageHead('travel', site.sections.travel.label, d.intro) +
      '<section class="block"><h2 class="sr">Travel map</h2><div class="map-tools">' +
        '<div class="tabs" role="group" aria-label="Show on map" id="kindTabs">' + ['all', 'itinerary', 'roadtrip', 'place'].map(function (k, i) { return '<button class="tab" aria-pressed="' + (i === 0) + '" data-v="' + k + '">' + (k === 'all' ? 'Everything' : k === 'place' ? 'Places to visit' : TYPE_LABEL[k] + 's') + '</button>'; }).join('') + '</div>' +
        '<div class="tabs" role="group" aria-label="Jump to region" id="areaTabs"><button class="tab" data-v="">Whole map</button>' + areas.map(function (a) { return '<button class="tab" data-v="' + esc(a) + '">' + esc(a) + '</button>'; }).join('') + '</div></div>' +
        '<div class="atlas-wrap"><div class="atlas" id="atlas"><div id="map" role="region" aria-label="Interactive travel map"></div></div><aside class="info" id="info" aria-live="polite"></aside></div></section>' +
      '<section class="block"><div class="sec-head"><div><h2>Everything on the map</h2><p class="lede">Uses the same filter as the map. Each itinerary has its own page.</p></div></div><div class="tcards" id="tcards">' +
        items.map(function (it) { return '<article class="tcard" data-type="' + it.type + '">' + ph(it.image, it.tone, '', '', it.name) + '<div class="body">' + tagHTML(it.type) + '<h3>' + esc(it.name) + '</h3><p class="where">' + esc(it.where) + '</p><p>' + esc(it.blurb) + '</p><div class="acts"><button class="ghost-btn" data-show="' + esc(it.id) + '">Show on map</button>' + (it.has_page ? '<a class="go-btn" href="' + tripHref(it) + '">Open itinerary</a>' : '') + '</div></div></article>'; }).join('') +
      '</div></section></div>';
    startFields();

    var info = $('#info'), kind = 'all', selected = null, map = null, layers = {};
    var LEGEND = '<h3>Explore the map</h3><p>Tap a pin or a dashed road to see details. Scroll or pinch to zoom, drag to move.</p><ul class="legend">' +
      '<li><svg viewBox="-15 -40 30 41">' + pinSVG('#B65A36').replace(/<\/?svg[^>]*>/g, '') + '</svg>Itinerary, with its own page</li>' +
      '<li><svg viewBox="0 0 28 28"><path d="M3 22 L12 12 L18 16 L25 5" fill="none" stroke="#9C7843" stroke-width="3" stroke-dasharray="4 3" stroke-linecap="round"/></svg>Road trip</li>' +
      '<li><svg viewBox="-15 -40 30 41">' + pinSVG('#657D60').replace(/<\/?svg[^>]*>/g, '') + '</svg>Place to visit</li></ul>';
    function infoHTML(it) {
      var facts = list(it.facts).map(function (f) { return '<dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd>'; }).join('');
      return '<button class="x" aria-label="Close details">×</button>' + ph(it.image, it.tone, '', '', it.name) + tagHTML(it.type) + '<h3>' + esc(it.name) + '</h3><p class="where">' + esc(it.where) + '</p><p>' + esc(it.blurb) + '</p>' +
        (facts ? '<dl class="facts">' + facts + '</dl>' : '') + '<div class="acts">' + (it.has_page ? '<a class="go-btn" href="' + tripHref(it) + '">Open itinerary</a>' : '<span class="soon">Itinerary coming soon</span>') + '<button class="ghost-btn" data-zoom="' + esc(it.id) + '">Zoom here</button></div>';
    }
    function flyTo(pts) {
      if (!map) return;
      var desk = window.innerWidth > 860;
      var b = L.latLngBounds(pts);
      map.flyToBounds(b, { paddingTopLeft: [40, 40], paddingBottomRight: [desk ? 370 : 40, 40], maxZoom: pts.length > 1 ? 10 : 11, duration: reduce ? 0 : 1 });
    }
    function select(id, fly) {
      selected = id ? BY[id] : null;
      items.forEach(function (it) { var L2 = layers[it.id]; if (L2 && L2.pin) { var el = L2.pin.getElement(); if (el) el.classList.toggle('active', !!selected && selected.id === it.id); } if (L2 && L2.line) L2.line.setStyle({ weight: selected && selected.id === it.id ? 6 : 4 }); });
      info.innerHTML = selected ? infoHTML(selected) : LEGEND;
      if (selected && fly) flyTo(pointsOf(selected));
    }
    info.addEventListener('click', function (e) { if (e.target.closest('.x')) { select(null); return; } var z = e.target.closest('[data-zoom]'); if (z) flyTo(pointsOf(BY[z.dataset.zoom])); });

    if (window.L) {
      map = L.map('map', { worldCopyJump: true, zoomSnap: .5 });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
      var terr = cssVar('--terracotta') || '#B65A36';
      items.forEach(function (it) {
        var group = L.layerGroup(), entry = { group: group };
        if (it.type === 'roadtrip') {
          var pts = pointsOf(it);
          entry.line = L.polyline(pts, { color: terr, weight: 4, dashArray: '6 8', lineCap: 'round' }).addTo(group);
          entry.line.on('click', function () { select(it.id, true); });
          list(it.stops).forEach(function (s, i) {
            var m = L.circleMarker([+s.lat, +s.lng], { radius: 6, color: terr, weight: 2.5, fillColor: '#FFFDF9', fillOpacity: 1 }).addTo(group);
            m.bindTooltip(esc(s.name), { direction: 'top', className: 'stop-tip', offset: [0, -6] });
            m.on('click', function () { select(it.id, true); });
          });
        } else {
          var color = it.type === 'itinerary' ? '#B65A36' : '#657D60';
          entry.pin = L.marker([+it.lat, +it.lng], { icon: L.divIcon({ className: 'pin-icon', html: pinSVG(color), iconSize: [30, 40], iconAnchor: [15, 40] }), title: it.name, alt: it.name, keyboard: true, riseOnHover: true }).addTo(group);
          entry.pin.bindTooltip(esc(it.name), { direction: 'top', className: 'stop-tip', offset: [0, -40] });
          entry.pin.on('click', function () { select(it.id, true); });
        }
        group.addTo(map); layers[it.id] = entry;
      });
      var all = []; items.forEach(function (it) { all = all.concat(pointsOf(it)); });
      if (all.length) map.fitBounds(all, { padding: [40, 40], maxZoom: 6 }); else map.setView([15, 100], 3);
      $$('#areaTabs .tab').forEach(function (b) { b.addEventListener('click', function () { var pts = []; items.forEach(function (it) { if (!b.dataset.v || it.area === b.dataset.v) pts = pts.concat(pointsOf(it)); }); if (pts.length) map.flyToBounds(pts, { padding: [40, 40], maxZoom: 9, duration: reduce ? 0 : 1 }); }); });
    } else {
      $('#atlas').innerHTML = '<div class="map-msg">The map couldn’t load right now. Everything is listed below.</div>';
    }
    function setKind(k) {
      kind = k;
      $$('#kindTabs .tab').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === k ? 'true' : 'false'); });
      items.forEach(function (it) { var show = k === 'all' || it.type === k, e = layers[it.id]; if (map && e) { if (show) e.group.addTo(map); else map.removeLayer(e.group); } });
      $$('#tcards .tcard').forEach(function (c) { c.hidden = !(k === 'all' || c.dataset.type === k); });
      if (selected && k !== 'all' && selected.type !== k) select(null);
    }
    $$('#kindTabs .tab').forEach(function (b) { b.addEventListener('click', function () { setKind(b.dataset.v); }); });
    $('#tcards').addEventListener('click', function (e) {
      var b = e.target.closest('[data-show]'); if (!b) return;
      var it = BY[b.dataset.show]; if (kind !== 'all' && kind !== it.type) setKind('all');
      $('#atlas').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      setTimeout(function () { select(it.id, true); }, reduce ? 0 : 400);
    });
    var focus = qs('focus');
    if (focus && BY[focus]) setTimeout(function () { $('#atlas').scrollIntoView({ block: 'center' }); select(focus, true); }, 200); else select(null);
  }

  /* ======================= ITINERARY PAGE ======================= */
  function renderTrip(site, d) {
    var it = list(d.items).filter(function (x) { return x.id === qs('id'); })[0];
    if (!it || !validItem(it)) { $('#main').innerHTML = '<div class="wrap oops"><h1>Trip not found</h1><p><a class="text-link" href="/travel/">Back to the travel map</a></p></div>'; return; }
    document.title = it.name + ' | ' + site.name;
    var photos = list(it.photos), fill = ['hills', 'mountains'];
    var facts = list(it.facts).slice(0, 4).map(function (f) { return '<div><span>' + esc(f.label) + '</span><b>' + esc(f.value) + '</b></div>'; }).join('');
    $('#main').innerHTML = '<div class="wrap"><div class="trip-top"><a class="back-link" href="/travel/">Back to the travel map</a>' +
      '<div class="trip-hero">' + ph(it.image, it.tone, '', '', it.name) + '<div class="cap"><span class="sample">' + TYPE_LABEL[it.type] + '</span><h1>' + esc(it.name) + '</h1><p>' + esc(it.tagline || it.blurb) + '</p></div></div>' +
      (facts ? '<div class="fact-row">' + facts + '</div>' : '') + '</div>' +
      '<div class="trip-grid"><div>' +
        (it.intro ? '<section class="block"><h2>Why go</h2><div class="prose">' + md(it.intro) + '</div></section>' : '') +
        (list(it.days).length ? '<section class="block"><div class="sec-head"><div><h2>Day by day</h2><p class="lede">Tap a day to open it.</p></div></div>' + timeline(it.days, 'label') + '</section>' : '') +
        '<section class="block"><h2>Photos from the trip</h2><div class="strip" style="margin-top:18px">' + [0, 1, 2].map(function (j) { return ph(photos[j], j ? fill[j - 1] : it.tone, '', j === 0 && !photos[0] ? 'Trip photo' : '', it.name); }).join('') + '</div></section>' +
      '</div><aside class="trip-aside block"><div class="mini"><div id="miniMap" style="height:260px"></div><div class="acts"><a class="go-btn" href="/travel/?focus=' + encodeURIComponent(it.id) + '">See on the big map</a></div></div>' +
        (list(it.nearby).length ? '<div class="box"><h3>Nearby</h3><ul class="chips" style="margin:0">' + list(it.nearby).map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul></div>' : '') +
        (it.notes ? '<div class="box"><h3>Notes and tips</h3><div class="lede">' + md(it.notes) + '</div></div>' : '') +
      '</aside></div></div>';
    if (window.L) {
      var pts = pointsOf(it), terr = cssVar('--terracotta') || '#B65A36';
      var m = L.map('miniMap', { scrollWheelZoom: false, attributionControl: true, zoomControl: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(m);
      if (pts.length > 1) L.polyline(pts, { color: terr, weight: 4, dashArray: '6 8' }).addTo(m);
      pts.forEach(function (p, i) { var c = L.circleMarker(p, { radius: 6, color: terr, weight: 2.5, fillColor: '#FFFDF9', fillOpacity: 1 }).addTo(m); var name = it.type === 'roadtrip' ? list(it.stops)[i].name : it.name; c.bindTooltip(esc(name), { direction: 'top', className: 'stop-tip', offset: [0, -6] }); });
      if (pts.length > 1) m.fitBounds(pts, { padding: [24, 24] }); else m.setView(pts[0], 11);
    } else { $('#miniMap').innerHTML = '<div class="map-msg" style="position:static;height:100%">Map unavailable right now.</div>'; }
  }

  /* ======================= POST PAGE ======================= */
  function ytEmbed(u) { var m = String(u || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? 'https://www.youtube-nocookie.com/embed/' + m[1] : ''; }
  function renderPost(site, d) {
    var from = qs('from') === 'movement' ? 'movement' : 'mind';
    var pool = from === 'movement' ? list(d.thoughts) : list(d.library);
    var p = pool.filter(function (x) { return x.id === qs('id'); })[0];
    var back = '/' + from + '/', backLabel = 'Back to ' + site.sections[from].label;
    if (!p) { $('#main').innerHTML = '<div class="wrap oops"><h1>Not found</h1><p><a class="text-link" href="' + back + '">' + esc(backLabel) + '</a></p></div>'; return; }
    document.title = p.title + ' | ' + site.name;
    var vid = ytEmbed(p.video_url);
    $('#main').innerHTML = '<div class="wrap"><article class="post"><a class="back-link" href="' + back + '">' + esc(backLabel) + '</a>' +
      '<p class="meta">' + esc(TYPE_NAMES[p.type] || 'Thoughts') + (p.meta ? ', ' + esc(p.meta) : '') + '</p><h1>' + esc(p.title) + '</h1>' + (p.summary ? '<p class="lede">' + esc(p.summary) + '</p>' : '') +
      (vid ? '<div class="video"><iframe src="' + vid + '" title="' + esc(p.title) + '" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>' : (p.image ? ph(p.image, '', 'cover', '', p.title) : '')) +
      '<div class="prose">' + md(p.body) + '</div>' + (p.link ? '<p><a class="go-btn" href="' + esc(p.link) + '" target="_blank" rel="noopener">Open link</a></p>' : '') + '</article></div>';
  }

  /* ---------- Boot ---------- */
  function getJSON(name) { return fetch('/content/' + name + '.json', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(name); return r.json(); }); }
  var DATA = { mind: 'mind', movement: 'movement', bahja: 'bahja', travel: 'travel', trip: 'travel', post: qs('from') === 'movement' ? 'movement' : 'mind' };
  var RENDER = { home: renderHome, mind: renderMind, movement: renderMovement, bahja: renderBahja, travel: renderTravel, trip: renderTrip, post: renderPost };
  var NAV = { trip: 'travel', post: DATA.post };
  root.setAttribute('data-path', NAV[page] || page);
  Promise.all([getJSON('site'), DATA[page] ? getJSON(DATA[page]) : Promise.resolve(null)]).then(function (res) {
    var site = res[0], d = res[1] || {};
    $('#siteHeader').innerHTML = header(site, NAV[page] || page);
    $('#siteFooter').innerHTML = footer(site);
    RENDER[page](site, d);
    bindTheme();
  }).catch(function (err) {
    console.error(err);
    $('#main').innerHTML = '<div class="wrap oops"><h1>Something went wrong</h1><p>The page content couldn’t load. Please refresh in a moment.</p></div>';
  });
})();
