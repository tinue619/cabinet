// 🎨 НОВЫЙ АДАПТЕР ДЛЯ ЕДИНОГО ДВИЖКА
// Заменяет старый CabinetRenderer2D.js
// ОТВЕТСТВЕННОСТЬ: Только адаптация к единому движку

import PanelEngine from '../../Universal2DPanelEngine.js';

/**
 * 🎨 Адаптер для CabinetRenderer2D
 * Использует единый Universal2DPanelEngine
 */
export class CabinetRenderer2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
        
        console.log('🎨 CabinetRenderer2D теперь использует единый движок');
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            const dpr = window.devicePixelRatio || 1;
            
            this.canvas.width = container.clientWidth * dpr;
            this.canvas.height = container.clientHeight * dpr;
            this.canvas.style.width = container.clientWidth + 'px';
            this.canvas.style.height = container.clientHeight + 'px';
            
            this.ctx.scale(dpr, dpr);
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // 🎯 ЕДИНСТВЕННЫЙ МЕТОД - все остальное делает движок
    render(cabinetData) {
        if (!cabinetData || !cabinetData.data?.dimensions) {
            this.renderEmptyState();
            return;
        }

        // ✨ МАГИЯ: просто вызываем единый движок!
        PanelEngine.renderFullCabinet(this.canvas, {
            dimensions: cabinetData.data.dimensions
        });
        
        console.log('🎨 Рендер через единый движок:', cabinetData.data.dimensions);
    }

    renderEmptyState() {
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;
        
        this.ctx.fillStyle = '#999999';
        this.ctx.font = '16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Создайте шкаф для просмотра', centerX, centerY);
    }
    
    // Совместимость со старым API
    setZoom(zoom) { /* единый движок автоматически масштабирует */ }
    setOffset(x, y) { /* единый движок автоматически центрирует */ }
    resetView() { /* единый движок сам управляет видом */ }
}
