/* =====================================================================
   [REF JS-BLOG-INDEX-01] MAPA DEL JAVASCRIPT DEL BLOG
   =====================================================================
     JS-BLOG-HEADER-01   cabecera móvil según la dirección del scroll
     JS-BLOG-CALL-01     evita dos llamadas visibles a la vez
   ===================================================================== */

/* =====================================================================
   MINI GUÍA DEL JAVASCRIPT DEL BLOG
   =====================================================================

   Este archivo controla únicamente comportamientos de móvil del blog:
     - la cabecera se esconde al bajar y vuelve al subir;
     - la barra flotante de llamada se oculta si ya hay otro teléfono visible.

   IntersectionObserver detecta cuándo un elemento entra en la pantalla.
   updateWithRectangles() es una alternativa para navegadores antiguos.
   ===================================================================== */

/* =====================================================================
   CARANDELL ADVOCATS — JAVASCRIPT DEL BLOG
   =====================================================================

   FUNCIONES EN MÓVIL
   1. Ocultar la cabecera al bajar y recuperarla al subir.
   2. Mantener visible la llamada flotante mientras no haya otra llamada
      fija visible en pantalla.
   3. Ocultar la llamada flotante cuando aparece:
      - el panel negro de contacto del listado;
      - la tarjeta dorada del artículo;
      - el reclamo negro final del artículo;
      - el teléfono del pie.

   Los textos y estilos se modifican en HTML/CSS, no en este archivo.
   ===================================================================== */

(function () {
  'use strict';

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, false);
    } else {
      callback();
    }
  }

  ready(function () {
    var header = document.getElementById('siteHeader');
    var floatingCall = document.querySelector('.blog-mobile-call');
    var lastScroll = window.pageYOffset || 0;
    var threshold = 14;

    /* ---------------------------------------------------------------
       [REF JS-BLOG-HEADER-01] CABECERA MÓVIL
       --------------------------------------------------------------- */
    if (header) {
      window.addEventListener('scroll', function () {
        var currentScroll = window.pageYOffset || 0;
        var isMobile = window.innerWidth <= 820;

        if (!isMobile || currentScroll < 18) {
          header.classList.remove('hidden-nav');
          lastScroll = currentScroll;
          return;
        }

        if (currentScroll > lastScroll + threshold) {
          header.classList.add('hidden-nav');
          lastScroll = currentScroll;
        } else if (currentScroll < lastScroll - threshold) {
          header.classList.remove('hidden-nav');
          lastScroll = currentScroll;
        }
      }, { passive: true });
    }

    /* ---------------------------------------------------------------
       [REF JS-BLOG-SCROLL-PANELS-01] PANELES DE CONTACTO EN PC
       ---------------------------------------------------------------
       Seguimiento fluido sin translateY ni cálculos de posición por frame.

       Cada panel tiene solo tres estados:
       - normal: antes de llegar a su posición de seguimiento;
       - fixed: acompaña el scroll con position:fixed;
       - stopped: queda anclado dentro de su contenedor al llegar al límite.

       Índice del blog:
       se detiene con su borde inferior alineado con la última publicación.

       Artículos:
       se detiene en el momento en que el CTA negro final empieza a entrar
       por la parte inferior de la ventana.
       --------------------------------------------------------------- */
    var DESKTOP_SCROLL_MIN = 981;
    var PANEL_VIEWPORT_TOP = 154;

    function createScrollFollower(container, panel, stopMode, stopElement) {
      if (!container || !panel) return null;

      var metrics = null;
      var currentState = '';

      function clearState() {
        panel.classList.remove('is-scroll-following', 'is-scroll-stopped');
        panel.style.removeProperty('--scroll-panel-left');
        panel.style.removeProperty('--scroll-panel-width');
        panel.style.removeProperty('--scroll-panel-stop-top');
        currentState = '';
      }

      function setState(nextState) {
        if (currentState === nextState) return;

        panel.classList.toggle(
          'is-scroll-following',
          nextState === 'following'
        );
        panel.classList.toggle(
          'is-scroll-stopped',
          nextState === 'stopped'
        );
        currentState = nextState;
      }

      function measure() {
        clearState();

        if (window.innerWidth < DESKTOP_SCROLL_MIN) {
          metrics = null;
          return;
        }

        var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        var viewportHeight =
          window.innerHeight || document.documentElement.clientHeight;
        var panelRect = panel.getBoundingClientRect();
        var containerRect = container.getBoundingClientRect();
        var panelDocumentTop = scrollY + panelRect.top;
        var containerDocumentTop = scrollY + containerRect.top;
        var containerDocumentBottom = containerDocumentTop + container.offsetHeight;

        var startScrollY = panelDocumentTop - PANEL_VIEWPORT_TOP;
        var latestStopScrollY =
          containerDocumentBottom - panelRect.height - PANEL_VIEWPORT_TOP;
        var stopScrollY = latestStopScrollY;

        if (stopMode === 'cta' && stopElement) {
          var stopRect = stopElement.getBoundingClientRect();
          var stopDocumentTop = scrollY + stopRect.top;

          /* La tarjeta deja de seguir exactamente cuando el CTA negro
             empieza a aparecer por la parte inferior de la ventana. */
          stopScrollY = Math.min(
            stopDocumentTop - viewportHeight,
            latestStopScrollY
          );
        }

        stopScrollY = Math.max(startScrollY, stopScrollY);

        var stopTopInsideContainer =
          stopScrollY + PANEL_VIEWPORT_TOP - containerDocumentTop;
        var maximumTopInsideContainer = Math.max(
          0,
          container.offsetHeight - panelRect.height
        );

        stopTopInsideContainer = Math.max(
          0,
          Math.min(stopTopInsideContainer, maximumTopInsideContainer)
        );

        panel.style.setProperty(
          '--scroll-panel-left',
          panelRect.left + 'px'
        );
        panel.style.setProperty(
          '--scroll-panel-width',
          panelRect.width + 'px'
        );
        panel.style.setProperty(
          '--scroll-panel-stop-top',
          stopTopInsideContainer + 'px'
        );

        metrics = {
          startScrollY:startScrollY,
          stopScrollY:stopScrollY
        };

        update();
      }

      function update() {
        if (!metrics || window.innerWidth < DESKTOP_SCROLL_MIN) {
          if (currentState) clearState();
          return;
        }

        var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

        if (scrollY < metrics.startScrollY) {
          setState('normal');
        } else if (scrollY < metrics.stopScrollY) {
          setState('following');
        } else {
          setState('stopped');
        }
      }

      return {
        measure:measure,
        update:update,
        clear:clearState
      };
    }

    var blogGrid = document.querySelector('.blog-grid');
    var blogReadyPanel = blogGrid
      ? blogGrid.querySelector('.blog-ready-panel')
      : null;
    var articleLayout = document.querySelector('.article-layout-wide');
    var articleContactCard = articleLayout
      ? articleLayout.querySelector('.article-contact-card')
      : null;
    var articleFinalCta = articleLayout
      ? articleLayout.querySelector('.article-final-cta')
      : null;

    var blogFollower = createScrollFollower(
      blogGrid,
      blogReadyPanel,
      'container',
      null
    );
    var articleFollower = createScrollFollower(
      articleLayout,
      articleContactCard,
      'cta',
      articleFinalCta
    );
    var scrollFollowers = [blogFollower, articleFollower].filter(Boolean);

    if (scrollFollowers.length) {
      function updateScrollFollowers() {
        scrollFollowers.forEach(function (follower) {
          follower.update();
        });
      }

      function measureScrollFollowers() {
        scrollFollowers.forEach(function (follower) {
          follower.measure();
        });
      }

      window.addEventListener('scroll', updateScrollFollowers, {
        passive:true
      });

      window.addEventListener('resize', measureScrollFollowers, false);
      window.addEventListener('load', measureScrollFollowers, false);

      /* Las fuentes web pueden alterar unos píxeles el alto tras DOMContentLoaded.
         Esta segunda medición deja los límites definitivos sin animaciones. */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(measureScrollFollowers).catch(function () {});
      }

      measureScrollFollowers();
    }

    /* ---------------------------------------------------------------
       [REF JS-BLOG-CALL-01] EVITAR DOS BOTONES DE LLAMADA A LA VEZ
       --------------------------------------------------------------- */
    if (!floatingCall) return;

    var staticCallTargets = Array.prototype.slice.call(
      document.querySelectorAll(
        '.blog-ready-panel [data-copy-phone], ' +
        '.article-contact-card [data-copy-phone], ' +
        '.article-final-cta [data-copy-phone], ' +
        '.footer-contact-details'
      )
    );

    function setFloatingCallSuppressed(suppressed) {
      floatingCall.classList.toggle(
        'is-suppressed-by-static',
        Boolean(suppressed)
      );
    }

    /* Alternativa para navegadores antiguos sin IntersectionObserver. */
    function updateWithRectangles() {
      if (window.innerWidth > 820) {
        setFloatingCallSuppressed(false);
        return;
      }

      var viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      var staticCallIsVisible = staticCallTargets.some(function (target) {
        var rectangle = target.getBoundingClientRect();
        return rectangle.bottom > 0 && rectangle.top < viewportHeight;
      });

      setFloatingCallSuppressed(staticCallIsVisible);
    }

    if ('IntersectionObserver' in window && staticCallTargets.length) {
      var visibility = staticCallTargets.map(function () {
        return false;
      });

      try {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            var targetIndex = staticCallTargets.indexOf(entry.target);
            if (targetIndex !== -1) {
              visibility[targetIndex] = entry.isIntersecting;
            }
          });

          setFloatingCallSuppressed(
            visibility.some(function (isVisible) {
              return isVisible;
            })
          );
        }, {
          threshold:0.08
        });

        staticCallTargets.forEach(function (target) {
          observer.observe(target);
        });
      } catch (error) {
        window.addEventListener('scroll', updateWithRectangles, {
          passive:true
        });
        window.addEventListener('resize', updateWithRectangles, false);
        updateWithRectangles();
      }
    } else {
      window.addEventListener('scroll', updateWithRectangles, {
        passive:true
      });
      window.addEventListener('resize', updateWithRectangles, false);
      updateWithRectangles();
    }
  });
}());
