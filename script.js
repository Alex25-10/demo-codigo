// Throttle utility
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');

function updateMenuAriaLabel(isOpen) {
  if (menuToggle) {
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu');
  }
}

if (menuToggle && navMobile) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
    updateMenuAriaLabel(!isExpanded);
  });

  // Close mobile menu on link click
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      navMobile.classList.remove('active');
      updateMenuAriaLabel(false);
    });
  });
}

// Header scroll effect with throttle
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 100));
}

// Calculator logic
const calcStep1 = document.getElementById('calcStep1');
const calcStep2 = document.getElementById('calcStep2');
const calcResult = document.getElementById('calcResult');
const calcText = document.getElementById('calcText');

let selectedTeeth = '';
let selectedBone = '';

function resetCalculator() {
  selectedTeeth = '';
  selectedBone = '';
  if (calcStep1) {
    calcStep1.classList.remove('hidden');
    calcStep1.querySelectorAll('.calc-btn').forEach(b => b.classList.remove('active'));
  }
  if (calcStep2) {
    calcStep2.classList.add('hidden');
    calcStep2.querySelectorAll('.calc-btn').forEach(b => b.classList.remove('active'));
  }
  if (calcResult) {
    calcResult.classList.add('hidden');
  }
}

function handleCalcKey(e, btn) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    btn.click();
  }
}

if (calcStep1) {
  const step1Btns = calcStep1.querySelectorAll('.calc-btn');
  step1Btns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedTeeth = btn.getAttribute('data-value');
      step1Btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcStep1.classList.add('hidden');
      calcStep2.classList.remove('hidden');
      // Scroll to step 2 on mobile for smooth UX
      if (window.innerWidth <= 768 && calcStep2) {
        setTimeout(() => calcStep2.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      }
    });
    btn.addEventListener('keydown', (e) => handleCalcKey(e, btn));
  });
}

if (calcStep2) {
  const step2Btns = calcStep2.querySelectorAll('.calc-btn');
  step2Btns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedBone = btn.getAttribute('data-one');
      step2Btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showResult();
    });
    btn.addEventListener('keydown', (e) => handleCalcKey(e, btn));
  });
}

function showResult() {
  if (!calcText || !calcResult || !calcStep2) return;

  let result = '';

  if (selectedTeeth === '1') {
    result = 'Para un solo diente, recomendamos un implante unitario con corona de zirconio. ';
  } else if (selectedTeeth === '2-3') {
    result = 'Para 2-3 dientes recomendamos implantes individuales o un puente sobre implantes. ';
  } else if (selectedTeeth === '4+') {
    result = 'Para 4 o mas dientes evaluamos rehabilitacion con protesis fija sobre implantes. ';
  } else if (selectedTeeth === 'total') {
    result = 'Para arcada completa recomendamos protesis fija sobre 4-6 implantes (carga inmediata). ';
  }

  if (selectedBone === 'no' || selectedBone === 'injerto') {
    result += 'Al no tener hueso suficiente o necesitar injerto, incluimos injerto oseo en el plan. ';
  }

  result += 'La consulta gratuita incluye planificacion 3D para confirmar tu caso exacto.';

  calcText.textContent = result;
  calcStep2.classList.add('hidden');
  calcResult.classList.remove('hidden');

  // Add reset button to result
  if (!calcResult.querySelector('.calc-reset')) {
    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-outline calc-reset';
    resetBtn.textContent = 'Calcular de nuevo';
    resetBtn.type = 'button';
    resetBtn.addEventListener('click', resetCalculator);
    resetBtn.addEventListener('keydown', (e) => handleCalcKey(e, resetBtn));
    calcResult.querySelector('.calc-result-inner').appendChild(resetBtn);
  }

  // Scroll to result on mobile
  if (window.innerWidth <= 768) {
    setTimeout(() => calcResult.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});
