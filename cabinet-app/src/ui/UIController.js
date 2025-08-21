/**
 * UI Controller
 * Управляет всеми элементами интерфейса
 */

export class UIController {
    constructor(app) {
        this.app = app;
        this.elements = {};
    }
    
    /**
     * Инициализация UI
     */
    async initialize() {
        this.cacheElements();
        this.setupEventListeners();
        this.updateHistoryButtons();
    }
    
    /**
     * Кэшировать DOM элементы
     */
    cacheElements() {
        this.elements = {
            // Inputs
            widthInput: document.getElementById('cabinet-width'),
            heightInput: document.getElementById('cabinet-height'),
            depthInput: document.getElementById('cabinet-depth'),
            baseInput: document.getElementById('cabinet-base'),
            
            // Buttons
            applyBtn: document.getElementById('btn-apply'),
            undoBtn: document.getElementById('btn-undo'),
            redoBtn: document.getElementById('btn-redo'),
            exportBtn: document.getElementById('btn-export'),
            
            // Mode buttons
            mode2dBtn: document.getElementById('btn-mode-2d'),
            mode3dBtn: document.getElementById('btn-mode-3d'),
            
            // Zoom buttons
            zoomInBtn: document.getElementById('btn-zoom-in'),
            zoomOutBtn: document.getElementById('btn-zoom-out'),
            zoomFitBtn: document.getElementById('btn-zoom-fit'),
            
            // Info panels
            volumeText: document.getElementById('stat-volume'),
            panelsText: document.getElementById('stat-panels'),
            sectionsText: document.getElementById('stat-sections'),
            partsList: document.getElementById('parts-list'),
            
            // Canvas
            canvas: document.getElementById('cabinet-canvas')
        };
    }
    
    /**
     * Настройка обработчиков событий
     */
    setupEventListeners() {
        // Применить размеры
        this.elements.applyBtn?.addEventListener('click', () => {
            this.handleApplyDimensions();
        });
        
        // История
        this.elements.undoBtn?.addEventListener('click', () => {
            this.app.undo();
            this.updateHistoryButtons();
        });
        
        this.elements.redoBtn?.addEventListener('click', () => {
            this.app.redo();
            this.updateHistoryButtons();
        });
        
        // Экспорт
        this.elements.exportBtn?.addEventListener('click', () => {
            this.app.export();
        });
        
        // Режимы
        this.elements.mode2dBtn?.addEventListener('click', () => {
            this.app.setMode('2d');
        });
        
        this.elements.mode3dBtn?.addEventListener('click', () => {
            this.app.setMode('3d');
        });
        
        // Масштабирование
        this.elements.zoomInBtn?.addEventListener('click', () => {
            this.app.zoomIn();
        });
        
        this.elements.zoomOutBtn?.addEventListener('click', () => {
            this.app.zoomOut();
        });
        
        this.elements.zoomFitBtn?.addEventListener('click', () => {
            this.app.zoomFit();
        });
        
        // Canvas события
        this.setupCanvasEvents();
        
        // Клавиатура
        this.setupKeyboardEvents();
    }
    
    /**
     * Настройка событий canvas
     */
    setupCanvasEvents() {
        const canvas = this.elements.canvas;
        if (!canvas) return;
        
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStart = {
                x: e.clientX - this.app.state.offset.x,
                y: e.clientY - this.app.state.offset.y
            };
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.app.state.offset.x = e.clientX - dragStart.x;
                this.app.state.offset.y = e.clientY - dragStart.y;
                this.app.render();
            } else {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.app.handleMouseMove(x, y);
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const factor = e.deltaY > 0 ? 0.9 : 1.1;
            this.app.zoom(factor);
        });
    }
    
    /**
     * Настройка клавиатурных событий
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Z - Undo
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.app.undo();
                this.updateHistoryButtons();
            }
            // Ctrl+Y - Redo
            else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.app.redo();
                this.updateHistoryButtons();
            }
            // Delete
            else if (e.key === 'Delete' && this.app.state.selectedElement) {
                // TODO: Удаление элемента
            }
        });
    }
    
    /**
     * Обработка применения размеров
     */
    handleApplyDimensions() {
        const params = {
            width: parseInt(this.elements.widthInput?.value) || 800,
            height: parseInt(this.elements.heightInput?.value) || 2000,
            depth: parseInt(this.elements.depthInput?.value) || 600,
            baseHeight: parseInt(this.elements.baseInput?.value) || 100
        };
        
        this.app.createCabinet(params);
        this.updateHistoryButtons();
    }
    
    /**
     * Обновить информацию о шкафе
     */
    updateCabinetInfo(cabinetData) {
        if (!cabinetData) return;
        
        // Обновляем статистику
        if (this.elements.volumeText) {
            const volume = cabinetData.stats?.volume || 0;
            this.elements.volumeText.textContent = `${volume.toFixed(3)} м³`;
        }
        
        if (this.elements.panelsText) {
            this.elements.panelsText.textContent = cabinetData.stats?.panelsCount || 0;
        }
        
        if (this.elements.sectionsText) {
            this.elements.sectionsText.textContent = cabinetData.stats?.sectionsCount || 0;
        }
        
        // Обновляем список деталей
        this.updatePartsList(cabinetData.panels);
    }
    
    /**
     * Обновить список деталей
     */
    updatePartsList(panels) {
        if (!this.elements.partsList || !panels) return;
        
        if (panels.length === 0) {
            this.elements.partsList.innerHTML = '<div class="empty-state">Нет деталей</div>';
            return;
        }
        
        let html = '';
        panels.forEach(panel => {
            html += `
                <div class="part-item" data-id="${panel.id}">
                    <div class="part-name">${panel.name || panel.type}</div>
                    <div class="part-dims">
                        ${Math.round(panel.dimensions?.width || 0)} × 
                        ${Math.round(panel.dimensions?.height || 0)} × 
                        ${Math.round(panel.dimensions?.thickness || 0)} мм
                    </div>
                </div>
            `;
        });
        
        this.elements.partsList.innerHTML = html;
    }
    
    /**
     * Установить режим
     */
    setMode(mode) {
        if (mode === '2d') {
            this.elements.mode2dBtn?.classList.add('active');
            this.elements.mode3dBtn?.classList.remove('active');
        } else {
            this.elements.mode3dBtn?.classList.add('active');
            this.elements.mode2dBtn?.classList.remove('active');
        }
    }
    
    /**
     * Обновить кнопки истории
     */
    updateHistoryButtons() {
        const canUndo = this.app.stateManager?.canUndo() || false;
        const canRedo = this.app.stateManager?.canRedo() || false;
        
        if (this.elements.undoBtn) {
            this.elements.undoBtn.disabled = !canUndo;
        }
        
        if (this.elements.redoBtn) {
            this.elements.redoBtn.disabled = !canRedo;
        }
    }
}