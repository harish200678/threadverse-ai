/* ==========================================================================
   ThreadVerse AI - Intelligent AI Graphic & T-Shirt Concept Generator
   ========================================================================== */

const AiGeneratorModule = (function() {
    let currentStyle = 'cyberpunk';
    let lastGeneratedTeeSrc = 'assets/golden_dragon_tee.jpg';
    let lastGeneratedGraphicSrc = 'assets/cyber_samurai.jpg';
    let lastPromptText = '';

    const aiPrebuiltDatabase = {
        cyberpunk: { tee: 'assets/cyber_samurai_tee.jpg', sticker: 'assets/cyber_samurai.jpg' },
        dragon: { tee: 'assets/golden_dragon_tee.jpg', sticker: 'assets/golden_dragon_tee.jpg' },
        wolf: { tee: 'assets/mecha_wolf_tee.jpg', sticker: 'assets/mecha_wolf_tee.jpg' },
        retro: { tee: 'assets/retro_sunset_tee.jpg', sticker: 'assets/retro_sunset.jpg' },
        cosmic: { tee: 'assets/cosmic_astronaut_tee.jpg', sticker: 'assets/cosmic_astronaut.jpg' }
    };

    function init() {
        bindEvents();
    }

    function bindEvents() {
        // Style Presets selector
        const presetChips = document.querySelectorAll('#aiStylePresets .preset-chip');
        presetChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                presetChips.forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                currentStyle = e.target.dataset.style;
            });
        });

        // Prompt Chips Quick fill
        document.querySelectorAll('.sample-prompts .prompt-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const prompt = e.target.dataset.prompt;
                const textarea = document.getElementById('aiPromptInput');
                if (textarea) textarea.value = prompt;
            });
        });

        // Magic Polish Button
        const polishBtn = document.getElementById('aiMagicPolishBtn');
        if (polishBtn) {
            polishBtn.addEventListener('click', polishPrompt);
        }

        // Generate AI Design Button
        const genBtn = document.getElementById('generateAiDesignBtn');
        if (genBtn) {
            genBtn.addEventListener('click', generateDesign);
        }

        // Add Ready AI Shirt to Cart Button
        const addReadyBtn = document.getElementById('aiReadyShirtAddToCartBtn');
        if (addReadyBtn) {
            addReadyBtn.addEventListener('click', addReadyAiShirtToCart);
        }

        // Try Prompt buttons in Showcase
        document.querySelectorAll('.try-prompt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.currentTarget.dataset.prompt;
                AppModule.navigateTo('studio');
                StudioModule.switchTab('tab-ai');
                const textarea = document.getElementById('aiPromptInput');
                if (textarea) textarea.value = prompt;
                generateDesign();
            });
        });
    }

    function polishPrompt() {
        const textarea = document.getElementById('aiPromptInput');
        if (!textarea) return;

        let val = textarea.value.trim();
        if (!val) val = "Futuristic samurai wolf";

        const polishSuffixes = [
            ", 8k vector art graphic badge, vivid neon lighting, crisp T-shirt print style, isolated dark background, masterpiece.",
            ", 1980s synthwave vaporwave aesthetics, chrome metallic gradient, high-detail vector emblem, vintage screenprint finish.",
            ", kawaii anime aesthetic, glowing celestial aura, intricate linework, premium streetwear print quality."
        ];

        const randomSuffix = polishSuffixes[Math.floor(Math.random() * polishSuffixes.length)];
        textarea.value = val + randomSuffix;
        AppModule.showToast('✨ AI Prompt polished for high detail!');
    }

    /**
     * AI Concept Graphic Generator Engine - Intelligent Prompt Parsing & Vector Artwork Creation
     */
    /**
     * DYNAMIC REALISTIC AI STREETWEAR STICKER GENERATOR ENGINE
     * Composites high-detail artwork graphics, white vinyl die-cut sticker cutouts, glossy reflections & 3D typography
     */
    function createConceptAiGraphicSticker(promptText, style) {
        return new Promise((resolve) => {
            const c = document.createElement('canvas');
            c.width = 640;
            c.height = 640;
            const g = c.getContext('2d');

            const p = promptText.toLowerCase();

            // 1. Dynamic Color Extraction
            let primaryColor = '#00f0ff';   // Electric Cyan
            let secondaryColor = '#ec4899'; // Neon Pink

            if (p.includes('red') || p.includes('fire') || p.includes('flame') || p.includes('crimson') || p.includes('blood') || p.includes('phoenix') || p.includes('inferno')) {
                primaryColor = '#ef4444';
                secondaryColor = '#f59e0b';
            } else if (p.includes('gold') || p.includes('yellow') || p.includes('sun') || p.includes('amber') || p.includes('crown') || p.includes('king')) {
                primaryColor = '#f59e0b';
                secondaryColor = '#fbbf24';
            } else if (p.includes('green') || p.includes('emerald') || p.includes('nature') || p.includes('forest') || p.includes('alien') || p.includes('toxic')) {
                primaryColor = '#10b981';
                secondaryColor = '#34d399';
            } else if (p.includes('purple') || p.includes('violet') || p.includes('galaxy') || p.includes('mystic') || p.includes('vaporwave')) {
                primaryColor = '#a855f7';
                secondaryColor = '#ec4899';
            } else if (p.includes('blue') || p.includes('cyan') || p.includes('electric') || p.includes('ice') || p.includes('ocean')) {
                primaryColor = '#00f0ff';
                secondaryColor = '#3b82f6';
            }

            const centerX = 320, centerY = 320, radius = 270;

            // 2. Select High-Detail Real Streetwear Artwork Graphic Asset Matching Prompt Theme
            let artSrc = 'assets/cyber_tiger.jpg';
            if (p.includes('skull') || p.includes('synthwave') || p.includes('80s') || p.includes('retro') || p.includes('reaper') || p.includes('death')) {
                artSrc = 'assets/synthwave_skull.jpg';
            } else if (p.includes('samurai') || p.includes('ninja') || p.includes('bushido') || p.includes('katana') || p.includes('sword') || p.includes('japan')) {
                artSrc = 'assets/cyber_samurai.jpg';
            } else if (p.includes('dragon') || p.includes('serpent') || p.includes('hydra') || p.includes('flame') || p.includes('red')) {
                artSrc = 'assets/golden_dragon_tee.jpg';
            } else if (p.includes('wolf') || p.includes('mecha') || p.includes('robot') || p.includes('mech') || p.includes('cyborg')) {
                artSrc = 'assets/mecha_wolf_tee.jpg';
            } else if (p.includes('space') || p.includes('astronaut') || p.includes('boba') || p.includes('galaxy') || p.includes('moon') || p.includes('planet')) {
                artSrc = 'assets/cosmic_astronaut.jpg';
            } else if (p.includes('sunset') || p.includes('palm') || p.includes('beach') || p.includes('horizon')) {
                artSrc = 'assets/retro_sunset.jpg';
            }

            // Load high-detail artwork image
            const artImg = new Image();
            artImg.crossOrigin = 'anonymous';
            artImg.onload = function() {

                // A. Draw Outer Vinyl Sticker White Die-Cut Border Contour
                g.save();
                g.shadowColor = 'rgba(0, 0, 0, 0.6)';
                g.shadowBlur = 24;

                g.fillStyle = '#ffffff'; // Crisp white physical vinyl sticker border!
                g.beginPath();
                g.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
                g.fill();
                g.restore();

                // B. Draw Radial Sunburst & Dark Crest Background inside Vinyl Outline
                g.save();
                g.beginPath();
                g.arc(centerX, centerY, radius, 0, Math.PI * 2);
                g.clip();

                const grad = g.createRadialGradient(centerX, centerY, 30, centerX, centerY, radius);
                grad.addColorStop(0, '#0d1322');
                grad.addColorStop(0.85, '#040711');
                grad.addColorStop(1, '#000000');
                g.fillStyle = grad;
                g.fillRect(0, 0, 640, 640);

                // Geometric Neon Rays
                g.fillStyle = 'rgba(255, 255, 255, 0.05)';
                for (let i = 0; i < 16; i++) {
                    g.beginPath();
                    g.moveTo(centerX, centerY);
                    g.arc(centerX, centerY, radius, (i * Math.PI) / 8, ((i + 0.5) * Math.PI) / 8);
                    g.closePath();
                    g.fill();
                }

                // C. Draw High-Detail Photorealistic / Vector Artwork Graphic
                g.drawImage(artImg, centerX - 180, centerY - 200, 360, 360);

                // D. Neon Glow Rim Stroke Rings
                g.strokeStyle = primaryColor;
                g.lineWidth = 10;
                g.shadowColor = primaryColor;
                g.shadowBlur = 25;
                g.beginPath();
                g.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
                g.stroke();

                g.strokeStyle = secondaryColor;
                g.lineWidth = 4;
                g.beginPath();
                g.arc(centerX, centerY, radius - 20, 0, Math.PI * 2);
                g.stroke();

                // E. Japanese Kanji Crest Accents on sides
                g.shadowBlur = 12;
                g.shadowColor = secondaryColor;
                g.fillStyle = secondaryColor;
                g.font = '700 22px sans-serif';
                g.textAlign = 'center';
                g.fillText('ネオン', centerX - 190, centerY + 20);
                g.fillText('東京', centerX + 190, centerY + 20);

                // F. 3D Metallic Typography Banner of User Prompt Words
                g.shadowBlur = 15;
                g.shadowColor = primaryColor;
                g.fillStyle = '#ffffff';
                g.font = '900 24px Orbitron, sans-serif';

                const words = promptText.toUpperCase().split(' ').filter(w => w.length > 1);
                const titleText = words.slice(0, 3).join(' ') || 'URBAN STREETWEAR';
                const subText = words.slice(3, 7).join(' ') || 'AUTHENTIC VINYL EDITION';

                g.fillText(titleText, centerX, 120);

                g.fillStyle = secondaryColor;
                g.font = '800 20px Orbitron, sans-serif';
                g.fillText(subText, centerX, 515);

                // G. Glossy Vinyl Sticker Diagonal Reflection Sheen
                const sheenGrad = g.createLinearGradient(0, 0, 640, 640);
                sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
                sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.05)');
                sheenGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
                sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                g.fillStyle = sheenGrad;
                g.fillRect(0, 0, 640, 640);

                g.restore();

                resolve(c.toDataURL('image/png'));
            };
            artImg.src = artSrc;
        });
    }

    /**
     * Composites generated graphic sticker ONTOP OF REAL COTTON T-SHIRT PHOTO BASE WITH ACCURATE FABRIC COLOR
     */
    function generateFullTeeMockup(graphicDataUrl, promptText) {
        return new Promise((resolve) => {
            const teeCanvas = document.createElement('canvas');
            teeCanvas.width = 600;
            teeCanvas.height = 600;
            const ctx = teeCanvas.getContext('2d');

            const selectedHex = StudioModule.getShirtColor() || '#111625';

            // 1. Fill outer background with dark studio theme background
            ctx.fillStyle = '#0e1421';
            ctx.fillRect(0, 0, 600, 600);

            // 2. Save state & clip strictly to the T-shirt silhouette contour polygon
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(228, 70);
            ctx.bezierCurveTo(264, 108, 336, 108, 372, 70);
            ctx.lineTo(540, 162);
            ctx.lineTo(474, 276);
            ctx.lineTo(426, 222);
            ctx.lineTo(432, 570);
            ctx.bezierCurveTo(432, 582, 414, 590, 396, 590);
            ctx.lineTo(204, 590);
            ctx.bezierCurveTo(186, 590, 168, 582, 168, 570);
            ctx.lineTo(174, 222);
            ctx.lineTo(126, 276);
            ctx.lineTo(60, 162);
            ctx.closePath();

            // Clip all fill & multiply operations strictly inside the T-shirt contour!
            ctx.clip();

            // 3. Fill T-shirt silhouette ONLY with selected fabric color
            ctx.fillStyle = selectedHex;
            ctx.fillRect(0, 0, 600, 600);

            // 4. Draw isolated T-Shirt cotton shading overlay with multiply blend mode
            const baseTeeImg = new Image();
            baseTeeImg.onload = function() {
                if (selectedHex.toLowerCase() === '#ffffff' || selectedHex.toLowerCase() === '#f8fafc') {
                    ctx.globalAlpha = 0.35;
                } else {
                    ctx.globalAlpha = 0.85;
                }
                ctx.globalCompositeOperation = 'multiply';
                ctx.drawImage(baseTeeImg, 0, 0, 600, 600);
                
                // Restore clip path so graphic sticker can draw on top smoothly
                ctx.restore();

                // 5. Draw Graphic Artwork Sticker on Chest (LARGE, BOLD & EYE-CATCHING PRINT)
                const graphicImg = new Image();
                graphicImg.onload = function() {
                    ctx.save();
                    ctx.shadowColor = 'rgba(0,0,0,0.65)';
                    ctx.shadowBlur = 18;
                    ctx.drawImage(graphicImg, 165, 150, 270, 270);
                    ctx.restore();

                    resolve(teeCanvas.toDataURL('image/png'));
                };
                graphicImg.src = graphicDataUrl;
            };
            baseTeeImg.src = 'assets/isolated_tshirt_base.jpg';
        });
    }

    function generateDesign() {
        const textarea = document.getElementById('aiPromptInput');
        const promptText = textarea ? textarea.value.trim() : '';

        if (!promptText) {
            AppModule.showToast('⚠️ Please enter a prompt for the AI generator.');
            return;
        }

        lastPromptText = promptText;
        const loader = document.getElementById('aiLoadingIndicator');
        const readyCard = document.getElementById('aiGeneratedReadyShirtCard');

        if (readyCard) readyCard.classList.add('hidden');
        if (loader) loader.classList.remove('hidden');

        // Simulate AI rendering (1.2 sec)
        setTimeout(async () => {
            if (loader) loader.classList.add('hidden');

            // ALWAYS dynamically generate vector graphic sticker & T-shirt mockup for ANY user prompt (NO HARDCODED STATIC OVERRIDES)
            const graphicSrc = await createConceptAiGraphicSticker(promptText, currentStyle);
            const teeMockupSrc = await generateFullTeeMockup(graphicSrc, promptText);

            lastGeneratedGraphicSrc = graphicSrc;
            lastGeneratedTeeSrc = teeMockupSrc;

            // 1. Add generated concept sticker artwork onto studio interactive canvas
            StudioModule.addImageLayer(graphicSrc, `AI: ${promptText.substring(0, 18)}...`);

            // 2. Display the generated Real T-Shirt Mockup Card in sidebar
            if (readyCard) {
                const img = document.getElementById('aiReadyShirtImg');
                const title = document.getElementById('aiReadyShirtTitle');
                const pDesc = document.getElementById('aiReadyShirtPrompt');

                if (img) img.src = teeMockupSrc;
                if (title) title.textContent = `Real AI T-Shirt: "${promptText.substring(0, 18)}..."`;
                if (pDesc) pDesc.textContent = `Prompt: "${promptText}"`;

                readyCard.classList.remove('hidden');
            }

            // Update hero print graphic to show latest full AI T-shirt mockup
            const heroGraphic = document.getElementById('heroPrintGraphic');
            if (heroGraphic) heroGraphic.src = teeMockupSrc;

            AppModule.showToast('🎨 Dynamic AI Graphic Sticker & T-Shirt Generated!');

        }, 1200);
    }

    function addReadyAiShirtToCart() {
        if (!lastPromptText) return;

        const readyItem = {
            id: 'ai-shirt-' + Date.now(),
            name: `Real AI T-Shirt: ${lastPromptText.substring(0, 20)}...`,
            price: 34.99,
            image: lastGeneratedTeeSrc,
            type: 'ai-generated',
            color: 'Midnight Black',
            size: 'M'
        };

        AppModule.addToCart(readyItem);
    }

    return {
        init: init,
        generateDesign: generateDesign
    };
})();
