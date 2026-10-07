/* =====================================================================
   [REF JS-HOME-INDEX-01] MAPA DEL JAVASCRIPT DE PORTADA
   =====================================================================
     JS-HOME-HEADER-01       ocultar/mostrar cabecera en móvil
     JS-HOME-STICKY-01       barra flotante de llamada
     JS-HOME-REVIEWS-01      carrusel de reseñas
     JS-HOME-CAROUSEL-01     carrusel de fotografías

   Para cambios de texto normalmente NO necesitas editar este archivo.
   ===================================================================== */

/* =====================================================================
   MINI GUÍA DEL JAVASCRIPT DE LA PORTADA
   =====================================================================

   Este archivo controla:
     - ocultar/mostrar la cabecera al desplazarse;
     - evitar dos botones de llamada visibles a la vez;
     - carrusel de reseñas;
     - carrusel móvil de fotografías;
     - comportamiento del logotipo al volver arriba.

   Los tiempos están expresados en milisegundos:
     1000 = 1 segundo, 2500 = 2,5 segundos, 4000 = 4 segundos.

   Antes de modificar una función, busca en el HTML los ids o clases que usa.
   Si un selector no encuentra el elemento, la función suele detenerse con
   una condición como: if (!elemento) return;
   ===================================================================== */

/* =====================================================================
   CARANDELL ADVOCATS — JAVASCRIPT DE LA PÁGINA PRINCIPAL
   =====================================================================

   Este archivo controla:
   1. La cabecera que aparece y desaparece al hacer scroll.
   2. El carrusel de fotografías en móvil.
   3. El carrusel de reseñas.
   4. El carrusel de Maria y su formación.

   Recomendación: modifica un bloque cada vez y conserva una copia anterior.
   ===================================================================== */

/* ------------------------------------------------------------------
   BLOQUE ORIGINAL DE JAVASCRIPT 2
   Se conserva el orden porque varios comportamientos dependen de él.
   ------------------------------------------------------------------ */
(function(){
  'use strict';

  function ready(callback){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, false);
    } else {
      callback();
    }
  }

  ready(function(){
    var header = document.getElementById('siteHeader');
    var lastY = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (header) {
      window.addEventListener('scroll', function(){
        var y = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
        var difference = y - lastY;

        if (window.innerWidth <= 820) {
          /* En móvil se oculta tras un desplazamiento corto hacia abajo
             y reaparece al desplazarse hacia arriba o volver al inicio. */
          if (y <= 8) {
            header.classList.remove('hidden-nav');
          } else if (y > 28 && difference > 2) {
            header.classList.add('hidden-nav');
          } else if (difference < -2) {
            header.classList.remove('hidden-nav');
          }
        } else {
          header.classList.toggle('hidden-nav', y > 180 && y > lastY);
        }

        lastY = y;
      }, {passive:true});
    }

    document.addEventListener('mousemove', function(event){
      if (!header || window.innerWidth <= 820) return;
      if (event.clientY <= 28) header.classList.remove('hidden-nav');
    }, false);

    /* [REF JS-HOME-STICKY-01] Elementos que deciden cuándo mostrar la llamada flotante. */
    var mobileContactBar = document.querySelector('.mobile-contact-bar');
    var heroContactActions = document.getElementById('heroContactActions');
    var mobileSectionContactActions = document.getElementById('mobileContactActions');
    var footerContactDetails = document.querySelector('.footer-contact-details');

    function updateMobileBar(show){
      if (!mobileContactBar) return;
      mobileContactBar.classList.toggle('is-visible', show);
      document.body.classList.toggle('mobile-contact-visible', show);
    }

    var stickyTargets = [];
    if (heroContactActions) stickyTargets.push(heroContactActions);
    if (mobileSectionContactActions) stickyTargets.push(mobileSectionContactActions);
    if (footerContactDetails) stickyTargets.push(footerContactDetails);

    function updateStickyFallback(){
      var duplicated = false;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      stickyTargets.forEach(function(target){
        var rect = target.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < viewportHeight) duplicated = true;
      });

      updateMobileBar(!duplicated);
    }

    if ('IntersectionObserver' in window && stickyTargets.length) {
      var visibility = [];

      stickyTargets.forEach(function(target, index){
        visibility[index] = false;
      });

      try {
        var observer = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            var targetIndex = stickyTargets.indexOf(entry.target);
            if (targetIndex !== -1) visibility[targetIndex] = entry.isIntersecting;
          });

          var duplicated = visibility.some(function(value){ return value; });
          updateMobileBar(!duplicated);
        }, {threshold:0.08});

        stickyTargets.forEach(function(target){
          observer.observe(target);
        });
      } catch (error) {
        window.addEventListener('scroll', updateStickyFallback, false);
        window.addEventListener('resize', updateStickyFallback, false);
        updateStickyFallback();
      }
    } else {
      window.addEventListener('scroll', updateStickyFallback, false);
      window.addEventListener('resize', updateStickyFallback, false);
      updateStickyFallback();
    }

    /* [REF JS-HOME-REVIEWS-01] Carrusel de reseñas: elementos, índice y temporizador. */
    var slides = Array.prototype.slice.call(document.querySelectorAll('.review-slide'));
    var dotsWrap = document.getElementById('reviewDots');
    var previousButton = document.getElementById('prevReview');
    var nextButton = document.getElementById('nextReview');
    var reviewIndex = 0;
    var reviewTimer = null;
    var dots = [];

    function showReview(index, userTriggered){
      if (!slides.length) return;
      reviewIndex = (index + slides.length) % slides.length;

      slides.forEach(function(slide, slideIndex){
        slide.classList.toggle('active', slideIndex === reviewIndex);
      });

      dots.forEach(function(dot, dotIndex){
        dot.classList.toggle('active', dotIndex === reviewIndex);
      });

      if (userTriggered) restartReviews();
    }

    function restartReviews(){
      if (!slides.length) return;
      window.clearInterval(reviewTimer);
      reviewTimer = window.setInterval(function(){
        showReview(reviewIndex + 1, false);
      }, 4000);
    }

    if (slides.length && dotsWrap) {
      dotsWrap.innerHTML = '';

      slides.forEach(function(_, index){
        var button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', ((document.documentElement.lang || 'es').toLowerCase().indexOf('ca') === 0 ? 'Mostrar ressenya ' : 'Mostrar reseña ') + (index + 1));
        button.addEventListener('click', function(){
          showReview(index, true);
        }, false);
        dotsWrap.appendChild(button);
      });

      dots = Array.prototype.slice.call(dotsWrap.children);

      if (previousButton) {
        previousButton.addEventListener('click', function(){
          showReview(reviewIndex - 1, true);
        }, false);
      }

      if (nextButton) {
        nextButton.addEventListener('click', function(){
          showReview(reviewIndex + 1, true);
        }, false);
      }

      showReview(0, false);
      restartReviews();
    }

    Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function(element){
      element.classList.add('visible');
    });

  });
})();

/* ------------------------------------------------------------------
   BLOQUE ORIGINAL DE JAVASCRIPT 3
   Se conserva el orden porque varios comportamientos dependen de él.
   ------------------------------------------------------------------ */
(function(){
  'use strict';

  function initCarousel(){
    /* [REF JS-HOME-CAROUSEL-01] Carrusel móvil de fotografías del despacho. */
    var carousel = document.getElementById('mobileOfficeCarousel');
    if (!carousel) return;

    var slides = Array.prototype.slice.call(
      carousel.querySelectorAll('[data-mobile-office-slide]')
    );
    var dots = Array.prototype.slice.call(
      carousel.querySelectorAll('[data-mobile-office-dot]')
    );
    var previous = carousel.querySelector('.mobile-office-prev');
    var next = carousel.querySelector('.mobile-office-next');

    if (!slides.length) return;

    var index = 0;
    var timer = null;
    var autoplayDelay = 2500;
    var touchStartX = 0;

    function applyState(){
      slides.forEach(function(slide, slideIndex){
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function(dot, dotIndex){
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function showSlide(newIndex){
      index = (newIndex + slides.length) % slides.length;
      applyState();
    }

    function restartTimer(){
      window.clearInterval(timer);

      var reducedMotion = false;
      if (window.matchMedia) {
        reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
      if (reducedMotion) return;

      timer = window.setInterval(function(){
        showSlide(index + 1);
      }, autoplayDelay);
    }

    function goTo(newIndex){
      showSlide(newIndex);
      restartTimer();
    }

    if (previous) {
      previous.addEventListener('click', function(){
        goTo(index - 1);
      }, false);
    }

    if (next) {
      next.addEventListener('click', function(){
        goTo(index + 1);
      }, false);
    }

    dots.forEach(function(dot, dotIndex){
      dot.addEventListener('click', function(){
        goTo(dotIndex);
      }, false);
    });

    carousel.addEventListener('touchstart', function(event){
      if (!event.changedTouches || !event.changedTouches.length) return;
      touchStartX = event.changedTouches[0].clientX;
    }, false);

    carousel.addEventListener('touchend', function(event){
      if (!event.changedTouches || !event.changedTouches.length) return;

      var touchEndX = event.changedTouches[0].clientX;
      var distance = touchEndX - touchStartX;

      if (Math.abs(distance) < 42) return;
      goTo(distance < 0 ? index + 1 : index - 1);
    }, false);

    document.addEventListener('visibilitychange', function(){
      if (document.hidden) {
        window.clearInterval(timer);
      } else {
        restartTimer();
      }
    }, false);

    showSlide(0);
    restartTimer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel, false);
  } else {
    initCarousel();
  }
})();

/* [REF JS-HOME-MARIA-PROFILE-01] Carrusel de Maria: foto y formación. */
/* Autoplay independiente en PC y móvil. Una interacción del usuario pausa
   el carrusel; el siguiente scroll de página reactiva el movimiento. */
(function(){
  'use strict';

  function initMariaProfileCarousels(){
    var carousels = Array.prototype.slice.call(
      document.querySelectorAll('[data-maria-profile-carousel]')
    );
    if (!carousels.length) return;

    var instances = [];
    var autoplayDelay = 4000;

    function reducedMotion(){
      return !!(window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    carousels.forEach(function(carousel){
      var slides = Array.prototype.slice.call(
        carousel.querySelectorAll('[data-maria-profile-slide]')
      );
      var dots = Array.prototype.slice.call(
        carousel.querySelectorAll('[data-maria-profile-dot]')
      );
      var previous = carousel.querySelector('.maria-profile-prev');
      var next = carousel.querySelector('.maria-profile-next');

      if (slides.length < 2) return;

      var index = 0;
      var timer = null;
      var pausedByUser = false;
      var touchStartX = 0;
      var touchStartY = 0;

      function applyState(){
        slides.forEach(function(slide, slideIndex){
          slide.classList.toggle('is-active', slideIndex === index);
        });
        dots.forEach(function(dot, dotIndex){
          dot.classList.toggle('is-active', dotIndex === index);
        });
        carousel.classList.toggle(
          'is-card-active',
          slides[index] && slides[index].classList.contains('maria-profile-card')
        );
      }

      function showSlide(newIndex){
        index = (newIndex + slides.length) % slides.length;
        applyState();
      }

      function clearTimer(){
        window.clearInterval(timer);
        timer = null;
      }

      function startTimer(){
        clearTimer();
        if (pausedByUser || document.hidden || reducedMotion()) return;
        timer = window.setInterval(function(){
          showSlide(index + 1);
        }, autoplayDelay);
      }

      function pauseByUser(){
        pausedByUser = true;
        clearTimer();
      }

      function resumeAfterScroll(){
        if (!pausedByUser) return;
        pausedByUser = false;
        startTimer();
      }

      function manualGo(newIndex){
        showSlide(newIndex);
        pauseByUser();
      }

      if (previous) {
        previous.addEventListener('click', function(event){
          event.preventDefault();
          event.stopPropagation();
          manualGo(index - 1);
        }, false);
      }

      if (next) {
        next.addEventListener('click', function(event){
          event.preventDefault();
          event.stopPropagation();
          manualGo(index + 1);
        }, false);
      }

      dots.forEach(function(dot, dotIndex){
        dot.addEventListener('click', function(event){
          event.preventDefault();
          event.stopPropagation();
          manualGo(dotIndex);
        }, false);
      });

      /* Pulsar o tocar el componente lo pausa aunque no se use un control. */
      carousel.addEventListener('pointerdown', function(){
        pauseByUser();
      }, false);

      carousel.addEventListener('touchstart', function(event){
        if (!event.changedTouches || !event.changedTouches.length) return;
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
        pauseByUser();
      }, {passive:true});

      carousel.addEventListener('touchend', function(event){
        if (!event.changedTouches || !event.changedTouches.length) return;
        var touchEndX = event.changedTouches[0].clientX;
        var touchEndY = event.changedTouches[0].clientY;
        var distanceX = touchEndX - touchStartX;
        var distanceY = touchEndY - touchStartY;

        /* Solo cambia de pestaña cuando el gesto es claramente horizontal. */
        if (Math.abs(distanceX) < 42 || Math.abs(distanceX) <= Math.abs(distanceY)) return;
        showSlide(distanceX < 0 ? index + 1 : index - 1);
      }, {passive:true});

      applyState();
      startTimer();

      instances.push({
        clearTimer: clearTimer,
        startTimer: startTimer,
        resumeAfterScroll: resumeAfterScroll
      });
    });

    /* El primer scroll posterior a una pausa reactiva el autoplay solicitado. */
    window.addEventListener('scroll', function(){
      instances.forEach(function(instance){
        instance.resumeAfterScroll();
      });
    }, {passive:true});

    document.addEventListener('visibilitychange', function(){
      instances.forEach(function(instance){
        if (document.hidden) instance.clearTimer();
        else instance.startTimer();
      });
    }, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMariaProfileCarousels, false);
  } else {
    initMariaProfileCarousels();
  }
})();

