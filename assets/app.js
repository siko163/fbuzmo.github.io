/* ФБУЗ ЦГИЭ — логика сайта. Этот файл редактировать не нужно.
   Весь изменяемый контент лежит в content.js. */
(function () {
  var S = window.SITE || {};
  var C = S.config || {};
  var page = document.body.getAttribute('data-page') || '';

  var ICONS = {
    record: '📝', docs: '📄', results: '🔬', map: '📍', phone: '📞', mail: '✉️', clock: '🕒', pin: '📍'
  };

  /* --- НАВИГАЦИЯ (одно место для всех страниц) --- */
  var NAV = [
    { id: 'home',     title: 'Главная',        href: 'index.html' },
    { id: 'about',    title: 'Об организации', href: 'ob-organizacii.html' },
    { id: 'uslugi',   title: 'Услуги и цены',  href: 'uslugi.html' },
    { id: 'dokumenty',title: 'Документы',      href: 'dokumenty.html' },
    { id: 'novosti',  title: 'Новости',        href: 'novosti.html' },
    { id: 'kontakty', title: 'Контакты',       href: 'kontakty.html' }
  ];

  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function $(sel, root) { return (root || document).querySelector(sel); }

  /* --- ШАПКА: topbar + header + nav --- */
  function buildHeader() {
    var mount = $('#site-top');
    if (!mount) return;
    var navLinks = NAV.map(function (n) {
      return '<a href="' + n.href + '"' + (n.id === page ? ' class="active"' : '') + '>' + n.title + '</a>';
    }).join('');

    mount.innerHTML =
      // версия для слабовидящих — панель настроек
      '<div class="bvi-panel"><div class="inner">' +
        '<b>Версия для слабовидящих</b>' +
        '<div class="group">Цвет: <button class="sw1" data-scheme="bw">A</button>' +
          '<button class="sw2" data-scheme="wb">A</button>' +
          '<button class="sw3" data-scheme="by">A</button></div>' +
        '<div class="group">Размер: <button class="fz1" data-fs="1">A</button>' +
          '<button class="fz2" data-fs="2">A</button>' +
          '<button class="fz3" data-fs="3">A</button></div>' +
        '<button data-bvi-off>✕ Обычная версия</button>' +
      '</div></div>' +

      '<div class="topbar"><div class="inner">' +
        '<div class="topbar-left">' +
          '<span>Официальный сайт ' + C.orgShort + ' — подведомственная организация Роспотребнадзора</span>' +
          '<button class="bvi-toggle" data-bvi-on>👁 Версия для слабовидящих</button>' +
        '</div>' +
        '<div class="hotline"><span class="label">ГОРЯЧАЯ ЛИНИЯ</span><span>8-800-555-49-43 (бесплатно)</span></div>' +
      '</div></div>' +

      '<header class="site-header"><div class="header-inner">' +
        '<a class="logo-block" href="index.html">' +
          '<span class="logo-img"><img src="assets/logo.jpg" alt="Герб Роспотребнадзора"></span>' +
          '<span class="logo-text-block">' +
            '<span class="logo-title">Центр гигиены<br>и эпидемиологии</span>' +
            '<span class="logo-sub">в Мурманской области</span>' +
          '</span>' +
        '</a>' +
        '<div class="header-contacts">' +
          '<a class="phone-main" href="tel:' + C.phoneHref + '">' + C.phone + '</a>' +
          '<span class="phone-note">' + C.hours + '</span>' +
          '<a class="btn-call" href="' + C.vkUrl + '" target="_blank" rel="noopener">Записаться</a>' +
        '</div>' +
      '</div></header>' +

      '<nav class="site-nav"><div class="nav-inner">' +
        '<div class="nav-links" id="navLinks">' + navLinks + '</div>' +
        '<div class="nav-cta"><a href="' + C.vkUrl + '" target="_blank" rel="noopener">Записаться онлайн</a></div>' +
        '<button class="nav-toggle" id="navToggle" aria-label="Меню"><span></span><span></span><span></span></button>' +
      '</div></nav>';

    // мобильное меню
    var toggle = $('#navToggle'), links = $('#navLinks');
    if (toggle) toggle.addEventListener('click', function () { links.classList.toggle('open'); });

    bindBvi();
  }

  /* --- ПОДВАЛ --- */
  function buildFooter() {
    var mount = $('#site-bottom');
    if (!mount) return;
    var navList = NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.title + '</a></li>'; }).join('') +
      '<li><a href="antikorrupciya.html">Противодействие коррупции</a></li>';
    mount.innerHTML =
      '<footer class="site-footer"><div class="footer-inner">' +
        '<div class="footer-brand">' +
          '<a class="logo-block" href="index.html">' +
            '<span class="logo-img"><img src="assets/logo.jpg" alt=""></span>' +
            '<span class="logo-text-block"><span class="logo-title">' + C.orgShort + '</span></span>' +
          '</a>' +
          '<p>Аккредитованная организация Роспотребнадзора. Санитарно-эпидемиологические исследования и услуги населению и организациям Мурманской области.</p>' +
          '<p style="margin-top:14px">' + ICONS.pin + ' ' + C.address + '<br>' + ICONS.mail + ' <a href="mailto:' + C.email + '" style="color:#9cf">' + C.email + '</a></p>' +
        '</div>' +
        '<div><h4>Разделы</h4><ul>' + navList + '</ul></div>' +
        '<div><h4>Полезные ссылки</h4><ul>' +
          '<li><a href="https://www.rospotrebnadzor.ru" target="_blank" rel="noopener">Роспотребнадзор</a></li>' +
          '<li><a href="https://www.gosuslugi.ru" target="_blank" rel="noopener">Госуслуги</a></li>' +
          '<li><a href="' + C.vkUrl + '" target="_blank" rel="noopener">Мы ВКонтакте</a></li>' +
          '<li><a href="files/politika-personalnyh-dannyh.pdf" target="_blank" rel="noopener">Политика обработки перс. данных</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' ' + C.orgName + '. Все права защищены.</span><span>' + C.siteName + '</span></div>' +
      '</footer>';
  }

  /* --- ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ --- */
  function store(k, v) { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function bindBvi() {
    var root = document.documentElement;
    function setScheme(s) { root.classList.remove('scheme-bw', 'scheme-wb', 'scheme-by'); if (s) root.classList.add('scheme-' + s); store('bvi-scheme', s); }
    function setFs(n) { root.classList.remove('fs-2', 'fs-3'); if (n === '2' || n === '3') root.classList.add('fs-' + n); store('bvi-fs', n); }
    function on() { root.classList.add('bvi'); if (!read('bvi-scheme')) setScheme('bw'); store('bvi', '1'); }
    function off() { root.classList.remove('bvi'); store('bvi', null); }

    document.querySelectorAll('[data-bvi-on]').forEach(function (b) { b.addEventListener('click', on); });
    document.querySelectorAll('[data-bvi-off]').forEach(function (b) { b.addEventListener('click', off); });
    document.querySelectorAll('[data-scheme]').forEach(function (b) { b.addEventListener('click', function () { setScheme(b.getAttribute('data-scheme')); }); });
    document.querySelectorAll('[data-fs]').forEach(function (b) { b.addEventListener('click', function () { setFs(b.getAttribute('data-fs')); }); });

    if (read('bvi') === '1') { root.classList.add('bvi'); setScheme(read('bvi-scheme') || 'bw'); setFs(read('bvi-fs') || '1'); }
  }

  /* --- РЕНДЕР: услуги --- */
  function renderServices(mount, limit) {
    if (!mount) return;
    var list = (S.services || []).slice(0, limit || 99);
    mount.innerHTML = list.map(function (s) {
      return '<a class="svc-card reveal" href="uslugi.html#' + s.key + '">' +
        '<div class="svc-img"><span class="yellow-accent"></span><span class="svc-img-label">' + s.title + '</span></div>' +
        '<div class="svc-body"><p>' + s.desc + '</p><span class="svc-link">Подробнее →</span></div>' +
      '</a>';
    }).join('');
  }

  /* --- РЕНДЕР: новости (карточки) --- */
  function renderNews(mount, limit) {
    if (!mount) return;
    var list = (S.news || []).slice(0, limit || 99);
    mount.innerHTML = list.map(function (n) {
      return '<a class="news-card reveal" href="' + C.vkUrl + '" target="_blank" rel="noopener">' +
        '<div class="news-date">' + n.date + '</div>' +
        '<h3>' + n.title + '</h3>' +
        (n.text ? '<p>' + n.text + '</p>' : '') +
        '<div class="news-more">Читать в сообществе →</div>' +
      '</a>';
    }).join('');
  }

  /* --- РЕНДЕР: прайс --- */
  function renderPrices(mount) {
    if (!mount) return;
    mount.innerHTML = (S.priceGroups || []).map(function (g) {
      var rows = g.items.map(function (it) {
        var tbd = /уточн/i.test(it.price) ? ' tbd' : '';
        return '<div class="price-row"><span class="pn">' + it.name + '</span><span class="pv' + tbd + '">' + it.price + '</span></div>';
      }).join('');
      return '<div class="price-group reveal"><h2>' + g.group + '</h2>' + rows + '</div>';
    }).join('');
  }

  /* --- РЕНДЕР: документы (универсально) --- */
  function renderDocListInto(mount, arr) {
    if (!mount) return;
    mount.innerHTML = '<ul class="doc-list">' + (arr || []).map(function (d) {
      var isImg = /jpg|jpeg|png/i.test(d.type);
      return '<li><span class="doc-icon">' + d.type + '</span>' +
        '<a href="' + d.file + '"' + (d.file !== '#' && !isImg ? ' download' : ' target="_blank" rel="noopener"') + '>' + d.title + '</a>' +
        '<span class="doc-dl">' + (isImg ? 'Открыть ↗' : 'Скачать ↓') + '</span></li>';
    }).join('') + '</ul>';
  }
  function renderDocs(mount) { renderDocListInto(mount, S.documents); }

  /* --- РЕНДЕР: блоки «Об организации» --- */
  function renderAbout() {
    var a = S.about || {};
    var intro = $('#about-intro'); if (intro) intro.textContent = a.intro || '';
    var sched = $('#about-schedule'); if (sched) sched.textContent = a.schedule || '';

    var dir = $('#about-directions');
    if (dir) dir.innerHTML = (a.directions || []).map(function (d) {
      return '<li class="dir-item"><span class="dir-mark"></span>' + d + '</li>';
    }).join('');

    var dep = $('#about-departments');
    if (dep) dep.innerHTML = (S.departments || []).map(function (d) {
      return '<li class="dir-item"><span class="dir-mark"></span>' + d + '</li>';
    }).join('');

    var br = $('#about-branches');
    if (br) br.innerHTML = (S.branches || []).map(function (b) {
      var icon = '<span class="lead-photo" style="background-image:url(\'' + (b.photo || AVATAR_SVG) + '\');width:48px;height:48px"></span>';
      return '<a class="branch-card reveal" href="filial.html?id=' + b.id + '">' + icon +
        '<div><strong style="display:block;font-size:14px">' + b.name + '</strong>' +
        (b.head ? '<span class="branch-head">' + b.head + '</span><br>' : '') +
        '<span class="card-hint">График, контакты, структура →</span>' +
        '</div></a>';
    }).join('');

    var lead = $('#about-leadership');
    if (lead) lead.innerHTML = (S.leadership || []).map(function (p) {
      var img = '<div class="lead-photo" style="background-image:url(\'' + (p.photo || AVATAR_SVG) + '\')"></div>';
      return '<a class="lead-card reveal" href="rukovoditel.html?id=' + p.id + '">' + img +
        '<div class="lead-body"><strong>' + p.name + '</strong><span class="lead-post">' + p.post + '</span>' +
        '<span class="lead-rec">Биография и контакты →</span></div></a>';
    }).join('');

    renderDocListInto($('#disclosure-list'), S.disclosureDocs);
  }

  /* --- РЕНДЕР: противодействие коррупции --- */
  function renderAnticorruption() {
    var ac = S.anticorruption || {};
    var intro = $('#ak-intro'); if (intro) intro.textContent = ac.intro || '';
    var hot = $('#ak-hotline'); if (hot) hot.textContent = ac.hotline || '';
    renderDocListInto($('#ak-list'), ac.docs);
  }

  /* --- РЕНДЕР: страница руководителя (rukovoditel.html?id=...) --- */
  function getParam(name) {
    var m = new RegExp('[?&]' + name + '=([^&]+)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : '';
  }
  /* разбивает строку с одним или несколькими телефонами на отдельные кликабельные номера (каждый — своей строкой) */
  function phoneLinks(raw) {
    if (!raw) return '';
    var s = raw.replace(/тел\.?\s*\/?\s*факс\.?:?/gi, ' ')
               .replace(/тел\.?:?/gi, ' ').replace(/факс\.?:?/gi, ' ')
               .replace(/[\/;]/g, ' ').replace(/\s+/g, ' ');
    var nums = s.match(/\(\s*\d[\d\s]*\)\s*[\d-]+|8[\d-]{9,}|\d[\d-]{4,}/g) || [s];
    var seen = {};
    nums = nums.map(function (n) { return n.replace(/\s+/g, ' ').trim(); })
               .filter(function (n) {
                 if (!n) return false;
                 var key = n.replace(/^\(\s*\d[\d\s]*\)\s*/, '').replace(/\D/g, ''); // номер без кода города
                 if (seen[key]) return false;
                 seen[key] = 1; return true;
               });
    return nums.map(function (n) {
      var tel = n.replace(/[^+\d]/g, '');
      return '<a class="struct-phone" href="tel:' + tel + '">' + n + '</a>';
    }).join('<br>');
  }
  function renderPerson() {
    var mount = $('#person'); if (!mount) return;
    var id = getParam('id');
    var p = (S.leadership || []).filter(function (x) { return x.id === id; })[0] || (S.leadership || [])[0];
    if (!p) { mount.innerHTML = '<p>Информация не найдена.</p>'; return; }
    var crumb = $('#person-crumb'); if (crumb) crumb.textContent = p.post;
    var ttl = $('#person-title'); if (ttl) ttl.textContent = p.post;
    var img = '<div class="bio-photo" style="background-image:url(\'' + (p.photo || AVATAR_SVG) + '\')"></div>';
    mount.innerHTML =
      '<div class="bio-layout">' + img +
      '<div class="bio-body"><h2 class="bio-name">' + p.name + '</h2>' +
      '<div class="bio-post">' + p.post + '</div>' +
      (p.contact ? '<div class="bio-contact">' + p.contact + '</div>' : '') +
      (p.bio || []).map(function (par) { return '<p>' + par + '</p>'; }).join('') +
      '</div></div>';
  }

  /* единый плейсхолдер-аватар, когда нет фото */
  var AVATAR_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23e8f2fc"/><circle cx="50" cy="38" r="18" fill="%23a9c7e8"/><path d="M18 88c0-18 14-30 32-30s32 12 32 30z" fill="%23a9c7e8"/></svg>');

  /* --- РЕНДЕР: страница филиала (filial.html?id=...) --- */
  function renderFilial() {
    var mount = $('#filial'); if (!mount) return;
    var id = getParam('id');
    var b = (S.branches || []).filter(function (x) { return x.id === id; })[0] || (S.branches || [])[0];
    if (!b) { mount.innerHTML = '<p>Филиал не найден.</p>'; return; }
    var ttl = $('#filial-title'); if (ttl) ttl.textContent = b.name;
    var photo = b.photo || AVATAR_SVG;
    var img = '<div class="bio-photo" style="background-image:url(\'' + photo + '\')"></div>';

    var structure = (b.structure || []).map(function (g) {
      // схлопываем строки с одинаковыми адресом и телефоном, объединяя роли
      var order = [], byKey = {};
      (g.items || []).forEach(function (it) {
        var key = (it.place || '') + '|' + (it.phone || '');
        if (byKey[key] === undefined) { byKey[key] = { place: it.place, phone: it.phone, roles: [] }; order.push(byKey[key]); }
        if (it.role && byKey[key].roles.indexOf(it.role) < 0) byKey[key].roles.push(it.role);
      });
      var rows = order.map(function (m) {
        var roleTxt = m.roles.join(', ');
        var left = (roleTxt ? '<span class="struct-role">' + roleTxt + '</span>' : '') +
                   (m.place ? '<span class="struct-place">' + m.place + '</span>' : '');
        var tel = (m.phone || '').replace(/факс/gi, '').replace(/[^+\d]/g, '');
        var ph = m.phone ? '<div class="struct-phones">' + phoneLinks(m.phone) + '</div>' : '';
        return '<div class="struct-row"><div class="struct-left">' + left + '</div>' + ph + '</div>';
      }).join('');
      return '<div class="struct-group"><h3>' + g.dept + '</h3>' + rows + '</div>';
    }).join('');

    mount.innerHTML =
      '<div class="bio-layout">' + img +
      '<div class="bio-body"><h2 class="bio-name">' + b.name + '</h2>' +
      (b.head ? '<div class="bio-post">' + b.head + '</div>' : '') +
      '<div class="contacts-grid" style="margin:18px 0">' +
        '<div class="contact-item"><span class="contact-icon">📍</span><div><strong>Адрес</strong><span>' + (b.address || '') + '</span></div></div>' +
        '<div class="contact-item"><span class="contact-icon">📞</span><div><strong>Телефон</strong>' + phoneLinks(b.phone) + '</div></div>' +
        (b.email ? '<div class="contact-item"><span class="contact-icon">✉️</span><div><strong>Email</strong><a href="mailto:' + b.email + '">' + b.email + '</a></div></div>' : '') +
        '<div class="contact-item"><span class="contact-icon">🕒</span><div><strong>Время работы</strong><span>' + (b.schedule || '') + '</span></div></div>' +
      '</div></div></div>' +
      (b.reception ? '<div class="ak-hotline">' + b.reception + '</div>' : '') +
      (structure ? '<h2 class="section-title" style="font-size:20px;margin-top:24px">Структура и контактные телефоны</h2><div class="struct-wrap">' + structure + '</div>' : '') +
      (b.doc ? '<p class="price-note"><a class="link-more" href="' + b.doc + '" download>Положение о филиале ↓</a></p>' : '');
  }

  /* --- РЕНДЕР: горячие линии --- */
  function renderHotlines(mount) {
    if (!mount) return;
    mount.innerHTML = (S.hotlines || []).map(function (h) {
      return '<div class="hl-card"><span class="label-tag">' + h.tag + '</span>' +
        '<a class="hl-phone" href="tel:' + h.phone.replace(/[^+\d]/g, '') + '">' + h.phone + '</a>' +
        '<span class="hl-desc">' + h.desc + '</span></div>';
    }).join('');
  }

  /* --- РЕНДЕР: FAQ --- */
  function renderFaq(mount) {
    if (!mount) return;
    mount.innerHTML = (S.faq || []).map(function (f) {
      return '<div class="faq-item"><button class="faq-q">' + f.q + '</button><div class="faq-a"><p>' + f.a + '</p></div></div>';
    }).join('');
    mount.querySelectorAll('.faq-q').forEach(function (b) {
      b.addEventListener('click', function () {
        var item = b.parentNode, a = item.querySelector('.faq-a');
        var open = item.classList.toggle('open');
        a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
      });
    });
  }

  /* --- ЛЕНТА ВК (страница новостей) --- */
  function renderVk(mount) {
    if (!mount) return;
    if (!C.vkAppId) {
      mount.innerHTML = '<div class="vk-note">💡 Авто-лента из ВКонтакте включается так: получите бесплатный ID приложения на <b>vk.com/dev</b> и впишите его в <b>content.js → config.vkAppId</b>. После этого здесь автоматически появятся ваши посты из сообщества. Пока ниже — список из content.js.</div><div id="news-fallback"></div>';
      return renderNews($('#news-fallback', document));
    }
    var s1 = document.createElement('script');
    s1.src = 'https://vk.com/js/api/openapi.js?169';
    s1.onload = function () {
      try {
        window.VK.init({ apiId: C.vkAppId });
        mount.innerHTML = '<div id="vk_groups"></div>';
        window.VK.Widgets.Group('vk_groups', { mode: 4, width: 'auto', height: 800, color1: 'FFFFFF', color2: '0d3b7a', color3: '1a5cb5' }, C.vkGroupId);
      } catch (e) { mount.innerHTML = '<div id="news-fallback"></div>'; renderNews($('#news-fallback', document)); }
    };
    s1.onerror = function () { mount.innerHTML = '<div id="news-fallback"></div>'; renderNews($('#news-fallback', document)); };
    document.body.appendChild(s1);
  }

  /* --- ПОДСТАНОВКА КОНТАКТОВ В ТЕКСТ --- */
  function fillBindings() {
    document.querySelectorAll('[data-bind]').forEach(function (n) {
      var key = n.getAttribute('data-bind');
      if (C[key] != null) {
        if (key === 'phone') { n.textContent = C.phone; n.setAttribute('href', 'tel:' + C.phoneHref); }
        else if (key === 'email') { n.textContent = C.email; n.setAttribute('href', 'mailto:' + C.email); }
        else if (key === 'vkUrl') { n.setAttribute('href', C.vkUrl); }
        else { n.textContent = C[key]; }
      }
    });
  }

  /* --- АНИМАЦИЯ ПОЯВЛЕНИЯ --- */
  function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e, i) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* --- ЗАПУСК --- */
  document.addEventListener('DOMContentLoaded', function () {
    buildHeader();
    buildFooter();
    fillBindings();
    renderServices($('#services-grid'), $('#services-grid') && $('#services-grid').getAttribute('data-limit') | 0 || null);
    renderNews($('#news-grid'), $('#news-grid') && $('#news-grid').getAttribute('data-limit') | 0 || null);
    renderPrices($('#price-list'));
    renderDocs($('#doc-list'));
    renderHotlines($('#hotlines'));
    renderFaq($('#faq'));
    renderAbout();
    renderAnticorruption();
    renderPerson();
    renderFilial();
    renderVk($('#vk-feed'));
    reveal();
  });
})();
