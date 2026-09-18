/* ==========================================================================
   ThreadVerse AI - Realistic Model Visualizer Module
   ========================================================================== */

const MockupRendererModule = (function() {
    let currentModel = 'flat';

    const modelAssets = {
        flat: 'assets/cyber_samurai.jpg',
        male: 'assets/cyber_samurai.jpg',
        female: 'assets/retro_sunset.jpg',
        hanger: 'assets/cosmic_astronaut.jpg'
    };

    function init() {
        bindEvents();
    }

    function bindEvents() {
        const previewBtn = document.getElementById('previewModelBtn');
        const modal = document.getElementById('modelPreviewModal');
        const closeBtn = document.getElementById('closeModelModalBtn');
        const overlay = document.getElementById('modelModalOverlay');

        if (previewBtn) {
            previewBtn.addEventListener('click', openModal);
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        if (overlay) {
            overlay.addEventListener('click', closeModal);
        }

        document.querySelectorAll('.model-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.model-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                currentModel = e.target.dataset.model;
                renderModelStage();
            });
        });
    }

    function openModal() {
        const modal = document.getElementById('modelPreviewModal');
        if (modal) {
            modal.classList.add('open');
            renderModelStage();
        }
    }

    function closeModal() {
        const modal = document.getElementById('modelPreviewModal');
        if (modal) modal.classList.remove('open');
    }

    function renderModelStage() {
        const img = document.getElementById('modelTeeBaseImg');
        const overlay = document.getElementById('modelArtworkOverlay');
        const studioCanvas = StudioModule.getCanvas();

        if (img && studioCanvas) {
            img.src = modelAssets[currentModel] || modelAssets.flat;
            if (overlay) {
                overlay.innerHTML = `<img src="${studioCanvas.toDataURL('image/png')}" style="width: 140px; height: 180px; object-fit: contain;">`;
            }
        }
    }

    return {
        init: init
    };
})();
