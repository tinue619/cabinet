/**
 * 🎨 ЕДИНЫЙ 2D ДВИЖОК РЕНДЕРИНГА ПАНЕЛЕЙ
 * Архитектурное решение: ОДИН движок вместо 4+ разных рендереров
 * ОТВЕТСТВЕННОСТЬ: ТОЛЬКО отрисовка панелей - ничего больше
 */

"use strict";

/**
 * 🎨 УНИВЕРСАЛЬНЫЙ 2D РЕНДЕРЕР ПАНЕЛЕЙ
 * Единственный источник логики отрисовки панелей во всей системе
 */
export class Universal2DPanelEngine {
    
    constructor() {
        // 🔒 Константы рендеринга - ЕДИНЫЕ для всей системы
        this.CONSTANTS = Object.freeze({
            PANEL_THICKNESS_MM: 16,           // реальная толщина панели в мм
            MIN_THICKNESS_PX: 1,              // минимум для видимости
            MAX_THICKNESS_PX: 8,              // максимум для красоты
            MIN_STROKE_WIDTH: 0.5,            // минимальная обводка
            DEFAULT_STROKE_WIDTH: 1,          // стандартная обводка
        });
        
        // 🎨 Цвета панелей - ЕДИНЫЕ для всей системы
        this.COLORS = Object.freeze({
            LDSP: '#e8e3d9',                  // цвет ЛДСП
            LDSP_STROKE: '#b8b0a0',           // обводка ЛДСП
            HDF: '#f5f1e8',                   // цвет ХДФ
            HDF_STROKE: '#d4c5a0',            // обводка ХДФ
            MDF: '#f0e6d2',                   // цвет МДФ
            MDF_STROKE: '#c8b896',            // обводка МДФ
            INTERIOR: '#fafafa',              // фон интерьера
            OUTLINE: '#2c3e50'                // внешний контур
        });
        
        Object.freeze(this);
    }
    
    // ===============================================
    // 🎯 ОСНОВНЫЕ МЕТОДЫ РЕНДЕРИНГА
    // ===============================================
    
    /**
     * 🔧 Вычисление ПРАВИЛЬНОЙ толщины торца панели
     * ЕДИНСТВЕННОЕ место во всей системе где это вычисляется
     */
    calculatePanelThickness(scale) {
        const realThickness = this.CONSTANTS.PANEL_THICKNESS_MM * scale;
        
        // 🎯 КЛЮЧЕВАЯ ФОРМУЛА - ИСПРАВЛЯЕТ ПРОБЛЕМУ ТОЛСТЫХ ТОРЦОВ:
        return Math.max(
            this.CONSTANTS.MIN_THICKNESS_PX,
            Math.min(realThickness, this.CONSTANTS.MAX_THICKNESS_PX)
        );
    }
    
    /**
     * 🖊️ Вычисление толщины обводки
     */
    calculateStrokeWidth(baseWidth, scale) {
        return Math.max(this.CONSTANTS.MIN_STROKE_WIDTH, baseWidth / scale);
    }
    
    /**
     * 🏗️ Отрисовка прямоугольной панели (вид спереди)
     * ЕДИНСТВЕННЫЙ метод для рендеринга панелей
     */
    renderPanel(ctx, panel, scale, offset = {x: 0, y: 0}) {
        const { x, y, width, height } = panel;
        const offsetX = offset.x || 0;
        const offsetY = offset.y || 0;
        
        // Вычисляем ПРАВИЛЬНУЮ толщину
        const thickness = this.calculatePanelThickness(scale);
        const strokeWidth = this.calculateStrokeWidth(this.CONSTANTS.DEFAULT_STROKE_WIDTH, scale);
        
        ctx.save();
        
        // Основная заливка панели
        ctx.fillStyle = this.COLORS.LDSP;
        ctx.fillRect(offsetX + x, offsetY + y, width, height);
        
        // Обводка панели
        ctx.strokeStyle = this.COLORS.LDSP_STROKE;
        ctx.lineWidth = strokeWidth;
        ctx.strokeRect(offsetX + x, offsetY + y, width, height);
        
        ctx.restore();
    }
    
    /**
     * 🏠 Отрисовка шкафа - РЕАЛЬНЫЕ ПРОПОРЦИИ как в жизни
     * Торцы панелей РЕАЛЬНО 16мм в масштабе, но выглядят правильно
     */
    renderCabinet(ctx, dimensions, scale, offset = {x: 0, y: 0}) {
        const { width, height, depth, baseHeight = 100 } = dimensions;
        const offsetX = offset.x || 0;
        const offsetY = offset.y || 0;
        
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        const scaledBaseHeight = baseHeight * scale;
        
        // РЕАЛЬНАЯ толщина панели 16мм в масштабе
        const panelThickness = 16 * scale;
        
        ctx.save();
        
        // 1. Фон интерьера (светлый)
        ctx.fillStyle = this.COLORS.INTERIOR;
        ctx.fillRect(offsetX, offsetY, scaledWidth, scaledHeight);
        
        // 2. РЕАЛЬНЫЕ торцы панелей 16мм (пропорционально)
        ctx.fillStyle = this.COLORS.LDSP;
        ctx.strokeStyle = this.COLORS.LDSP_STROKE;
        ctx.lineWidth = 1;
        
        // Левая боковина (РЕАЛЬНО 16мм)
        ctx.fillRect(offsetX, offsetY, panelThickness, scaledHeight);
        ctx.strokeRect(offsetX, offsetY, panelThickness, scaledHeight);
        
        // Правая боковина (РЕАЛЬНО 16мм)
        ctx.fillRect(offsetX + scaledWidth - panelThickness, offsetY, panelThickness, scaledHeight);
        ctx.strokeRect(offsetX + scaledWidth - panelThickness, offsetY, panelThickness, scaledHeight);
        
        // Верхняя панель (РЕАЛЬНО 16мм)
        ctx.fillRect(offsetX + panelThickness, offsetY, scaledWidth - 2 * panelThickness, panelThickness);
        ctx.strokeRect(offsetX + panelThickness, offsetY, scaledWidth - 2 * panelThickness, panelThickness);
        
        // Нижняя панель (дно) - НА цоколях, а не под ними!
        const bottomY = offsetY + scaledHeight - scaledBaseHeight;
        ctx.fillRect(offsetX + panelThickness, bottomY, scaledWidth - 2 * panelThickness, panelThickness);
        ctx.strokeRect(offsetX + panelThickness, bottomY, scaledWidth - 2 * panelThickness, panelThickness);
        
        // 3. Цоколь (отдельная зона) - в самом низу
        const baseLineY = offsetY + scaledHeight - scaledBaseHeight;
        ctx.fillStyle = '#e8e3d9';
        ctx.fillRect(offsetX + panelThickness, baseLineY + panelThickness, scaledWidth - 2 * panelThickness, scaledBaseHeight - panelThickness);
        
        // Контур цоколя
        ctx.strokeStyle = '#b8b0a0';
        ctx.strokeRect(offsetX + panelThickness, baseLineY + panelThickness, scaledWidth - 2 * panelThickness, scaledBaseHeight - panelThickness);
        
        // 4. БЕЗ внешнего контура - только торцы панелей
        // ctx.strokeStyle = '#333333';
        // ctx.lineWidth = 2;
        // ctx.strokeRect(offsetX, offsetY, scaledWidth, scaledHeight);
        
        ctx.restore();
    }
    
    /**
     * 📏 Автоматическое масштабирование для вписывания в контейнер
     */
    calculateFitScale(containerSize, cabinetSize, padding = 60) {
        const availableWidth = containerSize.width - padding * 2;
        const availableHeight = containerSize.height - padding * 2;
        
        const scaleX = availableWidth / cabinetSize.width;
        const scaleY = availableHeight / cabinetSize.height;
        
        return Math.min(scaleX, scaleY, 1.5); // максимум 150%
    }
    
    /**
     * 📐 Центрирование в контейнере
     */
    calculateCenterOffset(containerSize, cabinetSize, scale) {
        const scaledWidth = cabinetSize.width * scale;
        const scaledHeight = cabinetSize.height * scale;
        
        return {
            x: (containerSize.width - scaledWidth) / 2,
            y: (containerSize.height - scaledHeight) / 2
        };
    }
    
    /**
     * 🎨 Полный рендер шкафа с автоматическим масштабированием
     * ЗАМЕНЯЕТ все существующие методы render()
     */
    renderFullCabinet(canvas, cabinetData) {
        const ctx = canvas.getContext('2d');
        const containerSize = {
            width: canvas.clientWidth,
            height: canvas.clientHeight
        };
        
        // Очищаем canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Вычисляем масштаб и позицию
        const scale = this.calculateFitScale(containerSize, cabinetData.dimensions);
        const offset = this.calculateCenterOffset(containerSize, cabinetData.dimensions, scale);
        
        // Рендерим шкаф
        this.renderCabinet(ctx, cabinetData.dimensions, scale, offset);
        
        // Рендерим размеры
        this.renderDimensions(ctx, cabinetData.dimensions, scale, offset);
    }
    
    /**
     * 📏 Отрисовка размеров
     */
    renderDimensions(ctx, dimensions, scale, offset) {
        ctx.save();
        
        ctx.fillStyle = '#666';
        ctx.font = `${Math.max(10, 12 / scale)}px Arial`;
        ctx.textAlign = 'center';
        
        // Ширина (сверху)
        const topY = offset.y - 15;
        const centerX = offset.x + (dimensions.width * scale) / 2;
        ctx.fillText(`${dimensions.width}мм`, centerX, topY);
        
        // Высота (слева)
        const leftX = offset.x - 15;
        const centerY = offset.y + (dimensions.height * scale) / 2;
        ctx.save();
        ctx.translate(leftX, centerY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${dimensions.height}мм`, 0, 0);
        ctx.restore();
        
        ctx.restore();
    }
}

// ===============================================
// 🏭 СИНГЛТОН ЭКСПОРТ
// ===============================================

// Создаем единственный экземпляр
const panelEngine = new Universal2DPanelEngine();

export { panelEngine as PanelEngine };
export default panelEngine;

console.log('🎨 Universal2DPanelEngine loaded - ЕДИНЫЙ движок рендеринга панелей');
