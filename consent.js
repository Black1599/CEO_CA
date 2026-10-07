/* =====================================================================
   CARANDELL ADVOCATS — GESTOR DE CONSENTIMIENTO
   =====================================================================
   Categorías opcionales independientes:
   - Google Analytics
   - Google Maps

   Google Analytics 4 está configurado con el identificador real de producción.
   El script solo puede cargar Analytics en carandelladvocats.com y tras consentimiento.
   ===================================================================== */
(function(){
  'use strict';

  var STORAGE_KEY = 'ca_consent_preferences';
  var CONSENT_VERSION = 2;
  var CONSENT_MAX_AGE_MS = 24 * 30.4375 * 24 * 60 * 60 * 1000; // 24 meses aprox.
  var GA4_MEASUREMENT_ID = 'G-4LQT9GXEWM';
  var currentLanguage = (document.documentElement.lang || 'es').toLowerCase().indexOf('ca') === 0 ? 'ca' : 'es';
  var ui = currentLanguage === 'ca' ? {
    privacy:'Cookies i privacitat', banner:'Utilitzem tecnologies pròpies necessàries per al funcionament de la web i, amb el teu consentiment, tecnologies de tercers per obtenir estadístiques d’ús i carregar contingut extern.',
    choices:'Pots <strong>acceptar</strong>, <strong>rebutjar</strong> o <strong>configurar</strong> les teves preferències. Més informació a la nostra ', policy:'Política de Cookies',
    accept:'Acceptar', reject:'Rebutjar', configure:'Configurar', settings:'Configurar cookies', choose:'Tria les teves preferències', close:'Tancar configuració',
    intro1:'Pots decidir quines tecnologies opcionals permets utilitzar. Les tecnologies necessàries romanen sempre actives perquè permeten recordar les teves preferències de privacitat.',
    intro2:'Pots modificar o retirar el teu consentiment en qualsevol moment. Per a més informació, consulta la nostra ', necessary:'Necessàries', always:'Sempre actives',
    necessaryText:'Permeten recordar les teves preferències de privacitat i garantir les funcions bàsiques necessàries de la web. No s’utilitzen amb finalitats publicitàries ni d’anàlisi.',
    analyticsText:'Ens permet obtenir estadístiques sobre l’ús de la web i conèixer, de manera agregada, com interactuen les persones usuàries amb els seus continguts. Només s’activa si hi dones el teu consentiment.',
    allowAnalytics:'Permetre Google Analytics', mapsText:'Permet carregar el mapa interactiu de Google Maps disponible a la web. Si no ho autoritzes, el mapa no es carregarà i no s’establirà aquesta connexió amb Google.',
    allowMaps:'Permetre Google Maps', withdraw:'Retirar consentiment', save:'Desar preferències', legal:'Avís legal', privacyLink:'Privacitat', cookies:'Cookies', settingsLink:'Configurar cookies'
  } : {
    privacy:'Cookies y privacidad', banner:'Utilizamos tecnologías propias necesarias para el funcionamiento de la web y, con tu consentimiento, tecnologías de terceros para obtener estadísticas de uso y cargar contenido externo.',
    choices:'Puedes <strong>aceptar</strong>, <strong>rechazar</strong> o <strong>configurar</strong> tus preferencias. Más información en nuestra ', policy:'Política de Cookies',
    accept:'Aceptar', reject:'Rechazar', configure:'Configurar', settings:'Configurar cookies', choose:'Elige tus preferencias', close:'Cerrar configuración',
    intro1:'Puedes decidir qué tecnologías opcionales permites utilizar. Las tecnologías necesarias permanecen siempre activas porque permiten recordar tus preferencias de privacidad.',
    intro2:'Puedes modificar o retirar tu consentimiento en cualquier momento. Para más información, consulta nuestra ', necessary:'Necesarias', always:'Siempre activas',
    necessaryText:'Permiten recordar tus preferencias de privacidad y garantizar las funciones básicas necesarias de la web. No se utilizan con fines publicitarios ni de análisis.',
    analyticsText:'Nos permite obtener estadísticas sobre el uso de la web y conocer, de forma agregada, cómo interactúan las personas usuarias con sus contenidos. Solo se activa si das tu consentimiento.',
    allowAnalytics:'Permitir Google Analytics', mapsText:'Permite cargar el mapa interactivo de Google Maps disponible en la web. Si no lo autorizas, el mapa no se cargará y no se establecerá esa conexión con Google.',
    allowMaps:'Permitir Google Maps', withdraw:'Retirar consentimiento', save:'Guardar preferencias', legal:'Aviso legal', privacyLink:'Privacidad', cookies:'Cookies', settingsLink:'Configurar cookies'
  };

  var SERVICE_CONFIG = {
    googleAnalytics: { enabled: true, category: 'analytics' },
    googleMaps: { enabled: true, category: 'external' }
  };

  var state = {
    version: CONSENT_VERSION,
    external: false,
    analytics: false,
    decided: false,
    updatedAt: null
  };

  var banner = null;
  var settings = null;
  var analyticsToggle = null;
  var externalToggle = null;
  var lastFocusedElement = null;
  var currentScript = document.currentScript;
  var siteRoot = null;

  try {
    siteRoot = currentScript && currentScript.src
      ? new URL('../', currentScript.src)
      : new URL('./', window.location.href);
  } catch (error) {
    siteRoot = null;
  }

  function siteUrl(path){
    try { return new URL(path, siteRoot || window.location.href).href; }
    catch (error) { return path; }
  }

  function safeParse(value){
    try { return JSON.parse(value); }
    catch (error) { return null; }
  }

  function readStoredState(){
    var stored = null;
    try { stored = safeParse(window.localStorage.getItem(STORAGE_KEY)); }
    catch (error) { stored = null; }

    if (!stored || stored.version !== CONSENT_VERSION || stored.decided !== true) return null;

    var updatedAt = stored.updatedAt ? Date.parse(stored.updatedAt) : NaN;
    var expired = !Number.isFinite(updatedAt) || (Date.now() - updatedAt) >= CONSENT_MAX_AGE_MS;

    if (expired) {
      try { window.localStorage.removeItem(STORAGE_KEY); }
      catch (error) {}
      removeAnalyticsCookies();
      return null;
    }

    return {
      version: CONSENT_VERSION,
      external: stored.external === true,
      analytics: stored.analytics === true,
      decided: true,
      updatedAt: stored.updatedAt
    };
  }

  function writeState(nextState){
    state = {
      version: CONSENT_VERSION,
      external: nextState.external === true,
      analytics: nextState.analytics === true,
      decided: true,
      updatedAt: new Date().toISOString()
    };

    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { /* La elección sigue funcionando durante la página actual. */ }

    applyConsent();
    hideBanner();
    closeSettings(false);

    try {
      window.dispatchEvent(new CustomEvent('ca:consentchange', { detail: getPublicState() }));
    } catch (error) {}
  }

  function getPublicState(){
    return {
      version: state.version,
      external: state.external,
      analytics: state.analytics,
      decided: state.decided,
      updatedAt: state.updatedAt
    };
  }

  function hasConsent(category){
    return state.decided === true && state[category] === true;
  }

  /* ------------------------------------------------------------------
     GOOGLE MAPS
     ------------------------------------------------------------------ */
  function updateGoogleMaps(){
    var frames = Array.prototype.slice.call(
      document.querySelectorAll('iframe[data-consent-service="google-maps"]')
    );

    frames.forEach(function(frame){
      var allowed = SERVICE_CONFIG.googleMaps.enabled && hasConsent('external');
      var source = frame.getAttribute('data-consent-src');
      var visual = frame.closest ? frame.closest('.location-map-visual') : frame.parentNode;

      if (allowed && source) {
        frame.classList.remove('is-consent-blocked');
        if (visual && visual.classList) visual.classList.remove('is-map-consent-blocked');
        if (frame.getAttribute('src') !== source) frame.setAttribute('src', source);
      } else {
        frame.classList.add('is-consent-blocked');
        if (visual && visual.classList) visual.classList.add('is-map-consent-blocked');
        if (frame.getAttribute('src')) frame.removeAttribute('src');
      }
    });
  }

  /* ------------------------------------------------------------------
     GOOGLE ANALYTICS 4
     ------------------------------------------------------------------ */
  function isProductionHost(){
    var host = (window.location.hostname || '').toLowerCase();
    return host === 'carandelladvocats.com' || host === 'www.carandelladvocats.com';
  }

  function validGa4Id(){
    return isProductionHost() && /^G-[A-Z0-9]+$/i.test(GA4_MEASUREMENT_ID || '');
  }

  function removeAnalyticsCookies(){
    var names = document.cookie.split(';').map(function(part){
      return (part.split('=')[0] || '').trim();
    }).filter(function(name){ return name === '_ga' || name.indexOf('_ga_') === 0; });

    names.forEach(function(name){
      document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
      document.cookie = name + '=; Max-Age=0; path=/; domain=' + window.location.hostname + '; SameSite=Lax';
    });
  }

  function ensureGtagBase(){
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function(){ window.dataLayer.push(arguments); };
    }
  }

  function trackChatGPTReferral(){
    if (!window.gtag) return;

    var fromChatGPT = false;
    try {
      var currentUrl = new URL(window.location.href);
      fromChatGPT = (currentUrl.searchParams.get('utm_source') || '').toLowerCase() === 'chatgpt.com';
    } catch (error) {}

    if (!fromChatGPT && document.referrer) {
      try {
        var refHost = new URL(document.referrer).hostname.toLowerCase();
        fromChatGPT = refHost === 'chatgpt.com' || refHost.endsWith('.chatgpt.com');
      } catch (error) {}
    }

    if (!fromChatGPT) return;

    var alreadyTracked = false;
    try {
      alreadyTracked = window.sessionStorage.getItem('ca_chatgpt_referral_tracked') === '1';
      if (!alreadyTracked) window.sessionStorage.setItem('ca_chatgpt_referral_tracked', '1');
    } catch (error) {}

    if (!alreadyTracked) {
      window.gtag('event', 'chatgpt_referral', {
        traffic_source: 'chatgpt.com'
      });
    }
  }

  function enableGoogleAnalytics(){
    if (!SERVICE_CONFIG.googleAnalytics.enabled || !validGa4Id()) return;

    ensureGtagBase();
    window.gtag('consent', 'update', { analytics_storage: 'granted' });

    if (!document.querySelector('script[data-ca-ga4]')) {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_MEASUREMENT_ID);
      script.setAttribute('data-ca-ga4', '');
      document.head.appendChild(script);

      window.gtag('js', new Date());
      window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: true });
      trackChatGPTReferral();
    }
  }

  function disableGoogleAnalytics(){
    if (window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    removeAnalyticsCookies();
  }

  function updateGoogleAnalytics(){
    if (hasConsent('analytics')) enableGoogleAnalytics();
    else disableGoogleAnalytics();
  }

  function applyConsent(){
    updateGoogleMaps();
    updateGoogleAnalytics();
  }


  /* ------------------------------------------------------------------
     EVENTOS DE INTERACCIÓN GA4
     ------------------------------------------------------------------ */
  function sendAnalyticsEvent(eventName){
    if (!hasConsent('analytics') || !window.gtag) return;
    window.gtag('event', eventName);
  }

  function classifyTrackedLink(anchor){
    if (!anchor) return null;

    var href = (anchor.getAttribute('href') || '').trim();
    if (!href) return null;

    var hrefLower = href.toLowerCase();

    if (hrefLower.indexOf('tel:') === 0) return 'click_phone';
    if (hrefLower.indexOf('mailto:') === 0) return 'click_email';

    try {
      var url = new URL(href, window.location.href);
      var host = (url.hostname || '').toLowerCase();

      if (
        host === 'instagram.com' ||
        host === 'www.instagram.com' ||
        host.endsWith('.instagram.com')
      ) {
        return 'click_instagram';
      }

      if (
        host === 'maps.google.com' ||
        host === 'www.google.com' && url.pathname.toLowerCase().indexOf('/maps') === 0 ||
        host === 'google.com' && url.pathname.toLowerCase().indexOf('/maps') === 0 ||
        host === 'maps.app.goo.gl' ||
        host === 'goo.gl' && url.pathname.toLowerCase().indexOf('/maps') === 0
      ) {
        return 'click_maps';
      }
    } catch (error) {}

    return null;
  }

  function installAnalyticsClickTracking(){
    if (document.documentElement.getAttribute('data-ca-analytics-clicks-bound') === 'true') return;
    document.documentElement.setAttribute('data-ca-analytics-clicks-bound', 'true');

    document.addEventListener('click', function(event){
      var target = event.target;
      var anchor = target && target.closest ? target.closest('a[href]') : null;
      var eventName = classifyTrackedLink(anchor);

      if (eventName) sendAnalyticsEvent(eventName);
    }, false);
  }

  /* ------------------------------------------------------------------
     INTERFAZ
     ------------------------------------------------------------------ */
  function createInterface(){
    if (document.getElementById('caConsentBanner')) return;

    var policyUrl = siteUrl(currentLanguage === 'ca' ? 'cat/politica-cookies.html' : 'politica-cookies.html');

    var bannerMarkup = '' +
      '<section class="ca-consent-banner" id="caConsentBanner" aria-label="' + ui.privacy + '" hidden>' +
        '<div class="ca-consent-banner-inner">' +
          '<div class="ca-consent-copy">' +
            '<span class="ca-consent-kicker">' + ui.privacy + '</span>' +
            '<p>' + ui.banner + '</p>' +
            '<p class="ca-consent-copy-secondary">' + ui.choices + '<a class="ca-consent-policy-link" href="' + policyUrl + '"><strong>' + ui.policy + '</strong></a>.</p>' +
          '</div>' +
          '<div class="ca-consent-actions">' +
            '<button class="ca-consent-button" data-consent-accept type="button">' + ui.accept + '</button>' +
            '<button class="ca-consent-button" data-consent-reject type="button">' + ui.reject + '</button>' +
            '<button class="ca-consent-button ca-consent-configure" data-consent-configure type="button">' + ui.configure + '</button>' +
          '</div>' +
        '</div>' +
      '</section>';

    var settingsMarkup = '' +
      '<div class="ca-consent-settings" id="caConsentSettings" role="dialog" aria-modal="true" aria-labelledby="caConsentSettingsTitle" hidden>' +
        '<div class="ca-consent-settings-panel">' +
          '<div class="ca-consent-settings-head">' +
            '<div><span class="ca-consent-kicker">' + ui.privacy + '</span><h2 id="caConsentSettingsTitle">' + ui.settings + '</h2><p class="ca-consent-settings-subtitle">' + ui.choose + '</p></div>' +
            '<button class="ca-consent-close" data-consent-close type="button" aria-label="' + ui.close + '">×</button>' +
          '</div>' +
          '<div class="ca-consent-settings-intro">' +
            '<p>' + ui.intro1 + '</p>' +
            '<p>' + ui.intro2 + '<a class="ca-consent-policy-link" href="' + policyUrl + '"><strong>' + ui.policy + '</strong></a>.</p>' +
          '</div>' +
          '<div class="ca-consent-category">' +
            '<div><h3>' + ui.necessary + '</h3><p>' + ui.necessaryText + '</p></div>' +
            '<span class="ca-consent-always-on">' + ui.always + '</span>' +
          '</div>' +
          '<div class="ca-consent-category">' +
            '<div><h3>Google Analytics</h3><p>' + ui.analyticsText + '</p></div>' +
            '<label class="ca-consent-switch" aria-label="' + ui.allowAnalytics + '">' +
              '<input id="caConsentAnalytics" type="checkbox"/>' +
              '<span aria-hidden="true"></span>' +
            '</label>' +
          '</div>' +
          '<div class="ca-consent-category">' +
            '<div><h3>Google Maps</h3><p>' + ui.mapsText + '</p></div>' +
            '<label class="ca-consent-switch" aria-label="' + ui.allowMaps + '">' +
              '<input id="caConsentExternal" type="checkbox"/>' +
              '<span aria-hidden="true"></span>' +
            '</label>' +
          '</div>' +
          '<div class="ca-consent-settings-actions">' +
            '<button class="ca-consent-button ca-consent-configure" data-consent-withdraw type="button">' + ui.withdraw + '</button>' +
            '<button class="ca-consent-button" data-consent-save type="button">' + ui.save + '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', bannerMarkup + settingsMarkup);
    banner = document.getElementById('caConsentBanner');
    settings = document.getElementById('caConsentSettings');
    analyticsToggle = document.getElementById('caConsentAnalytics');
    externalToggle = document.getElementById('caConsentExternal');

    banner.querySelector('[data-consent-accept]').addEventListener('click', function(){ writeState({ external:true, analytics:true }); }, false);
    banner.querySelector('[data-consent-reject]').addEventListener('click', function(){ writeState({ external:false, analytics:false }); }, false);
    banner.querySelector('[data-consent-configure]').addEventListener('click', openSettings, false);
    settings.querySelector('[data-consent-close]').addEventListener('click', function(){ closeSettings(true); }, false);
    settings.querySelector('[data-consent-withdraw]').addEventListener('click', function(){
      if (analyticsToggle) analyticsToggle.checked = false;
      if (externalToggle) externalToggle.checked = false;
      writeState({ external:false, analytics:false });
    }, false);
    settings.querySelector('[data-consent-save]').addEventListener('click', function(){
      writeState({ external: !!(externalToggle && externalToggle.checked), analytics: !!(analyticsToggle && analyticsToggle.checked) });
    }, false);
    settings.addEventListener('click', function(event){ if (event.target === settings) closeSettings(true); }, false);
    document.addEventListener('keydown', function(event){ if (event.key === 'Escape' && settings && !settings.hidden) closeSettings(true); }, false);
  }

  function showBanner(){
    if (!banner) return;
    banner.hidden = false;
    document.body.classList.add('ca-consent-open');
  }

  function hideBanner(){
    if (!banner) return;
    banner.hidden = true;
    document.body.classList.remove('ca-consent-open');
  }

  function openSettings(event){
    if (event && event.preventDefault) event.preventDefault();
    if (!settings) return;
    lastFocusedElement = event && event.currentTarget ? event.currentTarget : document.activeElement;
    if (analyticsToggle) analyticsToggle.checked = state.decided ? state.analytics : false;
    if (externalToggle) externalToggle.checked = state.decided ? state.external : false;
    settings.hidden = false;
    document.body.classList.add('ca-consent-settings-open');
    var close = settings.querySelector('[data-consent-close]');
    if (close) close.focus();
  }

  function closeSettings(restoreFocus){
    if (!settings) return;
    settings.hidden = true;
    document.body.classList.remove('ca-consent-settings-open');
    if (restoreFocus && lastFocusedElement && lastFocusedElement.focus) lastFocusedElement.focus();
  }

  function installFooterSettingsLinks(){
    var legalHref = siteUrl(currentLanguage === 'ca' ? 'cat/avis-legal.html' : 'aviso-legal.html');
    var privacyHref = siteUrl(currentLanguage === 'ca' ? 'cat/privacitat.html' : 'privacidad.html');
    var cookiesHref = siteUrl(currentLanguage === 'ca' ? 'cat/politica-cookies.html' : 'politica-cookies.html');

    Array.prototype.forEach.call(document.querySelectorAll('.footer-legal'), function(footer){
      var group = footer.querySelector('.footer-legal-links');
      if (group) {
        group.innerHTML =
          '<a class="footer-legal-link" href="' + legalHref + '">' + ui.legal + '</a> ' +
          '<span aria-hidden="true">·</span> ' +
          '<a class="footer-legal-link" href="' + privacyHref + '">' + ui.privacyLink + '</a> ' +
          '<span aria-hidden="true">·</span> ' +
          '<a class="footer-legal-link" href="' + cookiesHref + '">' + ui.cookies + '</a> ' +
          '<span aria-hidden="true">·</span> ' +
          '<button class="ca-cookie-settings-link" type="button" data-cookie-settings>' + ui.settingsLink + '</button>';
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-cookie-settings]'), function(button){
      if (button.getAttribute('data-cookie-settings-bound') === 'true') return;
      button.setAttribute('data-cookie-settings-bound', 'true');
      button.addEventListener('click', openSettings, false);
    });
  }

  function init(){
    createInterface();
    installFooterSettingsLinks();
    installAnalyticsClickTracking();

    var stored = readStoredState();
    if (stored) {
      state = stored;
      hideBanner();
    } else {
      showBanner();
    }

    applyConsent();
  }

  window.CAConsent = {
    getPreferences: getPublicState,
    hasConsent: hasConsent,
    openSettings: openSettings,
    services: SERVICE_CONFIG
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, false);
  else init();
}());
