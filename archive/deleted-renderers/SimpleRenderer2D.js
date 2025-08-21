// 🎯 НОВЫЙ АДАПТЕР ДЛЯ ЕДИНОГО ДВИЖКА
// Заменяет старый SimpleRenderer2D.js
// ОТВЕТСТВЕННОСТЬ: Только простая адаптация к единому движку

import PanelEngine from '../../Universal2DPanelEngine.js';

export class SimpleRenderer2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
        
        console.log('🎯 SimpleRenderer2D теперь использует единый движок');
    }

    setupCanvas() {
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    render(cabinetData) {
        console.log('🔍 Данные для рендера:', cabinetData);
        
        // 🔧 Получаем данные от адаптера
        let dimensions = null;
        
        if (cabinetData && cabinetData.panels && cabinetData.data) {
            // Новый формат через адаптер
            dimensions = cabinetData.data.dimensions;
        } else if (cabinetData && cabinetData.dimensions) {
            // Прямые размеры
            dimensions = cabinetData.dimensions;
        } else {
            // Дефолтные размеры
            dimensions = { width: 800, height: 2000, depth: 600 };
        }

        if (!dimensions) {
            console.log('❌ Нет данных размеров для рендера');
            this.renderEmpty();
            return;
        }

        console.log('📏 Размеры шкафа:', dimensions);

        // ✨ МАГИЯ: единый движок делает ВСЮ работу!
        PanelEngine.renderFullCabinet(this.canvas, { dimensions });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderEmpty() {
        this.clear();
        this.ctx.fillStyle = '#999';
        this.ctx.font = '16px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Создайте шкаф', this.canvas.width / 2, this.canvas.height / 2);
    }
}
