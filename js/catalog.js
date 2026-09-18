/* ==========================================================================
   ThreadVerse AI - Catalog & Manual T-Shirt Store Module
   ========================================================================== */

const CatalogModule = (function() {
    // Database of pre-made manual design T-shirts
    const products = [
        {
            id: 'item-1',
            name: 'Japanese Golden Dragon Heavyweight',
            category: 'anime',
            price: 36.99,
            rating: 5.0,
            colors: ['#111625', '#ffffff', '#2c1e38'],
            image: 'assets/golden_dragon_tee.jpg',
            stickerImage: 'assets/golden_dragon_tee.jpg',
            description: 'Handcrafted Japanese Golden Dragon printed on 240 GSM organic cotton streetwear tee.'
        },
        {
            id: 'item-2',
            name: 'Tokyo Mecha Wolf Dark Slate',
            category: 'cyberpunk',
            price: 37.99,
            rating: 4.9,
            colors: ['#1e293b', '#111625', '#0f172a'],
            image: 'assets/mecha_wolf_tee.jpg',
            stickerImage: 'assets/mecha_wolf_tee.jpg',
            description: 'Futuristic Mecha Wolf emblem with glowing visor printed on dark slate crewneck tee.'
        },
        {
            id: 'item-3',
            name: 'Neon Samurai Katana Heavyweight',
            category: 'cyberpunk',
            price: 34.99,
            rating: 4.9,
            colors: ['#111625', '#ffffff', '#2c1e38'],
            image: 'assets/cyber_samurai_tee.jpg',
            stickerImage: 'assets/cyber_samurai.jpg',
            description: 'Futuristic Cyber Samurai Cat with glowing katana blade. Printed on 240 GSM organic combed cotton tee.'
        },
        {
            id: 'item-4',
            name: 'Retro Synthwave Sunset 84',
            category: 'retro',
            price: 29.99,
            rating: 4.8,
            colors: ['#111625', '#1e293b', '#451a03'],
            image: 'assets/retro_sunset_tee.jpg',
            stickerImage: 'assets/retro_sunset.jpg',
            description: '1980s Retro grid mountain sunset with neon palm trees badge emblem.'
        },
        {
            id: 'item-5',
            name: 'Cosmic Boba Astronaut Tee',
            category: 'cosmic',
            price: 31.99,
            rating: 5.0,
            colors: ['#ffffff', '#111625', '#312e81'],
            image: 'assets/cosmic_astronaut_tee.jpg',
            stickerImage: 'assets/cosmic_astronaut.jpg',
            description: 'Cute astronaut floating in space drinking boba tea amongst colorful nebulae and glowing stars.'
        }
    ];

    let currentCategory = 'all';
    let searchQuery = '';
    let sortBy = 'featured';

    function init() {
        renderProducts();
        bindEvents();
    }

    function bindEvents() {
        const filterBtns = document.querySelectorAll('#catalogFilters .filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentCategory = e.target.dataset.category;
                renderProducts();
            });
        });

        const searchInput = document.getElementById('catalogSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                renderProducts();
            });
        }

        const sortSelect = document.getElementById('catalogSortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                sortBy = e.target.value;
                renderProducts();
            });
        }
    }

    function getFilteredProducts() {
        let filtered = products.filter(p => {
            const matchesCat = currentCategory === 'all' || p.category === currentCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
            return matchesCat && matchesSearch;
        });

        if (sortBy === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filtered;
    }

    function renderProducts() {
        const grid = document.getElementById('productGrid');
        if (!grid) return;

        const items = getFilteredProducts();

        if (items.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
                    <i class="fa-solid fa-store-slash" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--text-dim);"></i>
                    <p>No T-shirts match your filter criteria.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = items.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image-box">
                    <span class="category-tag">${product.category}</span>
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/golden_dragon_tee.jpg'">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price-row">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <span class="sub-text"><i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${product.rating}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">
                            <i class="fa-solid fa-cart-plus"></i> Add
                        </button>
                        <button class="btn btn-outline-primary btn-sm customize-in-studio-btn" data-id="${product.id}">
                            <i class="fa-solid fa-paintbrush"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach card actions
        grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const prod = products.find(p => p.id === id);
                if (prod) {
                    AppModule.addToCart({
                        id: prod.id,
                        name: prod.name,
                        price: prod.price,
                        image: prod.image,
                        type: 'premade',
                        color: 'Midnight Black',
                        size: 'M'
                    });
                }
            });
        });

        grid.querySelectorAll('.customize-in-studio-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const prod = products.find(p => p.id === id);
                if (prod) {
                    StudioModule.loadProductToStudio(prod);
                    AppModule.navigateTo('studio');
                }
            });
        });
    }

    return {
        init: init,
        products: products
    };
})();
