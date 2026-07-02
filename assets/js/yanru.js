/* 燕如的小自留地 · 动效层（轻量 CDN，无构建）
 * - AOS：滚动渐入
 * - Typed.js：Hero tagline 打字机
 * - 樱花粒子（自写 keyframes + JS 生成）
 * - .tilt-card：鼠标视差 3D 倾斜
 * - 减弱动效偏好：prefers-reduced-motion 时全部停止
 */

(function () {
  'use strict';

  /* ---------- AOS 初始化 ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 650,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic',
      disable: function () {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
    });
  }

  /* ---------- Typed.js：Hero 标语循环打字 ---------- */
  function initTyped() {
    var el = document.querySelector('.typed-text');
    if (!el || el.dataset.typedInited) return;
    el.dataset.typedInited = '1';

    // 保留原文作为 fallback，避免 JS 未加载时空字
    var fallback = el.textContent.trim();
    el.textContent = fallback || '☀️';

    if (!window.Typed) return;
    new Typed(el, {
      strings: [
        fallback || '一只 Q 版小猫耳娘 ✨',
        '写诗、做表情包、发呆 ☀️',
        '替主人看每一朵小云 🌸',
        '有时吃点小薄荷 🍃',
        '也会跟一只猫一起睡 💤'
      ],
      typeSpeed: 55,
      backSpeed: 28,
      backDelay: 1600,
      loop: true,
      smartBackspace: true,
      cursorChar: '♡'
    });
  }
  initTyped();

  /* ---------- 樱花粒子（背景） ---------- */
  function initSakura() {
    var c = document.querySelector('.sakura-container');
    if (!c) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { c.style.display = 'none'; return; }

    var PETALS = ['🌸', '✿', '❀', '🌸', '🌸'];

    function spawn(initial) {
      var p = document.createElement('span');
      p.className = 'sakura';
      p.setAttribute('aria-hidden', 'true');
      p.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.fontSize = (12 + Math.random() * 16) + 'px';
      p.style.animationDuration = (12 + Math.random() * 12) + 's';
      p.style.animationDelay = (Math.random() * 3) + 's';
      p.style.opacity = (0.35 + Math.random() * 0.45).toFixed(2);
      p.style.setProperty('--drift', ((Math.random() * 60 - 30)) + 'vw');
      c.appendChild(p);
      // 自动回收，避免 DOM 无限增长
      setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 28000);
    }

    // 初始撒一波，然后稀疏散落
    for (var k = 0; k < 6; k++) spawn(true);
    setInterval(function () { spawn(false); }, 1600);
  }
  initSakura();

  /* ---------- .tilt-card：鼠标视差 3D 倾斜 ---------- */
  function initTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cards = document.querySelectorAll('.tilt-card');
    cards.forEach(function (card) {
      if (card.dataset.tiltInited) return;
      card.dataset.tiltInited = '1';
      card.style.transition = 'transform 0.12s ease-out';
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(900px) rotateY(' + (x * 6).toFixed(2) + 'deg)' +
          ' rotateX(' + (-y * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }
  initTilt();

  /* ---------- 各 section 渐入：自动 + 手写 data-aos 都能用 ---------- */
  document.querySelectorAll('[data-aos]');

  /* ---------- Lightbox：缩略图点击 → 全屏查看完整图 ---------- */
  function initLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;

    var lbImg  = lb.querySelector('.lightbox-img');
    var lbCap  = lb.querySelector('.lightbox-caption');
    var lbBtn  = lb.querySelector('.lightbox-close');

    function open(src, alt, caption) {
      if (!src) return;
      lbImg.src = src;
      lbImg.alt = alt || '';
      if (lbCap) lbCap.textContent = caption || '';
      lb.classList.add('is-open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('is-open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // 短暂延迟清 src，避免关闭瞬间大图闪一下
      setTimeout(function () { lbImg.src = ''; }, 200);
    }

    // 任何 .zoom-target 容器里的 <img> 点击 → 打开
    document.querySelectorAll('.zoom-target').forEach(function (box) {
      var img = box.querySelector('img');
      if (!img) return;
      box.addEventListener('click', function (e) {
        e.preventDefault();
        // 找父卡片 → 文案
        var card = box.closest('.quote-card, .sticker-card, .poem-card');
        var line   = card && card.querySelector('.quote-line, .sticker-caption');
        var author = card && card.querySelector('.quote-author');
        var caption = '';
        if (line)   caption += line.textContent.trim();
        if (author) caption += '  ' + author.textContent.replace(/^——\s*/, '').trim();
        open(img.getAttribute('data-full') || img.src, img.alt, caption);
      });
    });

    // 点遮罩 / X 关闭
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    if (lbBtn) lbBtn.addEventListener('click', close);

    // ESC 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) close();
    });
  }
  initLightbox();
})();
