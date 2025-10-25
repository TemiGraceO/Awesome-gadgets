// home.js - unified script for Dashboard, Categories, Cart, Modal, Checkout
document.addEventListener("DOMContentLoaded", () => {
  /* --------------------
     Elements & selectors
  -------------------- */
  const menuBtn = document.getElementById("menuBtn");
  const navUl = document.querySelector("nav ul");

  const dashboardLink = document.getElementById("dashboardLink");
  const dashboardOverlay = document.querySelector(".dashboard-overlay");
  const closeDashboardBtn = dashboardOverlay.querySelector(".close-dashboard");

  const categoriesLink = document.getElementById("categoriesLink");
  const categoriesOverlay = document.querySelector(".categories-overlay");
  const closeCategoriesBtn = categoriesOverlay.querySelector(".close-categories");

  const cartLink = document.getElementById("cartLink");
  const cartOverlay = document.querySelector(".cart-overlay");
  const closeCartBtn = cartOverlay.querySelector(".close-cart");
  const cartItemsContainer = cartOverlay.querySelector(".cart-items");
  const cartTotalEl = cartOverlay.querySelector(".cart-total");
  const cartBadge = document.querySelector(".cart-badge");

  const checkoutBtn = cartOverlay.querySelector(".checkout-btn");

  // Product modal (create once)
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "product-modal-overlay";
  modalOverlay.innerHTML = `
    <div class="product-modal" role="dialog" aria-modal="true">
      <button class="close-modal" aria-label="Close product">✖</button>
      <img src="" alt="Product image">
      <h3></h3>
      <p class="desc"></p>
      <p class="price"></p>
      <div style="display:flex;gap:10px;align-items:center;margin-top:10px;">
        <button class="add-to-cart-btn">Add to Cart 🛒</button>
        <button class="close-modal secondary">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  /* --------------------
     Utility: format currency
  -------------------- */
  function formatCurrency(value, isNGN = false) {
    if (isNGN) {
      // For NGN example (if price stored as large integer)
      const n = Number(value);
      if (isNaN(n)) return value;
      return `#${n.toLocaleString("en-NG")}`;
    }
    const n = Number(value);
    if (isNaN(n)) return value;
    return `$${n.toFixed(2)}`;
  }

  /* --------------------
     Mobile menu toggle
  -------------------- */
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const open = navUl.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.textContent = open ? "✖" : "☰";
    });
  }

  /* --------------------
     Dashboard handlers
  -------------------- */
  dashboardLink.addEventListener("click", (e) => {
    e.preventDefault();
    dashboardOverlay.classList.add("show");
    dashboardOverlay.setAttribute("aria-hidden", "false");
  });
  closeDashboardBtn.addEventListener("click", () => {
    dashboardOverlay.classList.remove("show");
    dashboardOverlay.setAttribute("aria-hidden", "true");
  });

  // dashboard sidebar switching
  const sidebarItems = dashboardOverlay.querySelectorAll(".sidebar-nav li");
  sidebarItems.forEach(li => {
    li.addEventListener("click", () => {
      dashboardOverlay.querySelectorAll(".sidebar-nav li").forEach(x => x.classList.remove("active"));
      li.classList.add("active");
      const target = li.dataset.section;
      dashboardOverlay.querySelectorAll(".content .section").forEach(s => s.classList.add("hidden"));
      const el = dashboardOverlay.querySelector(`#${target}`);
      if (el) el.classList.remove("hidden");
    });
  });

  /* --------------------
     Categories handlers
  -------------------- */
  categoriesLink.addEventListener("click", (e) => {
    e.preventDefault();
    categoriesOverlay.classList.add("show");
    categoriesOverlay.setAttribute("aria-hidden", "false");
  });
  closeCategoriesBtn.addEventListener("click", () => {
    categoriesOverlay.classList.remove("show");
    categoriesOverlay.setAttribute("aria-hidden", "true");
  });

  /* --------------------
     Cart handlers & data
  -------------------- */
  // cart state: map productName -> {name, price, image, qty}
  const cart = new Map();

  function updateCartBadge() {
    let totalQty = 0;
    for (let item of cart.values()) totalQty += item.qty;
    cartBadge.textContent = totalQty;
  }

  function recalcCartTotal() {
    let total = 0;
    for (let item of cart.values()) {
      const priceNum = Number(item.price);
      if (!isNaN(priceNum)) total += priceNum * item.qty;
      // If price is not numeric (e.g. NGN string), skip numeric math
    }
    // Show USD styled if at least one numeric price exists
    cartTotalEl.textContent = (total > 0) ? `$${total.toFixed(2)}` : "$0.00";
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.dataset.name = item.name;
      row.dataset.price = item.price;
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h4>${item.name}</h4>
          <p class="item-price">${ (isFinite(Number(item.price))) ? `$${Number(item.price).toFixed(2)}` : item.price }</p>
          <div class="quantity">
            <button class="decrease" aria-label="Decrease quantity">-</button>
            <input type="number" value="${item.qty}" min="1" aria-label="Quantity for ${item.name}">
            <button class="increase" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-item" aria-label="Remove ${item.name}">🗑️</button>
      `;
      cartItemsContainer.appendChild(row);
    });

    updateCartBadge();
    recalcCartTotal();
  }

  // open cart overlay
  cartLink.addEventListener("click", (e) => {
    e.preventDefault();
    cartOverlay.classList.add("show");
    cartOverlay.setAttribute("aria-hidden", "false");
  });
  closeCartBtn.addEventListener("click", () => {
    cartOverlay.classList.remove("show");
    cartOverlay.setAttribute("aria-hidden", "true");
  });

  // cart item interactions: delegate
  cartItemsContainer.addEventListener("click", (e) => {
    const itemEl = e.target.closest(".cart-item");
    if (!itemEl) return;

    const name = itemEl.dataset.name;
    if (e.target.classList.contains("increase")) {
      const input = itemEl.querySelector("input");
      input.value = Number(input.value) + 1;
      cart.get(name).qty = Number(input.value);
      renderCart();
    } else if (e.target.classList.contains("decrease")) {
      const input = itemEl.querySelector("input");
      if (Number(input.value) > 1) {
        input.value = Number(input.value) - 1;
        cart.get(name).qty = Number(input.value);
        renderCart();
      }
    } else if (e.target.classList.contains("remove-item")) {
      cart.delete(name);
      renderCart();
    }
  });

  // respond to manual quantity edits
  cartItemsContainer.addEventListener("change", (e) => {
    const input = e.target;
    if (input.tagName.toLowerCase() === "input" && input.closest(".cart-item")) {
      const itemEl = input.closest(".cart-item");
      const name = itemEl.dataset.name;
      const qty = Math.max(1, Number(input.value) || 1);
      if (cart.has(name)) {
        cart.get(name).qty = qty;
        renderCart();
      }
    }
  });

  /* --------------------
     Product modal & Add to cart logic
  -------------------- */
  function openProductModal({name, price, image, desc}) {
    modalOverlay.querySelector("img").src = image;
    modalOverlay.querySelector("h3").textContent = name;
    modalOverlay.querySelector(".desc").textContent = desc || "";
    // show price nicely
    const priceNum = Number(price);
    if (isFinite(priceNum)) {
      modalOverlay.querySelector(".price").textContent = `$${priceNum.toFixed(2)}`;
    } else {
      modalOverlay.querySelector(".price").textContent = price;
    }
    const addBtn = modalOverlay.querySelector(".add-to-cart-btn");
    addBtn.dataset.name = name;
    addBtn.dataset.price = price;
    addBtn.dataset.image = image;

    modalOverlay.classList.add("show");
  }

  // close modal
  modalOverlay.addEventListener("click", (e) => {
    if (e.target.classList.contains("product-modal-overlay") || e.target.classList.contains("close-modal")) {
      modalOverlay.classList.remove("show");
    }
  });

  // add to cart from modal
  modalOverlay.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    const image = btn.dataset.image;

    // if item exists, increment qty, else add
    if (cart.has(name)) {
      cart.get(name).qty += 1;
    } else {
      cart.set(name, { name, price, image, qty: 1 });
    }

    renderCart();
    modalOverlay.classList.remove("show");
    // open cart to give immediate feedback
    cartOverlay.classList.add("show");
  });

  /* --------------------
     Wire product cards (both on main and in categories panel)
  -------------------- */
  function wireProductCards(containerSelector = "body") {
    const selector = `${containerSelector} .product-card, .product-card`;
    // Use querySelectorAll on the document but only attach once per button
    document.querySelectorAll(".product-card").forEach(card => {
      // avoid double-binding: only attach if not wired
      if (card.dataset.wired) return;
      card.dataset.wired = "true";

      card.addEventListener("click", (evt) => {
        // allow clicking the inner buttons too
        const name = card.dataset.name;
        const price = card.dataset.price;
        const image = card.dataset.image;
        const desc = card.dataset.desc || "";

        openProductModal({ name, price, image, desc });
      });
    });

    // attach small "product-add-btn" buttons if present (they should open modal too)
    document.querySelectorAll(".product-add-btn").forEach(btn => {
      if (btn.dataset.wiredBtn) return;
      btn.dataset.wiredBtn = "true";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const card = btn.closest(".product-card");
        if (!card) return;
        const name = card.dataset.name;
        const price = card.dataset.price;
        const image = card.dataset.image;
        const desc = card.dataset.desc || "";
        openProductModal({ name, price, image, desc });
      });
    });
  }

  // initial wiring
  wireProductCards();

  /* --------------------
     Checkout: send order to WhatsApp
  -------------------- */
  checkoutBtn.addEventListener("click", () => {
    if (cart.size === 0) {
      alert("Your cart is empty.");
      return;
    }

    // build order summary
    const lines = [];
    let numericTotal = 0;
    cart.forEach(item => {
      lines.push(`${item.qty} x ${item.name} @ ${ (isFinite(Number(item.price))) ? `$${Number(item.price).toFixed(2)}` : item.price }`);
      if (isFinite(Number(item.price))) numericTotal += Number(item.price) * item.qty;
    });
    if (numericTotal > 0) {
      lines.push(`Total: $${numericTotal.toFixed(2)}`);
    }

    const phone = "2348137339046"; // checkout WhatsApp number
    const text = `Hello! I would like to place an order:\n\n${lines.join("\n")}\n\nPlease confirm availability and checkout steps.`;
    const url = `https://wa.me/${phone}?text=` + encodeURIComponent(text);

    // open whatsapp in new tab
    window.open(url, "_blank");

    // Optionally keep cart or clear it — we'll keep it and give user a message
    alert("WhatsApp opened with your order. Please complete the order in WhatsApp.");
  });

  /* --------------------
     Small UX: close overlays when clicking outside panels
  -------------------- */
  [dashboardOverlay, categoriesOverlay, cartOverlay].forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      // if clicked the semi-transparent backdrop (not the inner panel)
      if (e.target === overlay) {
        overlay.classList.remove("show");
      }
    });
  });

  /* --------------------
     Ensure cart badge initial value
  -------------------- */
  updateCartBadge();
  recalcCartTotal();

  /* --------------------
     Bonus: keyboard ESC to close modals/panels
  -------------------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modalOverlay.classList.remove("show");
      dashboardOverlay.classList.remove("show");
      categoriesOverlay.classList.remove("show");
      cartOverlay.classList.remove("show");
    }
  });

  /* --------------------
     Optional: pre-wire any dynamically added product lists later
     If you later inject products, call wireProductCards()
  -------------------- */

});
