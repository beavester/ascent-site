(() => {
  const form = document.querySelector('#app-filters');
  const records = [...document.querySelectorAll('.app-record')];
  const search = document.querySelector('#app-search');
  const category = document.querySelector('#category-filter');
  const blocking = document.querySelector('#blocking-filter');
  const watch = document.querySelector('#watch-filter');
  const widget = document.querySelector('#widget-filter');
  const status = document.querySelector('#filter-status');
  const reset = document.querySelector('#reset-filters');
  if (!form || records.length === 0 || !search || !category || !blocking || !watch || !widget || !status || !reset) return;

  const applyFilters = () => {
    const term = search.value.trim().toLowerCase();
    let resultCount = 0;
    for (const record of records) {
      const matchesSearch = !term || record.dataset.search.includes(term);
      const matchesCategory = !category.value || record.dataset.category === category.value;
      const matchesBlocking = !blocking.checked || record.dataset.appBlocking === 'yes';
      const matchesWatch = !watch.checked || record.dataset.appleWatch === 'yes';
      const matchesWidget = !widget.checked || record.dataset.widgets === 'yes';
      const matches = matchesSearch && matchesCategory && matchesBlocking && matchesWatch && matchesWidget;
      record.hidden = !matches;
      if (matches) resultCount += 1;
    }
    status.textContent = resultCount === records.length
      ? `Showing all ${records.length} apps.`
      : `Showing ${resultCount} of ${records.length} apps.`;
  };

  form.addEventListener('input', applyFilters);
  form.addEventListener('change', applyFilters);
  reset.addEventListener('click', () => {
    window.requestAnimationFrame(applyFilters);
  });
})();

