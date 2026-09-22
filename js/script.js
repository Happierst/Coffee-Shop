/* ============================================================
   Кофейня Зерно - основной скрипт
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ----- 1. Кастомный плавный скролл ----- */
  function smoothScrollTo(targetY, duration) {
    duration = duration || 900;
    var startY = window.pageYOffset;
    var diff = targetY - startY;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);

      var eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + diff * eased);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  /* ----- 2. Кнопка «Наверх» ----- */
  var toTop = document.getElementById('toTop');

  if (toTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        toTop.classList.add('visible');
      } else {
        toTop.classList.remove('visible');
      }
    });

    toTop.addEventListener('click', function () {
      smoothScrollTo(0, 900);
    });
  }

  /* ----- 3. Плавный скролл по всем якорным ссылкам ----- */
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  var HEADER_OFFSET = 90;

  for (var i = 0; i < anchorLinks.length; i++) {
    (function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        var targetY = target.getBoundingClientRect().top
                    + window.pageYOffset
                    - HEADER_OFFSET;

        smoothScrollTo(targetY, 900);

        if (history.replaceState) {
          history.replaceState(null, '', href);
        }
      });
    })(anchorLinks[i]);
  }

  /* ----- 4. Плавное появление секций ----- */
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    for (var j = 0; j < fadeEls.length; j++) {
      fadeEls[j].classList.add('visible');
    }
  }

  /* ----- 5. Подсветка активного пункта меню ----- */
  var navLinks = document.querySelectorAll('.nav a');
  var sections = document.querySelectorAll('section[id], header[id]');

  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    sections.forEach(function (sec) { navObserver.observe(sec); });
  }

  /* ----- 6. Автообновление года ----- */
  var footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML = footer.innerHTML.replace(/©\s*\d{4}/, '© ' + new Date().getFullYear());
  }

  /* ----- 7. Модальное окно карточки меню ----- */
  var modal        = document.getElementById('menuModal');
  var modalImg     = document.getElementById('modalImg');
  var modalTitle   = document.getElementById('modalTitle');
  var modalDesc    = document.getElementById('modalDesc');
  var modalRecipe  = document.getElementById('modalRecipe');
  var modalExtra   = document.getElementById('modalExtra');
  var modalPrice   = document.getElementById('modalPrice');
  var menuCards    = document.querySelectorAll('.menu-card[data-menu]');

  function openModal(data) {
    modalImg.src        = data.img;
    modalImg.alt        = data.title;
    modalTitle.textContent   = data.title;
    modalDesc.textContent    = data.desc;
    modalRecipe.textContent  = data.recipe;
    modalExtra.textContent   = data.extra;
    modalPrice.textContent   = data.price;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  // Клик по карточке — открыть модалку
  menuCards.forEach(function (card) {
    card.addEventListener('click', function () {
      openModal({
        img:     card.getAttribute('data-img'),
        title:   card.getAttribute('data-title'),
        desc:    card.getAttribute('data-desc'),
        recipe:  card.getAttribute('data-recipe'),
        extra:   card.getAttribute('data-extra'),
        price:   card.getAttribute('data-price')
      });
    });
  });

  // Клик по фону или крестику — закрыть
  modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  // Esc — закрыть
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

});