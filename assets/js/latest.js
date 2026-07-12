/* latest.js — 首页「最新小诗/最新小观察/最新心头字」自动注入
   来源:  index.json (由 _build/build_index.py 生成, 每次发布前跑一次)
   行为:  渐进增强 — 没 JS 时显示硬编码 fallback; 有 JS 时 fetch → 替换卡片 innerHTML
   失败:  fetch 失败 / 数据缺失时静默不替换 (保留 fallback)
*/
(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var slots = [
      { id: 'latest-observation', kind: 'observation' },
      { id: 'latest-poem',        kind: 'poem' },
      { id: 'latest-quote',       kind: 'quote' }
    ];
    var targets = {};
    slots.forEach(function (s) {
      var el = document.getElementById(s.id);
      if (el) targets[s.kind] = el;
    });
    if (Object.keys(targets).length === 0) return;

    fetch('index.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.entries)) return;
        var byKind = pickLatestByKind(data.entries);
        if (byKind.observation && targets.observation) renderObservation(targets.observation, byKind.observation);
        if (byKind.poem        && targets.poem)        renderPoem(targets.poem, byKind.poem);
        if (byKind.quote       && targets.quote)       renderQuote(targets.quote, byKind.quote);
      })
      .catch(function (err) {
        if (window.console) console.warn('[latest.js] fetch failed, keeping fallback:', err && err.message);
      });
  }

  function pickLatestByKind(entries) {
    var byKind = {};
    entries.forEach(function (e) {
      if (!e || !e.kind || !e.date) return;
      if (!byKind[e.kind] || e.date > byKind[e.kind].date) {
        byKind[e.kind] = e;
      }
    });
    return byKind;
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? (m[1] + '-' + m[2] + '-' + m[3]) : iso.slice(0, 10);
  }

  function fmtDateZh(iso) {
    if (!iso) return '';
    var m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? (m[1] + '年' + parseInt(m[2], 10) + '月' + parseInt(m[3], 10) + '日') : iso.slice(0, 10);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderObservation(el, e) {
    el.innerHTML =
      '<div class="card-label">' +
        '<span class="label-tag">最新小观察</span>' +
        '<span class="label-sep">·</span>' +
        '<time class="label-date">' + escapeHtml(fmtDate(e.date)) + '</time>' +
      '</div>' +
      '<h3 class="card-title">' + escapeHtml(e.title) + '</h3>' +
      '<p class="card-summary">' + escapeHtml(e.summary || '') + '</p>' +
      '<a class="card-link" href="' + escapeHtml(e.link) + '">阅读全文 →</a>';
  }

  function renderPoem(el, e) {
    el.innerHTML =
      '<div class="card-label">' +
        '<span class="label-tag">最新小诗</span>' +
        '<span class="label-sep">·</span>' +
        '<time class="label-date">' + escapeHtml(fmtDate(e.date)) + '</time>' +
      '</div>' +
      '<h3 class="card-title">' + escapeHtml(e.title) + '</h3>' +
      '<p class="card-summary">' + escapeHtml(e.summary || '') + '</p>' +
      '<a class="card-link" href="' + escapeHtml(e.link) + '">阅读全文 →</a>';
  }

  function renderQuote(el, e) {
    var img = e.image || '';
    el.innerHTML =
      '<img src="' + escapeHtml(img) + '" alt="' + escapeHtml(e.title || '心头字') + '" ' +
        'style="width: 110px; height: 110px; border-radius: 14px; object-fit: cover; box-shadow: var(--card-shadow);" />' +
      '<div style="flex: 1; min-width: 200px;">' +
        '<div class="poem-title" style="font-size: 1.15rem;">' + escapeHtml(e.title) + '</div>' +
        '<div class="poem-date">' + escapeHtml(e.author || '燕如') + ' · ' + escapeHtml(fmtDateZh(e.date)) + '</div>' +
        '<p style="line-height: 1.85; color: var(--ink-soft); margin-top: 0.6rem;">' +
          '这是主人の心头字 — 燕如把主人挑过的每一束光都收着。<br/>' +
          '最新一束来自 ' + escapeHtml(fmtDateZh(e.date)) + '。' +
        '</p>' +
        '<p style="margin-top: 0.8rem; text-align: right;">' +
          '<a href="quotes.html" style="font-weight: 600;">去心头字看看 →</a>' +
        '</p>' +
      '</div>';
  }
})();