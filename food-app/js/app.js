/**
 * app.js - Main application controller
 * SPA-like routing, page rendering, UI components
 */

const App = (() => {
  let currentPage = '';

  // ===== TOAST SYSTEM =====
  function toast(msg, type = 'success') {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `
      <span class="toast-icon">${icons[type] || '✅'}</span>
      <span class="toast-msg">${msg}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(100px)'; el.style.transition = '0.3s'; setTimeout(() => el.remove(), 300); }, 3500);
  }

  // ===== MODAL =====
  function showModal(title, content, actions = '') {
    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="App.closeModal()">✕</button>
        </div>
        <div>${content}</div>
        ${actions ? `<div class="modal-footer">${actions}</div>` : ''}
      </div>`;
    overlay.classList.add('active');
  }

  function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
  }

  // ===== NAVBAR =====
  function renderNavbar() {
    const user = Auth.getCurrentUser();
    const nav = document.getElementById('navbar');
    const page = getCurrentPage();
    const links = [
      { href: '#home', label: 'Home' },
      { href: '#products', label: 'Products' },
      { href: '#about', label: 'About' },
      { href: '#contact', label: 'Contact' },
    ];
    nav.innerHTML = `
      <div class="promo-banner" style="position:relative;top:0;width:100%;background:linear-gradient(90deg,#388E3C,#4CAF50,#8BC34A);color:white;text-align:center;padding:0.4rem;font-size:0.8rem;font-weight:600">
        🌿 Fresh From Local Farms <span>•</span> Free Delivery Over $30 <span>•</span> 100% Natural
      </div>
      <div style="display:flex;align-items:center;padding:0 2rem;height:calc(var(--navbar-h) - 32px)">
        <a href="#home" class="nav-brand">
          <div class="nav-brand-icon">🍃</div>
          <span>Food<em style="font-style:normal;color:var(--primary-light)">App</em></span>
        </a>
        <nav class="nav-links" id="nav-links">
          ${links.map(l => `<a href="${l.href}" class="${page === l.href.slice(1) ? 'active' : ''}">${l.label}</a>`).join('')}
        </nav>
        <div class="nav-actions">
          <a href="#cart" class="nav-cart-btn" title="Cart">
            🛒
            <span id="cart-badge" class="cart-badge hidden">0</span>
          </a>
          <button class="theme-toggle" id="theme-toggle" title="Toggle theme">🌙</button>
          ${user
            ? `<a href="#profile" class="nav-avatar" title="Profile">${user.name.charAt(0).toUpperCase()}</a>`
            : `<a href="#login" class="btn-login-nav">Login</a>`
          }
          <button class="hamburger" id="hamburger" onclick="App.toggleMobileMenu()">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="mobile-menu" id="mobile-menu">
        ${links.map(l => `<a href="${l.href}" class="${page === l.href.slice(1) ? 'active' : ''}" onclick="App.closeMobileMenu()">${l.label}</a>`).join('')}
        ${user ? `<a href="#profile" onclick="App.closeMobileMenu()">👤 My Profile</a><a href="#" onclick="Auth.logout()">🚪 Logout</a>` : `<a href="#login" onclick="App.closeMobileMenu()">🔐 Login / Signup</a>`}
      </div>`;

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    themeBtn.addEventListener('click', toggleTheme);

    // Scroll effect
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    });

    Cart.updateBadge();
  }

  function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('active');
  }

  function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('foodapp_theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-toggle').textContent = isDark ? '🌙' : '☀️';
  }

  // ===== FOOTER =====
  function renderFooter() {
    return `
      <footer class="footer">
        <div class="footer-grid">
          <div>
            <div class="footer-brand-logo">🍃 FoodApp</div>
            <p class="footer-tagline">Fresh fruits, juices and salads delivered straight to your door. Sourced from trusted local farms in Rwanda.</p>
            <div class="footer-social">
              <a href="https://twitter.com/foodapp" class="social-link" title="Twitter" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="https://instagram.com/foodapp" class="social-link" title="Instagram" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://wa.me/250794010485" class="social-link" title="WhatsApp" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/></svg>
              </a>
              <a href="https://facebook.com/foodapp" class="social-link" title="Facebook" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><a href="#products?cat=fruits">🍎 Fresh Fruits</a></li>
              <li><a href="#products?cat=juice">🥤 Fresh Juice</a></li>
              <li><a href="#products?cat=salad">🥗 Fruit Salad</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <div class="footer-contact-item"><i>📍</i> Rwanda-Kigali-Remera</div>
            <div class="footer-contact-item"><i>✉️</i> foodap12@gmail.com</div>
            <div class="footer-contact-item"><i>💬</i> +250794010485</div>
            <div class="footer-contact-item"><i>📘</i> foodapp123</div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 FoodApp. Made with 💚 in Kigali, Rwanda.</p>
        </div>
      </footer>`;
  }

  // ===== ROUTING =====
  function getCurrentPage() {
    const hash = window.location.hash.slice(1).split('?')[0] || 'home';
    return hash;
  }

  function getQueryParam(key) {
    const search = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
    const params = new URLSearchParams(search);
    return params.get(key);
  }

  function route() {
    const page = getCurrentPage();
    if (page === currentPage) return;
    currentPage = page;
    const main = document.getElementById('main-content');
    main.innerHTML = '';
    renderNavbar();
    window.scrollTo(0, 0);

    // Protected routes
    const protected_ = ['cart', 'checkout', 'profile', 'orders'];
    if (protected_.includes(page) && !Auth.getCurrentUser()) {
      window.location.hash = '#login';
      return;
    }

    switch (page) {
      case 'home': renderHome(main); break;
      case 'login': renderLogin(main); break;
      case 'signup': renderSignup(main); break;
      case 'products': renderProducts(main); break;
      case 'product': renderProductDetail(main); break;
      case 'cart': renderCart(main); break;
      case 'checkout': renderCheckout(main); break;
      case 'profile': renderProfile(main); break;
      case 'orders': renderOrders(main); break;
      case 'about': renderAbout(main); break;
      case 'contact': renderContact(main); break;
      default: render404(main);
    }
  }

  // ===== HOME PAGE =====
  function renderHome(main) {
    main.innerHTML = `
      <section class="hero">
        <div class="hero-content container">
          <div class="hero-text fade-in">
            <h1>Welcome to<br><span>FoodApp</span> 🌿</h1>
            <p>Discover the freshest fruits, juices & salads sourced directly from Rwanda's finest local farms. Delivered to your door with love.</p>
            <div class="hero-actions">
              <a href="#products" class="btn-hero-primary">🛒 Shop Now</a>
              <a href="#about" class="btn-hero-secondary">Learn More</a>
            </div>
            <div class="hero-stats">
              <div class="stat"><span class="stat-num">50+</span><span class="stat-label">Products</span></div>
              <div class="stat"><span class="stat-num">500+</span><span class="stat-label">Customers</span></div>
              <div class="stat"><span class="stat-num">100%</span><span class="stat-label">Natural</span></div>
            </div>
          </div>
          <div class="hero-imgs slide-up">
            <div class="hero-img-card"><img src="assets/images/3.jpg" alt="Fresh Fruits" loading="lazy"></div>
            <div class="hero-img-card"><img src="assets/images/7.jpg" alt="Fresh Produce" loading="lazy"></div>
            <div class="hero-img-card"><img src="assets/images/9.jpg" alt="Fresh Juice" loading="lazy"></div>
            <div class="hero-img-card"><img src="assets/images/10.jpg" alt="Fruit Salad" loading="lazy"></div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-label">Browse</span>
            <h2 class="section-title">Our <span>Categories</span></h2>
            <p class="section-subtitle">Choose from our freshly prepared categories</p>
          </div>
          <div class="categories-grid">
            <a href="#products?cat=fruits" class="category-card">
              <img src="assets/images/7.jpg" alt="Fresh Fruits" class="category-img">
              <div class="category-name">Fresh Fruits</div>
              <div class="category-count">6 products</div>
              <div class="category-arrow">→</div>
            </a>
            <a href="#products?cat=juice" class="category-card">
              <img src="assets/images/9.jpg" alt="Fresh Juice" class="category-img">
              <div class="category-name">Fresh Juice</div>
              <div class="category-count">4 products</div>
              <div class="category-arrow">→</div>
            </a>
            <a href="#products?cat=salad" class="category-card">
              <img src="assets/images/10.jpg" alt="Fruit Salad" class="category-img">
              <div class="category-name">Fruit Salad</div>
              <div class="category-count">3 products</div>
              <div class="category-arrow">→</div>
            </a>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="section section-alt">
        <div class="container">
          <div class="section-header">
            <span class="section-label">Featured</span>
            <h2 class="section-title">Popular <span>Products</span></h2>
            <p class="section-subtitle">Our most loved fresh picks</p>
          </div>
          <div class="products-grid" id="featured-grid">
            ${Products.getAll().slice(0,6).map(p => Products.renderCard(p, '')).join('')}
          </div>
          <div class="text-center mt-4">
            <a href="#products" class="btn btn-primary">View All Products →</a>
          </div>
        </div>
      </section>

      <!-- About Snippet -->
      <section class="section">
        <div class="container" style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center">
          <div>
            <span class="section-label">Who We Are</span>
            <h2 class="section-title" style="text-align:left">Farm-Fresh Goodness <span>Delivered</span></h2>
            <p style="color:var(--text-secondary);line-height:1.9;margin-bottom:1.5rem">We source the freshest fruits directly from trusted local farms across Rwanda. Every item is hand-picked to ensure peak freshness and delivered straight to your door.</p>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:0.75rem">
              <li style="display:flex;align-items:center;gap:0.75rem;color:var(--text-secondary)"><span style="color:var(--primary);font-size:1.2rem">✓</span> Hand-picked from local farms</li>
              <li style="display:flex;align-items:center;gap:0.75rem;color:var(--text-secondary)"><span style="color:var(--primary);font-size:1.2rem">✓</span> No preservatives or chemicals</li>
              <li style="display:flex;align-items:center;gap:0.75rem;color:var(--text-secondary)"><span style="color:var(--primary);font-size:1.2rem">✓</span> Fast delivery across Kigali</li>
            </ul>
            <div style="margin-top:2rem"><a href="#about" class="btn btn-outline">Learn More →</a></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <img src="assets/images/3.jpg" alt="About" style="border-radius:var(--radius-lg);box-shadow:var(--shadow)">
            <img src="assets/images/4.jpg" alt="About" style="border-radius:var(--radius-lg);box-shadow:var(--shadow);margin-top:2rem">
          </div>
        </div>
      </section>

      ${renderFooter()}`;

    // Wishlist click handlers
    document.querySelectorAll('.product-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
        toast(btn.classList.contains('active') ? 'Added to wishlist!' : 'Removed from wishlist', 'info');
      });
    });
  }

  // ===== LOGIN PAGE =====
  function renderLogin(main) {
    if (Auth.getCurrentUser()) { window.location.hash = '#home'; return; }
    main.innerHTML = `
      <div class="auth-page">
        <div class="auth-visual">
          <div class="auth-visual-content">
            <h2>Welcome Back!</h2>
            <p>Log in to access your fresh fruit orders and personalized recommendations.</p>
            <div class="auth-visual-imgs">
              <div class="auth-img-item"><img src="assets/images/3.jpg" alt="Fruits"></div>
              <div class="auth-img-item"><img src="assets/images/9.jpg" alt="Juice"></div>
              <div class="auth-img-item"><img src="assets/images/10.jpg" alt="Salad"></div>
              <div class="auth-img-item"><img src="assets/images/7.jpg" alt="Fresh"></div>
            </div>
          </div>
        </div>
        <div class="auth-form-side">
          <div class="auth-form-wrap">
            <div class="auth-logo">
              <div class="auth-logo-icon">🍃</div>
              <span class="auth-logo-text">FoodApp</span>
            </div>
            <h1 class="auth-title">Login</h1>
            <p class="auth-subtitle">Enter your credentials to continue</p>
            <div id="auth-msg"></div>
            <form id="login-form" novalidate>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <div class="input-wrap">
                  <span class="input-icon">✉️</span>
                  <input type="email" id="login-email" class="form-control" placeholder="enter email" autocomplete="email" required>
                </div>
                <span class="form-error hidden" id="email-err"></span>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <div class="input-wrap">
                  <span class="input-icon">🔒</span>
                  <input type="password" id="login-pass" class="form-control" placeholder="enter password" autocomplete="current-password" required>
                  <button type="button" class="input-toggle" id="toggle-pass">👁</button>
                </div>
                <span class="form-error hidden" id="pass-err"></span>
              </div>
              <button type="submit" class="btn btn-primary btn-block" id="login-btn">
                <span id="login-btn-text">Login</span>
              </button>
            </form>
            <div class="auth-switch">
              Create new account? <a href="#signup">signup</a>
            </div>
          </div>
        </div>
      </div>`;

    // Toggle password
    document.getElementById('toggle-pass').addEventListener('click', function() {
      const inp = document.getElementById('login-pass');
      inp.type = inp.type === 'password' ? 'text' : 'password';
      this.textContent = inp.type === 'password' ? '👁' : '🙈';
    });

    // Form submit
    document.getElementById('login-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-pass').value;
      const btn = document.getElementById('login-btn');
      const btnText = document.getElementById('login-btn-text');

      // Reset errors
      ['email-err','pass-err'].forEach(id => { document.getElementById(id).classList.add('hidden'); });

      // Validate
      let valid = true;
      if (!Auth.validateEmail(email)) {
        document.getElementById('email-err').textContent = 'Enter a valid email';
        document.getElementById('email-err').classList.remove('hidden');
        document.getElementById('login-email').classList.add('error');
        valid = false;
      }
      if (!pass) {
        document.getElementById('pass-err').textContent = 'Password is required';
        document.getElementById('pass-err').classList.remove('hidden');
        document.getElementById('login-pass').classList.add('error');
        valid = false;
      }
      if (!valid) return;

      // Simulate loading
      btn.disabled = true;
      btnText.textContent = '⏳ Logging in...';
      setTimeout(() => {
        const result = Auth.login({ email, password: pass });
        if (result.ok) {
          toast('Welcome back, ' + result.user.name + '! 👋', 'success');
          setTimeout(() => { window.location.hash = '#home'; }, 600);
        } else {
          document.getElementById('auth-msg').innerHTML = `<div style="background:rgba(244,67,54,0.1);color:#f44336;padding:0.75rem 1rem;border-radius:var(--radius);margin-bottom:1rem;font-size:0.9rem">❌ ${result.msg}</div>`;
          btn.disabled = false;
          btnText.textContent = 'Login';
        }
      }, 800);
    });
  }

  // ===== SIGNUP PAGE =====
  function renderSignup(main) {
    if (Auth.getCurrentUser()) { window.location.hash = '#home'; return; }
    main.innerHTML = `
      <div class="auth-page">
        <div class="auth-visual">
          <div class="auth-visual-content">
            <h2>Create Account</h2>
            <p>Join FoodApp for the freshest fruits & juices delivered right to your doorstep in Kigali.</p>
            <div class="auth-visual-imgs">
              <div class="auth-img-item"><img src="assets/images/7.jpg" alt="Fruits"></div>
              <div class="auth-img-item"><img src="assets/images/9.jpg" alt="Juice"></div>
              <div class="auth-img-item"><img src="assets/images/3.jpg" alt="Fresh"></div>
              <div class="auth-img-item"><img src="assets/images/10.jpg" alt="Salad"></div>
            </div>
          </div>
        </div>
        <div class="auth-form-side">
          <div class="auth-form-wrap">
            <div class="auth-logo">
              <div class="auth-logo-icon">🍃</div>
              <span class="auth-logo-text">FoodApp</span>
            </div>
            <h1 class="auth-title">Create new account</h1>
            <p class="auth-subtitle">Fill in the form to get started</p>
            <div id="auth-msg"></div>
            <form id="signup-form" novalidate>
              <div class="form-group">
                <label class="form-label">Your Name</label>
                <div class="input-wrap">
                  <span class="input-icon">👤</span>
                  <input type="text" id="signup-name" class="form-control" placeholder="enter your name" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <div class="input-wrap">
                  <span class="input-icon">✉️</span>
                  <input type="email" id="signup-email" class="form-control" placeholder="enter email" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <div class="input-wrap">
                  <span class="input-icon">📱</span>
                  <input type="tel" id="signup-phone" class="form-control" placeholder="enter phone number" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <div class="input-wrap">
                  <span class="input-icon">🔒</span>
                  <input type="password" id="signup-pass" class="form-control" placeholder="enter your password" required>
                  <button type="button" class="input-toggle" id="toggle-pass2">👁</button>
                </div>
                <div class="strength-bar"><div class="strength-fill" id="strength-fill"></div></div>
                <span class="strength-label" id="strength-label" style="color:var(--text-muted);font-size:0.75rem"></span>
              </div>
              <button type="submit" class="btn btn-primary btn-block" id="signup-btn" style="background:var(--primary)">
                <span id="signup-btn-text">create</span>
              </button>
            </form>
            <div class="auth-switch">
              Already have an account? <a href="#login">Login</a>
            </div>
          </div>
        </div>
      </div>`;

    // Password strength
    document.getElementById('signup-pass').addEventListener('input', function() {
      const score = Auth.getPasswordStrength(this.value);
      const fill = document.getElementById('strength-fill');
      const label = document.getElementById('strength-label');
      if (score <= 1) { fill.className = 'strength-fill strength-weak'; label.textContent = 'Weak password'; label.style.color = '#f44336'; }
      else if (score <= 3) { fill.className = 'strength-fill strength-medium'; label.textContent = 'Medium password'; label.style.color = '#FF9800'; }
      else { fill.className = 'strength-fill strength-strong'; label.textContent = 'Strong password ✓'; label.style.color = 'var(--primary)'; }
    });

    document.getElementById('toggle-pass2').addEventListener('click', function() {
      const inp = document.getElementById('signup-pass');
      inp.type = inp.type === 'password' ? 'text' : 'password';
      this.textContent = inp.type === 'password' ? '👁' : '🙈';
    });

    document.getElementById('signup-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const phone = document.getElementById('signup-phone').value.trim();
      const password = document.getElementById('signup-pass').value;
      const btn = document.getElementById('signup-btn');
      const btnText = document.getElementById('signup-btn-text');

      if (!name || !email || !phone || !password) {
        document.getElementById('auth-msg').innerHTML = `<div style="background:rgba(244,67,54,0.1);color:#f44336;padding:0.75rem 1rem;border-radius:var(--radius);margin-bottom:1rem;font-size:0.9rem">❌ All fields are required.</div>`;
        return;
      }

      btn.disabled = true;
      btnText.textContent = '⏳ Creating account...';
      setTimeout(() => {
        const result = Auth.signup({ name, email, phone, password });
        if (result.ok) {
          toast('Account created! Welcome to FoodApp! 🎉', 'success');
          setTimeout(() => { window.location.hash = '#home'; }, 700);
        } else {
          document.getElementById('auth-msg').innerHTML = `<div style="background:rgba(244,67,54,0.1);color:#f44336;padding:0.75rem 1rem;border-radius:var(--radius);margin-bottom:1rem;font-size:0.9rem">❌ ${result.msg}</div>`;
          btn.disabled = false;
          btnText.textContent = 'create';
        }
      }, 800);
    });
  }

  // ===== PRODUCTS PAGE =====
  function renderProducts(main) {
    const initCat = getQueryParam('cat') || 'all';
    main.innerHTML = `
      <div class="page-header">
        <div class="page-header-inner">
          <h1>🛒 Our Products</h1>
          <div class="breadcrumb"><a href="#home">Home</a> / Products</div>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <div class="filter-bar">
            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" id="search-input" class="form-control" placeholder="Search products..." value="">
            </div>
            <div class="filter-tabs">
              <button class="filter-tab ${initCat==='all'?'active':''}" data-cat="all">All</button>
              <button class="filter-tab ${initCat==='fruits'?'active':''}" data-cat="fruits">🍎 Fruits</button>
              <button class="filter-tab ${initCat==='juice'?'active':''}" data-cat="juice">🥤 Juice</button>
              <button class="filter-tab ${initCat==='salad'?'active':''}" data-cat="salad">🥗 Salad</button>
            </div>
          </div>
          <div class="products-grid" id="products-grid">
            ${Products.getByCategory(initCat).map(p => Products.renderCard(p, '')).join('')}
          </div>
          <div id="no-results" class="text-center hidden" style="padding:3rem">
            <p style="font-size:3rem">🔍</p>
            <h3>No products found</h3>
            <p style="color:var(--text-secondary)">Try a different search term or category</p>
          </div>
        </div>
      </section>
      ${renderFooter()}`;

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        filterProducts(this.dataset.cat, document.getElementById('search-input').value);
      });
    });

    // Search
    document.getElementById('search-input').addEventListener('input', function() {
      const activeCat = document.querySelector('.filter-tab.active').dataset.cat;
      filterProducts(activeCat, this.value);
    });

    // Wishlist handlers
    document.querySelectorAll('.product-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
      });
    });
  }

  function filterProducts(cat, q) {
    let prods = cat === 'all' ? Products.getAll() : Products.getByCategory(cat);
    if (q && q.trim()) {
      const lower = q.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(lower) || p.desc.toLowerCase().includes(lower));
    }
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    if (prods.length === 0) {
      grid.innerHTML = '';
      noResults.classList.remove('hidden');
    } else {
      noResults.classList.add('hidden');
      grid.innerHTML = prods.map(p => Products.renderCard(p, '')).join('');
      document.querySelectorAll('.product-wishlist').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.classList.toggle('active');
          btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
        });
      });
    }
  }

  // ===== PRODUCT DETAIL =====
  function renderProductDetail(main) {
    const id = getQueryParam('id');
    const p = Products.getById(id);
    if (!p) { render404(main); return; }

    const imgFile = p.image.split('/').pop();
    const stars = Array.from({length: 5}, (_, i) => `<span class="star ${i < Math.floor(p.rating) ? 'filled' : ''}">★</span>`).join('');
    const related = Products.getByCategory(p.category).filter(r => r.id !== p.id).slice(0, 3);

    main.innerHTML = `
      <div class="page-header">
        <div class="page-header-inner">
          <div class="breadcrumb"><a href="#home">Home</a> / <a href="#products">Products</a> / ${p.name}</div>
        </div>
      </div>
      <section class="section">
        <div class="container">
          <div class="product-detail-layout">
            <div>
              <div class="product-detail-img-main"><img src="assets/images/${imgFile}" alt="${p.name}" id="main-img"></div>
              <div class="product-detail-thumb-row">
                <div class="product-thumb active"><img src="assets/images/${imgFile}" alt="${p.name}"></div>
              </div>
            </div>
            <div>
              <span class="badge badge-primary" style="margin-bottom:0.75rem">${p.category}</span>
              ${p.badge ? `<span class="badge badge-primary" style="margin-left:0.5rem">${p.badge}</span>` : ''}
              <h1 class="product-detail-name">${p.name}</h1>
              <div class="product-rating"><div class="stars">${stars}</div><span>${p.rating} (${p.reviews} reviews)</span></div>
              <div class="product-detail-price">$${p.price}<span style="font-size:1rem;color:var(--text-muted);font-weight:400"> / unit</span></div>
              <p class="product-detail-desc">${p.desc}</p>
              <div class="product-detail-meta">
                ${p.weight ? `<div class="meta-row"><span class="meta-label">Weight:</span>${p.weight}</div>` : ''}
                ${p.volume ? `<div class="meta-row"><span class="meta-label">Volume:</span>${p.volume}</div>` : ''}
                <div class="meta-row"><span class="meta-label">Origin:</span>${p.origin}</div>
                <div class="meta-row"><span class="meta-label">Category:</span>${p.category}</div>
              </div>
              <div class="product-qty-add">
                <button class="qty-big-btn" id="qty-minus">−</button>
                <span class="qty-big-num" id="detail-qty">1</span>
                <button class="qty-big-btn" id="qty-plus">+</button>
              </div>
              <div class="product-action-row">
                <button class="btn btn-primary btn-lg" id="add-cart-detail">🛒 Add to Cart</button>
                <button class="btn btn-outline btn-lg">♡ Wishlist</button>
              </div>
            </div>
          </div>

          ${related.length > 0 ? `
          <div style="margin-top:4rem">
            <h3 class="section-title" style="margin-bottom:1.5rem">Related <span>Products</span></h3>
            <div class="products-grid">${related.map(r => Products.renderCard(r, '')).join('')}</div>
          </div>` : ''}
        </div>
      </section>
      ${renderFooter()}`;

    // Qty controls
    let qty = 1;
    document.getElementById('qty-minus').addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      document.getElementById('detail-qty').textContent = qty;
    });
    document.getElementById('qty-plus').addEventListener('click', () => {
      qty++;
      document.getElementById('detail-qty').textContent = qty;
    });

    // Add to cart
    document.getElementById('add-cart-detail').addEventListener('click', () => {
      for (let i = 0; i < qty; i++) Cart.addItem(p);
      toast(`${p.name} × ${qty} added to cart!`, 'success');
    });

    // Related wishlist
    document.querySelectorAll('.product-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
      });
    });
  }

  // ===== CART PAGE =====
  function renderCart(main) {
    const cartItems = Cart.getCart();
    const total = Cart.getTotal();

    if (cartItems.length === 0) {
      main.innerHTML = `
        <div class="page-header"><div class="page-header-inner"><h1>🛒 My Cart</h1></div></div>
        <section class="section"><div class="container">
          <div class="cart-empty">
            <div class="cart-empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <a href="#products" class="btn btn-primary">Start Shopping →</a>
          </div>
        </div></section>
        ${renderFooter()}`;
      return;
    }

    main.innerHTML = `
      <div class="page-header"><div class="page-header-inner"><h1>🛒 My Cart (${cartItems.length})</h1><div class="breadcrumb"><a href="#home">Home</a> / Cart</div></div></div>
      <section class="section">
        <div class="container">
          <div class="cart-layout">
            <div>
              <div class="cart-items">
                <div class="cart-header-row">
                  <h3>Cart Items</h3>
                  <button class="btn btn-danger btn-sm" onclick="App.clearCart()">Clear All</button>
                </div>
                <div id="cart-items-list">
                  ${cartItems.map(item => renderCartItem(item)).join('')}
                </div>
              </div>
            </div>
            <div>
              <div class="cart-summary-card">
                <h3>Order Summary</h3>
                <div class="summary-row"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
                <div class="summary-row"><span>Delivery</span><span style="color:var(--primary)">Free</span></div>
                <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
                <a href="#checkout" class="btn btn-primary btn-block mt-3" style="margin-top:1rem">Proceed to Checkout →</a>
                <a href="#products" class="btn btn-outline btn-block" style="margin-top:0.75rem">← Continue Shopping</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${renderFooter()}`;
  }

  function renderCartItem(item) {
    const imgFile = item.image ? item.image.split('/').pop() : '7.jpg';
    return `
      <div class="cart-item" id="cart-item-${item.id}">
        <div class="cart-item-img"><img src="assets/images/${imgFile}" alt="${item.name}" loading="lazy"></div>
        <div>
          <div class="cart-item-category">${item.category || ''}</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="qty-control" style="margin-top:0.5rem">
            <button class="qty-btn" onclick="App.updateCartQty('${item.id}', -1)">−</button>
            <span class="qty-num" id="qty-${item.id}">${item.qty}</span>
            <button class="qty-btn" onclick="App.updateCartQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="App.removeFromCart('${item.id}')" title="Remove">✕</button>
      </div>`;
  }

  function removeFromCart(id) {
    Cart.removeItem(id);
    renderCart(document.getElementById('main-content'));
    toast('Item removed from cart', 'info');
  }

  function updateCartQty(id, delta) {
    Cart.updateQty(id, delta);
    renderCart(document.getElementById('main-content'));
  }

  function clearCart() {
    showModal('Clear Cart', '<p>Are you sure you want to remove all items from your cart?</p>',
      `<button class="btn btn-outline" onclick="App.closeModal()">Cancel</button>
       <button class="btn btn-danger" onclick="Cart.clearCart();App.closeModal();App.route()">Yes, Clear</button>`);
  }

  // ===== CHECKOUT PAGE =====
  function renderCheckout(main) {
    const cart = Cart.getCart();
    const total = Cart.getTotal();
    const user = Auth.getCurrentUser();

    main.innerHTML = `
      <div class="page-header"><div class="page-header-inner"><h1>💳 Checkout</h1><div class="breadcrumb"><a href="#home">Home</a> / <a href="#cart">Cart</a> / Checkout</div></div></div>
      <section class="section">
        <div class="container">
          <div class="checkout-layout">
            <div class="checkout-form">
              <h3 class="checkout-section-title"><i>👤</i> Delivery Information</h3>
              <form id="checkout-form" novalidate>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-control" id="co-name" value="${user ? user.name : ''}" placeholder="Full Name" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-control" id="co-phone" value="${user ? user.phone || '' : ''}" placeholder="Phone Number" required>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Delivery Address</label>
                  <input type="text" class="form-control" id="co-address" value="${user ? user.address || '' : ''}" placeholder="e.g., Kigali, Remera, Street..." required>
                </div>
                <div class="form-group">
                  <label class="form-label">Additional Notes (Optional)</label>
                  <textarea class="form-control" id="co-notes" rows="3" placeholder="Any special instructions..."></textarea>
                </div>
                <h3 class="checkout-section-title" style="margin-top:1.5rem"><i>💳</i> Payment Method</h3>
                <div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem">
                  <label style="display:flex;align-items:center;gap:0.75rem;padding:1rem;border:1.5px solid var(--primary);border-radius:var(--radius);cursor:pointer;background:rgba(76,175,80,0.05)">
                    <input type="radio" name="payment" value="cod" checked style="accent-color:var(--primary)">
                    <span>💵 Cash on Delivery</span>
                  </label>
                  <label style="display:flex;align-items:center;gap:0.75rem;padding:1rem;border:1.5px solid var(--border);border-radius:var(--radius);cursor:pointer">
                    <input type="radio" name="payment" value="momo" style="accent-color:var(--primary)">
                    <span>📱 Mobile Money (MTN)</span>
                  </label>
                </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg">Place Order →</button>
              </form>
            </div>
            <div>
              <div class="cart-summary-card">
                <h3>Order Summary</h3>
                ${cart.map(item => `
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;font-size:0.9rem">
                    <div style="display:flex;align-items:center;gap:0.5rem">
                      <img src="assets/images/${item.image.split('/').pop()}" style="width:40px;height:40px;border-radius:8px;object-fit:cover">
                      <span>${item.name} × ${item.qty}</span>
                    </div>
                    <span>$${(item.price * item.qty).toFixed(2)}</span>
                  </div>`).join('')}
                <div class="summary-row" style="margin-top:1rem"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
                <div class="summary-row"><span>Delivery</span><span style="color:var(--primary)">Free</span></div>
                <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${renderFooter()}`;

    document.getElementById('checkout-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('co-name').value.trim();
      const phone = document.getElementById('co-phone').value.trim();
      const address = document.getElementById('co-address').value.trim();
      const notes = document.getElementById('co-notes').value.trim();
      const payment = document.querySelector('input[name="payment"]:checked').value;

      if (!name || !phone || !address) { toast('Please fill all required fields', 'error'); return; }

      const result = Cart.placeOrder({ name, phone, address, notes, payment });
      if (result.ok) {
        showModal('🎉 Order Placed!',
          `<div style="text-align:center;padding:1rem">
            <div style="font-size:3rem;margin-bottom:1rem">✅</div>
            <h3 style="margin-bottom:0.5rem">Thank you, ${name}!</h3>
            <p style="color:var(--text-secondary)">Your order <strong>${result.order.id}</strong> has been placed successfully.</p>
            <p style="color:var(--text-secondary);margin-top:0.5rem">Total: <strong>$${result.order.total.toFixed(2)}</strong></p>
          </div>`,
          `<a href="#orders" class="btn btn-outline" onclick="App.closeModal()">View Orders</a>
           <a href="#home" class="btn btn-primary" onclick="App.closeModal()">Continue Shopping</a>`);
        renderNavbar();
      }
    });
  }

  // ===== PROFILE PAGE =====
  function renderProfile(main) {
    const user = Auth.getCurrentUser();
    main.innerHTML = `
      <div class="page-header"><div class="page-header-inner"><h1>👤 My Profile</h1></div></div>
      <section class="section">
        <div class="container">
          <div class="profile-layout">
            <div class="profile-sidebar">
              <div class="profile-avatar">${user.name.charAt(0).toUpperCase()}</div>
              <div class="profile-name">${user.name}</div>
              <div class="profile-email">${user.email}</div>
              <nav class="profile-nav">
                <a href="#profile" class="active">👤 Profile</a>
                <a href="#orders">📦 Order History</a>
                <a href="#cart">🛒 My Cart</a>
                <a href="#" onclick="event.preventDefault();Auth.logout()">🚪 Logout</a>
              </nav>
            </div>
            <div class="profile-content">
              <div class="profile-section-header">
                <h3>Personal Information</h3>
                <button class="btn btn-outline btn-sm" id="edit-toggle">Edit</button>
              </div>
              <div id="profile-msg"></div>
              <form id="profile-form">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" id="prof-name" class="form-control" value="${user.name}" readonly>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" id="prof-email" class="form-control" value="${user.email}" readonly>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" id="prof-phone" class="form-control" value="${user.phone || ''}" readonly>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Address</label>
                    <input type="text" id="prof-address" class="form-control" value="${user.address || ''}" placeholder="Your address" readonly>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary hidden" id="save-profile">Save Changes</button>
              </form>
              <!-- Stats -->
              <div style="margin-top:2rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
                <div style="background:var(--bg-secondary);border-radius:var(--radius);padding:1.25rem;text-align:center">
                  <div style="font-size:1.8rem;font-weight:800;color:var(--primary)">${Cart.getUserOrders().length}</div>
                  <div style="font-size:0.85rem;color:var(--text-muted)">Orders</div>
                </div>
                <div style="background:var(--bg-secondary);border-radius:var(--radius);padding:1.25rem;text-align:center">
                  <div style="font-size:1.8rem;font-weight:800;color:var(--primary)">$${Cart.getUserOrders().reduce((s,o)=>s+o.total,0).toFixed(0)}</div>
                  <div style="font-size:0.85rem;color:var(--text-muted)">Total Spent</div>
                </div>
                <div style="background:var(--bg-secondary);border-radius:var(--radius);padding:1.25rem;text-align:center">
                  <div style="font-size:1.8rem;font-weight:800;color:var(--primary)">${Cart.getCount()}</div>
                  <div style="font-size:0.85rem;color:var(--text-muted)">Cart Items</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      ${renderFooter()}`;

    let editing = false;
    document.getElementById('edit-toggle').addEventListener('click', () => {
      editing = !editing;
      ['prof-name','prof-phone','prof-address'].forEach(id => {
        document.getElementById(id).readOnly = !editing;
        document.getElementById(id).style.borderColor = editing ? 'var(--primary)' : '';
      });
      document.getElementById('save-profile').classList.toggle('hidden', !editing);
      document.getElementById('edit-toggle').textContent = editing ? 'Cancel' : 'Edit';
    });

    document.getElementById('profile-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const result = Auth.updateProfile({
        name: document.getElementById('prof-name').value.trim(),
        phone: document.getElementById('prof-phone').value.trim(),
        address: document.getElementById('prof-address').value.trim()
      });
      if (result.ok) { toast('Profile updated!', 'success'); renderProfile(main); }
    });
  }

  // ===== ORDERS PAGE =====
  function renderOrders(main) {
    const orders = Cart.getUserOrders();
    const statusClass = { processing: 'status-processing', delivered: 'status-delivered', pending: 'status-pending' };

    main.innerHTML = `
      <div class="page-header"><div class="page-header-inner"><h1>📦 Order History</h1><div class="breadcrumb"><a href="#home">Home</a> / Orders</div></div></div>
      <section class="section">
        <div class="container">
          ${orders.length === 0
            ? `<div class="cart-empty"><div class="cart-empty-icon">📦</div><h3>No orders yet</h3><p>Start shopping to see your orders here!</p><a href="#products" class="btn btn-primary">Shop Now →</a></div>`
            : orders.map(o => `
              <div class="order-card">
                <div class="order-header">
                  <div>
                    <div class="order-id">${o.id}</div>
                    <div class="order-date">${new Date(o.date).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</div>
                  </div>
                  <span class="order-status ${statusClass[o.status] || 'status-processing'}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span>
                </div>
                <div class="order-items-mini">
                  ${o.items.map(i => `<span class="order-item-mini">🛒 ${i.name} × ${i.qty}</span>`).join('')}
                </div>
                <div class="order-footer">
                  <span style="color:var(--text-secondary);font-size:0.9rem">📍 ${o.details.address}</span>
                  <span class="order-total">Total: $${o.total.toFixed(2)}</span>
                </div>
              </div>`).join('')}
        </div>
      </section>
      ${renderFooter()}`;
  }

  // ===== ABOUT PAGE =====
  function renderAbout(main) {
    main.innerHTML = `
      <div class="about-hero">
        <h1>About Us</h1>
        <p>Discover the freshness of our premium fruits, carefully sourced from trusted local farms across Rwanda.</p>
      </div>
      <section class="section">
        <div class="container">
          <div class="about-content">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:center;margin-bottom:2rem">
              <div>
                <span class="section-label">Our Story</span>
                <h2 class="section-title" style="text-align:left">Premium Fruits <span>Delivered</span></h2>
              </div>
              <div></div>
            </div>
            <p>Discover the freshness of our premium fruits, carefully sourced from trusted local farms. Our crisp red apples are juicy and naturally sweet, perfect for snacking or making fresh juice.</p>
            <p>Each fruit is hand-picked to ensure the highest quality and delivered straight to your door to maintain peak freshness. Available in convenient weight options including 1 kg, 2 kg, or larger boxes.</p>
            <p>These apples are rich in Vitamin C and fiber, promoting a healthy lifestyle. With competitive prices, fast delivery, and customer reviews to guide your choice, shopping for fresh fruits online has never been easier.</p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🌱</div>
              <h4>Farm Fresh</h4>
              <p>Sourced directly from trusted local farms in Rwanda for maximum freshness and quality.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🚚</div>
              <h4>Fast Delivery</h4>
              <p>Same-day delivery across Kigali. Fresh produce at your doorstep when you need it.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💯</div>
              <h4>100% Natural</h4>
              <p>No preservatives, no chemicals. Just pure, natural fruits the way nature intended.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💰</div>
              <h4>Best Prices</h4>
              <p>Competitive pricing with regular deals and discounts for our loyal customers.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⭐</div>
              <h4>Top Quality</h4>
              <p>Hand-picked, quality-checked produce ensuring you receive only the best every time.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h4>Easy Ordering</h4>
              <p>Simple, user-friendly platform to browse, order, and track your fresh produce.</p>
            </div>
          </div>
          <div style="margin-top:4rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
            <img src="assets/images/3.jpg" alt="Fresh Fruits" style="border-radius:var(--radius-lg);box-shadow:var(--shadow)">
            <img src="assets/images/9.jpg" alt="Fresh Juice" style="border-radius:var(--radius-lg);box-shadow:var(--shadow)">
            <img src="assets/images/10.jpg" alt="Fruit Salad" style="border-radius:var(--radius-lg);box-shadow:var(--shadow)">
          </div>
        </div>
      </section>
      ${renderFooter()}`;
  }

  // ===== CONTACT PAGE =====
  function renderContact(main) {
    main.innerHTML = `
      <div class="page-header"><div class="page-header-inner"><h1>📞 Contact Us</h1><div class="breadcrumb"><a href="#home">Home</a> / Contact</div></div></div>
      <section class="section">
        <div class="container">
          <div class="contact-layout">
            <div class="contact-info-card">
              <h3>Get In Touch</h3>
              <p>Have a question or want to place a bulk order? Reach out to us anytime.</p>
              <div class="contact-detail">
                <div class="contact-detail-icon">📍</div>
                <div class="contact-detail-text"><h5>Address</h5><p>Rwanda - Kigali - Remera</p></div>
              </div>
              <div class="contact-detail">
                <div class="contact-detail-icon">✉️</div>
                <div class="contact-detail-text"><h5>Email</h5><p>foodap12@gmail.com</p></div>
              </div>
              <div class="contact-detail">
                <div class="contact-detail-icon">💬</div>
                <div class="contact-detail-text"><h5>WhatsApp</h5><p>+250794010485</p></div>
              </div>
              <div class="contact-detail">
                <div class="contact-detail-icon">📘</div>
                <div class="contact-detail-text"><h5>Facebook</h5><p>food app</p></div>
              </div>
              <div style="margin-top:2rem">
                <div style="font-weight:700;margin-bottom:0.75rem;opacity:0.9">Follow Us</div>
                <div class="footer-social">
                  <a href="#" class="social-link">📸</a>
                  <a href="#" class="social-link">💬</a>
                  <a href="#" class="social-link">👤</a>
                </div>
              </div>
            </div>
            <div class="contact-form-card">
              <h3>Send a Message</h3>
              <div id="contact-msg"></div>
              <form id="contact-form" novalidate>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" id="c-name" placeholder="Your name" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="c-email" placeholder="Your email" required>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Phone</label>
                  <input type="tel" class="form-control" id="c-phone" placeholder="+250...">
                </div>
                <div class="form-group">
                  <label class="form-label">Subject</label>
                  <input type="text" class="form-control" id="c-subject" placeholder="How can we help?" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Message</label>
                  <textarea class="form-control" id="c-message" rows="5" placeholder="Type your message..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Send Message 📤</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      ${renderFooter()}`;

    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('c-name').value.trim();
      const email = document.getElementById('c-email').value.trim();
      const subject = document.getElementById('c-subject').value.trim();
      const msg = document.getElementById('c-message').value.trim();
      if (!name || !email || !subject || !msg) { toast('Please fill all required fields', 'error'); return; }
      document.getElementById('contact-msg').innerHTML = `<div style="background:rgba(76,175,80,0.1);color:var(--primary);padding:0.75rem 1rem;border-radius:var(--radius);margin-bottom:1rem">✅ Message sent! We'll get back to you soon.</div>`;
      this.reset();
    });
  }

  // ===== 404 PAGE =====
  function render404(main) {
    main.innerHTML = `
      <div class="not-found" style="margin-top:var(--navbar-h)">
        <div class="not-found-content fade-in">
          <div class="not-found-num">404</div>
          <div style="font-size:4rem;margin:-1rem 0 1rem">🍎</div>
          <h2>Page Not Found</h2>
          <p>The page you're looking for seems to have gone missing, like a missing fruit from our basket!</p>
          <a href="#home" class="btn btn-primary btn-lg">← Back to Home</a>
        </div>
      </div>
      ${renderFooter()}`;
  }

  // ===== ADD TO CART FROM CARD =====
  function addToCartFromCard(id) {
    const p = Products.getById(id);
    if (!p) return;
    if (!Auth.getCurrentUser()) {
      toast('Please login to add items to cart', 'warning');
      setTimeout(() => { window.location.hash = '#login'; }, 1000);
      return;
    }
    Cart.addItem(p);
    toast(`${p.name} added to cart! 🛒`, 'success');
  }

  // ===== INIT =====
  function init() {
    // Restore theme
    const savedTheme = localStorage.getItem('foodapp_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Hide loading screen
    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('hidden');
    }, 1200);

    // Route on hash change
    window.addEventListener('hashchange', route);

    // Initial route
    route();

    // Update cart badge
    Cart.updateBadge();
  }

  return { init, route, toast, showModal, closeModal, addToCartFromCard, removeFromCart, updateCartQty, clearCart, toggleMobileMenu, closeMobileMenu, toggleTheme };
})();

// Start app
document.addEventListener('DOMContentLoaded', App.init);
