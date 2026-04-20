/**
 * products.js - Product data and rendering
 * All images sourced from prototype only
 */

const Products = (() => {
  // Product data based on prototype images
  const data = [
    // Fruits (images from prototype pages 7-8)
    { id: 'f1', name: 'Fresh Orange', category: 'fruits', price: 6, image: '../assets/images/7.jpg', desc: 'Sweet, juicy oranges rich in Vitamin C. Perfect for fresh juice or snacking.', weight: '1 kg', origin: 'Rwanda', badge: 'Popular', rating: 4.8, reviews: 124 },
    { id: 'f2', name: 'Ripe Avocado', category: 'fruits', price: 3, image: '../assets/images/7.jpg', desc: 'Creamy, fresh avocados loaded with healthy fats and nutrients.', weight: '500g', origin: 'Rwanda', badge: 'Fresh', rating: 4.6, reviews: 87 },
    { id: 'f3', name: 'Banana Bunch', category: 'fruits', price: 3, image: '../assets/images/7.jpg', desc: 'Sweet, energy-packed bananas. Great for snacks and smoothies.', weight: '1 kg', origin: 'Rwanda', badge: '', rating: 4.5, reviews: 96 },
    { id: 'f4', name: 'Red Apple', category: 'fruits', price: 4, image: '../assets/images/8.jpg', desc: 'Crisp, naturally sweet apples. Rich in fiber and antioxidants.', weight: '1 kg', origin: 'Rwanda', badge: 'Best Seller', rating: 4.7, reviews: 150 },
    { id: 'f5', name: 'Mango', category: 'fruits', price: 2, image: '../assets/images/8.jpg', desc: 'Tropical, sweet mangoes bursting with flavor and nutrients.', weight: '500g', origin: 'Rwanda', badge: 'Seasonal', rating: 4.9, reviews: 200 },
    { id: 'f6', name: 'Mixed Fruit Basket', category: 'fruits', price: 12, image: '../assets/images/3.jpg', desc: 'Assorted seasonal fresh fruits handpicked from local farms.', weight: '2 kg', origin: 'Rwanda', badge: 'Bundle', rating: 4.8, reviews: 63 },
    // Juice (images from prototype page 9)
    { id: 'j1', name: 'Fresh Fruit Juice', category: 'juice', price: 5, image: '../assets/images/9.jpg', desc: 'Cold-pressed from seasonal fruits. No preservatives, 100% natural.', volume: '500ml', origin: 'Rwanda', badge: 'No Preservatives', rating: 4.9, reviews: 178 },
    { id: 'j2', name: 'Mixed Juice', category: 'juice', price: 4, image: '../assets/images/9.jpg', desc: 'A refreshing blend of tropical fruits bursting with energy.', volume: '500ml', origin: 'Rwanda', badge: 'Refreshing', rating: 4.7, reviews: 134 },
    { id: 'j3', name: 'Orange Juice', category: 'juice', price: 3, image: '../assets/images/9.jpg', desc: 'Freshly squeezed pure orange juice with natural sweetness.', volume: '330ml', origin: 'Rwanda', badge: '', rating: 4.6, reviews: 99 },
    { id: 'j4', name: 'Detox Green Juice', category: 'juice', price: 6, image: '../assets/images/9.jpg', desc: 'A healthy blend of vegetables and fruits for a natural detox boost.', volume: '400ml', origin: 'Rwanda', badge: 'Healthy', rating: 4.8, reviews: 57 },
    // Salad (images from prototype page 10)
    { id: 's1', name: 'Fresh Fruit Salad', category: 'salad', price: 5, image: '../assets/images/10.jpg', desc: 'Fresh seasonal fruits tossed together. Light, sweet, and nutritious.', weight: '400g', origin: 'Rwanda', badge: 'Fresh Daily', rating: 4.8, reviews: 112 },
    { id: 's2', name: 'Tropical Salad', category: 'salad', price: 7, image: '../assets/images/10.jpg', desc: 'Exotic tropical fruits with a light honey-lime dressing.', weight: '500g', origin: 'Rwanda', badge: 'Premium', rating: 4.7, reviews: 78 },
    { id: 's3', name: 'Mixed Bowl Salad', category: 'salad', price: 4, image: '../assets/images/10.jpg', desc: 'Small price, great quality. A colorful mix of nutritious fresh fruits.', weight: '300g', origin: 'Rwanda', badge: 'Budget Friendly', rating: 4.5, reviews: 92 },
  ];

  function getAll() { return data; }
  function getById(id) { return data.find(p => p.id === id); }
  function getByCategory(cat) { return cat === 'all' ? data : data.filter(p => p.category === cat); }
  function search(q) {
    const lower = q.toLowerCase();
    return data.filter(p => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower) || p.desc.toLowerCase().includes(lower));
  }

  function renderCard(p, pathPrefix = '../') {
    const stars = Array.from({length: 5}, (_, i) => `<span class="star ${i < Math.floor(p.rating) ? 'filled' : ''}">★</span>`).join('');
    return `
      <div class="product-card slide-up" data-id="${p.id}">
        <div class="product-img-wrap">
          <img src="${pathPrefix}assets/images/${p.image.split('/').pop()}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <button class="product-wishlist" data-id="${p.id}" title="Add to wishlist">♡</button>
        </div>
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="stars">${stars}</div>
          <div class="product-footer" style="margin-top:0.75rem">
            <div class="product-price">$${p.price}<span>/ unit</span></div>
            <button class="btn-add-cart" onclick="App.addToCartFromCard('${p.id}')">
              🛒 Add
            </button>
          </div>
        </div>
      </div>`;
  }

  return { getAll, getById, getByCategory, search, renderCard };
})();
