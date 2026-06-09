/* ================================================
   TRUCKFLEET PRO — script.js  v2.0
   Landing page: theme, cursor, auth, animations
   ================================================ */

/* ---- Redirect if already logged in ---- */
if (localStorage.getItem('tfp_session')) {
  window.location.href = 'dashboard.html';
}

/* ---- Theme System ---- */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const htmlEl      = document.documentElement;
const rippleEl    = document.getElementById('theme-ripple');
const flashEl     = document.getElementById('theme-flash');

function applyTheme(theme, animate = false, originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  if (animate && rippleEl) {
    // Position ripple at origin point
    rippleEl.style.left = originX + 'px';
    rippleEl.style.top  = originY + 'px';
    // Reset animation
    rippleEl.className = 'theme-ripple';
    flashEl.className  = 'theme-flash';
    void rippleEl.offsetWidth; // force reflow
    // Fire animations
    rippleEl.className = `theme-ripple to-${theme}`;
    flashEl.className  = `theme-flash flash-${theme}`;
    // Apply theme slightly after ripple starts (so it looks like ripple reveals the new theme)
    setTimeout(() => {
      htmlEl.setAttribute('data-theme', theme);
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
      localStorage.setItem('tfp_theme', theme);
    }, 200);
    // Clean up
    rippleEl.addEventListener('animationend', () => { rippleEl.className = 'theme-ripple'; }, { once: true });
    flashEl.addEventListener('animationend',  () => { flashEl.className  = 'theme-flash';  }, { once: true });
  } else {
    htmlEl.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('tfp_theme', theme);
  }
}

// Load saved theme (no animation on load)
const savedTheme = localStorage.getItem('tfp_theme') || 'dark';
applyTheme(savedTheme, false);

themeToggle.addEventListener('click', (e) => {
  const current = htmlEl.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';
  const rect    = themeToggle.getBoundingClientRect();
  applyTheme(next, true, rect.left + rect.width / 2, rect.top + rect.height / 2);
});

/* ---- Custom Cursor Circle ---- */
const cursorCircle = document.getElementById('cursor-circle');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0;
let circleX = 0, circleY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  // Dot follows instantly
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Smooth circle lag effect
function animateCursor() {
  const ease = 0.12;
  circleX += (mouseX - circleX) * ease;
  circleY += (mouseY - circleY) * ease;
  cursorCircle.style.left = circleX + 'px';
  cursorCircle.style.top = circleY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Expand on hover over interactive elements
document.addEventListener('mouseover', (e) => {
  const el = e.target;
  if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'INPUT'
      || el.tagName === 'SELECT' || el.closest('.feature-card')
      || el.closest('.truck-card')) {
    cursorCircle.classList.add('hover');
  }
});
document.addEventListener('mouseout', () => {
  cursorCircle.classList.remove('hover');
});

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ---- Mobile hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navActions = document.querySelector('.nav-actions');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navActions.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

/* ---- Particle system ---- */
function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 45; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
    p.style.animationDuration = (Math.random() * 14 + 8) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.opacity = Math.random() * 0.25 + 0.05;
    container.appendChild(p);
  }
}
createParticles();

/* ---- Counter animation ---- */
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const step = target / (2000 / 16);
    let current = 0;
    function update() {
      current += step;
      if (current < target) { counter.textContent = Math.floor(current).toLocaleString() + '+'; requestAnimationFrame(update); }
      else counter.textContent = target.toLocaleString() + '+';
    }
    update();
  });
}
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); }
  }, { threshold: 0.3 }).observe(heroStats);
}

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll('.feature-card, .step-card, .cta-card, .section-header');
revealEls.forEach(el => el.classList.add('reveal'));
new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }).observe = (() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => obs.observe(el));
  return obs.observe.bind(obs);
})();

/* ---- Feature card mouse glow ---- */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const glow = card.querySelector('.feature-glow');
    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(237,137,54,0.25) 0%, transparent 60%)`;
    glow.style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => { card.querySelector('.feature-glow').style.opacity = '0'; });
});

/* ---- Truck card 3D tilt ---- */
document.querySelectorAll('.truck-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ---- CAPTCHA Logic ---- */
let captchaData = { signin: '', signup: '' };

function generateCaptchaText(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

window.refreshCaptcha = function(type) {
  const canvas = document.getElementById(`captcha-canvas-${type}`);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear and fill background
  ctx.clearRect(0, 0, width, height);
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  ctx.fillStyle = isLight ? '#f8fafc' : '#0f172a';
  ctx.fillRect(0, 0, width, height);
  
  // Generate text
  const text = generateCaptchaText();
  captchaData[type] = text;
  
  // Draw noise dots
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw noise lines
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }
  
  // Draw text
  ctx.font = 'bold 24px Outfit, sans-serif';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const x = 15 + (i * 20);
    const y = height / 2;
    const angle = (Math.random() - 0.5) * 0.5;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = isLight ? '#0f1f3d' : '#f0f4f8';
    
    // Randomize slight vertical offset
    ctx.fillText(char, 0, (Math.random() - 0.5) * 10);
    ctx.restore();
  }
};

/* ---- Modal logic ---- */
function openModal(type) {
  document.getElementById(`modal-${type}`).classList.add('active');
  document.body.style.overflow = 'hidden';
  if (type === 'signin' || type === 'signup') refreshCaptcha(type);
}
function closeModal(type) {
  document.getElementById(`modal-${type}`).classList.remove('active');
  document.body.style.overflow = '';
  if (type === 'signup' && typeof resetSignupForm === 'function') resetSignupForm();
  
  // Clear input
  const captchaInput = document.getElementById(`${type}-captcha`);
  if (captchaInput) captchaInput.value = '';
}
function closeModalOnOverlay(e, type) { if (e.target === e.currentTarget) closeModal(type); }
function switchModal(toType) {
  const from = toType === 'signup' ? 'signin' : 'signup';
  closeModal(from);
  setTimeout(() => openModal(toType), 200);
}
function handleForgotPwd(email, btn) {
  console.log(`Sending reset link to ${email}...`);
  setTimeout(() => {
    btn.innerHTML = 'Reset Link Sent! ✉️';
    btn.style.background = 'var(--green)';
    btn.style.borderColor = 'var(--green)';
    setTimeout(() => closeModal('forgot-pwd'), 1500);
  }, 1200);
}

/* ---- Password Toggle ---- */
window.togglePasswordVisibility = function(inputId, toggleBtnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(toggleBtnId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
};

/* ---- Custom Animated Error Modal ---- */
window.showAnimatedError = function(message) {
  let overlay = document.getElementById('custom-error-overlay');
  
  // Create it dynamically if it doesn't exist
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.id = 'custom-error-overlay';
    overlay.innerHTML = `
      <div class="confirm-box">
        <div class="cb-icon" style="font-size: 3.5rem; animation: shakeError 0.5s ease-out forwards;">⚠️</div>
        <h3 class="cb-title" style="color: var(--red);">Action Required</h3>
        <p class="cb-message" id="custom-error-message"></p>
        <div class="cb-actions">
          <button class="cb-btn cb-btn-cancel" onclick="closeCustomError()">Got it</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const msgEl = document.getElementById('custom-error-message');
  msgEl.textContent = message;
  
  // Use a tiny timeout to ensure DOM update before adding 'show' class for the transition
  setTimeout(() => {
    overlay.classList.add('show');
    // Briefly shake the icon
    const icon = overlay.querySelector('.cb-icon');
    if(icon) {
      icon.style.animation = 'none';
      // trigger reflow
      void icon.offsetWidth;
      icon.style.animation = 'shakeError 0.5s ease-out forwards';
    }
  }, 10);
};

window.closeCustomError = function() {
  const overlay = document.getElementById('custom-error-overlay');
  if (overlay) overlay.classList.remove('show');
};
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal('signin'); closeModal('signup'); }
});

/* ---- Toast ---- */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  toastMsg.textContent = message;
  toast.className = `toast ${type}`;
  toastIcon.textContent = type === 'success' ? '✅' : '❌';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function showFormError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 4000);
}

/* ---- localStorage helpers ---- */
function getUsers() { return JSON.parse(localStorage.getItem('tfp_users') || '[]'); }
function saveUsers(users) { localStorage.setItem('tfp_users', JSON.stringify(users)); }
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

/* ---- Sign Up ---- */
/* ════════════════════════════════════════════
   OTP VERIFICATION LOGIC
════════════════════════════════════════════ */
let isPhoneVerified = false;
let currentPhoneOtp = null;
let otpNotifTimer = null;

/* Beautiful on-screen OTP notification */
function showOtpNotification(otp) {
  // Remove existing if any
  let existing = document.getElementById('otp-notif-overlay');
  if (existing) existing.remove();
  if (otpNotifTimer) clearTimeout(otpNotifTimer);

  const overlay = document.createElement('div');
  overlay.className = 'otp-notif-overlay';
  overlay.id = 'otp-notif-overlay';
  overlay.innerHTML = `
    <div class="otp-notif-card">
      <div class="otp-notif-icon">📲</div>
      <p class="otp-notif-title">Verification Code Sent</p>
      <div class="otp-notif-code-wrap">
        <span class="otp-notif-code-label">Your OTP Code</span>
        <span class="otp-notif-code">${otp}</span>
      </div>
      <p class="otp-notif-hint">Enter this code in the verification field.<br>This notification will auto-dismiss in 8 seconds.</p>
      <div class="otp-notif-timer"><div class="otp-notif-timer-bar"></div></div>
      <button class="otp-notif-close" onclick="dismissOtpNotification()">Got it</button>
    </div>
  `;
  document.body.appendChild(overlay);
  
  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add('show'));
  });
  
  // Auto-dismiss after 8s
  otpNotifTimer = setTimeout(() => dismissOtpNotification(), 8000);
}

function dismissOtpNotification() {
  const overlay = document.getElementById('otp-notif-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 400);
  }
  if (otpNotifTimer) { clearTimeout(otpNotifTimer); otpNotifTimer = null; }
}

function sendOtp(type) {
  if (type !== 'phone') return;
  
  const phone = document.getElementById('signup-phone').value.trim();
  if (!/^\d{10}$/.test(phone)) {
    showAnimatedError('Please enter a valid 10-digit phone number before verifying.');
    return;
  }
  
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  currentPhoneOtp = otp;
  
  // Show OTP container
  document.getElementById('otp-container-phone').style.display = 'block';
  
  // Disable the input so they don't change it while verifying
  document.getElementById('signup-phone').disabled = true;
  
  // Show beautiful on-screen OTP notification
  showOtpNotification(otp);
}

function resendOtp(type) {
  if (type !== 'phone') return;
  
  const btn = document.getElementById('btn-resend-phone');
  btn.disabled = true;
  btn.innerHTML = '<span class="resend-icon">↻</span> Resending...';
  
  setTimeout(() => {
    // Generate a new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    currentPhoneOtp = otp;
    
    // Show beautiful on-screen OTP notification again
    showOtpNotification(otp);
    
    // Reset button
    btn.disabled = false;
    btn.innerHTML = '<span class="resend-icon">↻</span> Resend Code';
  }, 1000); // 1-second mock loading delay
}

function verifyOtp(type) {
  if (type !== 'phone') return;
  const enteredOtp = document.getElementById(`otp-input-${type}`).value.trim();
  
  if (enteredOtp === currentPhoneOtp) {
    isPhoneVerified = true;
    document.getElementById(`otp-container-${type}`).style.display = 'none';
    const btn = document.getElementById(`btn-verify-${type}`);
    btn.innerHTML = '✅ Verified';
    btn.classList.add('verified');
    btn.disabled = true;
  } else {
    showAnimatedError('Invalid OTP. Please try again.');
  }
}

// Reset OTP states when closing signup
function resetSignupForm() {
  document.getElementById('form-signup').reset();
  
  isPhoneVerified = false;
  currentPhoneOtp = null;
  
  ['phone'].forEach(type => {
    document.getElementById(`signup-${type}`).disabled = false;
    document.getElementById(`otp-container-${type}`).style.display = 'none';
    document.getElementById(`otp-input-${type}`).value = '';
    const btn = document.getElementById(`btn-verify-${type}`);
    if(btn) {
      btn.innerHTML = 'Verify';
      btn.classList.remove('verified');
      btn.disabled = false;
    }
  });
}

async function handleSignUp(e) {
  e.preventDefault();
  const firstName = document.getElementById('signup-firstname').value.trim();
  const lastName = document.getElementById('signup-lastname').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const phone = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;
  const terms = document.getElementById('signup-terms').checked;
  const captchaInput = document.getElementById('signup-captcha').value.trim();

  // 1. Mandatory Fields
  if (!firstName) {
    showAnimatedError('First name is mandatory. Please enter your first name.');
    return;
  }
  if (!lastName) {
    showAnimatedError('Last name is mandatory. Please enter your last name.');
    return;
  }
  if (!email) {
    showAnimatedError('Email address is mandatory. Please enter a valid email.');
    return;
  }
  if (!phone) {
    showAnimatedError('Phone number is mandatory. Please enter your phone number.');
    return;
  }
  if (!password) {
    showAnimatedError('Password is mandatory. Please create a strong password.');
    return;
  }
  if (!role) {
    showAnimatedError('Role selection is mandatory. Please select your role.');
    return;
  }
  if (!terms) {
    showAnimatedError('You must agree to the Terms & Conditions.');
    return;
  }

  // 2. CAPTCHA Validation
  if (captchaInput !== captchaData.signup) {
    showAnimatedError('Invalid Security Code. Please try again.');
    refreshCaptcha('signup');
    document.getElementById('signup-captcha').value = '';
    return;
  }

  // 3. Gmail format validation
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    showAnimatedError('Please enter a valid @gmail.com address.');
    return;
  }

  // 4. Phone number validation (exactly 10 digits)
  if (!/^\d{10}$/.test(phone)) {
    showAnimatedError('Phone number must be exactly 10 digits.');
    return;
  }

  // 5. Password Complexity (Min 10 chars, at least one uppercase letter)
  if (!/^(?=.*[A-Z]).{10,}$/.test(password)) {
    showAnimatedError('Password must be at least 10 characters long and contain at least one uppercase letter.');
    return;
  }

  // 5. OTP Verification Check
  if (!isPhoneVerified) {
    showAnimatedError('Please verify your Phone Number before signing up.');
    return;
  }

  try {
    // Check if email already registered
    const existingUsers = await supabaseRequest('users', 'GET', null, `?email=eq.${encodeURIComponent(email)}`);
    if (existingUsers && existingUsers.length > 0) {
      showAnimatedError('Email already registered.');
      return;
    }

    const user = {
      id: generateId(),
      firstName,
      lastName,
      email,
      phone,
      role,
      password: btoa(password), // simple base64 hash, same as before
      createdAt: new Date().toISOString()
    };

    // Save to Supabase
    await supabaseRequest('users', 'POST', user);

    // Auto login
    localStorage.setItem('tfp_session', user.id);

    // Auto login
    localStorage.setItem('tfp_session', user.id);
    closeModal('signup');
    
    // Create beautiful welcome overlay
    const overlay = document.createElement('div');
    overlay.className = 'welcome-overlay';
    overlay.innerHTML = `
      <div class="welcome-content">
        <div class="wc-icon">🚀</div>
        <h2 class="wc-title">Welcome, ${firstName}!</h2>
        <p class="wc-subtitle">Launching your TruckFleet Pro Dashboard...</p>
        <div class="wc-loader"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Trigger animation
    setTimeout(() => overlay.classList.add('show'), 10);

    // Redirect after animation completes
    setTimeout(() => location.href = 'dashboard.html', 3000);
  } catch (error) {
    console.error(error);
    showAnimatedError(`Database Error: ${error.message}`);
  }
}

/* ---- Sign In ---- */
async function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('signin-email').value.trim().toLowerCase();
  const password = document.getElementById('signin-password').value;
  const captchaInput = document.getElementById('signin-captcha').value.trim();

  // Validate CAPTCHA
  if (captchaInput !== captchaData.signin) {
    showFormError('signin-error', '❌ Invalid Security Code. Please try again.');
    refreshCaptcha('signin');
    document.getElementById('signin-captcha').value = '';
    return;
  }

  try {
    const users = await supabaseRequest('users', 'GET', null, `?email=eq.${encodeURIComponent(email)}`);
    
    if (!users || users.length === 0) {
      showFormError('signin-error', '⚠️ Account not found. Please sign up.');
      return;
    }

    const user = users[0];

    // Support both unhashed (if they somehow bypassed it) and hashed to completely fix the bug
    if (user.password !== btoa(password) && user.password !== password) {
      showFormError('signin-error', '❌ Incorrect password.');
      return;
    }

    localStorage.setItem('tfp_session', user.id);
    closeModal('signin');

    // Create beautiful welcome overlay
    const overlay = document.createElement('div');
    overlay.className = 'welcome-overlay';
    overlay.innerHTML = `
      <div class="welcome-content">
        <div class="wc-icon">🚀</div>
        <h2 class="wc-title">Welcome back, ${user.firstName}!</h2>
        <p class="wc-subtitle">Loading your TruckFleet Pro Dashboard...</p>
        <div class="wc-loader"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Trigger animation
    setTimeout(() => overlay.classList.add('show'), 10);

    // Redirect after animation completes
    setTimeout(() => location.href = 'dashboard.html', 3000);
  } catch (error) {
    console.error(error);
    showFormError('signin-error', '❌ Could not connect to database.');
  }
}

/* ---- Smooth scroll for nav links ---- */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navActions.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});
