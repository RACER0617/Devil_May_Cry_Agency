document.addEventListener('DOMContentLoaded', () => {
  // ===== Подключение API Яндекс.Карт должно быть в <head> вашего HTML:
  // <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>

  // ===== 1. Инициализация анимаций =====
  initAnimations();

  // ===== 2. Яндекс.Карта и ценообразование =====
  const agencyCoords = [40.7128, -74.0060]; // [широта, долгота]
  ymaps.ready(initMap);

  let map, placemark;
  function initMap() {
    map = new ymaps.Map('map', {
      center: agencyCoords,
      zoom: 5,
      controls: ['zoomControl', 'fullscreenControl']
    });

    placemark = new ymaps.Placemark(agencyCoords, {}, {
      preset: 'islands#redIcon'
    });
    map.geoObjects.add(placemark);
  }

  const basePrices = { weak: 50, standard: 100, elite: 200, boss: 500 };
  const agentMult = { 'Данте': 1.2, 'Неро': 1.1, 'Леди': 1.0, 'Триш': 1.15 };
  const rankMult = { D:1, C:1.1, B:1.2, A:1.3, S:1.5, SS:1.8, SSS:2.2 };

  function getDistance(a, b) {
    // простая эвклидова приближённая формула, или расчёт по сфере:
    const toRad = v => v * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]), lat2 = toRad(b[0]);
    const aHarv = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(aHarv), Math.sqrt(1 - aHarv));
  }

  async function updatePriceAndMap() {
    const addr = document.getElementById('address').value;
    const prob = document.getElementById('problemType').value;
    const ag = document.getElementById('agent').value;
    const rk = document.getElementById('rank').value;
    if (!addr || !prob || !ag || !rk || !ymaps) return;

    try {
      // геокодирование через Яндекс
      const res = await ymaps.geocode(addr, { results: 1 });
      const obj = res.geoObjects.get(0);
      if (!obj) throw new Error();
      const coords = obj.geometry.getCoordinates();  // [lat, lon]

      // двигаем маркер и центрируем карту
      placemark.geometry.setCoordinates(coords);
      map.setCenter(coords, 6, { duration: 300 });

      // пересчёт цены
      const dist = getDistance(agencyCoords, coords);
      const price = (
        basePrices[prob] *
        agentMult[ag] *
        rankMult[rk] *
        (1 + dist / 100)
      ).toFixed(2);
      document.getElementById('priceValue').textContent = price;
    } catch (e) {
      document.getElementById('priceValue').textContent = 'Ошибка';
    }
  }

  ['address', 'problemType', 'agent', 'rank'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('change', updatePriceAndMap);
    if (id === 'address') el.addEventListener('blur', updatePriceAndMap);
  });

  // ===== 3. Обработка формы и модалки =====
  const form = document.getElementById('orderForm');
  const codes = ['Вергилий','Спарда','Ребеллион','Ямато','Красная королева','Синяя Роза','Агни и Рудра','Неван'];

  form.addEventListener('submit', e => {
    e.preventDefault();
    const modal = document.getElementById('confirmationModal');
    document.getElementById('callTime').textContent = 
      new Date(Date.now() + 30*60*1000)
        .toLocaleTimeString('ru-RU', { hour:'2-digit', minute:'2-digit' });
    document.getElementById('codeWord').textContent =
      codes[Math.floor(Math.random() * codes.length)];
    modal.classList.remove('hidden');
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('confirmationModal').classList.add('hidden');
    form.reset();
    document.getElementById('priceValue').textContent = '–';
    // вернуть курсор карты и маркер
    placemark.geometry.setCoordinates(agencyCoords);
    map.setCenter(agencyCoords, 5, { duration: 300 });
  });

  // ===== 4. Очистка формы =====
  document.getElementById('clearForm').addEventListener('click', () => {
    form.reset();
    document.getElementById('priceValue').textContent = '–';
    placemark.geometry.setCoordinates(agencyCoords);
    map.setCenter(agencyCoords, 5, { duration: 300 });
    document.getElementById('confirmationModal').classList.add('hidden');
  });

  // ===== 5. Мобильное меню =====
  let originalNav = null;
  let mobileInited = false;
  const nav = document.querySelector('.main-nav');

  function initMobileMenu() {
    if (mobileInited) return;
    mobileInited = true;
    originalNav = nav.innerHTML;
    const items = [...nav.querySelectorAll('a:not(.logo)')]
      .map(a => a.outerHTML).join('');
    nav.innerHTML = `
      <a href="index.html" class="logo" data-animate data-delay="400">
        <img src="myaat5cnway51.webp" alt="DMC Logo">
      </a>
      <div class="dropdown">
        <a href="index.html" class="menu-item mobile-home">Главная</a>
        ${items}
      </div>`;
  }

  function restoreMenu() {
    if (!originalNav) return;
    nav.innerHTML = originalNav;
    mobileInited = false;
  }

  function handleResize() {
    if (window.innerWidth <= 1200) initMobileMenu();
    else restoreMenu();
  }

  nav.addEventListener('click', e => {
    const logo = e.target.closest('.logo');
    if (!logo || window.innerWidth > 1200) return;
    e.preventDefault();
    nav.classList.toggle('active');
  });

  window.addEventListener('resize', () => {
    handleResize();
    nav.classList.remove('active');
  });

  handleResize();
});

// ===== Инициализация анимаций =====
function initAnimations() {
  const elems = document.querySelectorAll('[data-animate]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        const d = +ent.target.dataset.delay || 0;
        setTimeout(() => ent.target.classList.add('animated'), d);
      }
    });
  }, { threshold: 0.1 });
  elems.forEach(el => obs.observe(el));
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    document.querySelectorAll('.hero-content > *')
      .forEach((el, i) => el.style.transitionDelay = `${i*0.2}s`);
  });
}