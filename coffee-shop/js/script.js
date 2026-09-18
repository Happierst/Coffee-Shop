/* ============================================================
   Кофейня «Зерно» — основной скрипт
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ----- 1. Кнопка «Наверх» ----- */
  const toTop = document.getElementById('toTop');

  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('visible', window.scrollY > 500);
    });

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----- 2. Плавное появление секций при скролле ----- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback для старых браузеров
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ----- 3. Подсветка активного пункта меню при скролле ----- */
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('section[id], header[id]');

  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    sections.forEach(sec => navObserver.observe(sec));
  }

  /* ----- 4. Плавный скролл с учётом плавающего меню ----- */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = 90; // высота плавающего меню + отступ
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', targetId);
    });
  });

  /* ----- 5. Мелкая приятность: текущий год в подвале ----- */
  const footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML = footer.innerHTML.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
  }

    /* ----- 6. Переключатель тёмной темы ----- */
  const themeBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const STORAGE_KEY = 'zerno-theme';

  // Восстанавливаем сохранённую тему при загрузке
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (themeBtn) themeBtn.textContent = '☀️';
  }

  // Переключение по клику
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        themeBtn.textContent = '🌙';
        localStorage.setItem(STORAGE_KEY, 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        themeBtn.textContent = '☀️';
        localStorage.setItem(STORAGE_KEY, 'dark');
      }
    });
  }
});