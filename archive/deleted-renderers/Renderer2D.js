/**
 * 🎨 НОВЫЙ 2D Renderer для cabinet-app
 * Использует единый Universal2DPanelEngine
 * Заменяет старый дублированный код
 */

import PanelEngine from '../../../Universal2DPanelEngine.js';

export class Renderer2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        console.log('🎨 Renderer2D использует единый движок');
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    setTransform(scale, offset) {
        this.scale = scale;
        this.offset = offset;
        // Единый движок автоматически управляет трансформациями
    }
    
    /**
     * 🎯 ГЛАВНЫЙ МЕТОД - теперь просто вызывает единый движок
     */
    render(cabinetData) {
        if (!cabinetData) {
            this.clear();
            return;
        }
        
        // Преобразуем данные в нужный формат
        const renderData = {
            dimensions: cabinetData.dimensions || {
                width: 800,
                height: 2000, 
                depth: 600,
                baseHeight: 100
            }
        };
        
        // ✨ ЕДИНЫЙ ДВИЖОК ДЕЛАЕТ ВСЮ РАБОТУ!
        PanelEngine.renderFullCabinet(this.canvas, renderData);
    }
    
    // Устаревшие методы для совместимости
    drawGrid() { /* единый движок не нуждается в сетке */ }
    drawCabinet() { /* заменено на PanelEngine.renderCabinet */ }
    drawPanel() { /* заменено на PanelEngine.renderPanel */ }
    drawSection() { /* пока не реализовано в движке */ }
    drawDimensions() { /* единый движок рисует размеры автоматически */ }
    highlightElement() { /* пока не реализовано */ }
    hoverElement() { /* пока не реализовано */ }
}
