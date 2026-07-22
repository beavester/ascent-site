(() => {
  const params = new URLSearchParams(window.location.search);
  let referredByChatGPT = params.get('utm_source') === 'chatgpt.com';

  if (!referredByChatGPT && document.referrer) {
    try {
      referredByChatGPT = new URL(document.referrer).hostname === 'chatgpt.com';
    } catch {
      referredByChatGPT = false;
    }
  }

  if (referredByChatGPT && typeof window.gtag === 'function') {
    window.gtag('event', 'chatgpt_referral', {
      landing_path: window.location.pathname,
      traffic_source: 'chatgpt.com'
    });
  }
})();
