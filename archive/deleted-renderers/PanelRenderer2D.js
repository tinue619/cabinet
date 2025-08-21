/**
 * 🎨 НОВЫЙ Panel Renderer 2D для cabinet-app
 * Использует единый Universal2DPanelEngine
 * Заменяет сложный старый код простым адаптером
 */

import PanelEngine from '../../../Universal2DPanelEngine.js';

export class PanelRenderer2D {
    
    constructor(canvasElement, options = {}) {
        if (!canvasElement) {
            throw new Error('PanelRenderer2D requires canvas element');
        }
        
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.options = options;
        
        console.log('🎨 PanelRenderer2D использует единый движок');
    }
    
    initialize() {
        this._setupCanvas();
        console.log('🎨 PanelRenderer2D initialized with unified engine');
    }
    
    /**
     * 🎯 ГЛАВНЫЙ МЕТОД - теперь просто вызывает единый движок
     */
    render(cabinetData, renderOptions = {}) {
        if (!cabinetData || !cabinetData.panels) {
            console.warn('PanelRenderer2D.render: no panels data');
            return;
        }
        
        // Преобразуем данные в формат движка
        const renderData = {
            dimensions: cabinetData.dimensions || {
                width: 800,
                height: 2000,
                depth: 600
            }
        };
        
        // ✨ ЕДИНЫЙ ДВИЖОК ДЕЛАЕТ ВСЮ РАБОТУ!
        PanelEngine.renderFullCabinet(this.canvas, renderData);
        
        // Уведомляем о завершении
        this._emit('render-complete', {
            panelsCount: cabinetData.panels.length,
            dimensions: renderData.dimensions
        });
    }
    
    setTransform(transform) {
        // Единый движок автоматически управляет трансформациями
        this._emit('transform-changed', { transform });
    }
    
    fitToView(cabinetDimensions) {
        // Единый движок автоматически масштабирует по размеру
        console.log('fitToView: единый движок автоматически масштабирует');
    }
    
    resize() {
        this._setupCanvas();
        this._emit('canvas-resized', { 
            width: this.canvas.clientWidth, 
            height: this.canvas.clientHeight 
        });
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Событийная система (упрощенная)
    on(eventName, callback) {
        if (!this._callbacks) this._callbacks = new Map();
        if (!this._callbacks.has(eventName)) {
            this._callbacks.set(eventName, []);
        }
        this._callbacks.get(eventName).push(callback);
    }
    
    off(eventName, callback) {
        if (!this._callbacks || !this._callbacks.has(eventName)) return;
        const callbacks = this._callbacks.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
    }
    
    destroy() {
        if (this._callbacks) this._callbacks.clear();
    }
    
    // Приватные методы
    _setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }
    
    _emit(eventName, data) {
        if (!this._callbacks || !this._callbacks.has(eventName)) return;
        this._callbacks.get(eventName).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`PanelRenderer2D event error:`, error);
            }
        });
    }
    
    // Статические методы для совместимости
    static createForCanvas(canvasId, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error(`Canvas element with ID '${canvasId}' not found`);
        }
        
        const renderer = new PanelRenderer2D(canvas, options);
        renderer.initialize();
        return renderer;
    }
    
    static getInfo() {
        return Object.freeze({
            name: 'PanelRenderer2D',
            version: '2.0.0',
            responsibility: 'Adapter to Universal2DPanelEngine',
            engine: 'Universal2DPanelEngine',
            dependencies: 'Universal2DPanelEngine only'
        });
    }
}

console.log('🎨 PanelRenderer2D v2.0 loaded - unified engine adapter');
