/**
 * auth.js - Authentication module (LocalStorage-based)
 * Handles login, signup, session, password hashing simulation
 */

const Auth = (() => {
  // Simple hash simulation (NOT cryptographic - frontend demo only)
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit int
    }
    return hash.toString(16);
  }

  function sanitize(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function getPasswordStrength(password) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem('foodapp_users') || '[]');
    } catch { return []; }
  }

  function saveUsers(users) {
    localStorage.setItem('foodapp_users', JSON.stringify(users));
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('foodapp_session') || 'null');
    } catch { return null; }
  }

  function setSession(user) {
    const sessionData = { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address || '' };
    localStorage.setItem('foodapp_session', JSON.stringify(sessionData));
  }

  function logout() {
    localStorage.removeItem('foodapp_session');
    window.location.hash = '#login';
  }

  function signup({ name, email, phone, password }) {
    const users = getUsers();
    if (!name || !email || !phone || !password) return { ok: false, msg: 'All fields are required.' };
    if (!validateEmail(email)) return { ok: false, msg: 'Invalid email address.' };
    if (!validatePassword(password)) return { ok: false, msg: 'Password must be at least 6 characters.' };
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' };

    const user = {
      id: 'u_' + Date.now(),
      name: sanitize(name.trim()),
      email: email.toLowerCase().trim(),
      phone: sanitize(phone.trim()),
      address: '',
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    setSession(user);
    return { ok: true, user };
  }

  function login({ email, password }) {
    if (!email || !password) return { ok: false, msg: 'All fields are required.' };
    if (!validateEmail(email)) return { ok: false, msg: 'Invalid email format.' };

    const users = getUsers();
    const user = users.find(u => u.email === email.toLowerCase().trim());
    if (!user) return { ok: false, msg: 'No account found with this email.' };
    if (user.passwordHash !== simpleHash(password)) return { ok: false, msg: 'Incorrect password.' };

    setSession(user);
    return { ok: true, user };
  }

  function updateProfile(data) {
    const session = getCurrentUser();
    if (!session) return { ok: false, msg: 'Not logged in.' };
    const users = getUsers();
    const idx = users.findIndex(u => u.id === session.id);
    if (idx === -1) return { ok: false, msg: 'User not found.' };
    users[idx] = { ...users[idx], ...data };
    saveUsers(users);
    setSession(users[idx]);
    return { ok: true };
  }

  function requireAuth() {
    if (!getCurrentUser()) {
      window.location.hash = '#login';
      return false;
    }
    return true;
  }

  return { login, signup, logout, getCurrentUser, requireAuth, updateProfile, getPasswordStrength, validateEmail, validatePassword };
})();
