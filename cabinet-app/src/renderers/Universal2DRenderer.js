/**
 * 🎨 ЕДИНЫЙ УНИВЕРСАЛЬНЫЙ 2D РЕНДЕРЕР
 * 
 * Слой: Infrastructure (адаптер для UI)
 * Ответственность: ТОЛЬКО адаптация единого движка к разным UI
 * 
 * ЗАМЕНЯЕТ:
 * - Renderer2D.js
 * - PanelRenderer2D.js  
 * - CabinetRenderer2D.js
 * - SimpleRenderer2D.js
 */

import { Universal2DPanelEngine } from '../infrastructure/Universal2DPanelEngine.js';

export class Universal2DRenderer {
    
    constructor(canvas, options = {}) {
        if (!canvas) {
            throw new Error('Universal2DRenderer: canvas is required');
        }
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.engine = new Universal2DPanelEngine();
        this._eventCallbacks = new Map();
        
        this._setupCanvas();
        window.addEventListener('resize', () => this._setupCanvas());
        
        console.log('🎨 Universal2DRenderer initialized');
    }
    
    render(cabinetData) {
        if (!cabinetData) {
            this._renderEmpty();
            return;
        }
        
        const renderData = this._normalizeData(cabinetData);
        this.engine.renderFullCabinet(this.canvas, renderData);
        this._emit('render-complete', renderData);
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    on(eventName, callback) {
        if (!this._eventCallbacks.has(eventName)) {
            this._eventCallbacks.set(eventName, []);
        }
        this._eventCallbacks.get(eventName).push(callback);
        return this;
    }
    
    destroy() {
        this._eventCallbacks.clear();
    }
    
    _setupCanvas() {
        const container = this.canvas.parentElement;
        if (!container) return;
        
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
    }
    
    _normalizeData(input) {
        if (input.dimensions) return { dimensions: input.dimensions };
        if (input.data?.dimensions) return { dimensions: input.data.dimensions };
        return { dimensions: { width: 800, height: 2000, depth: 600 } };
    }
    
    _renderEmpty() {
        this.clear();
        this.ctx.fillStyle = '#999';
        this.ctx.font = '16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Создайте шкаф', this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
    }
    
    _emit(eventName, data) {
        const callbacks = this._eventCallbacks.get(eventName);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Event error:`, error);
                }
            });
        }
    }
}
