/**
 * UI Manager Module
 * Handles UI updates and interactions
 */

export class UIManager {
    constructor(app) {
        this.app = app;
        
        // Cache DOM elements
        this.elements = {
            // Stats
            statVolume: document.getElementById('stat-volume'),
            statPanels: document.getElementById('stat-panels'),
            statSections: document.getElementById('stat-sections'),
            
            // Parts list
            partsList: document.getElementById('parts-list'),
            
            // Materials
            materialsList: document.getElementById('materials-list'),
            
            // Status
            statusMessage: document.getElementById('status-message'),
            selectionInfo: document.getElementById('selection-info'),
            
            // Buttons
            undoBtn: document.getElementById('btn-undo'),
            redoBtn: document.getElementById('btn-redo')
        };
    }
    
    /**
     * Update all UI elements
     */
    updateAll() {
        this.updateStats();
        this.updatePartsList();
        this.updateMaterials();
        this.updateHistoryButtons();
    }
    
    /**
     * Update statistics
     */
    updateStats() {
        if (!this.app.cabinet) return;
        
        const stats = this.app.cabinet.getStats();
        const dims = this.app.cabinet.dimensions;
        
        // Calculate volume
        const volume = (dims.width * dims.height * dims.depth) / 1000000000; // to m³
        
        if (this.elements.statVolume) {
            this.elements.statVolume.textContent = `${volume.toFixed(3)} м³`;
        }
        
        if (this.elements.statPanels) {
            this.elements.statPanels.textContent = stats.panelsCount || '0';
        }
        
        if (this.elements.statSections) {
            this.elements.statSections.textContent = stats.sectionsCount || '0';
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
                <div class="empty-state">
                    Создайте шкаф для просмотра деталей
                </div>
            `;
            return;
        }
        
        // Group panels by type
        const grouped = {};
        panels.forEach(panel => {
            const key = panel.name || panel.panelType;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(panel);
        });
        
        // Generate HTML
        let html = '';
        for (const [name, items] of Object.entries(grouped)) {
            items.forEach((panel, index) => {
                const dims = panel.dimensions;
                const dimText = `${Math.round(dims.width)}×${Math.round(dims.height)}×${Math.round(dims.thickness)}`;
                
                html += `
                    <div class="part-item" data-panel-id="${panel.id}">
                        <div>
                            <div class="part-name">${name} ${items.length > 1 ? `#${index + 1}` : ''}</div>
                            <div class="part-dimensions">${dimText} мм</div>
                        </div>
                    </div>
                `;
            });
        }
        
        this.elements.partsList.innerHTML = html;
        
        // Add click handlers
        this.elements.partsList.querySelectorAll('.part-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const panelId = e.currentTarget.dataset.panelId;
                this.selectPanel(panelId);
            });
        });
    }
    
    /**
     * Update materials summary
     */
    updateMaterials() {
        if (!this.app.cabinet) return;
        
        const panels = this.app.cabinet.getPanels();
        
        // Calculate material usage
        const materials = {
            'ЛДСП 16мм': 0,
            'ХДФ 3мм': 0,
            'МДФ 16мм': 0
        };
        
        panels.forEach(panel => {
            const area = (panel.dimensions.width * panel.dimensions.height) / 1000000; // to m²
            const materialName = panel.material?.name || 'ЛДСП 16мм';
            
            if (materials.hasOwnProperty(materialName)) {
                materials[materialName] += area;
            }
        });
        
        // Update display
        if (this.elements.materialsList) {
            let html = '';
            for (const [name, area] of Object.entries(materials)) {
                html += `
                    <div class="material-item">
                        <span class="material-name">${name}:</span>
                        <span class="material-value">${area.toFixed(3)} м²</span>
                    </div>
                `;
            }
            this.elements.materialsList.innerHTML = html;
        }
    }
    
    /**
     * Update history buttons
     */
    updateHistoryButtons() {
        if (!this.app.history) return;
        
        const canUndo = this.app.history.canUndo();
        const canRedo = this.app.history.canRedo();
        
        if (this.elements.undoBtn) {
            this.elements.undoBtn.disabled = !canUndo;
        }
        
        if (this.elements.redoBtn) {
            this.elements.redoBtn.disabled = !canRedo;
        }
    }
    
    /**
     * Select panel
     */
    selectPanel(panelId) {
        // Find panel
        const panels = this.app.cabinet.getPanels();
        const panel = panels.find(p => p.id === panelId);
        
        if (panel) {
            this.app.selectedElement = panel;
            this.updateSelectionInfo(panel);
            
            // Highlight in list
            this.elements.partsList.querySelectorAll('.part-item').forEach(item => {
                item.classList.toggle('selected', item.dataset.panelId === panelId);
            });
            
            // Re-render
            if (this.app.render) {
                this.app.render();
            }
        }
    }
    
    /**
     * Update selection info
     */
    updateSelectionInfo(element) {
        if (!this.elements.selectionInfo) return;
        
        if (element) {
            const name = element.name || element.panelType;
            this.elements.selectionInfo.textContent = `Выбрано: ${name}`;
        } else {
            this.elements.selectionInfo.textContent = 'Нет выбранных элементов';
        }
    }
    
    /**
     * Set status message
     */
    setStatus(message, duration = 3000) {
        if (!this.elements.statusMessage) return;
        
        this.elements.statusMessage.textContent = message;
        
        if (duration > 0) {
            setTimeout(() => {
                this.elements.statusMessage.textContent = 'Готов к работе';
            }, duration);
        }
    }
}