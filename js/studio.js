/* ==========================================================================
   ThreadVerse AI - Interactive T-Shirt Customizer Studio Engine
   ========================================================================== */

const StudioModule = (function() {
    let canvas, ctx;
    let viewMode = 'front'; // 'front' | 'back'
    let layers = {
        front: [],
        back: []
    };
    let activeLayerIndex = -1;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let selectedApparelStyle = 'heavyweight';
    let basePrice = 29.99;
    let shirtColorHex = '#111625';
    let selectedSize = 'M';

    // Preset Accurate Fabric Color Swatches
    const fabricColors = [
        { name: 'Midnight Black', hex: '#111625' },
        { name: 'Crisp Pure White', hex: '#ffffff' },
        { name: 'Crimson Red', hex: '#dc2626' },
        { name: 'Deep Emerald Green', hex: '#059669' },
        { name: 'Electric Royal Blue', hex: '#2563eb' },
        { name: 'Sunset Amber Orange', hex: '#d97706' },
        { name: 'Lavender Violet', hex: '#7c3aed' },
        { name: 'Ocean Turquoise Cyan', hex: '#0891b2' },
        { name: 'Heather Slate Grey', hex: '#475569' },
        { name: 'Desert Sand Tan', hex: '#b45309' }
    ];

    // Sticker Library Data
    const stickerLibrary = [
        { name: 'Cyber Neon Tiger', image: 'assets/cyber_tiger.jpg' },
        { name: 'Synthwave Skull Riders', image: 'assets/synthwave_skull.jpg' },
        { name: 'Cyber Samurai Cat', image: 'assets/cyber_samurai.jpg' },
        { name: '80s Synthwave Sunset', image: 'assets/retro_sunset.jpg' },
        { name: 'Cosmic Boba Space', image: 'assets/cosmic_astronaut.jpg' },
        { name: 'Golden Dragon Crest', image: 'assets/golden_dragon_tee.jpg' },
        { name: 'Mecha Cyber Wolf', image: 'assets/mecha_wolf_tee.jpg' }
    ];

    function init() {
        canvas = document.getElementById('tshirtCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');

        renderFabricSwatches();
        renderStickerLibrary();
        bindEvents();
        updatePriceSummary();
        renderCanvas();
    }

    function renderFabricSwatches() {
        const container = document.getElementById('fabricColorSwatches');
        if (!container) return;

        container.innerHTML = fabricColors.map((color, idx) => `
            <div class="swatch-item ${idx === 0 ? 'active' : ''}" 
                 style="background-color: ${color.hex};" 
                 title="${color.name}"
                 data-hex="${color.hex}">
            </div>
        `).join('');

        container.querySelectorAll('.swatch-item').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                container.querySelectorAll('.swatch-item').forEach(s => s.classList.remove('active'));
                e.target.classList.add('active');
                setShirtColor(e.target.dataset.hex);
            });
        });
    }

    function renderStickerLibrary() {
        const grid = document.getElementById('stickerLibraryGrid');
        if (!grid) return;

        grid.innerHTML = stickerLibrary.map(st => `
            <div class="sticker-item" data-src="${st.image}" data-name="${st.name}">
                <img src="${st.image}" alt="${st.name}" onerror="this.src='assets/cyber_samurai.jpg'">
            </div>
        `).join('');

        grid.querySelectorAll('.sticker-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const src = e.currentTarget.dataset.src;
                const name = e.currentTarget.dataset.name;
                addImageLayer(src, name);
            });
        });
    }

    /**
     * Updates real T-shirt fabric color dynamically and accurately on the studio stage
     */
    function setShirtColor(hex) {
        shirtColorHex = hex;
        const colorObj = fabricColors.find(c => c.hex.toLowerCase() === hex.toLowerCase()) || { name: 'Custom Color', hex: hex };

        // 1. Update SVG Fabric Color Fill element directly inside clipPath (ONLY THE T-SHIRT)
        const svgFill = document.getElementById('svgFabricColorFill');
        if (svgFill) {
            svgFill.setAttribute('fill', hex);
        }

        // 2. Adjust texture shading overlay opacity for pure white vs dark colors
        const overlayImg = document.querySelector('#studioShirtSvg image');
        if (overlayImg) {
            if (hex.toLowerCase() === '#ffffff' || hex.toLowerCase() === '#f8fafc') {
                overlayImg.style.mixBlendMode = 'multiply';
                overlayImg.style.opacity = '0.35';
            } else if (hex.toLowerCase() === '#111625' || hex.toLowerCase() === '#000000') {
                overlayImg.style.mixBlendMode = 'multiply';
                overlayImg.style.opacity = '0.9';
            } else {
                overlayImg.style.mixBlendMode = 'multiply';
                overlayImg.style.opacity = '0.78';
            }
        }

        AppModule.showToast(`🎨 T-Shirt color changed accurately to ${colorObj.name}!`);
    }

    function bindEvents() {
        // Tab switching
        document.querySelectorAll('.studio-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                switchTab(targetTab);
            });
        });

        // View toggle (Front / Back)
        const frontBtn = document.getElementById('viewFrontBtn');
        const backBtn = document.getElementById('viewBackBtn');

        if (frontBtn && backBtn) {
            frontBtn.addEventListener('click', () => setViewMode('front'));
            backBtn.addEventListener('click', () => setViewMode('back'));
        }

        // Clear studio button
        const clearBtn = document.getElementById('clearStudioCanvasBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all canvas layers?')) {
                    layers[viewMode] = [];
                    activeLayerIndex = -1;
                    renderCanvas();
                    renderLayersList();
                    updatePriceSummary();
                    AppModule.showToast('Canvas cleared.');
                }
            });
        }

        // Apparel Style Selection
        const styleOptions = document.querySelectorAll('#apparelStyleSelect .style-option');
        styleOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                styleOptions.forEach(o => o.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                selectedApparelStyle = target.dataset.style;
                basePrice = parseFloat(target.dataset.price);
                updatePriceSummary();
            });
        });

        // Size Selection
        document.querySelectorAll('#studioSizeSelect .size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#studioSizeSelect .size-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                selectedSize = e.target.textContent;
            });
        });

        // Add Text Controls
        const addTextBtn = document.getElementById('addTextBtn');
        if (addTextBtn) {
            addTextBtn.addEventListener('click', addTextLayerFromInput);
        }

        const textInput = document.getElementById('textToAddInput');
        if (textInput) {
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') addTextLayerFromInput();
            });
        }

        // Text properties live edit
        const fontSelect = document.getElementById('fontFamilySelect');
        const colorPicker = document.getElementById('textColorPicker');
        const sizeSlider = document.getElementById('textSizeSlider');
        const curvedSlider = document.getElementById('textCurvedSlider');
        const glowCheck = document.getElementById('textGlowCheckbox');

        if (fontSelect) fontSelect.addEventListener('change', updateActiveTextLayerProps);
        if (colorPicker) colorPicker.addEventListener('input', updateActiveTextLayerProps);
        if (sizeSlider) sizeSlider.addEventListener('input', updateActiveTextLayerProps);
        if (curvedSlider) curvedSlider.addEventListener('input', updateActiveTextLayerProps);
        if (glowCheck) glowCheck.addEventListener('change', updateActiveTextLayerProps);

        // Upload custom image from device (Mobile & Computer)
        const uploadInput = document.getElementById('customArtFileInput');
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        addImageLayer(event.target.result, file.name || 'Device Sticker');
                        AppModule.showToast('📱 Device Sticker / Photo added to T-Shirt!');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Quick Canvas Align Controls
        document.getElementById('centerHBtn')?.addEventListener('click', centerActiveLayerH);
        document.getElementById('centerVBtn')?.addEventListener('click', centerActiveLayerV);

        // Export PNG button
        document.getElementById('exportDesignPngBtn')?.addEventListener('click', exportDesignPng);

        // Add Custom to Cart
        document.getElementById('addCustomToCartBtn')?.addEventListener('click', addCustomShirtToCart);

        // Canvas Mouse Events for Dragging & Transforms
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function switchTab(tabId) {
        document.querySelectorAll('.studio-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        const btn = document.querySelector(`.studio-tabs .tab-btn[data-tab="${tabId}"]`);
        const panel = document.getElementById(tabId);

        if (btn) btn.classList.add('active');
        if (panel) panel.classList.add('active');
    }

    function setViewMode(mode) {
        viewMode = mode;
        document.getElementById('viewFrontBtn').classList.toggle('active', mode === 'front');
        document.getElementById('viewBackBtn').classList.toggle('active', mode === 'back');

        activeLayerIndex = -1;
        renderCanvas();
        renderLayersList();
        updatePriceSummary();
    }

    function addTextLayerFromInput() {
        const textInput = document.getElementById('textToAddInput');
        const text = textInput ? textInput.value.trim() : '';

        if (!text) {
            AppModule.showToast('⚠️ Please enter some text!');
            return;
        }

        const newLayer = {
            type: 'text',
            text: text,
            x: canvas.width / 2,
            y: canvas.height / 2,
            fontFamily: document.getElementById('fontFamilySelect')?.value || 'Orbitron',
            fontSize: parseInt(document.getElementById('textSizeSlider')?.value || 36),
            color: document.getElementById('textColorPicker')?.value || '#00f0ff',
            curve: parseInt(document.getElementById('textCurvedSlider')?.value || 0),
            glow: document.getElementById('textGlowCheckbox')?.checked || false,
            rotation: 0,
            scale: 1.0
        };

        layers[viewMode].push(newLayer);
        activeLayerIndex = layers[viewMode].length - 1;

        renderCanvas();
        renderLayersList();
        updatePriceSummary();
        showTextPropsBox();
        AppModule.showToast('Text added to canvas!');
    }

    function addImageLayer(src, name) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            const maxDim = 240; // Increased so graphic stickers render large, bold and stylish on chest!
            let w = img.width;
            let h = img.height;

            if (w > maxDim || h > maxDim) {
                if (w > h) {
                    h = (h / w) * maxDim;
                    w = maxDim;
                } else {
                    w = (w / h) * maxDim;
                    h = maxDim;
                }
            }

            const newLayer = {
                type: 'image',
                name: name || 'Graphic',
                img: img,
                src: src,
                x: canvas.width / 2,
                y: canvas.height / 2,
                width: w,
                height: h,
                rotation: 0,
                scale: 1.0
            };

            layers[viewMode].push(newLayer);
            activeLayerIndex = layers[viewMode].length - 1;

            renderCanvas();
            renderLayersList();
            updatePriceSummary();
        };
        img.src = src;
    }

    function showTextPropsBox() {
        const box = document.getElementById('textPropertiesBox');
        if (box) box.classList.remove('hidden');
    }

    function updateActiveTextLayerProps() {
        if (activeLayerIndex < 0 || activeLayerIndex >= layers[viewMode].length) return;
        const layer = layers[viewMode][activeLayerIndex];
        if (layer.type !== 'text') return;

        layer.fontFamily = document.getElementById('fontFamilySelect')?.value || layer.fontFamily;
        layer.color = document.getElementById('textColorPicker')?.value || layer.color;
        layer.fontSize = parseInt(document.getElementById('textSizeSlider')?.value || layer.fontSize);
        layer.curve = parseInt(document.getElementById('textCurvedSlider')?.value || 0);
        layer.glow = document.getElementById('textGlowCheckbox')?.checked || false;

        document.getElementById('textColorHex').textContent = layer.color.toUpperCase();

        renderCanvas();
    }

    function centerActiveLayerH() {
        if (activeLayerIndex >= 0 && activeLayerIndex < layers[viewMode].length) {
            layers[viewMode][activeLayerIndex].x = canvas.width / 2;
            renderCanvas();
        }
    }

    function centerActiveLayerV() {
        if (activeLayerIndex >= 0 && activeLayerIndex < layers[viewMode].length) {
            layers[viewMode][activeLayerIndex].y = canvas.height / 2;
            renderCanvas();
        }
    }

    function renderCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const currentLayers = layers[viewMode];

        currentLayers.forEach((layer, idx) => {
            ctx.save();

            if (layer.type === 'text') {
                ctx.translate(layer.x, layer.y);
                ctx.rotate((layer.rotation * Math.PI) / 180);

                ctx.font = `${layer.fontSize}px "${layer.fontFamily}", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                if (layer.glow) {
                    ctx.shadowColor = layer.color;
                    ctx.shadowBlur = 18;
                }

                ctx.fillStyle = layer.color;
                ctx.fillText(layer.text, 0, 0);

            } else if (layer.type === 'image') {
                ctx.translate(layer.x, layer.y);
                ctx.rotate((layer.rotation * Math.PI) / 180);

                const w = layer.width * layer.scale;
                const h = layer.height * layer.scale;

                ctx.drawImage(layer.img, -w / 2, -h / 2, w, h);
            }

            ctx.restore();

            // Draw bounding box handle for active layer
            if (idx === activeLayerIndex) {
                drawBoundingBox(layer);
            }
        });
    }

    function drawBoundingBox(layer) {
        ctx.save();
        ctx.translate(layer.x, layer.y);
        ctx.rotate((layer.rotation * Math.PI) / 180);

        let w = 100, h = 40;
        if (layer.type === 'image') {
            w = layer.width * layer.scale;
            h = layer.height * layer.scale;
        } else if (layer.type === 'text') {
            ctx.font = `${layer.fontSize}px "${layer.fontFamily}", sans-serif`;
            const metrics = ctx.measureText(layer.text);
            w = metrics.width + 20;
            h = layer.fontSize + 16;
        }

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8);

        // Corner handles
        ctx.fillStyle = '#00f0ff';
        ctx.setLineDash([]);
        ctx.fillRect(-w / 2 - 8, -h / 2 - 8, 8, 8);
        ctx.fillRect(w / 2, -h / 2 - 8, 8, 8);
        ctx.fillRect(-w / 2 - 8, h / 2, 8, 8);
        ctx.fillRect(w / 2, h / 2, 8, 8);

        ctx.restore();
    }

    function handleMouseDown(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const currentLayers = layers[viewMode];

        for (let i = currentLayers.length - 1; i >= 0; i--) {
            const layer = currentLayers[i];
            let hit = false;

            if (layer.type === 'image') {
                const w = (layer.width * layer.scale) / 2;
                const h = (layer.height * layer.scale) / 2;
                if (mouseX >= layer.x - w && mouseX <= layer.x + w && mouseY >= layer.y - h && mouseY <= layer.y + h) {
                    hit = true;
                }
            } else if (layer.type === 'text') {
                const w = 100;
                const h = layer.fontSize;
                if (mouseX >= layer.x - w && mouseX <= layer.x + w && mouseY >= layer.y - h && mouseY <= layer.y + h) {
                    hit = true;
                }
            }

            if (hit) {
                activeLayerIndex = i;
                isDragging = true;
                dragStartX = mouseX - layer.x;
                dragStartY = mouseY - layer.y;
                renderCanvas();
                renderLayersList();
                if (layer.type === 'text') showTextPropsBox();
                return;
            }
        }

        activeLayerIndex = -1;
        renderCanvas();
        renderLayersList();
    }

    function handleMouseMove(e) {
        if (!isDragging || activeLayerIndex < 0) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const layer = layers[viewMode][activeLayerIndex];
        layer.x = mouseX - dragStartX;
        layer.y = mouseY - dragStartY;

        renderCanvas();
    }

    function handleMouseUp() {
        isDragging = false;
    }

    function renderLayersList() {
        const list = document.getElementById('layersList');
        if (!list) return;

        const currentLayers = layers[viewMode];

        if (currentLayers.length === 0) {
            list.innerHTML = `<div class="empty-layers">No items added to ${viewMode} canvas yet.</div>`;
            return;
        }

        list.innerHTML = currentLayers.map((layer, idx) => `
            <div class="layer-item ${idx === activeLayerIndex ? 'active' : ''}">
                <span>${layer.type === 'text' ? `Text: "${layer.text}"` : (layer.name || 'Graphic')}</span>
                <div class="layer-controls">
                    <button class="layer-btn" onclick="StudioModule.deleteLayer(${idx})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    function deleteLayer(idx) {
        layers[viewMode].splice(idx, 1);
        activeLayerIndex = -1;
        renderCanvas();
        renderLayersList();
        updatePriceSummary();
    }

    function updatePriceSummary() {
        const frontHasPrint = layers.front.length > 0;
        const backHasPrint = layers.back.length > 0;

        const frontPrintPrice = frontHasPrint ? 5.00 : 0.00;
        const backPrintPrice = backHasPrint ? 5.00 : 0.00;

        const total = basePrice + frontPrintPrice + backPrintPrice;

        document.getElementById('summaryBasePrice').textContent = `$${basePrice.toFixed(2)}`;
        document.getElementById('summaryFrontPrice').textContent = `$${frontPrintPrice.toFixed(2)}`;
        document.getElementById('summaryBackPrice').textContent = `$${backPrintPrice.toFixed(2)}`;
        document.getElementById('summaryTotalPrice').textContent = `$${total.toFixed(2)}`;
    }

    function exportDesignPng() {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `ThreadVerse_Custom_Tee_${viewMode}.png`;
        link.href = dataUrl;
        link.click();
        AppModule.showToast('📥 High-Res Design Spec downloaded!');
    }

    function addCustomShirtToCart() {
        if (layers.front.length === 0 && layers.back.length === 0) {
            AppModule.showToast('⚠️ Your T-shirt canvas is empty! Add text or AI graphic first.');
            return;
        }

        const frontPrint = layers.front.length > 0;
        const backPrint = layers.back.length > 0;
        const total = basePrice + (frontPrint ? 5.00 : 0.00) + (backPrint ? 5.00 : 0.00);

        const customItem = {
            id: 'custom-' + Date.now(),
            name: `Custom ${selectedApparelStyle.toUpperCase()} Tee`,
            price: total,
            image: canvas.toDataURL('image/png'),
            type: 'custom',
            color: fabricColors.find(c => c.hex === shirtColorHex)?.name || 'Custom Color',
            size: selectedSize
        };

        AppModule.addToCart(customItem);
    }

    function loadProductToStudio(product) {
        layers.front = [];
        layers.back = [];
        const imgToLoad = product.stickerImage || product.image;
        addImageLayer(imgToLoad, product.name);
        if (product.colors && product.colors[0]) {
            setShirtColor(product.colors[0]);
        }
        AppModule.showToast(`Loaded "${product.name}" in Studio!`);
    }

    return {
        init: init,
        switchTab: switchTab,
        addImageLayer: addImageLayer,
        deleteLayer: deleteLayer,
        setShirtColor: setShirtColor,
        loadProductToStudio: loadProductToStudio,
        getCanvas: () => canvas,
        getLayers: () => layers,
        getShirtColor: () => shirtColorHex
    };
})();
