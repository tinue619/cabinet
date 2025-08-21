/**
 * 3D Renderer
 * Отрисовка шкафа в 3D (изометрическая проекция)
 */

export class Renderer3D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        
        this.colors = {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            front: '#f8f9fa',
            top: 'rgba(248, 249, 250, 0.9)',
            side: 'rgba(248, 249, 250, 0.7)',
            stroke: '#2c3e50',
            shadow: 'rgba(0, 0, 0, 0.1)'
        };
        
        // Углы изометрической проекции
        this.angleX = Math.PI / 6; // 30 градусов
        this.angleY = Math.PI / 6;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    /**
     * Изменить размер canvas
     */
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    /**
     * Очистить canvas
     */
    clear() {
        const ctx = this.ctx;
        
        // Градиентный фон
        const gradient = ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Установить трансформацию
     */
    setTransform(scale, offset) {
        this.scale = scale;
        this.offset = offset;
    }
    
    /**
     * Преобразование координат в изометрию
     */
    toIsometric(x, y, z) {
        return {
            x: (x - z) * Math.cos(this.angleX),
            y: y + (x + z) * Math.sin(this.angleY) / 2
        };
    }
    
    /**
     * Отрисовать шкаф
     */
    render(cabinetData) {
        if (!cabinetData || !cabinetData.dimensions) return;
        
        const ctx = this.ctx;
        ctx.save();
        
        // Центрируем и применяем трансформацию
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offset.x, this.offset.y);
        
        // Рисуем 3D шкаф
        this.drawCabinet3D(cabinetData);
        
        ctx.restore();
    }
    
    /**
     * Нарисовать шкаф в 3D
     */
    drawCabinet3D(cabinetData) {
        const ctx = this.ctx;
        const dims = cabinetData.dimensions;
        
        // Размеры
        const w = dims.width;
        const h = dims.height;
        const d = dims.depth;
        
        // Вычисляем вершины в изометрии
        const vertices = {
            // Передняя грань
            frontTopLeft: this.toIsometric(0, 0, d),
            frontTopRight: this.toIsometric(w, 0, d),
            frontBottomRight: this.toIsometric(w, h, d),
            frontBottomLeft: this.toIsometric(0, h, d),
            
            // Задняя грань
            backTopLeft: this.toIsometric(0, 0, 0),
            backTopRight: this.toIsometric(w, 0, 0),
            backBottomRight: this.toIsometric(w, h, 0),
            backBottomLeft: this.toIsometric(0, h, 0)
        };
        
        // Рисуем грани в правильном порядке (задние первыми)
        
        // Задняя грань (не видна)
        // this.drawFace(ctx, [
        //     vertices.backTopLeft,
        //     vertices.backTopRight,
        //     vertices.backBottomRight,
        //     vertices.backBottomLeft
        // ], this.colors.side);
        
        // Левая грань
        this.drawFace(ctx, [
            vertices.backTopLeft,
            vertices.frontTopLeft,
            vertices.frontBottomLeft,
            vertices.backBottomLeft
        ], this.colors.side);
        
        // Нижняя грань
        this.drawFace(ctx, [
            vertices.frontBottomLeft,
            vertices.frontBottomRight,
            vertices.backBottomRight,
            vertices.backBottomLeft
        ], this.colors.side);
        
        // Правая грань
        this.drawFace(ctx, [
            vertices.frontTopRight,
            vertices.backTopRight,
            vertices.backBottomRight,
            vertices.frontBottomRight
        ], this.colors.top);
        
        // Верхняя грань
        this.drawFace(ctx, [
            vertices.backTopLeft,
            vertices.backTopRight,
            vertices.frontTopRight,
            vertices.frontTopLeft
        ], this.colors.top);
        
        // Передняя грань
        this.drawFace(ctx, [
            vertices.frontTopLeft,
            vertices.frontTopRight,
            vertices.frontBottomRight,
            vertices.frontBottomLeft
        ], this.colors.front);
        
        // Рисуем панели на передней грани
        if (cabinetData.panels) {
            this.drawPanels3D(cabinetData.panels, vertices);
        }
    }
    
    /**
     * Нарисовать грань
     */
    drawFace(ctx, points, color) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.closePath();
        
        // Заливка
        ctx.fillStyle = color;
        ctx.fill();
        
        // Обводка
        ctx.strokeStyle = this.colors.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    /**
     * Нарисовать панели в 3D
     */
    drawPanels3D(panels, vertices) {
        const ctx = this.ctx;
        
        // Упрощенная отрисовка - показываем разделители на передней грани
        panels.forEach(panel => {
            if (panel.type === 'VERTICAL' && panel.position) {
                // Вертикальная панель (стойка)
                const x = panel.position.x || 0;
                const top = this.toIsometric(x, 0, 600);
                const bottom = this.toIsometric(x, 2000, 600);
                
                ctx.strokeStyle = this.colors.stroke;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(top.x, top.y);
                ctx.lineTo(bottom.x, bottom.y);
                ctx.stroke();
                
            } else if (panel.type === 'HORIZONTAL' && panel.position) {
                // Горизонтальная панель (полка)
                const y = panel.position.y || 0;
                const left = this.toIsometric(0, y, 600);
                const right = this.toIsometric(800, y, 600);
                
                ctx.strokeStyle = this.colors.stroke;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(left.x, left.y);
                ctx.lineTo(right.x, right.y);
                ctx.stroke();
            }
        });
    }
    
    /**
     * Подсветить элемент
     */
    highlightElement(element) {
        // TODO: Реализовать подсветку выбранного элемента в 3D
    }
    
    /**
     * Подсветить hover элемент
     */
    hoverElement(element) {
        // TODO: Реализовать подсветку при наведении в 3D
    }
}