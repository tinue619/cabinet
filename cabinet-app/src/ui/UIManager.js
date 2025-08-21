/**
 * APPLICATION LAYER - UI Manager
 * Handles all UI interactions and updates
 */

export class UIManager {
    constructor(cabinetApp) {
        this.app = cabinetApp;
        this.selectedElement = null;
        
        // Cache DOM elements
        this.elements = this.cacheElements();
        
        // Bind event handlers
        this.bindEvents();
        
        console.log('✅ UIManager initialized');
    }
    
    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        return {
            // Input controls
            widthInput: document.getElementById('cabinet-width'),
            heightInput: document.getElementById('cabinet-height'),
            depthInput: document.getElementById('cabinet-depth'),
            baseInput: document.getElementById('cabinet-base'),
            applyBtn: document.getElementById('btn-apply'),
            
            // Mode controls
            mode2DBtn: document.getElementById('btn-mode-2d'),
            mode3DBtn: document.getElementById('btn-mode-3d'),
            
            // Toolbar
            zoomInBtn: document.getElementById('btn-zoom-in'),
            zoomOutBtn: document.getElementById('btn-zoom-out'),
            zoomFitBtn: document.getElementById('btn-zoom-fit'),
            zoomLevel: document.getElementById('zoom-level'),
            
            // History
            undoBtn: document.getElementById('btn-undo'),
            redoBtn: document.getElementById('btn-redo'),
            
            // Stats
            statVolume: document.getElementById('stat-volume'),
            statPanels: document.getElementById('stat-panels'),
            statSections: document.getElementById('stat-sections'),
            
            // Parts list
            partsList: document.getElementById('parts-list'),
            
            // Status
            coreStatus: document.getElementById('core-status'),
            currentMode: document.getElementById('current-mode')
        };
    }
    
    /**
     * Bind event handlers
     */
    bindEvents() {
        // Apply button
        if (this.elements.applyBtn) {
            this.elements.applyBtn.addEventListener('click', () => {
                this.handleApplyDimensions();
            });
        }
        
        // Mode buttons
        if (this.elements.mode2DBtn) {
            this.elements.mode2DBtn.addEventListener('click', () => {
                this.setMode('2D');
            });
        }
        
        if (this.elements.mode3DBtn) {
            this.elements.mode3DBtn.addEventListener('click', () => {
                this.setMode('3D');
            });
        }
        
        // Zoom controls
        if (this.elements.zoomInBtn) {
            this.elements.zoomInBtn.addEventListener('click', () => {
                this.app.renderer?.zoomIn();
                this.updateZoomLevel();
            });
        }
        
        if (this.elements.zoomOutBtn) {
            this.elements.zoomOutBtn.addEventListener('click', () => {
                this.app.renderer?.zoomOut();
                this.updateZoomLevel();
            });
        }
        
        if (this.elements.zoomFitBtn) {
            this.elements.zoomFitBtn.addEventListener('click', () => {
                this.app.renderer?.zoomFit();
                this.updateZoomLevel();
            });
        }
        
        // History buttons
        if (this.elements.undoBtn) {
            this.elements.undoBtn.addEventListener('click', () => {
                // TODO: Implement undo
                console.log('🔄 Undo action');
            });
        }
        
        if (this.elements.redoBtn) {
            this.elements.redoBtn.addEventListener('click', () => {
                // TODO: Implement redo
                console.log('🔄 Redo action');
            });
        }
        
        // Input changes
        ['widthInput', 'heightInput', 'depthInput', 'baseInput'].forEach(inputName => {
            const input = this.elements[inputName];
            if (input) {
                input.addEventListener('input', () => {
                    this.validateInputs();
                });
            }
        });
    }
    
    /**
     * Handle apply dimensions button
     */
    handleApplyDimensions() {
        const width = parseInt(this.elements.widthInput?.value || 800);
        const height = parseInt(this.elements.heightInput?.value || 2000);
        const depth = parseInt(this.elements.depthInput?.value || 600);
        const baseHeight = parseInt(this.elements.baseInput?.value || 100);
        
        console.log('📐 Applying new dimensions:', { width, height, depth, baseHeight });
        
        // Validation
        if (width < 400 || width > 2000) {
            this.showNotification('Ширина должна быть от 400 до 2000 мм', 'error');
            return;
        }
        
        if (height < 600 || height > 3000) {
            this.showNotification('Высота должна быть от 600 до 3000 мм', 'error');
            return;
        }
        
        if (depth < 300 || depth > 800) {
            this.showNotification('Глубина должна быть от 300 до 800 мм', 'error');
            return;
        }
        
        // Apply changes
        try {
            this.app.updateCabinetDimensions({ width, height, depth, baseHeight });
            this.showNotification('Размеры обновлены', 'success');
        } catch (error) {
            console.error('❌ Failed to update dimensions:', error);
            this.showNotification('Ошибка обновления размеров', 'error');
        }
    }
    
    /**
     * Set viewing mode
     */
    setMode(mode) {
        this.app.currentMode = mode;
        
        // Update button states
        if (this.elements.mode2DBtn && this.elements.mode3DBtn) {
            this.elements.mode2DBtn.classList.toggle('active', mode === '2D');
            this.elements.mode3DBtn.classList.toggle('active', mode === '3D');
        }
        
        // Update current mode display
        if (this.elements.currentMode) {
            this.elements.currentMode.textContent = mode;
        }
        
        // Re-render
        this.app.render();
        
        console.log('🔄 Mode changed to:', mode);
    }
    
    /**
     * Update all UI elements
     */
    updateAll() {
        this.updateStats();
        this.updatePartsList();
        this.updateCoreStatus();
        this.validateInputs();
    }
    
    /**
     * Update statistics display
     */
    updateStats() {
        if (!this.app.cabinet) return;
        
        const stats = this.app.cabinet.getStats();
        
        if (this.elements.statVolume) {
            const volume = (stats.volume / 1000000000).toFixed(3); // to m³
            this.elements.statVolume.textContent = `${volume} м³`;
        }
        
        if (this.elements.statPanels) {
            this.elements.statPanels.textContent = stats.panelsCount || 0;
        }
        
        if (this.elements.statSections) {
            this.elements.statSections.textContent = stats.sectionsCount || 0;
        }
    }
    
    /**
     * Update parts list
     */
    updatePartsList() {
        if (!this.app.cabinet || !this.elements.partsList) return;
        
        const panels = this.app.cabinet.getPanels();
        
        if (panels.length === 0) {
            this.elements.partsList.innerHTML = `
                <div class="empty-state">Нет деталей</div>
            `;
            return;
        }
        
        let html = '';
        panels.forEach(panel => {
            const dims = panel.dimensions;
            const material = panel.material?.name || 'Неизвестный материал';
            
            html += `
                <div class="part-item" data-panel-id="${panel.id}">
                    <span class="part-name">${panel.name || panel.panelType}</span>
                    <span class="part-material">${material}</span>
                    <span class="part-dimensions">${Math.round(dims.width)}×${Math.round(dims.height)}×${Math.round(dims.depth)}мм</span>
                </div>
            `;
        });
        
        this.elements.partsList.innerHTML = html;
        
        // Add click handlers for part selection
        this.elements.partsList.querySelectorAll('.part-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const panelId = e.currentTarget.dataset.panelId;
                this.selectPanel(panelId);
            });
        });
    }
    
    /**
     * Select panel
     */
    selectPanel(panelId) {
        if (!this.app.cabinet) return;
        
        const panels = this.app.cabinet.getPanels();
        const panel = panels.find(p => p.id === panelId);
        
        if (panel) {
            this.selectedElement = panel;
            
            // Update visual selection in parts list
            this.elements.partsList?.querySelectorAll('.part-item').forEach(item => {
                item.classList.toggle('selected', item.dataset.panelId === panelId);
            });
            
            // Re-render to show selection
            this.app.render();
            
            console.log('🎯 Selected panel:', panel.name || panel.panelType);
        }
    }
    
    /**
     * Update core status
     */
    updateCoreStatus() {
        if (this.elements.coreStatus) {
            this.elements.coreStatus.textContent = this.app.cabinet ? 'Готов' : 'Не загружен';
        }
    }
    
    /**
     * Validate inputs
     */
    validateInputs() {
        let isValid = true;
        
        ['widthInput', 'heightInput', 'depthInput', 'baseInput'].forEach(inputName => {
            const input = this.elements[inputName];
            if (input) {
                const value = parseInt(input.value);
                const min = parseInt(input.min);
                const max = parseInt(input.max);
                
                const valid = value >= min && value <= max;
                input.classList.toggle('invalid', !valid);
                
                if (!valid) isValid = false;
            }
        });
        
        if (this.elements.applyBtn) {
            this.elements.applyBtn.disabled = !isValid;
        }
    }
    
    /**
     * Update zoom level display
     */
    updateZoomLevel() {
        if (this.elements.zoomLevel && this.app.renderer) {
            const zoom = Math.round(this.app.renderer.getZoom() * 100);
            this.elements.zoomLevel.textContent = `${zoom}%`;
        }
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Simple notification implementation
        console.log(`📢 ${type.toUpperCase()}: ${message}`);
        
        // TODO: Implement proper notification system
        if (type === 'error') {
            alert(`Ошибка: ${message}`);
        }
    }
    
    /**
     * Clear selection
     */
    clearSelection() {
        this.selectedElement = null;
        
        // Clear visual selection
        this.elements.partsList?.querySelectorAll('.part-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Re-render
        this.app.render();
    }
}
