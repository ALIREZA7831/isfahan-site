document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'بستن منو' : 'باز کردن منو');
      toggle.textContent = isOpen ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'باز کردن منو');
      toggle.textContent = '☰';
    }));
  }

  // PWA install button
  let deferredInstallPrompt = null;
  const installButton = document.createElement('button');
  installButton.type = 'button';
  installButton.className = 'install-app-btn';
  installButton.textContent = 'نصب اپلیکیشن';
  installButton.setAttribute('aria-label', 'نصب اپلیکیشن اصفهان');
  const header = document.querySelector('.site-header');
  if (header) header.appendChild(installButton);

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.classList.add('is-installable');
  });

  installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) {
      alert('برای نصب، منوی سه‌نقطه Chrome را باز کن و گزینه «Install app» یا «افزودن به صفحه اصلی» را انتخاب کن.');
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installButton.classList.remove('is-installable');
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    installButton.remove();
  });

  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
});
