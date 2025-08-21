// 🚀 ЛЕГКОВЕСНЫЙ АДАПТЕР ДЛЯ БЫСТРОЙ ОТРИСОВКИ
// Domain Layer: Создает облегченное представление данных для UI

"use strict";

/**
 * 🚀 ЛЕГКОВЕСНЫЙ АДАПТЕР ШКАФА
 * Создает оптимизированное представление для быстрой отрисовки
 * НЕ заменяет основную архитектуру, а дополняет ее
 */
export class LightweightCabinetAdapter {
    
    /**
     * 📦 Создание легковесного представления из полного шкафа
     * @param {Cabinet} cabinet - Полный объект шкафа
     * @returns {Object} Оптимизированные данные для отрисовки
     */
    static createLightweightRepresentation(cabinet) {
        if (!cabinet || !cabinet.isGenerated) {
            throw new Error('Cabinet must be generated before creating lightweight representation');
        }
        
        // Получаем размеры один раз
        const dimensions = cabinet.dimensions;
        const materialThickness = cabinet.materialThickness;
        
        // Создаем простой объект с панелями
        const panels = cabinet.getPanels().map(panel => {
            console.log('🔍 Creating lightweight panel:', {
                key: panel.key,
                name: panel.name,
                hasKey: panel.hasOwnProperty('key'),
                type: typeof panel.key,
                panel: panel
            });
            
            return {
                key: panel.key,
                name: panel.name,
                position: {
                    x: panel.position.x,
                    y: panel.position.y,
                    z: panel.position.z
                },
                dimensions: {
                    width: panel.dimensions.width,
                    height: panel.dimensions.height,
                    depth: panel.dimensions.depth
                },
                material: panel.material ? panel.material.name : 'Unknown'
            };
        });
        
        // Получаем секции если есть
        const sections = cabinet.getSections().map(section => ({
            id: section.id,
            bounds: section.bounds ? {
                left: section.bounds.left,
                right: section.bounds.right,
                top: section.bounds.top,
                bottom: section.bounds.bottom
            } : null
        }));
        
        // Возвращаем плоский объект без сложной иерархии
        return Object.freeze({
            dimensions: Object.freeze({
                width: dimensions.width,
                height: dimensions.height,
                depth: dimensions.depth,
                baseHeight: dimensions.baseHeight
            }),
            materialThickness,
            panels: Object.freeze(panels),
            sections: Object.freeze(sections),
            metadata: Object.freeze({
                panelsCount: panels.length,
                sectionsCount: sections.length,
                generatedAt: Date.now()
            })
        });
    }
    
    /**
     * 🎨 ПРОСТАЯ ОТРИСОВКА КАК В v2.0 - БЕЗ ФАСАДА!
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Object} lightweightCabinet 
     * @param {Object} transform - {scale, offsetX, offsetY, onlyFrontBase}
     */
    static renderLightweight(ctx, lightweightCabinet, transform = {}) {
        const { scale = 1, offsetX = 0, offsetY = 0, onlyFrontBase = false } = transform;
        
        console.log('🚀 LightweightCabinetAdapter v3.4 loaded - FIXED VERSION');
        
        // 🎨 Игрушечные цвета по NAME (так как key = undefined)
        const colors = {
            'Боковина левая': '#3498db',
            'Боковина правая': '#9b59b6', 
            'Крыша': '#e74c3c',
            'Дно': '#f39c12',
            'Цоколь передний': '#2ecc71',
            'Цоколь задний': '#34495e',
            'Задняя стенка': '#f1c40f'
        };
        
        // 🏠 ОТРИСОВКА ОБЩЕГО КОНТУРА КАК В v2.0
        const cabinetWidth = lightweightCabinet.dimensions.width * scale;
        const cabinetHeight = lightweightCabinet.dimensions.height * scale;
        
        // Основной контур шкафа
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX, offsetY, cabinetWidth, cabinetHeight);
        
        // 🎨 ФОН ВНУТРИ ШКАФА
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(offsetX, offsetY, cabinetWidth, cabinetHeight);
        
        // ⚡ Отрисовка панелей (с фильтрацией для 2D)
        for (let i = 0; i < lightweightCabinet.panels.length; i++) {
            const panel = lightweightCabinet.panels[i];
            
            // 🎯 ФИЛЬТР ПО NAME ВМЕСТО KEY (так как key = undefined)
            console.log('🔍 Checking panel:', panel.name, 'onlyFrontBase:', onlyFrontBase);
            
            if (onlyFrontBase) {
                // Убираем задние элементы по NAME
                if (panel.name === 'Цоколь задний' || panel.name === 'Задняя стенка' || panel.name === 'Фасад') {
                    console.log('🚫 Skipping panel:', panel.name, '(filtered out by NAME)');
                    continue;
                }
            }
            
            console.log('✅ Rendering panel:', panel.name, 'dimensions:', panel.dimensions);
            
            const x = offsetX + panel.position.x * scale;
            const y = offsetY + panel.position.y * scale;
            const w = panel.dimensions.width * scale;
            const h = panel.dimensions.height * scale;
            
            // 🎨 УЛУЧШЕННОЕ ОТОБРАЖЕНИЕ ТОНКИХ ПАНЕЛЕЙ
            let displayWidth = w;
            let displayHeight = h;
            
            // Для очень тонких панелей увеличиваем минимальные размеры
            const minDisplaySize = 2; // минимум 2px на экране
            if (displayWidth < minDisplaySize) displayWidth = minDisplaySize;
            if (displayHeight < minDisplaySize) displayHeight = minDisplaySize;
            
            // Отрисовка с улучшенными размерами
            ctx.fillStyle = colors[panel.name] || '#bdc3c7';
            ctx.fillRect(x, y, displayWidth, displayHeight);
            
            // Контур с улучшенными размерами
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, displayWidth, displayHeight);
            
            // 🎨 ДОПОЛНИТЕЛЬНАЯ ОКАНТОВКА ПО NAME
            if (panel.name === 'Боковина левая' || panel.name === 'Боковина правая') {
                // 🟦 Боковины - синяя окантовка
                ctx.strokeStyle = '#34495e';
                ctx.lineWidth = 2;
                ctx.strokeRect(x-1, y-1, displayWidth+2, displayHeight+2);
            }
            
            if (panel.name === 'Крыша' || panel.name === 'Дно') {
                // 🟧 Горизонтальные - красная окантовка
                ctx.strokeStyle = '#c0392b';
                ctx.lineWidth = 2;
                ctx.strokeRect(x-1, y-1, displayWidth+2, displayHeight+2);
            }
            
            if (panel.name === 'Цоколь передний') {
                // 🟩 Передний цоколь - зеленая окантовка
                ctx.strokeStyle = '#27ae60';
                ctx.lineWidth = 2;
                ctx.strokeRect(x-1, y-1, displayWidth+2, displayHeight+2);
            }
            
            // 📝 Подпись панели (если панель достаточно большая)
            if (w > 60 && h > 30) {
                ctx.fillStyle = '#2c3e50';
                ctx.font = `${Math.min(12, Math.max(8, w/10))}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const text = panel.name.replace(/\s+/g, ' ');
                ctx.fillText(text, x + w/2, y + h/2);
            }
        }
        
        // 🎨 Отрисовка секций (без пунктира)
        if (lightweightCabinet.sections.length > 0) {
            // 🟦 Основная секция с полупрозрачным фоном
            ctx.fillStyle = 'rgba(74, 158, 255, 0.05)';
            for (let i = 0; i < lightweightCabinet.sections.length; i++) {
                const section = lightweightCabinet.sections[i];
                if (section.bounds) {
                    const bounds = section.bounds;
                    const x = offsetX + bounds.left * scale;
                    const y = offsetY + bounds.top * scale;
                    const w = (bounds.right - bounds.left) * scale;
                    const h = (bounds.bottom - bounds.top) * scale;
                    ctx.fillRect(x, y, w, h);
                }
            }
        }
    }
    
    /**
     * 📊 Автоматический расчет трансформации для canvas
     * @param {Object} lightweightCabinet 
     * @param {number} canvasWidth 
     * @param {number} canvasHeight 
     * @param {number} padding 
     * @returns {Object} {scale, offsetX, offsetY}
     */
    static calculateOptimalTransform(lightweightCabinet, canvasWidth, canvasHeight, padding = 50) {
        const availableWidth = canvasWidth - 2 * padding;
        const availableHeight = canvasHeight - 2 * padding;
        
        const cabinetWidth = lightweightCabinet.dimensions.width;
        const cabinetHeight = lightweightCabinet.dimensions.height;
        
        const scale = Math.min(
            availableWidth / cabinetWidth,
            availableHeight / cabinetHeight
        );
        
        const scaledWidth = cabinetWidth * scale;
        const scaledHeight = cabinetHeight * scale;
        
        const offsetX = (canvasWidth - scaledWidth) / 2;
        const offsetY = (canvasHeight - scaledHeight) / 2;
        
        return { scale, offsetX, offsetY };
    }
}

console.log('🚀 LightweightCabinetAdapter v3.5-DEBUG loaded - FINAL FIX');