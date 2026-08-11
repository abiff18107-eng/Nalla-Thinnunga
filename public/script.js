// ==========================================================================
// Nalla Thinnunga - RESTAURANT INTERACTIVE LOGIC & PAYMENT RECEIPT MODAL
// ==========================================================================

const reservationForm = document.getElementById('reservationForm');
const statusMessage = document.getElementById('statusMessage');
const viewBookingsBtnWrap = document.getElementById('viewBookingsBtnWrap');
const reservationsList = document.getElementById('reservationsList');
const menuItemsContainer = document.getElementById('menuItems');
const previewContent = document.getElementById('previewContent');
const orderCart = document.getElementById('orderCart');
const cuisineFiltersContainer = document.getElementById('cuisineFilters');

// Modal Elements
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDescription = document.getElementById('modalDescription');
const modalPrice = document.getElementById('modalPrice');
const modalAddCartBtn = document.getElementById('modalAddCartBtn');

// Receipt Modal Elements
const receiptModal = document.getElementById('receiptModal');
const receiptModalContent = document.getElementById('receiptModalContent');

let allMenuItems = [];
let activeCuisineFilter = 'All';
let selectedMenuItem = null;
let cart = [];
let paymentMethod = 'card';

/* ==========================================================================
   CART & LOCAL STORAGE MANAGEMENT
   ========================================================================== */
function loadCart() {
  try {
    const saved = localStorage.getItem('nt_restaurant_cart');
    cart = saved ? JSON.parse(saved) : [];
  } catch (err) {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem('nt_restaurant_cart', JSON.stringify(cart));
}

function addToCart(item, quantity = 1) {
  const qty = Math.max(1, Number(quantity));
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      qty: qty
    });
  }
  saveCart();
  renderCart();
}

function updateCartQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    renderCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
}

function formatCurrency(val) {
  return `₹${Number(val).toFixed(2)}`;
}

/* ==========================================================================
   RENDER MENU ITEMS & FILTER TABS
   ========================================================================== */
async function fetchMenu() {
  try {
    const res = await fetch('/api/menu');
    allMenuItems = await res.json();
    populateQuickDishSelect(allMenuItems);
    if (menuItemsContainer) renderMenuItems(allMenuItems);
    setupCuisineFilters();
  } catch (err) {
    if (menuItemsContainer) {
      menuItemsContainer.innerHTML = '<p class="preview-empty">Unable to connect to backend server menu.</p>';
    }
  }
}

function populateQuickDishSelect(items) {
  const selectEl = document.getElementById('quickDishSelect');
  if (!selectEl) return;
  selectEl.innerHTML = `
    <option value="">-- Select a Dish to Add to Bill --</option>
    ${items.map(i => `<option value="${i.id}">${i.name} — ${formatCurrency(i.price)} (${i.cuisine})</option>`).join('')}
  `;
}

let quickAddQty = 1;
function adjustQuickQty(delta) {
  quickAddQty = Math.max(1, quickAddQty + delta);
  const qtyEl = document.getElementById('quickQtyVal');
  if (qtyEl) qtyEl.textContent = quickAddQty;
}

function handleQuickDishSelectChange() {
  const selectEl = document.getElementById('quickDishSelect');
  if (!selectEl || !selectEl.value) return;
  selectAndPreviewDish(selectEl.value);
}

function handleQuickDishAdd() {
  const selectEl = document.getElementById('quickDishSelect');
  if (!selectEl || !selectEl.value) {
    alert('Please select a dish from the dropdown menu first.');
    return;
  }
  const item = allMenuItems.find(i => i.id === selectEl.value);
  if (item) {
    addToCart(item, quickAddQty);
    quickAddQty = 1;
    const qtyEl = document.getElementById('quickQtyVal');
    if (qtyEl) qtyEl.textContent = '1';
  }
}

function filterCuisine(cuisine) {
  activeCuisineFilter = cuisine;
  
  if (cuisineFiltersContainer) {
    cuisineFiltersContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cuisine === cuisine);
    });
  }

  const filtered = cuisine === 'All' 
    ? allMenuItems 
    : allMenuItems.filter(item => item.cuisine.toLowerCase() === cuisine.toLowerCase());
  
  renderMenuItems(filtered);
}

function setupCuisineFilters() {
  if (!cuisineFiltersContainer) return;
  cuisineFiltersContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterCuisine(btn.dataset.cuisine);
    });
  });
}

function renderMenuItems(items) {
  if (!menuItemsContainer) return;

  if (!items || items.length === 0) {
    menuItemsContainer.innerHTML = '<p class="preview-empty">No dishes found in this cuisine category.</p>';
    return;
  }

  menuItemsContainer.innerHTML = items.map(item => {
    const isVeg = item.isVeg !== false;
    const dietLabel = isVeg ? '🟢 Veg' : '🔴 Non-Veg';
    const dietClass = isVeg ? 'veg' : 'non-veg';
    const rating = item.rating || 4.8;

    return `
      <article class="menu-card" data-id="${item.id}">
        <div class="menu-card-img-wrap" onclick="selectAndPreviewDish('${item.id}')">
          <img src="${item.image}" alt="${item.name}" class="menu-card-img" />
          <span class="diet-tag ${dietClass}">${dietLabel}</span>
          <span class="cuisine-badge">${item.cuisine}</span>
        </div>
        
        <div class="menu-card-content">
          <div class="menu-card-title-row">
            <h3>${item.name}</h3>
            <span class="rating-badge">★ ${rating}</span>
          </div>
          <p class="menu-card-desc">${item.description}</p>

          <div class="menu-card-footer">
            <span class="menu-price">${formatCurrency(item.price)}</span>
            <div class="card-actions">
              <button type="button" class="button button-sm" onclick="selectAndPreviewDish('${item.id}')">Preview</button>
              <button type="button" class="button button-primary button-sm" onclick="quickAddToCart('${item.id}')">+ Add</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function quickAddToCart(dishId) {
  const item = allMenuItems.find(i => i.id === dishId);
  if (item) {
    addToCart(item, 1);
  }
}

function selectAndPreviewDish(dishId) {
  const item = allMenuItems.find(i => i.id === dishId);
  if (!item) return;

  selectedMenuItem = item;
  renderSidebarPreview(item);
  triggerImagePreview(
    item.image,
    item.name,
    `${item.cuisine} Cuisine · ${item.isVeg ? '🟢 Pure Veg' : '🔴 Non-Veg'}`,
    item.description,
    item.price,
    item
  );
}

/* ==========================================================================
   SIDEBAR DISH QUICK PREVIEW
   ========================================================================== */
function renderSidebarPreview(item) {
  if (!previewContent) return;

  const spice = item.spiceLevel || 'Medium';
  const prepTime = item.prepTime || '20 mins';
  const isAlc = item.isCustomizableAlcohol || item.category === 'Alcohol' || item.cuisine === 'Alcohol';

  previewContent.innerHTML = `
    <div class="sidebar-preview-card" style="background: var(--bg-surface); padding: 1.1rem; border-radius: var(--radius-md); border: 1.5px solid var(--border-light); display: flex; flex-direction: column; gap: 1rem;">
      <div class="sidebar-preview-img-wrap" onclick="triggerImagePreview('${item.image}', '${item.name}', '${item.cuisine}', '${item.description}', ${item.price}, null)" style="height: 160px; cursor: pointer;">
        <img src="${item.image}" alt="${item.name}" class="sidebar-preview-img" style="width:100%; height:100%; object-fit:cover; border-radius: var(--radius-sm);" />
      </div>
      
      <div>
        <span class="eyebrow-sm" style="font-weight: 700; color: var(--accent-gold);">${item.category || item.cuisine} Specialty</span>
        <h4 style="font-size: 1.25rem; margin: 0.3rem 0 0.4rem; color: var(--text-primary); font-family: var(--font-sans); font-weight: 700;">${item.name}</h4>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.8rem; line-height: 1.4;">${item.description}</p>
        
        <div class="sidebar-preview-meta" style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
          <span style="background: rgba(255,255,255,0.06); padding: 0.25rem 0.6rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600;">🌶️ ${spice}</span>
          <span style="background: rgba(255,255,255,0.06); padding: 0.25rem 0.6rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600;">⏱️ ${prepTime}</span>
          <span style="background: rgba(255,255,255,0.06); padding: 0.25rem 0.6rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600;">★ ${item.rating || 4.8}</span>
        </div>
      </div>

      ${isAlc ? `
        <div class="alcohol-preview-options" style="background: rgba(230, 182, 85, 0.08); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--accent-gold-glow); display: flex; flex-direction: column; gap: 0.6rem;">
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: var(--accent-gold); display: block; margin-bottom: 0.3rem;">🥃 Select Portion Size:</label>
            <select id="previewPortionSelect" onchange="updatePreviewAlcoholPrice(${item.price})" style="width: 100%; padding: 0.5rem; border-radius: var(--radius-sm); background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-light); font-size: 0.88rem; font-weight: 600;">
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

          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: var(--accent-gold); display: block; margin-bottom: 0.3rem;">🍗 Pair Bar Side Dish / Touchings:</label>
            <select id="previewSideSelect" onchange="updatePreviewAlcoholPrice(${item.price})" style="width: 100%; padding: 0.5rem; border-radius: var(--radius-sm); background: var(--bg-card); color: var(--text-primary); border: 1px solid var(--border-light); font-size: 0.88rem; font-weight: 600;">
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

      <div style="display: flex; flex-direction: column; gap: 0.8rem; padding-top: 0.8rem; border-top: 1px solid var(--border-light);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span id="previewPriceTag" style="font-size: 1.35rem; font-weight: 800; color: var(--accent-gold);">${formatCurrency(item.price)}</span>
          <div class="qty-control" style="border: 1px solid var(--border-light); border-radius: var(--radius-md);">
            <button type="button" class="qty-btn" aria-label="Decrease quantity" onclick="adjustPreviewQty(-1)" style="min-width: 44px; min-height: 44px;">-</button>
            <span class="qty-val" id="sidebarQtyVal" style="font-size: 1rem; font-weight: 700; padding: 0 0.5rem;">1</span>
            <button type="button" class="qty-btn" aria-label="Increase quantity" onclick="adjustPreviewQty(1)" style="min-width: 44px; min-height: 44px;">+</button>
          </div>
        </div>

        <button type="button" class="button button-primary button-full" onclick="addSelectedDishFromSidebar()" style="min-height: 46px; font-weight: 700; font-size: 0.95rem;">
          + Add to Table Bill Cart
        </button>
      </div>
    </div>
  `;
}

function updatePreviewAlcoholPrice(basePrice) {
  const portionEl = document.getElementById('previewPortionSelect');
  const sideEl = document.getElementById('previewSideSelect');
  const priceEl = document.getElementById('previewPriceTag');

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
  if (priceEl) priceEl.textContent = formatCurrency(finalCalc);
}

let sidebarQty = 1;
function adjustPreviewQty(delta) {
  sidebarQty = Math.max(1, sidebarQty + delta);
  const qtyEl = document.getElementById('sidebarQtyVal');
  if (qtyEl) qtyEl.textContent = sidebarQty;
}

function addSelectedDishFromSidebar() {
  if (!selectedMenuItem) return;

  const item = selectedMenuItem;
  let finalPrice = item.price;
  let optionText = '';

  if (item.isCustomizableAlcohol || item.category === 'Alcohol' || item.cuisine === 'Alcohol') {
    const portionEl = document.getElementById('previewPortionSelect');
    const sideEl = document.getElementById('previewSideSelect');

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
    optionText = ` (${portionLabel}${sideLabel})`;
  }

  addToCart({
    id: item.id + (optionText ? '-' + optionText.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : ''),
    name: item.name + optionText,
    price: finalPrice,
    image: item.image
  }, sidebarQty);

  sidebarQty = 1;
  const qtyEl = document.getElementById('sidebarQtyVal');
  if (qtyEl) qtyEl.textContent = '1';
}

function updateHomeAlcPrice(key, basePrice) {
  const portionEl = document.getElementById(`home_portion_${key}`);
  const sideEl = document.getElementById(`home_side_${key}`);
  const priceEl = document.getElementById(`home_price_${key}`);

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
  if (priceEl) priceEl.textContent = formatCurrency(finalCalc);
}

function addHomeAlcToCart(id, name, basePrice, img, key) {
  const portionEl = document.getElementById(`home_portion_${key}`);
  const sideEl = document.getElementById(`home_side_${key}`);

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

  const finalPrice = Math.round(basePrice * mult) + sideAdd;
  const optionText = ` (${portionLabel}${sideLabel})`;

  addToCart({
    id: id + '-' + optionText.trim().toLowerCase().replace(/[^a-z0-9]/g, ''),
    name: name + optionText,
    price: finalPrice,
    image: img
  }, 1);
}

/* ==========================================================================
   IMAGE LIGHTBOX MODAL PREVIEW
   ========================================================================== */
function triggerImagePreview(imgSrc, title, category, description, price = null, itemObj = null) {
  if (!imageModal) return;

  modalImage.src = imgSrc;
  modalTitle.textContent = title;
  modalCategory.textContent = category || 'Restaurant Preview';
  modalDescription.textContent = description || '';
  
  if (price) {
    modalPrice.style.display = 'block';
    modalPrice.textContent = formatCurrency(price);
  } else {
    modalPrice.style.display = 'none';
  }

  if (modalAddCartBtn) {
    if (price && (itemObj || selectedMenuItem)) {
      modalAddCartBtn.style.display = 'inline-flex';
      modalAddCartBtn.onclick = () => {
        const target = itemObj || selectedMenuItem;
        if (target) addToCart(target, 1);
        closeImageModal(true);
      };
    } else {
      modalAddCartBtn.style.display = 'none';
    }
  }

  imageModal.classList.add('active');
}

function closeImageModal(force = false) {
  if (!imageModal) return;
  imageModal.classList.remove('active');
}

/* ==========================================================================
   ORDER BILL RECEIPT & PAYMENT PANEL RENDER
   ========================================================================== */
function updateTopbarCartBadge() {
  const countEls = document.querySelectorAll('#topCartCount, .top-cart-badge');
  const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
  countEls.forEach(el => {
    el.textContent = totalCount;
  });
  renderFloatingCheckoutBar();
}

function renderFloatingCheckoutBar() {
  let floatBar = document.getElementById('floatingCheckoutBar');
  const isCheckoutPage = window.location.pathname.endsWith('checkout.html');
  const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
  
  if (totalCount === 0 || isCheckoutPage) {
    if (floatBar) floatBar.remove();
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const grandTotal = subtotal * 1.05;

  if (!floatBar) {
    floatBar = document.createElement('a');
    floatBar.id = 'floatingCheckoutBar';
    floatBar.href = 'checkout.html';
    floatBar.className = 'floating-checkout-bar';
    document.body.appendChild(floatBar);
  }

  floatBar.innerHTML = `
    <div style="font-size: 1.4rem;">🧾</div>
    <div class="floating-checkout-info">
      <span class="floating-checkout-title">View Table Bill & Checkout (${totalCount} ${totalCount === 1 ? 'item' : 'items'})</span>
      <span class="floating-checkout-sub">Total Bill: <strong>${formatCurrency(grandTotal)}</strong> &bull; Click to Pay →</span>
    </div>
    <span class="button button-sm button-primary" style="margin-left: 0.5rem; border-radius: var(--radius-full); pointer-events: none;">Pay Now →</span>
  `;
}

function renderCart() {
  updateTopbarCartBadge();
  renderCheckoutPage();

  if (!orderCart) return;

  if (!cart || cart.length === 0) {
    orderCart.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🧾</div>
        <p>No dishes added to your bill yet.<br>Click <strong>+ Add</strong> on dishes to calculate order total.</p>
        <a href="checkout.html" class="button button-secondary button-sm" style="margin-top: 0.75rem;">Go to Separate Checkout Page 🧾</a>
      </div>
    `;
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const itemsHtml = cart.map(item => `
    <div class="receipt-item">
      <div class="receipt-item-info">
        <h4>${item.name}</h4>
        <p>${formatCurrency(item.price)} × ${item.qty}</p>
      </div>
      <div class="receipt-item-actions">
        <div class="qty-control" style="transform: scale(0.85); transform-origin: right;">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
        <button class="btn-remove-sm" title="Remove Dish" onclick="removeFromCart('${item.id}')">✕</button>
      </div>
    </div>
  `).join('');

  // Dynamic Payment Method Details Panel
  let paymentDetailsHtml = '';
  
  if (paymentMethod === 'upi') {
    const upiUri = `upi://pay?pa=abinesh18x@oksbi&pn=ABINESH%20S&am=${total.toFixed(2)}&cu=INR&tn=Nalla%20Thinnungaa%20Bill`;
    const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}`;

    paymentDetailsHtml = `
      <div class="payment-details-box payment-upi-box">
        <div class="upi-header-row">
          <span class="upi-name-tag">👤 <strong>ABINESH S</strong></span>
          <span class="upi-id-badge">📱 <strong>abinesh18x@oksbi</strong></span>
        </div>

        <div class="qr-code-wrapper dynamic-qr-box" id="qrWrapperBox">
          <img id="upiQrImageEl" src="${dynamicQrUrl}" alt="Dynamic GPay QR Code with Pre-filled Amount" class="upi-qr-img" />
          <div class="gpay-badge-overlay">
            <span class="gpay-dot"></span> Pre-filled Amount: <strong>${formatCurrency(total)}</strong>
          </div>
        </div>

        <div class="upi-info">
          <p class="upi-hint">✨ Scanning with GPay, PhonePe, or Paytm directly opens & pre-fills <strong>${formatCurrency(total)}</strong>!</p>
          
          <a href="${upiUri}" class="button button-primary button-sm gpay-direct-btn">⚡ Tap to Pay in GPay / UPI (${formatCurrency(total)})</a>
          
          <button type="button" class="btn-toggle-qr" onclick="toggleQrView()">📷 Switch QR View (Dynamic / Static Photo)</button>
        </div>
      </div>
    `;
  } else if (paymentMethod === 'card') {
    paymentDetailsHtml = `
      <div class="payment-details-box payment-card-box">
        <div class="card-field-group">
          <label>Cardholder Name</label>
          <input type="text" id="cardNameInput" placeholder="e.g. Rahul Sharma" value="Rahul Sharma" required />
        </div>
        <div class="card-field-group">
          <label>Card Number</label>
          <input type="text" id="cardNumberInput" placeholder="4532 8901 2345 6789" maxlength="19" value="4532 8901 2345 6789" required />
        </div>
        <div class="card-row-2col">
          <div class="card-field-group">
            <label>Expiry Date</label>
            <input type="text" id="cardExpiryInput" placeholder="MM/YY" maxlength="5" value="12/28" required />
          </div>
          <div class="card-field-group">
            <label>CVV</label>
            <input type="password" id="cardCvvInput" placeholder="•••" maxlength="3" value="888" required />
          </div>
        </div>
      </div>
    `;
  } else if (paymentMethod === 'cash') {
    paymentDetailsHtml = `
      <div class="payment-details-box payment-cash-box">
        <div class="cash-info">
          <span class="cash-icon">💵</span>
          <p>Pay cash directly to your waiter or at the billing counter upon dining.</p>
        </div>
      </div>
    `;
  }

  orderCart.innerHTML = `
    <div class="receipt-items">
      ${itemsHtml}
    </div>

    <div class="receipt-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>GST & Service (5%)</span>
        <span>${formatCurrency(tax)}</span>
      </div>
      <div class="summary-row total">
        <span>Total Payable</span>
        <span>${formatCurrency(total)}</span>
      </div>
    </div>

    <div class="payment-methods">
      <label class="payment-label">
        <input type="radio" name="payment" value="card" ${paymentMethod === 'card' ? 'checked' : ''} onchange="setPaymentMethod('card')" /> 💳 Card
      </label>
      <label class="payment-label">
        <input type="radio" name="payment" value="upi" ${paymentMethod === 'upi' ? 'checked' : ''} onchange="setPaymentMethod('upi')" /> 📱 UPI QR
      </label>
      <label class="payment-label">
        <input type="radio" name="payment" value="cash" ${paymentMethod === 'cash' ? 'checked' : ''} onchange="setPaymentMethod('cash')" /> 💵 Cash
      </label>
    </div>

    ${paymentDetailsHtml}

    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <button class="button button-primary button-full" onclick="completeCheckout(${total})">Pay ${formatCurrency(total)} & Order</button>
      <a href="checkout.html" class="button button-secondary button-full" style="text-align: center; font-size: 0.88rem;">Proceed to Dedicated Billing Page 🧾 →</a>
    </div>
  `;
}

/* ==========================================================================
   STANDALONE CHECKOUT PAGE LOGIC & RENDERING
   ========================================================================== */
function renderCheckoutPage() {
  const container = document.getElementById('checkoutCartItems');
  if (!container) return; // Not on checkout page

  const subtotalEl = document.getElementById('checkoutSubtotal');
  const taxEl = document.getElementById('checkoutTax');
  const totalEl = document.getElementById('checkoutGrandTotal');
  const payDetailsBox = document.getElementById('checkoutPaymentDetails');

  if (!cart || cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty" style="padding: 2rem 1rem; text-align: center;">
        <div class="empty-icon" style="font-size: 2.5rem; margin-bottom: 0.5rem;">🧾</div>
        <p style="font-size: 1rem; color: var(--text-primary); font-weight: 700; margin-bottom: 0.4rem;">Your Table Bill is Empty!</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Select dishes from the menu or pick a dish below to add to your bill.</p>
        <a href="category.html?cat=biryani" class="button button-primary button-sm">Explore Menu Categories →</a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '₹0.00';
    if (taxEl) taxEl.textContent = '₹0.00';
    if (totalEl) totalEl.textContent = '₹0.00';

    if (payDetailsBox) {
      payDetailsBox.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.88rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-light);">
          Add dishes to your bill cart to view step-by-step payment options.
        </div>
      `;
    }
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (taxEl) taxEl.textContent = formatCurrency(tax);
  if (totalEl) totalEl.textContent = formatCurrency(total);

  container.innerHTML = cart.map(item => `
    <div class="checkout-item-row">
      <div class="checkout-item-info">
        <h4>${item.name}</h4>
        <p>${formatCurrency(item.price)} × ${item.qty} = <strong>${formatCurrency(item.price * item.qty)}</strong></p>
      </div>
      <div class="checkout-item-controls">
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
        </div>
        <button class="btn-remove-sm" title="Remove Item" onclick="removeFromCart('${item.id}')">✕</button>
      </div>
    </div>
  `).join('');

  // Render Payment Selector Details Box for checkout page
  if (payDetailsBox) {
    let paymentDetailsHtml = '';
    if (paymentMethod === 'upi') {
      const upiUri = `upi://pay?pa=abinesh18x@oksbi&pn=ABINESH%20S&am=${total.toFixed(2)}&cu=INR&tn=Nalla%20Thinnungaa%20Bill`;
      const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}`;

      paymentDetailsHtml = `
        <div class="payment-details-box payment-upi-box">
          <div class="upi-header-row">
            <span class="upi-name-tag">👤 <strong>ABINESH S</strong></span>
            <span class="upi-id-badge">📱 <strong>abinesh18x@oksbi</strong></span>
          </div>

          <div class="qr-code-wrapper dynamic-qr-box">
            <img id="upiQrImageEl" src="${dynamicQrUrl}" alt="Dynamic UPI QR Code" class="upi-qr-img" />
            <div class="gpay-badge-overlay">
              <span class="gpay-dot"></span> Pre-filled Amount: <strong>${formatCurrency(total)}</strong>
            </div>
          </div>

          <div class="upi-info">
            <p class="upi-hint">✨ Scan with GPay, PhonePe, or Paytm to pay <strong>${formatCurrency(total)}</strong> instantly!</p>
            <a href="${upiUri}" class="button button-primary button-sm gpay-direct-btn">⚡ Tap to Pay in GPay / UPI (${formatCurrency(total)})</a>
            <div style="margin-top: 0.6rem;">
              <input type="text" id="upiTxnRefInput" placeholder="Enter UPI Reference / UTR No. (Optional)" style="font-size: 0.85rem; padding: 0.6rem;" />
            </div>
          </div>
        </div>
      `;
    } else if (paymentMethod === 'card') {
      paymentDetailsHtml = `
        <div class="payment-details-box payment-card-box">
          <div class="card-field-group">
            <label>Cardholder Name</label>
            <input type="text" id="cardNameInput" placeholder="e.g. Abinesh Kumar" value="Abinesh Kumar" required />
          </div>
          <div class="card-field-group">
            <label>Card Number</label>
            <input type="text" id="cardNumberInput" placeholder="4532 8901 2345 6789" maxlength="19" value="4532 8901 2345 6789" required />
          </div>
          <div class="card-row-2col">
            <div class="card-field-group">
              <label>Expiry Date</label>
              <input type="text" id="cardExpiryInput" placeholder="MM/YY" maxlength="5" value="12/28" required />
            </div>
            <div class="card-field-group">
              <label>CVV Code</label>
              <input type="password" id="cardCvvInput" placeholder="•••" maxlength="3" value="888" required />
            </div>
          </div>
        </div>
      `;
    } else if (paymentMethod === 'cash') {
      paymentDetailsHtml = `
        <div class="payment-details-box payment-cash-box">
          <div class="cash-info">
            <span class="cash-icon">💵</span>
            <p>Pay <strong>${formatCurrency(total)}</strong> cash directly to your waiter at table or at the billing counter upon dining.</p>
          </div>
        </div>
      `;
    }

    payDetailsBox.innerHTML = paymentDetailsHtml;
  }
}

function switchCheckoutPayMethod(method) {
  paymentMethod = method;
  const tabBtns = document.querySelectorAll('.pay-tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.method === method);
  });
  renderCart();
}

function handleCheckoutQuickAdd(e) {
  const dishId = e.target.value;
  if (!dishId) return;
  const dish = allMenuItems.find(i => i.id === dishId);
  if (dish) {
    addToCart(dish, 1);
    e.target.value = '';
  }
}

function processCheckoutOrder() {
  if (!cart || cart.length === 0) {
    alert('Your bill cart is empty! Please add dishes before checking out.');
    return;
  }

  const tableNo = document.getElementById('custTableNo')?.value || 'Table 04';
  const name = document.getElementById('custName')?.value || 'Guest';

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const totalAmount = subtotal * 1.05;

  completeCheckout(totalAmount, { tableNo, name });
}

function setPaymentMethod(method) {
  paymentMethod = method;
  renderCart();
}

let showingStaticQr = false;
function toggleQrView() {
  const qrImg = document.getElementById('upiQrImageEl');
  if (!qrImg) return;
  showingStaticQr = !showingStaticQr;
  if (showingStaticQr) {
    qrImg.src = '/assets/upi-qr-abinesh.jpg';
  } else {
    showingStaticQr = false;
    renderCart();
  }
}


/* ==========================================================================
   TRANSACTION RECEIPT MODAL GENERATOR
   ========================================================================== */
function completeCheckout(totalAmount) {
  if (!cart || cart.length === 0) return;

  let payMeta = '';
  if (paymentMethod === 'card') {
    const cardName = document.getElementById('cardNameInput')?.value || 'Guest';
    const cardNum = document.getElementById('cardNumberInput')?.value || '4532 8901 2345 6789';
    const masked = `•••• •••• •••• ${cardNum.replace(/\s/g, '').slice(-4)}`;
    payMeta = `💳 Credit/Debit Card (${masked}) · ${cardName}`;
  } else if (paymentMethod === 'upi') {
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

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const tax = subtotal * 0.05;

  // Save Payment Details into MongoDB Database
  const paymentPayload = {
    invoiceId: invoiceId,
    items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
    subtotal: subtotal,
    tax: tax,
    totalAmount: totalAmount,
    paymentMethod: paymentMethod,
    paymentMeta: payMeta,
    status: 'COMPLETED'
  };

  fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentPayload)
  }).then(res => res.json()).then(saved => {
    console.log('Successfully saved payment details to MongoDB:', saved);
    fetchPayments();
  }).catch(err => {
    console.error('Failed to save payment to MongoDB:', err);
  });

  const receiptRowsHtml = cart.map((item, idx) => `
    <tr class="receipt-table-row">
      <td class="col-num">${idx + 1}</td>
      <td class="col-item">
        <strong>${item.name}</strong>
      </td>
      <td class="col-qty">${item.qty}</td>
      <td class="col-price">${formatCurrency(item.price)}</td>
      <td class="col-total">${formatCurrency(item.price * item.qty)}</td>
    </tr>
  `).join('');

  if (receiptModalContent) {
    receiptModalContent.innerHTML = `
      <div class="printable-receipt">
        <div class="receipt-header text-center">
          <div class="receipt-brand">✨ Nalla Thinnunga ✨</div>
          <p class="receipt-subtitle">Luxury Multi-Cuisine Dining & Lounge</p>
          <p class="receipt-address">📍 Marthandam Bus Stand, Kanyakumari, Tamil Nadu · 💬 +91 89037 18820</p>
          
          <div class="receipt-divider"></div>

          <div class="receipt-meta-grid">
            <div>
              <span class="meta-label">INVOICE NO:</span>
              <strong>#${invoiceId}</strong>
            </div>
            <div>
              <span class="meta-label">DATE & TIME:</span>
              <strong>${dateStr}</strong>
            </div>
            <div>
              <span class="meta-label">TABLE STATUS:</span>
              <span class="paid-badge">✅ PAID & VERIFIED</span>
            </div>
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
          <div class="math-row">
            <span>Subtotal</span>
            <span>${formatCurrency(subtotal)}</span>
          </div>
          <div class="math-row">
            <span>GST & Service Tax (5%)</span>
            <span>${formatCurrency(tax)}</span>
          </div>
          <div class="math-row math-total">
            <span>FINAL PAID AMOUNT</span>
            <span>${formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <div class="receipt-pay-method-banner">
          <span class="pay-method-title">Payment Method:</span>
          <strong>${payMeta}</strong>
        </div>

        <div class="receipt-footer-msg text-center">
          <p>❤️ Thank you for dining with us! Keep this tax receipt for your reference.</p>
        </div>

        <div class="receipt-action-buttons" style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.25rem;">
          <button type="button" class="button button-primary button-sm" onclick="window.print()">🖨️ Print Tax Invoice Receipt</button>
          <button type="button" class="button button-secondary button-sm" onclick="closeReceiptModal(true)">Done / Place New Order 🍽️</button>
        </div>
      </div>
    `;
  }

  // Open Receipt Modal
  if (receiptModal) receiptModal.classList.add('active');

  // Clear cart
  cart = [];
  saveCart();
  renderCart();
}

function closeReceiptModal(force = false) {
  if (!receiptModal) return;
  receiptModal.classList.remove('active');
}

/* ==========================================================================
   RESERVATIONS API & DEDICATED PAGE LOGIC
   ========================================================================== */
async function fetchReservations() {
  if (!reservationsList) return;
  try {
    const res = await fetch('/api/reservations');
    const data = await res.json();
    renderReservations(data);
  } catch (err) {
    reservationsList.innerHTML = '<p class="preview-empty">Unable to load reservations.</p>';
  }
}

function renderReservations(list) {
  if (!reservationsList) return;

  if (!Array.isArray(list) || list.length === 0) {
    reservationsList.innerHTML = `
      <div class="cart-empty" style="padding: 3rem 1rem;">
        <div class="empty-icon">📅</div>
        <h3>No Confirmed Bookings Yet</h3>
        <p>Be the first to reserve a table at Nalla Thinnunga!</p>
        <a href="/#reservation" class="button button-primary button-sm" style="margin-top:1rem;">Book A Table Now</a>
      </div>
    `;
    return;
  }

  reservationsList.innerHTML = list.map(res => `
    <div class="reservation-card reservation-card-standalone">
      <div class="res-card-top">
        <h4>${res.name}</h4>
        <span class="res-guests-badge">👥 ${res.guests} Guest${res.guests > 1 ? 's' : ''}</span>
      </div>
      <p class="res-datetime">📅 ${res.date} &nbsp;·&nbsp; ⏰ ${res.time}</p>
      <div class="res-meta-row">
        <span>✉️ ${res.email}</span>
        <span>📞 ${res.phone}</span>
      </div>
      ${res.message ? `<p class="res-note"><strong>Special Request:</strong> ${res.message}</p>` : ''}
      
      <div class="res-card-actions">
        <button class="btn-remove-sm" onclick="cancelReservation('${res._id}')">Cancel Booking</button>
      </div>
    </div>
  `).join('');
}

async function cancelReservation(id) {
  if (!confirm('Are you sure you want to cancel this table reservation?')) return;
  try {
    const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchReservations();
    }
  } catch (err) {
    alert('Failed to cancel reservation.');
  }
}

if (reservationForm) {
  reservationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (statusMessage) statusMessage.textContent = 'Submitting reservation...';

    const formData = new FormData(reservationForm);
    const data = Object.fromEntries(formData.entries());
    data.guests = Number(data.guests);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Failed');

      reservationForm.reset();
      if (statusMessage) {
        statusMessage.textContent = '✨ Table Reservation Confirmed!';
        statusMessage.style.color = 'var(--accent-gold)';
      }
      if (viewBookingsBtnWrap) {
        viewBookingsBtnWrap.style.display = 'block';
      }
      fetchReservations();
    } catch (err) {
      if (statusMessage) {
        statusMessage.textContent = '❌ Reservation could not be saved. Please try again.';
        statusMessage.style.color = 'var(--accent-ruby)';
      }
    }
  });
}

/* ==========================================================================
   MONGODB PAYMENT RECORDS RENDER
   ========================================================================== */
async function fetchPayments() {
  const paymentsList = document.getElementById('paymentsList');
  if (!paymentsList) return;
  try {
    const res = await fetch('/api/payments');
    const data = await res.json();
    renderPayments(data);
  } catch (err) {
    paymentsList.innerHTML = '<p class="preview-empty">Unable to load payment records from database.</p>';
  }
}

function renderPayments(list) {
  const paymentsList = document.getElementById('paymentsList');
  if (!paymentsList) return;

  if (!Array.isArray(list) || list.length === 0) {
    paymentsList.innerHTML = `
      <div class="cart-empty" style="padding: 2rem 1rem;">
        <div class="empty-icon">💳</div>
        <h4>No Database Payments Recorded Yet</h4>
        <p>Complete an order on the home page to record transactions in MongoDB!</p>
      </div>
    `;
    return;
  }

  paymentsList.innerHTML = list.map(pay => {
    const itemSummary = pay.items && pay.items.length 
      ? pay.items.map(i => `${i.qty}× ${i.name}`).join(', ') 
      : 'Order Items';

    return `
      <div class="reservation-card reservation-card-standalone">
        <div class="res-card-top">
          <h4>Invoice #${pay.invoiceId}</h4>
          <span class="res-guests-badge" style="background:var(--accent-green); color:#fff;">✅ ${formatCurrency(pay.totalAmount)}</span>
        </div>
        <p class="res-datetime">💳 ${pay.paymentMethod.toUpperCase()} &nbsp;·&nbsp; ${new Date(pay.createdAt || Date.now()).toLocaleString('en-IN')}</p>
        <div class="res-meta-row">
          <span>📦 <strong>Ordered Dishes:</strong> ${itemSummary}</span>
        </div>
        <p class="res-note"><strong>MongoDB Payment Meta:</strong> ${pay.paymentMeta || 'Saved in Database'}</p>
      </div>
    `;
  }).join('');
}

// Initial setup
loadCart();
renderCart();
fetchMenu();
fetchReservations();
fetchPayments();
fetchReviews();

/* ==========================================================================
   GUEST REVIEWS & RATING SYSTEM LOGIC (MONGODB)
   ========================================================================== */
let allReviews = [];

async function fetchReviews() {
  const feedEl = document.getElementById('reviewsFeedList');
  if (!feedEl) return;

  try {
    const res = await fetch('/api/reviews');
    allReviews = await res.json();
    renderReviews(allReviews);
  } catch (err) {
    feedEl.innerHTML = '<p class="preview-empty">Unable to connect to reviews database.</p>';
  }
}

function renderReviews(reviews) {
  const feedEl = document.getElementById('reviewsFeedList');
  const avgScoreEl = document.getElementById('avgRatingScore');
  const avgStarsEl = document.getElementById('avgRatingStars');
  const countEl = document.getElementById('totalReviewsCount');

  if (!feedEl) return;

  if (!Array.isArray(reviews) || reviews.length === 0) {
    feedEl.innerHTML = '<p class="preview-empty">No reviews submitted yet. Be the first to leave a review!</p>';
    return;
  }

  // Calculate average rating
  const totalScore = reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0);
  const avg = (totalScore / reviews.length).toFixed(1);
  const roundedAvg = Math.round(avg);

  if (avgScoreEl) avgScoreEl.textContent = avg;
  if (avgStarsEl) avgStarsEl.textContent = '★'.repeat(roundedAvg) + '☆'.repeat(5 - roundedAvg);
  if (countEl) countEl.textContent = reviews.length;

  feedEl.innerHTML = reviews.map(rev => {
    const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
    const dateStr = new Date(rev.createdAt || Date.now()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return `
      <article class="review-card">
        <div class="review-card-top">
          <div>
            <h4 class="reviewer-name">${rev.name}</h4>
            <span class="verified-badge">✔ Verified Guest</span>
          </div>
          <div class="review-stars-gold">${stars}</div>
        </div>

        <div class="review-dish-chip">
          <span>Recommended:</span> <strong>${rev.recommendedDish || 'Hyderabadi Chicken Dum Biryani'}</strong>
        </div>

        <p class="review-text">"${rev.comment}"</p>
        <span class="review-date">${dateStr}</span>
      </article>
    `;
  }).join('');
}

let selectedFormRating = 5;
function setFormRating(val) {
  selectedFormRating = val;
  const ratingInput = document.getElementById('reviewRatingInput');
  if (ratingInput) ratingInput.value = val;

  const starBtns = document.querySelectorAll('#starPicker .star-btn');
  starBtns.forEach(btn => {
    const btnVal = Number(btn.dataset.val);
    btn.classList.toggle('active', btnVal <= val);
  });
}

async function handleReviewSubmit(e) {
  e.preventDefault();
  const statusEl = document.getElementById('reviewStatus');
  const nameEl = document.getElementById('reviewName');
  const dishEl = document.getElementById('reviewDish');
  const commentEl = document.getElementById('reviewComment');

  if (!nameEl || !commentEl) return;

  const payload = {
    name: nameEl.value.trim(),
    rating: selectedFormRating,
    recommendedDish: dishEl ? dishEl.value : 'Hyderabadi Chicken Dum Biryani',
    comment: commentEl.value.trim()
  };

  if (statusEl) {
    statusEl.textContent = 'Submitting review to database...';
    statusEl.className = 'status-msg';
  }

  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      if (statusEl) {
        statusEl.textContent = '✨ Thank you! Your review has been published.';
        statusEl.className = 'status-msg success';
      }
      nameEl.value = '';
      commentEl.value = '';
      setFormRating(5);
      fetchReviews();
    } else {
      if (statusEl) {
        statusEl.textContent = data.error || 'Failed to submit review.';
        statusEl.className = 'status-msg error';
      }
    }
  } catch (err) {
    if (statusEl) {
      statusEl.textContent = 'Server connection error. Please try again.';
      statusEl.className = 'status-msg error';
    }
  }
}

/* ==========================================================================
   SIDEBAR WIDGET INTERACTION HANDLERS
   ========================================================================== */
function addComboToCart() {
  const comboItem = {
    id: 'special-chef-combo-499',
    name: 'Hyderabadi Dum Biryani Feast (Combo Offer)',
    price: 499,
    image: '/assets/hyderabadi-biryani.png'
  };
  addToCart(comboItem, 1);
}

function addQuickAddon(addonName, addonPrice) {
  const addonItem = {
    id: 'addon-' + addonName.toLowerCase().replace(/[^a-z]/g, ''),
    name: addonName,
    price: addonPrice,
    image: '/assets/paneer-butter-masala.png'
  };
  addToCart(addonItem, 1);
}

function callWaiterAssistance() {
  const waiterStatus = document.getElementById('waiterStatus');
  if (waiterStatus) {
    waiterStatus.textContent = '🔔 Staff Notified! A waiter is on their way to your table.';
    waiterStatus.style.display = 'block';
    setTimeout(() => {
      waiterStatus.style.display = 'none';
    }, 4000);
  }
}
