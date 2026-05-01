/**
 * SISTEMA DE TRACKING DE CONVERSIONES
 * GA4 + Meta Pixel + Eventos WhatsApp
 * Clinica Dental - La sonrisa feliz
 */

(function() {
  'use strict';

  // Configuración - REEMPLAZAR con IDs reales
  const CONFIG = {
    GA4_ID: 'G-XXXXXXXXXX', // Reemplazar con ID real de GA4
    META_PIXEL_ID: '000000000000000', // Reemplazar con ID real de Meta Pixel
    debug: true // Cambiar a false en producción
  };

  // Estado de tracking
  const state = {
    scrollTracked: { 25: false, 50: false, 75: false, 90: false },
    whatsappClicked: false,
    calculatorUsed: false
  };

  // ============ UTILIDADES ============
  function log(message, data = {}) {
    if (CONFIG.debug && window.console) {
      console.log(`[Tracking] ${message}`, data);
    }
  }

  function isGTMAvailable() {
    return typeof window.gtag === 'function';
  }

  function isMetaPixelAvailable() {
    return typeof window.fbq === 'function';
  }

  // ============ GOOGLE ANALYTICS 4 ============
  function trackGA4Event(eventName, params = {}) {
    if (isGTMAvailable()) {
      gtag('event', eventName, {
        ...params,
        send_to: CONFIG.GA4_ID
      });
      log(`GA4 Event: ${eventName}`, params);
    }
  }

  // ============ META PIXEL ============
  function trackMetaEvent(eventName, params = {}) {
    if (isMetaPixelAvailable()) {
      fbq('track', eventName, params);
      log(`Meta Pixel Event: ${eventName}`, params);
    }
  }

  // ============ EVENTOS WHATSAPP ============
  function trackWhatsAppClick(buttonType, section) {
    const eventData = {
      button_type: buttonType, // 'primary', 'secondary', 'float', 'nav'
      section: section, // 'hero', 'services', 'calculator', 'cta_final', etc.
      timestamp: new Date().toISOString()
    };

    // GA4
    trackGA4Event('whatsapp_click', {
      event_category: 'engagement',
      event_label: `${buttonType}_${section}`,
      ...eventData
    });

    // Meta Pixel - Evento de contacto
    trackMetaEvent('Contact', {
      content_category: 'WhatsApp',
      content_name: buttonType,
      ...eventData
    });

    // Guardar en sessionStorage para attribution
    sessionStorage.setItem('whatsapp_clicked', 'true');
    sessionStorage.setItem('whatsapp_timestamp', eventData.timestamp);
    sessionStorage.setItem('whatsapp_source', section);
  }

  // ============ EVENTOS CALCULADORA ============
  function trackCalculatorStart() {
    trackGA4Event('calculator_start', {
      event_category: 'engagement',
      event_label: 'calculator_started'
    });
    trackMetaEvent('InitiateCheckout', {
      content_category: 'Calculator',
      content_name: 'Implant Calculator'
    });
  }

  function trackCalculatorComplete(implants, bone) {
    const eventData = {
      implants_needed: implants,
      bone_available: bone,
      event_category: 'conversion',
      event_label: 'calculator_completed'
    };

    trackGA4Event('calculator_complete', eventData);
    trackMetaEvent('SubmitApplication', {
      content_category: 'Calculator',
      content_name: 'Implant Calculator Complete',
      ...eventData
    });

    state.calculatorUsed = true;
  }

  // ============ SCROLL DEPTH ============
  function trackScrollDepth() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    const thresholds = [25, 50, 75, 90];
    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !state.scrollTracked[threshold]) {
        state.scrollTracked[threshold] = true;

        trackGA4Event('scroll_depth', {
          event_category: 'engagement',
          event_label: `${threshold}%`,
          scroll_percentage: threshold
        });

        trackMetaEvent('Scroll', {
          content_category: 'Scroll Depth',
          content_name: `${threshold}%`
        });

        log(`Scroll depth: ${threshold}%`);
      }
    });
  }

  // ============ TIEMPO EN PÁGINA ============
  let startTime = Date.now();
  function trackTimeOnPage() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    if (timeSpent === 30) {
      trackGA4Event('time_on_page_30s', { event_category: 'engagement' });
    } else if (timeSpent === 60) {
      trackGA4Event('time_on_page_60s', { event_category: 'engagement' });
    } else if (timeSpent === 180) {
      trackGA4Event('time_on_page_180s', { event_category: 'engagement' });
    }
  }

  // ============ ASIGNAR EVENTOS ============
  function initializeTracking() {
    log('Initializing tracking system...');

    // 1. Tracking de clics en botones de WhatsApp
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        const section = getSectionFromElement(this);
        const buttonType = getButtonType(this);

        trackWhatsAppClick(buttonType, section);

        log('WhatsApp clicked', { buttonText, section, buttonType });
      });
    });

    // 2. Tracking de calculadora
    const calcButtons = document.querySelectorAll('.calc-btn');
    let calcStarted = false;

    calcButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        if (!calcStarted) {
          calcStarted = true;
          trackCalculatorStart();
        }

        // Si es el último paso, trackear completitud
        const step1 = document.getElementById('calcStep1');
        const step2 = document.getElementById('calcStep2');
        const result = document.getElementById('calcResult');

        if (step1.classList.contains('hidden') && step2.classList.contains('hidden') && !result.classList.contains('hidden')) {
          const implants = sessionStorage.getItem('calc_implants') || 'unknown';
          const bone = sessionStorage.getItem('calc_bone') || 'unknown';
          trackCalculatorComplete(implants, bone);
        }
      });
    });

    // Guardar selecciones de calculadora
    const step1Btns = document.querySelectorAll('#calcStep1 .calc-btn');
    step1Btns.forEach(btn => {
      btn.addEventListener('click', function() {
        sessionStorage.setItem('calc_implants', this.getAttribute('data-value'));
      });
    });

    const step2Btns = document.querySelectorAll('#calcStep2 .calc-btn');
    step2Btns.forEach(btn => {
      btn.addEventListener('click', function() {
        sessionStorage.setItem('calc_bone', this.getAttribute('data-one'));
      });
    });

    // 3. Scroll depth tracking (throttled)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 500);
    });

    // 4. Tiempo en página
    setInterval(trackTimeOnPage, 1000);

    // 5. Tracking de clics en teléfono
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', function() {
        trackGA4Event('phone_click', {
          event_category: 'engagement',
          event_label: 'phone_call',
          phone_number: this.getAttribute('href').replace('tel:', '')
        });
        trackMetaEvent('Contact', { content_category: 'Phone' });
      });
    });

    log('Tracking system initialized successfully');
  }

  // ============ HELPERS ============
  function getSectionFromElement(element) {
    const section = element.closest('section');
    if (!section) return 'unknown';

    if (section.classList.contains('hero')) return 'hero';
    if (section.classList.contains('services')) return 'services';
    if (section.classList.contains('calculator')) return 'calculator';
    if (section.classList.contains('before-after')) return 'before_after';
    if (section.classList.contains('testimonials')) return 'testimonials';
    if (section.classList.contains('cta-final')) return 'cta_final';
    if (section.classList.contains('footer')) return 'footer';
    if (element.classList.contains('whatsapp-float')) return 'floating_button';
    if (element.closest('.nav-desktop') || element.closest('.nav-mobile')) return 'navigation';

    return 'other';
  }

  function getButtonType(element) {
    if (element.classList.contains('btn-primary')) return 'primary';
    if (element.classList.contains('btn-outline')) return 'secondary';
    if (element.classList.contains('btn-white')) return 'white';
    if (element.classList.contains('whatsapp-float')) return 'float';
    if (element.classList.contains('btn-sm')) return 'small';
    if (element.classList.contains('btn-lg')) return 'large';
    return 'default';
  }

  // ============ INICIALIZACIÓN ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTracking);
  } else {
    initializeTracking();
  }

})();
