// ====== Vanilla JS для меню и общих анимаций ======
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

  // Мобильное меню
  const initMobileMenu = () => {
    if (isMobileMenuInitialized) return;
    isMobileMenuInitialized = true;
    originalNavContent = nav.innerHTML;
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
  const restoreDesktopMenu = () => {
    if (!originalNavContent) return;
    nav.innerHTML = originalNavContent;
    isMobileMenuInitialized = false;
  };
  const handleResponsiveMenu = () => {
    if (window.innerWidth <= 1200) initMobileMenu();
    else restoreDesktopMenu();
  };

  nav.addEventListener('click', (e) => {
    const logo = e.target.closest('.logo');
    if (!logo || window.innerWidth > 1200) return;
    e.preventDefault();
    nav.classList.toggle('active');
  });

  // Ссылки-кнопки
  const bindButtons = () => {
    document.querySelectorAll('.btn-order').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = 'order.html';
      });
    });
  };

  // Появление элементов при скролле
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

  const init = () => {
    initAnimations();
    handleResponsiveMenu();
    bindButtons();
    initScrollAnimations();
    initScrollAnimations();
    initSmoothScroll();
  };
  init();
  window.addEventListener('resize', () => {
    handleResponsiveMenu();
    nav.classList.remove('active');
  });
});

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

  // Плавный скролл с jQuery
  const initSmoothScroll = () => {
    $(document).ready(function(){
      $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
          event.preventDefault();
          $('html, body').stop().animate({
            scrollTop: target.offset().top
          }, 1000);
        }
      });
    });
  };


// ====== jQuery для кнопок агентов и модалки ======
$(function(){
  const $btns = $('.agent-btn');

  // 2) Hover-анимация тени
  $btns.hover(
    function(){
      $(this).stop().animate({ 'box-shadow': '0 0 20px #e22222' }, 200);
    },
    function(){
      $(this).stop().animate({ 'box-shadow': '0 0 15px rgba(226,34,34,0.8)' }, 200);
    }
  );

  // 3) Открытие модалки с улучшенной анимацией и обновлением аудио
  $btns.on('click', function(){
    const name     = $(this).find('.agent-name').text();
    const imgUrl   = $(this).css('background-image').slice(5, -2);
    const h3Text   = $(this).data('h3');
    const pText    = $(this).data('p');
    const audioSrc = $(this).data('audio'); // <-- путь к аудиофайлу из data-audio

    const $modal      = $('#agent-modal');
    const $contentSec = $modal.find('.modal-content');
    
    // Заполнение данных
    $contentSec.find('.agents-text h2').text(name);
    $contentSec.find('.agents-text h3').text(h3Text);
    $contentSec.find('.agents-text p').text(pText);
    $contentSec.find('.agents-image img')
      .attr('src', imgUrl)
      .attr('alt', name);

    // Обновляем аудиоплеер
    const $audio = $contentSec.find('.audio-player');
    $audio.find('source').attr('src', audioSrc);
    $audio[0].load(); // перезагрузить новый источник

    // Если используется Plyr, обновляем через его API
    if (window.audioPlayer) {
      window.audioPlayer.source = {
        type: 'audio',
        sources: [{ src: audioSrc, type: 'audio/mp3' }]
      };
    }

    // Анимация открытия модалки
    $modal.fadeIn(300, function(){
      $contentSec
        .css({ 
          opacity: 0, 
          transform: 'translateY(-20px)'
        })
        .show()
        .animate({ 
          opacity: 1,
          transform: 'translateY(0)'
        }, {
          duration: 400,
          step: function(now, fx) {
            if (fx.prop === 'opacity') {
              $(this).css('transform', `translateY(${(1 - now) * -20}px)`);
            }
          }
        });
    });
  });

  // 4) Улучшенное закрытие модалки с анимацией
  function closeModal(){
    const $modal      = $('#agent-modal');
    const $contentSec = $modal.find('.modal-content');
    
    $contentSec.animate({ 
      opacity: 0,
      transform: 'translateY(-20px)'
    }, {
      duration: 300,
      complete: function() {
        $modal.fadeOut(200);
        $(this).css({ transform: 'translateY(0)' });
      }
    });
  }

  // Инициализация Slick Carousel
    $('.agent-buttons').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

  // Обработчики закрытия
  $(document)
    .on('click', '.modal-close', closeModal)              // крестик
    .on('click', function(e) {                             // клик вне модалки
      if ($(e.target).is('#agent-modal')) closeModal();
    })
    .on('keyup', function(e) {                             // ESC
      if (e.key === "Escape" && $('#agent-modal').is(':visible')) {
        closeModal();
      }
    });
});


