document.addEventListener('DOMContentLoaded', () => {
  let originalNavContent = null;
  let isMobileMenuInitialized = false;
  const nav = document.querySelector('.main-nav');

  // Анимация при загрузке
  const initAnimations = () => {
    const animateElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay, 10) || 0;
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, delay);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));

    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      document.querySelectorAll('.hero-content > *').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.2}s`;
      });
    });
  };

  // Инициализация мобильного меню (≤ 1200px)
  const initMobileMenu = () => {
    if (isMobileMenuInitialized) return;
    isMobileMenuInitialized = true;

    // Сохраняем исходную разметку
    originalNavContent = nav.innerHTML;

    // Собираем мобильную структуру
    const mobileStructure = `
      <a href="index.html" class="logo" data-animate data-delay="400">
        <img src="myaat5cnway51.webp" alt="DMC Logo">
      </a>
      <div class="dropdown">
        <a href="index.html" class="menu-item mobile-home">Главная</a>
        ${[...nav.querySelectorAll('a:not(.logo)')]
          .map(link => link.outerHTML)
          .join('')}
      </div>
    `;
    nav.innerHTML = mobileStructure;
  };

  // Восстановление десктопного меню (> 1200px)
  const restoreDesktopMenu = () => {
    if (!originalNavContent) return;
    nav.innerHTML = originalNavContent;
    isMobileMenuInitialized = false;
  };

  // Переключение между мобильным и десктопным меню
  const handleResponsiveMenu = () => {
    if (window.innerWidth <= 1200) {
      initMobileMenu();
    } else {
      restoreDesktopMenu();
    }
  };

  // Делегированное событие клика по логотипу для открытия/закрытия меню
  nav.addEventListener('click', (e) => {
    const logo = e.target.closest('.logo');
    if (!logo) return;
    if (window.innerWidth > 1200) return;
    e.preventDefault();
    nav.classList.toggle('active');
  });

  // Обработчики других элементов
  const bindButtons = () => {
    document.querySelectorAll('.btn-order').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = 'order.html';
      });
    });
  };

  // Анимации при скролле
  const initScrollAnimations = () => {
    let lastScroll = window.pageYOffset;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      const direction = currentScroll > lastScroll ? 'down' : 'up';
      lastScroll = currentScroll;

      document.querySelectorAll('[data-animate]').forEach(el => {
        const delay = parseInt(el.dataset.delay, 10) || 0;
        if (
          el.getBoundingClientRect().top < window.innerHeight * 0.8 &&
          direction === 'down' &&
          !el.classList.contains('animated')
        ) {
          setTimeout(() => el.classList.add('animated'), delay);
        }
      });
    }, { passive: true });
  };

  // Инициализация всего
  const init = () => {
    initAnimations();
    handleResponsiveMenu();
    bindButtons();
    initScrollAnimations();
  };

  init();

  // Пересчёт при изменении размера окна
  window.addEventListener('resize', () => {
    handleResponsiveMenu();
    nav.classList.remove('active');
  });
});
