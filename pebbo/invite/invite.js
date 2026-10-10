'use strict';
(() => {
  const params = new URL(window.location.href).searchParams;
  const raw = params.getAll('code').length === 1 ? params.get('code') : '';
  const code = (raw || '').toUpperCase().replace(/[\s-]/g, '');
  const valid = /^[A-Z0-9]{8}$/.test(code);
  const instructions = document.getElementById('instructions');
  const display = document.getElementById('code');
  const feedback = document.getElementById('feedback');
  if (!valid) {
    display.textContent = 'Let’s meet.';
    instructions.textContent = 'This invite is missing a valid code. Ask your friend for their link, or download Pebbo to meet your first pet.';
    return;
  }
  const formatted = `${code.slice(0, 4)}-${code.slice(4)}`;
  display.textContent = formatted;
  const appLink = `pebbo://invite?code=${encodeURIComponent(code)}`;
  const openApp = document.getElementById('open-app');
  openApp.href = appLink;
  openApp.hidden = false;
  openApp.addEventListener('click', () => {
    feedback.textContent = 'If Pebbo hasn’t opened, download it below, then return to this invite.';
  });
  const smartBanner = document.createElement('meta');
  smartBanner.name = 'apple-itunes-app';
  smartBanner.content = `app-id=6794359468, app-argument=${window.location.origin}/pebbo/invite/?code=${code}`;
  document.head.appendChild(smartBanner);
  const copy = document.getElementById('copy-download');
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(formatted);
      feedback.textContent = 'Code copied. In Pebbo, tap Invite friends, then paste your friend’s code.';
      window.location.assign(document.getElementById('download').href);
    } catch {
      // Keep the code selectable, with a visible App Store link. Do not claim
      // success or leave the page when a browser denies clipboard access.
      feedback.textContent = 'Touch and hold your code to copy it, then tap Download on the App Store. You can also return here after installing.';
    }
  });
})();
