/* =====================================================================
   BUSCADOR DEL BLOG — ES / CAT
   Filtra las tarjetas por título y categoría inmediatamente. En la primera
   búsqueda completa el índice leyendo el contenido de cada artículo del
   mismo idioma, de modo que una publicación nueva queda incluida al añadir
   su tarjeta al listado sin mantener un índice separado.
   ===================================================================== */
(function(){
  'use strict';

  var form = document.querySelector('[data-blog-search-form]');
  if (!form) return;

  var input = form.querySelector('[data-blog-search-input]');
  var clearButton = form.querySelector('[data-blog-search-clear]');
  var status = form.querySelector('[data-blog-search-status]');
  var list = document.querySelector('.blog-post-list');
  if (!input || !clearButton || !status || !list) return;

  var cards = Array.prototype.slice.call(list.querySelectorAll('.blog-card'));
  var language = form.getAttribute('data-search-language') === 'ca' ? 'ca' : 'es';
  var indexPromise = null;
  var searchTimer = null;
  var analyticsTimer = null;
  var lastTrackedQuery = '';

  var copy = language === 'ca' ? {
    one: '1 article trobat',
    many: function(n){ return n + ' articles trobats'; },
    none: 'No hem trobat cap article amb aquesta cerca.',
    loading: 'Cercant també dins del contingut dels articles…'
  } : {
    one: '1 artículo encontrado',
    many: function(n){ return n + ' artículos encontrados'; },
    none: 'No hemos encontrado ningún artículo con esta búsqueda.',
    loading: 'Buscando también dentro del contenido de los artículos…'
  };

  function normalize(value){
    return (value || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’‘`´]/g, "'")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  cards.forEach(function(card){
    var titleLink = card.querySelector('h3 a');
    var href = titleLink ? titleLink.getAttribute('href') : '';
    card.__searchText = normalize(card.textContent + ' ' + href);
  });

  var emptyState = document.createElement('div');
  emptyState.className = 'blog-search-empty';
  emptyState.setAttribute('role', 'status');
  emptyState.textContent = copy.none;
  list.appendChild(emptyState);

  function termsFrom(value){
    var normalized = normalize(value);
    return normalized ? normalized.split(' ').filter(Boolean) : [];
  }

  function cardMatches(card, terms){
    if (!terms.length) return true;
    var words = (card.__searchText || '').split(' ').filter(Boolean);
    return terms.every(function(term){
      return words.some(function(word){
        if (word === term) return true;
        if (word === term + 's' || word === term + 'es') return true;
        if (term === word + 's' || term === word + 'es') return true;
        return false;
      });
    });
  }

  function updateStatus(count, hasQuery, loading){
    if (!hasQuery){
      status.textContent = '';
      return;
    }
    if (loading){
      status.textContent = copy.loading;
      return;
    }
    status.textContent = count === 1 ? copy.one : copy.many(count);
  }

  function applySearch(options){
    options = options || {};
    var terms = termsFrom(input.value);
    var hasQuery = terms.length > 0;
    var count = 0;

    cards.forEach(function(card){
      var visible = cardMatches(card, terms);
      card.hidden = !visible;
      if (visible) count += 1;
    });

    emptyState.classList.toggle('is-visible', hasQuery && count === 0);
    clearButton.classList.toggle('is-visible', input.value.length > 0);
    updateStatus(count, hasQuery, !!options.loading);
    return count;
  }

  async function enrichCard(card){
    var titleLink = card.querySelector('h3 a');
    if (!titleLink) return;
    var href = titleLink.getAttribute('href');
    if (!href) return;

    try{
      var response = await fetch(href, { credentials:'same-origin' });
      if (!response.ok) return;
      var html = await response.text();
      var parsed = new DOMParser().parseFromString(html, 'text/html');
      var content = parsed.querySelector('.article-content') || parsed.querySelector('main');
      var description = parsed.querySelector('meta[name="description"]');
      var extra = '';
      if (description) extra += ' ' + (description.getAttribute('content') || '');
      if (content){
        var cleanContent = content.cloneNode(true);
        Array.prototype.forEach.call(
          cleanContent.querySelectorAll('.article-final-cta,.article-disclaimer,.article-contact-card'),
          function(node){ node.remove(); }
        );
        extra += ' ' + cleanContent.textContent;
      }
      card.__searchText = normalize(card.__searchText + ' ' + extra);
    }catch(error){
      // Si la carga falla, el buscador sigue funcionando con título y categoría.
    }
  }

  function enrichIndex(){
    if (indexPromise) return indexPromise;

    indexPromise = (async function(){
      var cursor = 0;
      var concurrency = Math.min(5, cards.length);

      async function worker(){
        while (cursor < cards.length){
          var current = cards[cursor++];
          await enrichCard(current);
        }
      }

      var workers = [];
      for (var i = 0; i < concurrency; i += 1) workers.push(worker());
      await Promise.all(workers);
      applySearch();
    })();

    return indexPromise;
  }

  function trackSearch(){
    window.clearTimeout(analyticsTimer);
    analyticsTimer = window.setTimeout(function(){
      var raw = input.value.trim();
      var normalized = normalize(raw);
      if (normalized.length < 2 || normalized === lastTrackedQuery) return;
      if (typeof window.gtag === 'function'){
        window.gtag('event', 'view_search_results', { search_term: raw });
        lastTrackedQuery = normalized;
      }
    }, 900);
  }

  function handleInput(){
    window.clearTimeout(searchTimer);
    var hasQuery = termsFrom(input.value).length > 0;
    applySearch({ loading: hasQuery && !indexPromise });

    if (!hasQuery) return;

    searchTimer = window.setTimeout(function(){
      enrichIndex();
      trackSearch();
    }, 180);
  }

  form.addEventListener('submit', function(event){
    event.preventDefault();
    handleInput();
  });

  input.addEventListener('input', handleInput);

  clearButton.addEventListener('click', function(){
    input.value = '';
    applySearch();
    input.focus();
  });

  applySearch();
})();
