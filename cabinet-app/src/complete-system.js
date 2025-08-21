/**
 * ✅ ИНТЕРАКТИВНАЯ СИСТЕМА - ПОЛНАЯ ВЕРСИЯ
 * Application Layer - Interactive Cabinet Designer
 */

// 🧩 МИКРОКОМПОНЕНТЫ - Single Responsibility
import { ZoomControl } from './components/controls/ZoomControl.js';
import { DimensionInput } from './components/controls/DimensionInput.js';
import { Universal2DRenderer } from './renderers/Universal2DRenderer.js';
// import { MaterialSelector } from './components/controls/MaterialSelector.js'; // TODO: потом для фасадов

class CabinetDesignerApp {
    constructor() {
        // App state
        this.cabinet = null;
        this.currentMode = '2D';
        this.history = [];
        this.historyIndex = -1;
        
        // 🧩 Микрокомпоненты
        this.zoomControl = null;
        this.dimensionInput = null;
        this.universal2DRenderer = null;
        // this.materialSelector = null; // TODO: потом для фасадов
        this.canvas = null;
        
        console.log('🚀 CabinetDesignerApp initializing...');
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            // Load core system
            console.log('📦 Loading core system...');
            const coreModule = await import('../../new_core/index.js');
            const { SystemFactory } = coreModule;
            
            // Create system
            this.system = SystemFactory.create({
                enableEvents: true,
                enableValidation: true,
                debugMode: true
            });
            
            console.log('✅ Core system loaded');
            
            // 🧩 Инициализация микрокомпонентов
            this.canvas = document.getElementById('cabinet-canvas');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }
            
            // 🔍 Микрокомпонент: Зум
            this.zoomControl = ZoomControl.createForCanvas('cabinet-canvas');
            
            // 📏 Микрокомпонент: Габариты
            this.dimensionInput = DimensionInput.createForContainer('dimension-input-container', {
                width: 800,
                height: 2000,
                depth: 600,
                baseHeight: 100
            });
            
            // 🎨 Микрокомпонент: Универсальный 2D рендерер
            this.universal2DRenderer = new Universal2DRenderer(this.canvas, {
                showPanelLabels: true,
                showDimensions: true,
                showGrid: false
            });
            
            // 🧱 MaterialSelector пока не нужен - материалы автоматические
            
            console.log('✅ Микрокомпоненты созданы');
            
            // 🔗 Подписываемся на события микрокомпонентов
            this.setupMicroComponentEvents();
            
            // Create initial cabinet
            await this.createInitialCabinet();
            
            // Bind window events
            this.bindWindowEvents();
            
            console.log('🎉 CabinetDesignerApp initialized successfully!');
            
            // Notify ready
            window.dispatchEvent(new CustomEvent('cabinet-app-ready', {
                detail: { 
                    message: 'Interactive cabinet designer ready',
                    features: ['2D/3D rendering', 'Real-time editing', 'Interactive UI']
                }
            }));
            
        } catch (error) {
            console.error('❌ Failed to initialize CabinetDesignerApp:', error);
            window.dispatchEvent(new CustomEvent('cabinet-app-error', {
                detail: { message: `Initialization failed: ${error.message}` }
            }));
        }
    }
    
    /**
     * 🔗 Настройка событий микрокомпонентов
     */
    setupMicroComponentEvents() {
        // 🔍 События зума
        this.zoomControl.on('zoom-changed', (data) => {
            console.log('🔍 Zoom changed:', data.newZoom);
            this.render();
        });
        
        // 📏 События габаритов
        this.dimensionInput.on('dimensions-changed', (data) => {
            console.log('📏 Dimensions changed:', data.newDimensions);
            this.updateCabinetDimensions(data.newDimensions);
        });
        
        // 🎨 События 2D рендера
        this.universal2DRenderer.on('render-complete', (data) => {
            console.log('🎨 2D render complete:', data.panelsCount, 'panels');
        });
        
        // 🧱 MaterialSelector пока отключен - материалы автоматические
        
        console.log('🔗 Микрокомпоненты подключены к системе');
    }
    
    /**
     * Create initial cabinet
     */
    async createInitialCabinet() {
        console.log('🏗️ Creating initial cabinet...');
        
        // Create materials
        const ldsp16 = this.system.createLDSP16();
        const hdf3 = this.system.createHDF3();
        const mdf16 = this.system.createMDF16();
        
        // Create cabinet
        this.cabinet = this.system.createCabinet({
            width: 800,
            height: 2000,
            depth: 600,
            baseHeight: 100
        });
        
        // Generate complete cabinet
        this.cabinet.generate();
        
        console.log('✅ Initial cabinet created');
        
        // 🧱 MaterialSelector отключен - материалы автоматические (ЛДСП + ХДФ)
        
        // 🔄 Обновляем микрокомпоненты
        this.updateMicroComponents();
        this.render();
        
        // Save to history
        this.saveToHistory('Initial cabinet created');
    }
    
    /**
     * Update cabinet dimensions
     */
    updateCabinetDimensions(newDimensions) {
        console.log('📐 Updating cabinet dimensions:', newDimensions);
        
        try {
            // Create new cabinet with new dimensions
            const newCabinet = this.system.createCabinet(newDimensions);
            newCabinet.generate();
            
            // Replace current cabinet
            this.cabinet = newCabinet;
            
            // 🔄 Обновляем микрокомпоненты
            this.updateMicroComponents();
            this.render();
            
            // Save to history
            this.saveToHistory(`Dimensions updated: ${newDimensions.width}×${newDimensions.height}×${newDimensions.depth}`);
            
            console.log('✅ Cabinet dimensions updated successfully');
            
        } catch (error) {
            console.error('❌ Failed to update dimensions:', error);
            throw error;
        }
    }
    
    /**
     * Set rendering mode
     */
    setMode(mode) {
        console.log('🔄 Switching to', mode, 'mode');
        
        this.currentMode = mode;
        // TODO: Обновить когда создадим микрокомпонент рендера
        
        this.render();
    }
    
    /**
     * Render the cabinet
     * ✅ Используем PanelRenderer2D микрокомпонент
     */
    render() {
        if (!this.cabinet) return;
        
        // 🎨 Используем PanelRenderer2D для отрисовки
        const cabinetData = {
            dimensions: this.cabinet.dimensions,
            panels: this.cabinet.getPanels(),
            sections: this.cabinet.getSections(),
            stats: this.cabinet.getStats()
        };
        
        // Рендерим через универсальный рендерер
        this.universal2DRenderer.render(cabinetData);
        
        console.log('🎨 Rendered cabinet via PanelRenderer2D:', {
            dimensions: cabinetData.dimensions,
            panelsCount: cabinetData.panels.length,
            sectionsCount: cabinetData.sections.length
        });
    }
    
    /**
     * 🔄 Обновление микрокомпонентов
     */
    updateMicroComponents() {
        if (!this.cabinet) return;
        
        // 📏 Обновляем ввод габаритов
        if (this.dimensionInput) {
            this.dimensionInput.setDimensions(this.cabinet.dimensions);
        }
        
        // 🔍 Обновляем зум (по размерам шкафа)
        if (this.zoomControl && this.canvas) {
            const cabinetBounds = {
                width: this.cabinet.dimensions.width,
                height: this.cabinet.dimensions.height
            };
            this.zoomControl.fitToView(cabinetBounds);
        }
        
        // 🎨 Обновляем 2D рендерер (по размерам шкафа)
        if (this.universal2DRenderer) {
            // Universal2DRenderer автоматически масштабируется
        }
        
        console.log('🔄 Микрокомпоненты обновлены');
    }
    
    /**
     * Select element (panel or section)
     * TODO: Создать микрокомпонент выбора
     */
    selectElement(element) {
        console.log('🎯 Selected element:', element.name || element.id);
        
        // TODO: Обновить когда создадим микрокомпонент выбора
        
        this.render();
    }
    
    /**
     * Save state to history
     */
    saveToHistory(description) {
        // Remove any history after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new state
        const state = {
            description,
            timestamp: Date.now(),
            cabinetData: this.cabinet ? this.cabinet.serialize() : null
        };
        
        this.history.push(state);
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
        
        console.log('💾 Saved to history:', description);
    }
    
    /**
     * Bind window events
     */
    bindWindowEvents() {
        // Window resize
        window.addEventListener('resize', () => {
            // 🎨 Обновляем 2D рендерер при изменении размера окна
            if (this.universal2DRenderer) {
                this.universal2DRenderer.resize();
            }
        });
        
        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        console.log('↶ Undo (not implemented)');
                        break;
                    case 'y':
                        e.preventDefault();
                        console.log('↷ Redo (not implemented)');
                        break;
                    case '1':
                        e.preventDefault();
                        this.setMode('2D');
                        break;
                    case '2':
                        e.preventDefault();
                        this.setMode('3D');
                        break;
                }
            }
            
            // Escape to clear selection
            if (e.key === 'Escape') {
                // TODO: Обновить когда создадим микрокомпонент выбора
                console.log('❌ Clear selection');
            }
        });
        
        console.log('⌨️ Keyboard shortcuts enabled');
    }
}

// Start the application
console.log('🚀 Starting interactive cabinet designer...');
const app = new CabinetDesignerApp();
app.init()
    .catch(error => {
        console.error('❌ INTERACTIVE SYSTEM FAILED:', error);
        
        window.dispatchEvent(new CustomEvent('cabinet-app-error', {
            detail: { 
                message: `Interactive system failed: ${error.message}`,
                stack: error.stack
            }
        }));
    });

// Export for access from HTML
window.CabinetDesignerApp = app;
