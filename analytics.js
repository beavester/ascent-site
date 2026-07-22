(() => {
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

  if (!match || typeof window.gtag !== 'function') return;

  const event = {
    landing_path: window.location.pathname,
    traffic_source: match.source
  };
  window.gtag('event', 'answer_engine_referral', event);
  if (match.source === 'chatgpt') window.gtag('event', 'chatgpt_referral', event);
})();
