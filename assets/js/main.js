import '../css/style.css'
import 'iconify-icon';
import confetti from 'canvas-confetti';
import beursvloerLogoImg from '../img/beursvloer-logo.png';
import divtagLogoImg from '../img/divtag-logo.svg';

document.querySelector('#app').innerHTML = `
  <div class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-orange-100 to-teal-100">
    <div class="relative z-10 bg-white/80 p-16 rounded-2xl shadow-xl text-center">
      <img src="${beursvloerLogoImg}" alt="Beursvloer Logo" class="mx-auto mb-12 max-w-md w-full">
      <div class="flex flex-wrap justify-center gap-12 mb-16">
        <div class="w-[350px] max-w-full">
          <div class="text-4xl font-semibold text-gray-600 mb-4">Aantal matches</div>
          <div id="matches" class="text-9xl font-bold text-[#f19848] tabular-nums">0</div>
        </div>
        <div class="w-[725px] max-w-full">
          <div class="text-4xl font-semibold text-gray-600 mb-4">Maatschappelijke waarde</div>
          <div id="value" class="text-9xl font-bold text-[#14b8a6] tabular-nums">€0</div>
        </div>
      </div>

      <button class="bg-[#b3a1cb] hover:bg-[#9682b1] text-white text-4xl font-bold py-6 px-16 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer">START</button>
    </div>
  </div>

  <div class="fixed bottom-4 left-4 flex items-center gap-2 text-gray-400">
    <span>Gemaakt door</span>
    <img src="${divtagLogoImg}" alt="Divtag logo" class="w-4">
    <a href="https://divtag.nl" target="_blank" rel="noopener noreferrer" class="hover:underline">divtag.nl</a>
  </div>
  
  <button id="reload-btn" class="fixed bottom-4 right-18 flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full text-gray-700 text-xl cursor-pointer opacity-50 hover:opacity-100 transition-opacity" title="Reset"><iconify-icon icon="lucide:refresh-ccw"></iconify-icon></button>
  <button id="settings-btn" class="fixed bottom-4 right-4 flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full text-gray-700 text-xl cursor-pointer opacity-50 hover:opacity-100 transition-opacity" title="Instellingen"><iconify-icon icon="lucide:settings"></iconify-icon></button>

  <div id="settings-dialog" class="hidden fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
      <h2 class="text-xl font-bold mb-4">Instellingen</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Aantal matches</label>
          <input type="number" id="input-matches" value="453" class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Maatschappelijke waarde (€)</label>
          <input type="number" id="input-value" value="245368" class="w-full px-3 py-2 border rounded">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Duur animatie 'Aantal matches' (ms)</label>
          <input type="number" id="input-duration-matches" value="5000" class="w-full px-3 py-2 border rounded" step="1000">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Duur animatie 'Maatschappelijke waarde' (ms)</label>
          <input type="number" id="input-duration-value" value="7000" class="w-full px-3 py-2 border rounded" step="1000">
        </div>
      </div>
      <div class="flex gap-2 mt-6">
        <button id="save-settings" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">Opslaan</button>
        <button id="cancel-settings" class="flex-1 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded cursor-pointer">Annuleren</button>
      </div>
    </div>
  </div>
`;

let matches = 453;
let value = 245368;
let animationDuration = 5000;
let animationDurationValue = 7000;
let confettiInterval = null;

const startButton = document.querySelector('button');
const matchesDiv = document.querySelector('#matches');
const valueDiv = document.querySelector('#value');
const reloadBtn = document.querySelector('#reload-btn');
const settingsBtn = document.querySelector('#settings-btn');
const settingsDialog = document.querySelector('#settings-dialog');
const saveSettingsBtn = document.querySelector('#save-settings');
const cancelSettingsBtn = document.querySelector('#cancel-settings');

startButton.addEventListener('click', () => {
  animateNumbers();
});

reloadBtn.addEventListener('click', () => {
  window.location.reload();
});

settingsBtn.addEventListener('click', () => {
  document.querySelector('#input-matches').value = matches;
  document.querySelector('#input-value').value = value;
  document.querySelector('#input-duration-matches').value = animationDuration;
  document.querySelector('#input-duration-value').value = animationDurationValue;
  settingsDialog.classList.remove('hidden');
});

saveSettingsBtn.addEventListener('click', () => {
  matches = parseInt(document.querySelector('#input-matches').value);
  value = parseInt(document.querySelector('#input-value').value);
  animationDuration = parseInt(document.querySelector('#input-duration-matches').value) || 5000;
  animationDurationValue = parseInt(document.querySelector('#input-duration-value').value) || 7000;
  settingsDialog.classList.add('hidden');
});

cancelSettingsBtn.addEventListener('click', () => {
  settingsDialog.classList.add('hidden');
});

function animateNumbers() {
  const startTime = Date.now();
  
  // Add animation class for visual effects
  matchesDiv.parentElement.classList.add('animating');
  valueDiv.parentElement.classList.add('animating');
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progressMatches = Math.min(elapsed / animationDuration, 1);
    const progressValue = Math.min(elapsed / animationDurationValue, 1);
    
    // Improved easing for matches with dramatic final second
    let easedMatches;
    if (progressMatches < 0.2) {
      easedMatches = Math.pow(progressMatches / 0.2, 3) * 0.1;
    } else if (progressMatches < 0.75) {
      const t = (progressMatches - 0.2) / 0.55;
      easedMatches = 0.1 + (t * 0.75);
    } else {
      // Dramatic final 25% - exponential slowdown with overshoot feeling
      const t = (progressMatches - 0.75) / 0.25;
      const dramatic = 1 - Math.pow(1 - t, 5);
      easedMatches = 0.85 + (dramatic * 0.15);
    }
    
    // Improved easing for value with dramatic final second
    let easedValue;
    if (progressValue < 0.2) {
      easedValue = Math.pow(progressValue / 0.2, 3) * 0.1;
    } else if (progressValue < 0.75) {
      const t = (progressValue - 0.2) / 0.55;
      easedValue = 0.1 + (t * 0.75);
    } else {
      // Dramatic final 25% - exponential slowdown with overshoot feeling
      const t = (progressValue - 0.75) / 0.25;
      const dramatic = 1 - Math.pow(1 - t, 5);
      easedValue = 0.85 + (dramatic * 0.15);
    }
    
    const currentMatches = Math.floor(matches * easedMatches);
    const currentValue = Math.floor(value * easedValue);
    
    matchesDiv.textContent = currentMatches;
    valueDiv.textContent = '€' + currentValue.toLocaleString('nl-NL');
    
    // Add pulsing effect during fast growth phase for matches
    if (progressMatches > 0.3 && progressMatches < 0.7) {
      const pulseIntensity = Math.sin(progressMatches * Math.PI * 10) * 0.1 + 1;
      matchesDiv.style.transform = `scale(${pulseIntensity})`;
    } else if (progressMatches > 0.85) {
      // Dramatic final moment - intense pulsing and growing scale
      const finalPhase = (progressMatches - 0.85) / 0.15;
      const dramaticPulse = Math.sin(finalPhase * Math.PI * 15) * 0.15 * (1 - finalPhase) + 1;
      const finalGrow = 1 + (finalPhase * 0.1);
      matchesDiv.style.transform = `scale(${dramaticPulse * finalGrow})`;
    } else {
      matchesDiv.style.transform = 'scale(1)';
    }
    
    // Add pulsing effect during fast growth phase for value
    if (progressValue > 0.3 && progressValue < 0.7) {
      const pulseIntensity = Math.sin(progressValue * Math.PI * 10) * 0.1 + 1;
      valueDiv.style.transform = `scale(${pulseIntensity})`;
    } else if (progressValue > 0.85) {
      // Dramatic final moment - intense pulsing and growing scale
      const finalPhase = (progressValue - 0.85) / 0.15;
      const dramaticPulse = Math.sin(finalPhase * Math.PI * 15) * 0.15 * (1 - finalPhase) + 1;
      const finalGrow = 1 + (finalPhase * 0.1);
      valueDiv.style.transform = `scale(${dramaticPulse * finalGrow})`;
    } else {
      valueDiv.style.transform = 'scale(1)';
    }
    
    const bothComplete = progressMatches >= 1 && progressValue >= 1;
    
    if (!bothComplete) {
      requestAnimationFrame(update);
    } else {
      // Ensure final values are displayed exactly
      matchesDiv.textContent = matches;
      valueDiv.textContent = '€' + value.toLocaleString('nl-NL');
      
      // Final "pop" effect
      matchesDiv.style.transform = 'scale(1.15)';
      valueDiv.style.transform = 'scale(1.15)';
      
      setTimeout(() => {
        matchesDiv.style.transform = 'scale(1)';
        valueDiv.style.transform = 'scale(1)';
      }, 200);
      
      // Clean up after animation
      setTimeout(() => {
        matchesDiv.parentElement.classList.remove('animating');
        valueDiv.parentElement.classList.remove('animating');
      }, 400);
      
      // Start confetti after animations complete
      startConfetti();
    }
  }
  
  update();
}

function startConfetti() {
  // Clear any existing interval to prevent speed-up
  if (confettiInterval) {
    clearInterval(confettiInterval);
  }

  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, scalar: 1.75 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Fireworks phase - 5 seconds
  const fireworksDuration = 5000;
  
  confettiInterval = setInterval(function() {
    const particleCount = 50;

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 500);

  // Transition to falling confetti after fireworks
  setTimeout(() => {
    clearInterval(confettiInterval);
    
    // Continuous falling confetti from the entire top of the screen
    const colors = ['#f0960a', '#d2706a', '#b3a1cb', '#f9db72', '#14b8a6'];
    
    confettiInterval = setInterval(function() {
      // Multiple spawn points across the width for better coverage
      const spawnCount = 5;
      for (let i = 0; i < spawnCount; i++) {
        confetti({
          particleCount: 1,
          startVelocity: 0,
          ticks: 600,
          origin: {
            x: Math.random(),
            y: Math.random() * 0.5 - 0.2
          },
          colors: [colors[Math.floor(Math.random() * colors.length)]],
          shapes: ['square', 'circle'],
          gravity: randomInRange(0.4, 0.6),
          scalar: randomInRange(1.5, 2),
          drift: randomInRange(-0.4, 0.4),
          zIndex: 0
        });
      }
    }, 50);
  }, fireworksDuration);
}