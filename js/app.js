/* ==========================================================================
   ThreadVerse AI - Main Application & Controller Module
   ========================================================================== */

const AppModule = (function() {
    let cart = [];

    function init() {
        CatalogModule.init();
        AiGeneratorModule.init();
        StudioModule.init();
        MockupRendererModule.init();

        bindEvents();
        updateCartUI();
    }

    function bindEvents() {
        // Nav Links Smooth Scroll & Active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.currentTarget.dataset.target;
                navigateTo(targetId);
            });
        });

        // Quick Launch Studio
        document.getElementById('openStudioBtn')?.addEventListener('click', () => {
            navigateTo('studio');
        });

        // Cart Drawer Toggles
        const cartToggle = document.getElementById('cartToggleBtn');
        const closeCart = document.getElementById('closeCartBtn');
        const cartOverlay = document.getElementById('cartOverlay');

        if (cartToggle) cartToggle.addEventListener('click', openCartDrawer);
        if (closeCart) closeCart.addEventListener('click', closeCartDrawer);
        if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

        // Checkout Modal Toggles
        const checkoutBtn = document.getElementById('checkoutBtn');
        const closeCheckout = document.getElementById('closeCheckoutBtn');
        const checkoutOverlay = document.getElementById('checkoutOverlay');

        if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);
        if (closeCheckout) closeCheckout.addEventListener('click', closeCheckoutModal);
        if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckoutModal);

        // Complete Order button
        document.getElementById('placeOrderBtn')?.addEventListener('click', completeOrder);
    }

    function navigateTo(targetId) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
        if (activeLink) activeLink.classList.add('active');

        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function addToCart(item) {
        cart.push(item);
        updateCartUI();
        openCartDrawer();
        showToast(`🛍️ Added "${item.name}" to cart!`);
    }

    function removeFromCart(idx) {
        cart.splice(idx, 1);
        updateCartUI();
        showToast('Item removed from cart.');
    }

    function updateCartUI() {
        const countBadge = document.getElementById('cartCountBadge');
        const itemsList = document.getElementById('cartItemsList');
        const subtotalEl = document.getElementById('cartSubtotal');
        const totalEl = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (countBadge) countBadge.textContent = cart.length;

        let total = 0;

        if (cart.length === 0) {
            if (itemsList) {
                itemsList.innerHTML = `
                    <div class="empty-cart-msg">
                        <i class="fa-solid fa-basket-shopping"></i>
                        <p>Your cart is empty.</p>
                        <a href="#shop" class="btn btn-sm btn-outline-primary" onclick="AppModule.navigateTo('shop')">Browse Store Catalog</a>
                    </div>
                `;
            }
            if (subtotalEl) subtotalEl.textContent = '$0.00';
            if (totalEl) totalEl.textContent = '$0.00';
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        if (checkoutBtn) checkoutBtn.disabled = false;

        if (itemsList) {
            itemsList.innerHTML = cart.map((item, idx) => {
                total += item.price;
                return `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-meta">Color: ${item.color} | Size: ${item.size}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <button class="layer-btn" onclick="AppModule.removeFromCart(${idx})" title="Remove"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                `;
            }).join('');
        }

        if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    }

    function openCartDrawer() {
        document.getElementById('cartDrawer')?.classList.add('open');
    }

    function closeCartDrawer() {
        document.getElementById('cartDrawer')?.classList.remove('open');
    }

    function openCheckoutModal() {
        closeCartDrawer();
        const modal = document.getElementById('checkoutModal');
        if (!modal) return;

        modal.classList.add('open');

        // Populate summary
        const checkoutList = document.getElementById('checkoutItemsList');
        const subtotalEl = document.getElementById('checkoutSubtotal');
        const grandTotalEl = document.getElementById('checkoutGrandTotal');

        let total = 0;
        if (checkoutList) {
            checkoutList.innerHTML = cart.map(item => {
                total += item.price;
                return `
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.88rem;">
                        <span>${item.name} (${item.size})</span>
                        <strong>$${item.price.toFixed(2)}</strong>
                    </div>
                `;
            }).join('');
        }

        if (subtotalEl) subtotalEl.textContent = `$${total.toFixed(2)}`;
        if (grandTotalEl) grandTotalEl.textContent = `$${total.toFixed(2)}`;
    }

    function closeCheckoutModal() {
        document.getElementById('checkoutModal')?.classList.remove('open');
    }

    function completeOrder() {
        if (cart.length === 0) return;

        closeCheckoutModal();
        cart = [];
        updateCartUI();

        showToast('🎉 Order Successfully Placed! Invoice sent to your email.');

        alert('✨ SUCCESS! Your custom T-shirt order has been submitted to production!\n\nOrder Ref: #TV-' + Math.floor(100000 + Math.random() * 900000) + '\nEstimated Delivery: 3-5 Business Days.');
    }

    function showToast(msg) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--accent-cyan);"></i> <span>${msg}</span>`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3500);
    }

    return {
        init: init,
        navigateTo: navigateTo,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        showToast: showToast
    };
})();

// Launch application on DOMReady
document.addEventListener('DOMContentLoaded', AppModule.init);
