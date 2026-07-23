(() => {
  const sendEvent = (name, parameters) => {
    if (typeof window.gtag === 'function') window.gtag('event', name, parameters);
  };

  const engines = [
    { source: 'chatgpt', hosts: ['chatgpt.com'], campaigns: ['chatgpt.com', 'chatgpt'] },
    { source: 'perplexity', hosts: ['perplexity.ai'], campaigns: ['perplexity', 'perplexity.ai'] },
    { source: 'claude', hosts: ['claude.ai'], campaigns: ['claude', 'claude.ai'] },
    { source: 'copilot', hosts: ['copilot.microsoft.com', 'bing.com'], campaigns: ['copilot', 'microsoft_copilot'] },
    { source: 'gemini', hosts: ['gemini.google.com'], campaigns: ['gemini', 'google_gemini'] }
  ];

  const campaign = new URLSearchParams(window.location.search).get('utm_source')?.toLowerCase();
  let referrerHost = '';
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : '';
  } catch {
    referrerHost = '';
  }

  const match = engines.find((engine) =>
    engine.campaigns.includes(campaign) ||
    engine.hosts.some((host) => referrerHost === host || referrerHost.endsWith('.' + host))
  );

  if (match) {
    const event = {
      landing_path: window.location.pathname,
      traffic_source: match.source
    };
    sendEvent('answer_engine_referral', event);
    if (match.source === 'chatgpt') sendEvent('chatgpt_referral', event);
  }

  const placementFor = (link) => {
    if (link.closest('header, nav')) return 'navigation';
    if (link.closest('footer')) return 'footer';
    if (link.closest('.cta, .cta-band, .cta-sec')) return 'cta';
    return 'editorial';
  };

  const destinationClassFor = (path) => {
    if (path === '/') return 'home';
    if (path.startsWith('/habit-apps/')) return 'habit_app_index';
    if (path.startsWith('/compare/')) return 'comparison';
    if (path.startsWith('/best/')) return 'decision_guide';
    if (path.startsWith('/guides/') || path.startsWith('/blog/')) return 'behavior_guide';
    if (path.startsWith('/science/') || path.startsWith('/methodology/')) return 'research';
    if (path.startsWith('/ascent/')) return 'product';
    return 'other_internal';
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;

    let destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    const source_path = window.location.pathname;
    const placement = placementFor(link);
    if (
      destination.hostname === 'apps.apple.com' &&
      destination.pathname.includes('id6756843194')
    ) {
      sendEvent('app_store_cta_click', { source_path, placement });
      return;
    }

    if (destination.origin !== window.location.origin) return;
    sendEvent('editorial_path_click', {
      source_path,
      placement,
      destination_class: destinationClassFor(destination.pathname)
    });
  });
})();
