/**
 * cart.js - Cart & Order management
 */

const Cart = (() => {
  function getCart() {
    try { return JSON.parse(localStorage.getItem('foodapp_cart') || '[]'); } catch { return []; }
  }
  function saveCart(cart) { localStorage.setItem('foodapp_cart', JSON.stringify(cart)); }
  function getOrders() {
    try { return JSON.parse(localStorage.getItem('foodapp_orders') || '[]'); } catch { return []; }
  }
  function saveOrders(orders) { localStorage.setItem('foodapp_orders', JSON.stringify(orders)); }

  function addItem(product) {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
    updateBadge();
    return true;
  }

  function removeItem(id) {
    const cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    updateBadge();
  }

  function updateQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, item.qty + delta);
      saveCart(cart);
      updateBadge();
    }
  }

  function clearCart() { localStorage.removeItem('foodapp_cart'); updateBadge(); }

  function getTotal() {
    return getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
  }

  function getCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function updateBadge() {
    const badge = document.getElementById('cart-badge');
    const count = getCount();
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
  }

  function placeOrder(details) {
    const user = Auth.getCurrentUser();
    const cart = getCart();
    if (cart.length === 0) return { ok: false, msg: 'Cart is empty.' };

    const order = {
      id: 'ORD-' + Date.now(),
      userId: user ? user.id : 'guest',
      items: cart,
      total: getTotal(),
      details,
      status: 'processing',
      date: new Date().toISOString()
    };
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    clearCart();
    return { ok: true, order };
  }

  function getUserOrders() {
    const user = Auth.getCurrentUser();
    if (!user) return [];
    return getOrders().filter(o => o.userId === user.id);
  }

  return { addItem, removeItem, updateQty, clearCart, getCart, getTotal, getCount, updateBadge, placeOrder, getUserOrders };
})();
