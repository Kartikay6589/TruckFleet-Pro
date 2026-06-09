/* ════════════════════════════════════════════
   TRUCKFLEET PRO — forgot-password.js
   Forgot password: verify old password → set new
════════════════════════════════════════════ */

/* ── Theme ── */
const htmlEl   = document.documentElement;
const rippleEl = document.getElementById('theme-ripple');
const flashEl  = document.getElementById('theme-flash');

function applyTheme(theme, animate = false, originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  if (animate && rippleEl) {
    rippleEl.style.left = originX + 'px';
    rippleEl.style.top  = originY + 'px';
    rippleEl.className  = 'theme-ripple';
    flashEl.className   = 'theme-flash';
    void rippleEl.offsetWidth;
    rippleEl.className  = `theme-ripple to-${theme}`;
    flashEl.className   = `theme-flash flash-${theme}`;
    setTimeout(() => {
      htmlEl.setAttribute('data-theme', theme);
      document.getElementById('theme-icon').textContent = theme === 'dark' ? '🌙' : '☀️';
      localStorage.setItem('tfp_theme', theme);
    }, 200);
    rippleEl.addEventListener('animationend', () => { rippleEl.className = 'theme-ripple'; }, { once: true });
    flashEl.addEventListener('animationend',  () => { flashEl.className  = 'theme-flash';  }, { once: true });
  } else {
    htmlEl.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('tfp_theme', theme);
  }
}
function toggleTheme() {
  const curr = htmlEl.getAttribute('data-theme') || 'dark';
  const next = curr === 'dark' ? 'light' : 'dark';
  const btn  = document.getElementById('theme-toggle');
  const rect = btn.getBoundingClientRect();
  applyTheme(next, true, rect.left + rect.width / 2, rect.top + rect.height / 2);
}
applyTheme(localStorage.getItem('tfp_theme') || 'dark', false);

/* ── Cursor ── */
const cc = document.getElementById('cursor-circle');
const cd = document.getElementById('cursor-dot');
let mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cd.style.left = mx + 'px'; cd.style.top = my + 'px';
});
(function animCursor() {
  cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12;
  cc.style.left = cx + 'px'; cc.style.top = cy + 'px';
  requestAnimationFrame(animCursor);
})();
document.addEventListener('mouseover', e => {
  if (['BUTTON','A','INPUT','SELECT'].includes(e.target.tagName)) cc.classList.add('hover');
});
document.addEventListener('mouseout', () => cc.classList.remove('hover'));

/* ════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════ */
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'fp-error show';
  setTimeout(() => { el.className = 'fp-error'; el.textContent = ''; }, 5000);
}

/* ════════════════════════════════════════════
   OTP AND PASSWORD RESET
════════════════════════════════════════════ */
let targetPhone = '';
let fpOtp = null;
let fpOtpNotifTimer = null;

/* Beautiful on-screen OTP notification */
function showOtpNotification(otp) {
  let existing = document.getElementById('otp-notif-overlay');
  if (existing) existing.remove();
  if (fpOtpNotifTimer) clearTimeout(fpOtpNotifTimer);

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
  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add('show'));
  });
  fpOtpNotifTimer = setTimeout(() => dismissOtpNotification(), 8000);
}

function dismissOtpNotification() {
  const overlay = document.getElementById('otp-notif-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 400);
  }
  if (fpOtpNotifTimer) { clearTimeout(fpOtpNotifTimer); fpOtpNotifTimer = null; }
}

async function sendOTP(e) {
  e.preventDefault();
  const phone = document.getElementById('fp-phone').value.trim();

  if (!/^\d{10}$/.test(phone)) {
    showError('fp-error-1', '❌ Please enter a valid 10-digit phone number.');
    return;
  }

  try {
    const users = await supabaseRequest('users', 'GET', null, `?phone=eq.${encodeURIComponent(phone)}`);
    if (!users || users.length === 0) {
      showError('fp-error-1', '❌ No account found with this phone number.');
      return;
    }

    // Generate mock OTP
    fpOtp = Math.floor(100000 + Math.random() * 900000).toString();
    targetPhone = phone;

    // Show beautiful on-screen OTP notification
    showOtpNotification(fpOtp);

    document.getElementById('step-1').classList.add('fp-hidden');
    const step2 = document.getElementById('step-2');
    step2.classList.remove('fp-hidden');
    step2.style.animation = 'cardIn .4s cubic-bezier(.4,0,.2,1)';
  } catch (error) {
    console.error(error);
    showError('fp-error-1', '❌ Could not connect to database.');
  }
}

function resendFPOTP() {
  const btn = document.getElementById('fp-resend-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="resend-icon">↻</span> Resending...';
  
  setTimeout(() => {
    // Generate new mock OTP
    fpOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Show beautiful on-screen OTP notification
    showOtpNotification(fpOtp);
    
    // Reset button
    btn.disabled = false;
    btn.innerHTML = '<span class="resend-icon">↻</span> Resend Code';
  }, 1000); // 1-second mock loading delay
}

function verifyOTP(e) {
  e.preventDefault();
  const otp = document.getElementById('fp-otp').value.trim();

  if (otp === fpOtp) {
    document.getElementById('step-2').classList.add('fp-hidden');
    const step3 = document.getElementById('step-3');
    step3.classList.remove('fp-hidden');
    step3.style.animation = 'cardIn .4s cubic-bezier(.4,0,.2,1)';
  } else {
    showError('fp-error-2', '❌ Invalid OTP. Please try again.');
  }
}

async function resetPassword(e) {
  e.preventDefault();
  const newPass = document.getElementById('fp-new-pass').value;
  
  try {
    // We already verified the user exists in sendOTP
    // Update password in Supabase for the given phone number
    await supabaseRequest('users', 'PATCH', { password: btoa(newPass) }, `?phone=eq.${encodeURIComponent(targetPhone)}`);
    
    document.getElementById('step-3').classList.add('fp-hidden');
    const step4 = document.getElementById('step-4');
    step4.classList.remove('fp-hidden');
    step4.style.animation = 'cardIn .4s cubic-bezier(.4,0,.2,1)';
  } catch (error) {
    console.error(error);
    showError('fp-error-3', '❌ Could not reset password.');
  }
}
