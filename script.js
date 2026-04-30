// MOBILE MENU
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');

if (menuToggle && navMobile) {
  menuToggle.addEventListener('click', () => {
    navMobile.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('active');
      menuToggle.classList.remove('open');
    });
  });
}

// IMPLANT CALCULATOR
const calcStep1 = document.getElementById('calcStep1');
const calcStep2 = document.getElementById('calcStep2');
const calcResult = document.getElementById('calcResult');
const calcText = document.getElementById('calcText');
let selectedTeeth = '';

const teethButtons = calcStep1?.querySelectorAll('.calc-btn');
const boneButtons = calcStep2?.querySelectorAll('.calc-btn');

teethButtons?.forEach(btn => {
  btn.addEventListener('click', () => {
    selectedTeeth = btn.dataset.value;
    teethButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    calcStep1.classList.add('hidden');
    calcStep2.classList.remove('hidden');
  });
});

boneButtons?.forEach(btn => {
  btn.addEventListener('click', () => {
    const bone = btn.dataset.bone;
    boneButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    let result = '';
    switch (selectedTeeth) {
      case '1':
        result = '<strong>Plan sugerido: 1 implante unitario.</strong><br>';
        if (bone === 'no' || bone === 'injerto') result += 'Incluye evaluación de hueso y posible injerto óseo.<br>';
        result += 'Tiempo estimado: 1 a 3 meses.<br>Consulta gratuita para evaluar tu caso.';
        break;
      case '2-3':
        result = '<strong>Plan sugerido: 2 a 3 implantes unitarios.</strong><br>';
        if (bone === 'no' || bone === 'injerto') result += 'Evaluaremos hueso y planificaremos con tecnología 3D.<br>';
        result += 'Tiempo estimado: 3 a 4 meses.<br>Consulta gratuita para presupuesto personalizado.';
        break;
      case '4+':
        result = '<strong>Plan sugerido: Rehabilitación con múltiples implantes.</strong><br>';
        if (bone === 'no' || bone === 'injerto') result += 'Posible necesidad de regeneración ósea previa.<br>';
        result += 'Tiempo estimado: 4 a 6 meses.<br>Consulta gratuita para diseñar tu plan.';
        break;
      case 'total':
        result = '<strong>Plan sugerido: Arcada completa sobre implantes (All-on-4 o similar).</strong><br>';
        if (bone === 'no' || bone === 'injerto') result += 'Evaluación completa de hueso disponible.<br>';
        result += 'Tiempo estimado: 4 a 8 meses.<br>Consulta gratuita para evaluar tu caso.';
        break;
    }

    calcText.innerHTML = result;
    calcStep2.classList.add('hidden');
    calcResult.classList.remove('hidden');
  });
});

// ANIMATED COUNTER
function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.counter);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 16);
  });
}

// INTERSECTION OBSERVER FOR ANIMATIONS
const observerOptions = { threshold: 0.3 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.hasAttribute('data-counter')) {
        animateCounters();
      }
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.trust-score, [data-counter]').forEach(el => {
  observer.observe(el);
});

// SMOOTH SCROLL FOR ANCHOR LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
