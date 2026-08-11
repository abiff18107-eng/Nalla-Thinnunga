// ==========================================================================
// Nalla Thinnunga - DISH CATEGORY & VARIETY SHOWCASE LOGIC
// ==========================================================================

let categoryItems = [];
let currentCategory = 'biryani';
let currentDietFilter = 'all';
let searchQuery = '';
let cart = [];

// Category metadata details
const categoryMeta = {
  biryani: {
    title: 'Royal Biryani Varieties & Dum Festival',
    eyebrow: '🍲 Slow Dum Cooked • Saffron Rice • Rich Spices',
    subtitle: 'Savor our signature dum biryanis crafted with long-grain basmati, authentic spices, fried onions, and served with salan and chilled raita.',
    bg: 'linear-gradient(135deg, rgba(30, 20, 10, 0.95), rgba(15, 10, 5, 0.95))'
  },
  mandhi: {
    title: 'Authentic Arabian Mandhi Feast',
    eyebrow: '🍖 Charcoal Flame Grilled • Saffron Mandhi Rice',
    subtitle: 'Experience Yemen & Arabian style Mandhi with tender meat roasted over wood coals, fragrant rice, toasted almonds, and spicy tomato salsa.',
    bg: 'linear-gradient(135deg, rgba(35, 15, 10, 0.95), rgba(15, 8, 5, 0.95))'
  },
  indian: {
    title: 'Classic Indian Curries & Tandoori',
    eyebrow: '🍛 Rich Butter Masalas • Clay Oven Grills',
    subtitle: 'Handcrafted North & South Indian classics infused with rich cream, pure desi ghee, and charcoal-tandoor flavors.',
    bg: 'linear-gradient(135deg, rgba(25, 20, 15, 0.95), rgba(10, 8, 5, 0.95))'
  },
  chinese: {
    title: 'High-Flame Chinese Wok & Dim Sums',
    eyebrow: '🥢 Wok-Tossed Fried Rice • Fiery Szechuan Glazes',
    subtitle: 'Crispy pan-seared appetisers, stir-fried noodles, and high-heat wok specials tossed with garlic, ginger, and sesame.',
    bg: 'linear-gradient(135deg, rgba(20, 25, 20, 0.95), rgba(5, 10, 5, 0.95))'
  },
  western: {
    title: 'Gourmet Western Steaks & Risotto',
    eyebrow: '🥩 Truffle Mushroom Risotto • Char-Grilled Steaks',
    subtitle: 'Elegantly plated Italian risottos, artisanal pastas, and prime cuts prepared with truffle oils and fine herb sauces.',
    bg: 'linear-gradient(135deg, rgba(15, 20, 30, 0.95), rgba(5, 8, 15, 0.95))'
  },
  dessert: {
    title: 'Decadent Desserts & Sweet Treats',
    eyebrow: '🍨 Belgian Chocolates • Authentic Arabian Sweets',
    subtitle: 'Indulgent sweet creations ranging from rich dark chocolate mousse to traditional saffron gulab jamuns and warm kunafa.',
    bg: 'linear-gradient(135deg, rgba(30, 15, 25, 0.95), rgba(12, 5, 10, 0.95))'
  },
  beverages: {
    title: 'Tea, Coffee & Authentic Chaya Corner',
    eyebrow: '☕ High-Poured Nadan Chaya • Filter Coffee • Custom Sugar & Brew Strength',
    subtitle: 'Freshly brewed Kerala milk tea, South Indian filter coffee, sulaimani, ginger tea, and espressos. Choose your preferred sugar level (Sugar, Less Sugar, Without Sugar) and strength (Light, Medium, Strong)!',
    bg: 'linear-gradient(135deg, rgba(30, 20, 15, 0.95), rgba(15, 10, 8, 0.95))'
  },
  juices: {
    title: 'Fresh Cold Juices & Malabar Shakes',
    eyebrow: '🧃 Mint Kulukki Sarbath • Tender Coconut • Avil Milk',
    subtitle: '100% natural cold-pressed juices, refreshing Kulukki Sarbath, hydrating tender coconut water, Alphonso mango shake, and Malabar Avil Milk.',
    bg: 'linear-gradient(135deg, rgba(15, 30, 20, 0.95), rgba(5, 15, 10, 0.95))'
  },
  local: {
    title: 'Authentic South Indian Local Specials',
    eyebrow: '🌴 Nadan Fish Fry • Idli Sambar Chutneys • Ghee Dosa • Malabar Porotta',
    subtitle: 'Taste local South Indian comfort food! Tava fried seer fish, steaming white idlis with hot sambar and trio of chutneys, crispy ghee roast dosa, and flaky porotta with chicken roast.',
    bg: 'linear-gradient(135deg, rgba(35, 25, 15, 0.95), rgba(15, 10, 5, 0.95))'
  },
  alcohol: {
    title: 'Nalla Thinnunga Bar & Lounge',
    eyebrow: '🍷 Jack Daniel\'s • Old Monk • Bacardi • Magic Moments • Honey Bee • Chilled Beers',
    subtitle: 'Savor premium spirits and craft beers in our dark lounge. Explore Tennessee whiskey, vatted dark rums, triple-distilled grain vodkas, fine brandies, gins, and ice-cold beers.',
    bg: 'linear-gradient(135deg, rgba(20, 10, 30, 0.95), rgba(10, 5, 15, 0.95))'
  },
  whiskey: {
    title: 'Whiskey Lounge (Tennessee, Single Malts & Blends)',
    eyebrow: '🥃 Jack Daniel\'s • Amrut Single Malt • Royal Challenge • Signature • McDowell\'s No.1',
    subtitle: 'Taste iconic charcoal-mellowed Tennessee whiskey, award-winning Indian single malts, and classic grain whiskies served in 60ml pegs with ice, water, or soda.',
    bg: 'linear-gradient(135deg, rgba(30, 15, 10, 0.95), rgba(15, 8, 5, 0.95))'
  },
  rum: {
    title: 'Legendary Rum Collection',
    eyebrow: '🍹 Old Monk XXX Dark Rum • Bacardi Superior White Rum • Captain Morgan Spiced',
    subtitle: 'Iconic 7-year vatted dark rums, smooth white rums, and spiced Caribbean blends served with cola, ice, or fresh mixers.',
    bg: 'linear-gradient(135deg, rgba(35, 20, 10, 0.95), rgba(15, 10, 5, 0.95))'
  },
  vodka: {
    title: 'Vodka & Gin Lounge',
    eyebrow: '🍸 Magic Moments • Absolut • Smirnoff • Blue Riband Gin • Bombay Sapphire',
    subtitle: 'Triple-distilled grain vodkas and vapor-infused London dry gins. Enjoy neat, on the rocks, or mixed with fresh citrus & tonic.',
    bg: 'linear-gradient(135deg, rgba(15, 25, 35, 0.95), rgba(5, 10, 15, 0.95))'
  },
  brandy: {
    title: 'Premium Fine Grape Brandies',
    eyebrow: '🍷 Honey Bee Brandy • Morpheus XO • Mansion House French Brandy',
    subtitle: 'Smooth aged brandies infused with honey and oak notes. Warm, aromatic, and rich French grape spirits served in snifter glasses.',
    bg: 'linear-gradient(135deg, rgba(30, 15, 20, 0.95), rgba(12, 5, 10, 0.95))'
  },
  beer: {
    title: 'Chilled Beers & Craft Brews',
    eyebrow: '🍺 Kingfisher Premium • Bira 91 White • Heineken Dutch Lager • British Empire Strong',
    subtitle: 'Ice-cold lager pints, Belgian craft wheat beers, and strong malt brews. Served chilled with roasted bar snacks and finger food.',
    bg: 'linear-gradient(135deg, rgba(25, 30, 15, 0.95), rgba(10, 15, 5, 0.95))'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  parseCategoryFromUrl();
  fetchCategoryItems();
});

function parseCategoryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam && categoryMeta[catParam.toLowerCase()]) {
    currentCategory = catParam.toLowerCase();
  } else {
    currentCategory = 'biryani';
  }
  updateHeroMeta();
  highlightCategoryPill();
}

function updateHeroMeta() {
  const meta = categoryMeta[currentCategory] || categoryMeta.biryani;
  const titleEl = document.getElementById('catTitle');
  const eyebrowEl = document.getElementById('catEyebrow');
  const subtitleEl = document.getElementById('catSubtitle');

  if (titleEl) titleEl.textContent = meta.title;
  if (eyebrowEl) eyebrowEl.textContent = meta.eyebrow;
  if (subtitleEl) subtitleEl.textContent = meta.subtitle;
}

function highlightCategoryPill() {
  document.querySelectorAll('.cat-pill-btn').forEach(btn => {
    if (btn.dataset.cat === currentCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

async function fetchCategoryItems() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;
  grid.innerHTML = '<p class="preview-empty">Loading dish varieties...</p>';

  try {
    const res = await fetch(`/api/menu?category=${currentCategory}`);
    categoryItems = await res.json();
    renderCategoryGrid();
  } catch (err) {
    grid.innerHTML = '<p class="preview-empty">Error connecting to server. Please try again later.</p>';
  }
}

function filterDiet(diet) {
  currentDietFilter = diet;
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.textContent.toLowerCase().includes(diet));
  });
  renderCategoryGrid();
}

function handleSearchInput(e) {
  searchQuery = e.target.value.toLowerCase().trim();
  renderCategoryGrid();
}

function renderCategoryGrid() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;

  let filtered = categoryItems;

  if (currentDietFilter === 'veg') {
    filtered = filtered.filter(item => item.isVeg === true);
  } else if (currentDietFilter === 'nonveg') {
    filtered = filtered.filter(item => item.isVeg === false);
  }

  if (searchQuery) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery) ||
      item.spiceLevel.toLowerCase().includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state-box"><div class="empty-icon">🍽️</div><h3>No varieties match your filter</h3><p>Try switching between Veg / Non-Veg tabs or searching for another term.</p></div>';
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const isVeg = item.isVeg !== false;
    const dietLabel = isVeg ? '🟢 Veg' : '🔴 Non-Veg';
    const dietClass = isVeg ? 'veg' : 'non-veg';
    const hasPortions = Boolean(item.halfPrice);

    return `
      <article class="menu-card category-item-card" id="card-${item.id}">
        <div class="menu-card-img-wrap">
          <img src="${item.image}" alt="${item.name}" class="menu-card-img" />
          <span class="diet-tag ${dietClass}">${dietLabel}</span>
          <span class="cuisine-badge">${item.category || item.cuisine}</span>
        </div>

        <div class="menu-card-content">
          <div class="menu-card-title-row">
            <h3>${item.name}</h3>
            <span class="rating-badge">★ ${item.rating || 4.8}</span>
          </div>

          <p class="menu-card-desc">${item.description}</p>
          
          <div class="dish-meta-row">
            <span>🌶️ ${item.spiceLevel}</span>
            <span>⏱️ ${item.prepTime || '20 mins'}</span>
          </div>

          ${hasPortions ? `
            <div class="portion-selector">
              <span class="portion-label">Portion Size:</span>
              <label class="portion-radio">
                <input type="radio" name="portion_${item.id}" value="half" onchange="updatePortionPrice('${item.id}', ${item.halfPrice})" />
                <span>Half (₹${item.halfPrice})</span>
              </label>
              <label class="portion-radio">
                <input type="radio" name="portion_${item.id}" value="full" checked onchange="updatePortionPrice('${item.id}', ${item.price})" />
                <span>Full (₹${item.price})</span>
              </label>
            </div>
          ` : ''}

          ${(item.isCustomizableBeverage || item.category === 'Beverages') ? `
            <div class="beverage-options-box">
              <div class="beverage-option-row">
                <span class="bev-option-label">Sugar Option:</span>
                <select id="sugar_${item.id}" class="bev-select">
                  <option value="Sugar">🍬 Sugar (Normal)</option>
                  <option value="Less Sugar">🤏 Less Sugar</option>
                  <option value="Without Sugar">🚫 Without Sugar</option>
                </select>
              </div>

              <div class="beverage-option-row">
                <span class="bev-option-label">Brew Strength:</span>
                <select id="strength_${item.id}" class="bev-select">
                  <option value="Medium">☕☕ Medium Strength</option>
                  <option value="Light">☕ Light</option>
                  <option value="Strong">☕☕☕ Extra Strong</option>
                </select>
              </div>
            </div>
          ` : ''}

          ${(item.isCustomizableAlcohol || item.category === 'Alcohol' || item.cuisine === 'Alcohol') ? `
            <div class="beverage-options-box alcohol-options-box" style="margin-top: 0.8rem; background: rgba(230, 182, 85, 0.05); padding: 0.8rem; border-radius: var(--radius-md); border: 1px solid var(--accent-gold-glow);">
              
              <div class="beverage-option-row" style="margin-bottom: 0.5rem;">
                <span class="bev-option-label" style="font-weight:700; color:var(--accent-gold);">🥃 Serving Portion:</span>
                <select id="portion_${item.id}" class="bev-select" onchange="updateAlcoholPrice('${item.id}', ${item.price})">
                  ${item.isBeer ? `
                    <option value="pint" data-mult="1.0">🍺 330ml Pint (₹${item.price})</option>
                    <option value="can" data-mult="1.4">🍺 500ml Can (₹${Math.round(item.price * 1.4)})</option>
                    <option value="largebottle" data-mult="1.8">🍺 650ml Large Bottle (₹${Math.round(item.price * 1.8)})</option>
                  ` : `
                    <option value="shot" data-mult="0.6">🥃 30ml Shot / Small (₹${Math.round(item.price * 0.6)})</option>
                    <option value="peg" data-mult="1.0" selected>🥃 60ml Peg / Half (₹${item.price})</option>
                    <option value="quarter" data-mult="2.5">🥃 180ml Quarter / Large (₹${Math.round(item.price * 2.5)})</option>
                    <option value="bottle" data-mult="9.0">🍾 750ml Full Bottle (₹${Math.round(item.price * 9.0)})</option>
                  `}
                </select>
              </div>

              <div class="beverage-option-row">
                <span class="bev-option-label" style="font-weight:700; color:var(--accent-gold);">🍗 Bar Touchings / Side Dish:</span>
                <select id="sidedish_${item.id}" class="bev-select" onchange="updateAlcoholPrice('${item.id}', ${item.price})">
                  <option value="No Side Dish" data-price="0">🚫 No Side Dish</option>
                  <option value="Roasted Masala Peanuts" data-price="60">🥜 Masala Peanuts (+₹60)</option>
                  <option value="Spicy Chicken 65" data-price="180">🍗 Spicy Chicken 65 (+₹180)</option>
                  <option value="Roasted Spiced Cashews" data-price="120">🌰 Spiced Cashews (+₹120)</option>
                  <option value="Tava Seer Fish Fry" data-price="250">🐟 Tava Fish Fry (+₹250)</option>
                  <option value="Egg Pepper Fry" data-price="90">🥚 Egg Pepper Fry (+₹90)</option>
                  <option value="Crispy Roasted Papad" data-price="40">🫓 Crispy Papad (+₹40)</option>
                  <option value="Cheese Balls & Dip" data-price="140">🧀 Cheese Balls (+₹140)</option>
                </select>
              </div>

            </div>
          ` : ''}

          <div class="menu-card-footer">
            <span class="menu-price" id="price-${item.id}">₹${item.price}</span>
            <div class="card-actions">
              <div class="qty-control qty-sm">
                <button type="button" class="qty-btn" onclick="adjustCardQty('${item.id}', -1)">-</button>
                <span class="qty-val" id="qty-${item.id}">1</span>
                <button type="button" class="qty-btn" onclick="adjustCardQty('${item.id}', 1)">+</button>
              </div>
              <button type="button" class="button button-primary button-sm" onclick="addDishToCart('${item.id}')">+ Add to Bill</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function updateAlcoholPrice(dishId, basePrice) {
  const portionEl = document.getElementById(`portion_${dishId}`);
  const sideEl = document.getElementById(`sidedish_${dishId}`);
  const priceEl = document.getElementById(`price-${dishId}`);

  let mult = 1.0;
  if (portionEl) {
    const selectedOption = portionEl.options[portionEl.selectedIndex];
    mult = parseFloat(selectedOption.dataset.mult || '1.0');
  }

  let sideAdd = 0;
  if (sideEl) {
    const selectedSide = sideEl.options[sideEl.selectedIndex];
    sideAdd = parseFloat(selectedSide.dataset.price || '0');
  }

  const finalCalc = Math.round(basePrice * mult) + sideAdd;
  if (priceEl) priceEl.textContent = `₹${finalCalc}`;
}

function updatePortionPrice(dishId, newPrice) {
  const priceEl = document.getElementById(`price-${dishId}`);
  if (priceEl) {
    priceEl.textContent = `₹${newPrice}`;
  }
}

function adjustCardQty(dishId, delta) {
  const qtyEl = document.getElementById(`qty-${dishId}`);
  if (!qtyEl) return;
  let val = Math.max(1, parseInt(qtyEl.textContent || 1) + delta);
  qtyEl.textContent = val;
}

function addDishToCart(dishId) {
  const item = categoryItems.find(i => i.id === dishId);
  if (!item) return;

  const qtyEl = document.getElementById(`qty-${dishId}`);
  const qty = qtyEl ? parseInt(qtyEl.textContent) || 1 : 1;

  let portionName = '';
  let finalPrice = item.price;
  let bevOptionsText = '';

  if (item.halfPrice) {
    const checkedPortion = document.querySelector(`input[name="portion_${dishId}"]:checked`);
    if (checkedPortion && checkedPortion.value === 'half') {
      finalPrice = item.halfPrice;
      portionName = ' (Half)';
    } else {
      portionName = ' (Full)';
    }
  }

  // Check Tea/Coffee Beverage Customization Options
  if (item.isCustomizableBeverage || item.category === 'Beverages') {
    const sugarEl = document.getElementById(`sugar_${dishId}`);
    const strengthEl = document.getElementById(`strength_${dishId}`);
    const sugarVal = sugarEl ? sugarEl.value : 'Sugar';
    const strengthVal = strengthEl ? strengthEl.value : 'Medium';
    bevOptionsText = ` (${sugarVal}, ${strengthVal})`;
  }

  // Check Alcohol Portion & Side Dish Options
  if (item.isCustomizableAlcohol || item.category === 'Alcohol' || item.cuisine === 'Alcohol') {
    const portionEl = document.getElementById(`portion_${dishId}`);
    const sideEl = document.getElementById(`sidedish_${dishId}`);

    let mult = 1.0;
    let portionLabel = '60ml Peg';
    if (portionEl) {
      const opt = portionEl.options[portionEl.selectedIndex];
      mult = parseFloat(opt.dataset.mult || '1.0');
      portionLabel = opt.text.split('(₹')[0].trim();
    }

    let sideAdd = 0;
    let sideLabel = '';
    if (sideEl && sideEl.value !== 'No Side Dish') {
      const sOpt = sideEl.options[sideEl.selectedIndex];
      sideAdd = parseFloat(sOpt.dataset.price || '0');
      sideLabel = ` + ${sOpt.value}`;
    }

    finalPrice = Math.round(item.price * mult) + sideAdd;
    bevOptionsText = ` (${portionLabel}${sideLabel})`;
  }

  const cartItemId = item.id + (portionName ? '-' + portionName.trim().toLowerCase().replace(/[^a-z]/g, '') : '') + (bevOptionsText ? '-' + bevOptionsText.trim().toLowerCase().replace(/[^a-z]/g, '') : '');
  const existing = cart.find(c => c.id === cartItemId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: cartItemId,
      name: item.name + portionName + bevOptionsText,
      price: finalPrice,
      image: item.image,
      qty: qty
    });
  }

  saveCart();
  renderCartDrawer();
  toggleCartDrawer(true);

  // reset card quantity back to 1
  if (qtyEl) qtyEl.textContent = 1;
}

/* ==========================================================================
   CART & DRAWER LOGIC
   ========================================================================== */
function loadCart() {
  try {
    const saved = localStorage.getItem('nt_restaurant_cart');
    cart = saved ? JSON.parse(saved) : [];
  } catch (err) {
    cart = [];
  }
  updateTopCartCount();
  renderCartDrawer();
}

function saveCart() {
  localStorage.setItem('nt_restaurant_cart', JSON.stringify(cart));
  updateTopCartCount();
}

function updateTopCartCount() {
  const countEl = document.getElementById('topCartCount');
  if (countEl) {
    const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
    countEl.textContent = totalCount;
  }
}

function toggleCartDrawer(show) {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;

  if (typeof show === 'boolean') {
    drawer.classList.toggle('active', show);
  } else {
    drawer.classList.toggle('active');
  }

  if (drawer.classList.contains('active')) {
    renderCartDrawer();
  }
}

function renderCartDrawer() {
  const body = document.getElementById('drawerCartBody');
  const subtotalEl = document.getElementById('drawerSubtotal');
  const taxEl = document.getElementById('drawerTax');
  const grandTotalEl = document.getElementById('drawerGrandTotal');

  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty"><p>Your table bill cart is empty.</p><p style="font-size:0.85rem; margin-top:0.5rem;">Select any dish above to add to your bill.</p></div>';
    if (subtotalEl) subtotalEl.textContent = '₹0.00';
    if (taxEl) taxEl.textContent = '₹0.00';
    if (grandTotalEl) grandTotalEl.textContent = '₹0.00';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="drawer-item-row">
      <img src="${item.image}" alt="${item.name}" class="drawer-item-img" />
      <div class="drawer-item-info">
        <h4>${item.name}</h4>
        <span class="drawer-item-price">₹${item.price} × ${item.qty} = ₹${(item.price * item.qty).toFixed(2)}</span>
      </div>
      <div class="qty-control qty-sm">
        <button type="button" class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
        <span class="qty-val">${item.qty}</span>
        <button type="button" class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const tax = subtotal * 0.05;
  const grand = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
  if (grandTotalEl) grandTotalEl.textContent = `₹${grand.toFixed(2)}`;
  
  renderDrawerPaymentDetails(grand);
}

function updateCartQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  saveCart();
  renderCartDrawer();
}

/* ==========================================================================
   DRAWER PAYMENT & CHECKOUT MODAL LOGIC
   ========================================================================== */
let drawerPaymentMethod = 'card';

function setDrawerPaymentMethod(method) {
  drawerPaymentMethod = method;
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const tax = subtotal * 0.05;
  renderDrawerPaymentDetails(subtotal + tax);
}

function renderDrawerPaymentDetails(grandTotal) {
  const detailsBox = document.getElementById('drawerPaymentDetailsBox');
  if (!detailsBox) return;

  if (drawerPaymentMethod === 'upi') {
    const upiUri = `upi://pay?pa=abinesh18x@oksbi&pn=ABINESH%20S&am=${grandTotal.toFixed(2)}&cu=INR&tn=Nalla%20Thinnungaa%20Bill`;
    const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`;

    detailsBox.innerHTML = `
      <div class="payment-details-box payment-upi-box" style="padding: 0.85rem;">
        <div style="font-size:0.8rem; margin-bottom:0.4rem; color:var(--accent-gold);">👤 <strong>ABINESH S</strong> (abinesh18x@oksbi)</div>
        <div style="text-align:center;">
          <img src="${dynamicQrUrl}" alt="UPI QR" style="width:140px; height:140px; border-radius:8px; border:1px solid var(--border-light);" />
        </div>
        <a href="${upiUri}" class="button button-primary button-sm" style="display:block; text-align:center; margin-top:0.5rem; font-size:0.8rem;">⚡ Tap to Pay via UPI (₹${grandTotal.toFixed(2)})</a>
      </div>
    `;
  } else if (drawerPaymentMethod === 'card') {
    detailsBox.innerHTML = `
      <div class="payment-details-box payment-card-box" style="padding: 0.85rem;">
        <div class="card-field-group" style="margin-bottom:0.4rem;">
          <label style="font-size:0.75rem;">Cardholder Name</label>
          <input type="text" id="drawerCardName" placeholder="e.g. Rahul Sharma" value="Rahul Sharma" style="padding:0.4rem 0.6rem; font-size:0.85rem;" required />
        </div>
        <div class="card-field-group" style="margin-bottom:0.4rem;">
          <label style="font-size:0.75rem;">Card Number</label>
          <input type="text" id="drawerCardNum" placeholder="4532 8901 2345 6789" maxlength="19" value="4532 8901 2345 6789" style="padding:0.4rem 0.6rem; font-size:0.85rem;" required />
        </div>
      </div>
    `;
  } else {
    detailsBox.innerHTML = `
      <div class="payment-details-box payment-cash-box" style="padding: 0.85rem;">
        <p style="font-size:0.82rem; margin:0; color:var(--text-muted);">💵 Pay cash directly to your waiter or at the billing counter upon dining.</p>
      </div>
    `;
  }
}

function completeDrawerCheckout() {
  if (!cart || cart.length === 0) {
    alert('Your bill cart is empty! Please add dishes before paying.');
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const tax = subtotal * 0.05;
  const totalAmount = subtotal + tax;

  let payMeta = '';
  if (drawerPaymentMethod === 'card') {
    const cardName = document.getElementById('drawerCardName')?.value || 'Guest';
    const cardNum = document.getElementById('drawerCardNum')?.value || '4532 8901 2345 6789';
    const masked = `•••• •••• •••• ${cardNum.replace(/\s/g, '').slice(-4)}`;
    payMeta = `💳 Credit/Debit Card (${masked}) · ${cardName}`;
  } else if (drawerPaymentMethod === 'upi') {
    const ref = `UPI-${Date.now().toString().slice(-8)}`;
    payMeta = `📱 UPI Payment (ABINESH S · abinesh18x@oksbi · Ref: ${ref})`;
  } else {
    payMeta = `💵 Cash Payment at Table / Counter`;
  }

  const invoiceId = `NT-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const paymentPayload = {
    invoiceId: invoiceId,
    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
    subtotal: subtotal,
    tax: tax,
    totalAmount: totalAmount,
    paymentMethod: drawerPaymentMethod,
    paymentMeta: payMeta,
    status: 'COMPLETED'
  };

  fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentPayload)
  }).then(res => res.json()).then(saved => {
    console.log('Successfully saved payment details to MongoDB:', saved);
  }).catch(err => {
    console.error('Failed to save payment to MongoDB:', err);
  });

  const receiptRowsHtml = cart.map((item, idx) => `
    <tr class="receipt-table-row">
      <td class="col-num">${idx + 1}</td>
      <td class="col-item"><strong>${item.name}</strong></td>
      <td class="col-qty">${item.qty}</td>
      <td class="col-price">₹${item.price.toFixed(2)}</td>
      <td class="col-total">₹${(item.price * item.qty).toFixed(2)}</td>
    </tr>
  `).join('');

  const receiptModalContent = document.getElementById('receiptModalContent');
  if (receiptModalContent) {
    receiptModalContent.innerHTML = `
      <div class="printable-receipt">
        <div class="receipt-header text-center">
          <div class="receipt-brand">✨ Nalla Thinnunga ✨</div>
          <p class="receipt-subtitle">Luxury Multi-Cuisine Dining & Lounge</p>
          <p class="receipt-address">📍 Marthandam Bus Stand, Kanyakumari, Tamil Nadu · 💬 +91 89037 18820</p>
          <div class="receipt-divider"></div>
          <div class="receipt-meta-grid">
            <div><span class="meta-label">INVOICE NO:</span> <strong>#${invoiceId}</strong></div>
            <div><span class="meta-label">DATE & TIME:</span> <strong>${dateStr}</strong></div>
            <div><span class="meta-label">TABLE STATUS:</span> <span class="paid-badge">✅ PAID & VERIFIED</span></div>
          </div>
        </div>

        <table class="receipt-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ITEM DESCRIPTION</th>
              <th>QTY</th>
              <th>PRICE</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${receiptRowsHtml}
          </tbody>
        </table>

        <div class="receipt-math-box">
          <div class="math-row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
          <div class="math-row"><span>GST & Service Tax (5%)</span><span>₹${tax.toFixed(2)}</span></div>
          <div class="math-row math-total"><span>FINAL PAID AMOUNT</span><span>₹${totalAmount.toFixed(2)}</span></div>
        </div>

        <div class="receipt-pay-method-banner">
          <span class="pay-method-title">Payment Method:</span>
          <strong>${payMeta}</strong>
        </div>

        <div class="receipt-footer-msg text-center">
          <p>❤️ Thank you for dining with us! Keep this receipt for your reference.</p>
        </div>
      </div>
    `;
  }

  // Close drawer
  toggleCartDrawer(false);

  // Open Receipt Modal
  const receiptModal = document.getElementById('receiptModal');
  if (receiptModal) receiptModal.classList.add('active');

  // Clear cart
  cart = [];
  saveCart();
  renderCartDrawer();
}

function closeReceiptModal(force = false) {
  const receiptModal = document.getElementById('receiptModal');
  if (receiptModal) receiptModal.classList.remove('active');
}
