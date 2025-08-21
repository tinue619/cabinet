/**
 * INFRASTRUCTURE LAYER: Адаптер для получения статистики панелей
 * Слой: Infrastructure - НЕ ИЗМЕНЯЕТ ядро, только адаптирует данные
 */

// ===========================
// АДАПТЕР ДЛЯ СЧЕТЧИКА ПАНЕЛЕЙ (Infrastructure Layer)
// ===========================
export class PanelStatsAdapter {
    constructor(cabinet) {
        this.cabinet = cabinet;
    }

    // Получение статистики панелей БЕЗ ИЗМЕНЕНИЯ ядра
    getPanelStats() {
        if (!this.cabinet) {
            return { count: 0, volume: 0, cost: 0, panels: [] };
        }

        // ИСПОЛЬЗУЕМ СУЩЕСТВУЮЩИЕ методы ядра
        const panels = this.extractPanelsFromCabinet();
        const volume = this.calculateTotalVolume(panels);
        const cost = this.estimateCost(volume);

        return {
            count: panels.length,
            volume: volume.toFixed(3),
            cost: cost.toLocaleString('ru-RU'),
            panels: panels
        };
    }

    // АДАПТАЦИЯ существующих данных шкафа
    extractPanelsFromCabinet() {
        const panels = [];
        
        // Базовые панели на основе габаритов (как в онтологии)
        const basePanels = this.generateBasePanels();
        panels.push(...basePanels);
        
        // Дополнительные панели (если есть методы в ядре для их получения)
        if (this.cabinet.getDividers && typeof this.cabinet.getDividers === 'function') {
            const dividers = this.cabinet.getDividers();
            const dividerPanels = this.generateDividerPanels(dividers);
            panels.push(...dividerPanels);
        }

        return panels;
    }

    // Генерация базовых панелей на основе габаритов (НЕ ИЗМЕНЯЯ ядро)
    generateBasePanels() {
        const dims = this.cabinet.getDimensions ? this.cabinet.getDimensions() : 
                     { width: 800, height: 1800, depth: 500, baseHeight: 100 };
        
        const thickness = 16; // Стандартная толщина
        
        return [
            { name: 'Боковина левая', w: thickness, h: dims.height, d: dims.depth, material: 'ЛДСП 16мм' },
            { name: 'Боковина правая', w: thickness, h: dims.height, d: dims.depth, material: 'ЛДСП 16мм' },
            { name: 'Крыша', w: dims.width, h: thickness, d: dims.depth, material: 'ЛДСП 16мм' },
            { name: 'Дно', w: dims.width - 2*thickness, h: thickness, d: dims.depth, material: 'ЛДСП 16мм' },
            { name: 'Цоколь передний', w: dims.width - 2*thickness, h: thickness, d: dims.depth, material: 'ЛДСП 16мм' },
            { name: 'Цоколь задний', w: dims.width - 2*thickness, h: thickness, d: dims.depth, material: 'ЛДСП 16мм' },
            { name: 'Задняя стенка', w: dims.width - 2*thickness, h: dims.height - dims.baseHeight - thickness, d: 3, material: 'ХДФ 3мм' },
            { name: 'Фасад', w: dims.width, h: dims.height - dims.baseHeight, d: thickness, material: 'МДФ 16мм' }
        ];
    }

    generateDividerPanels(dividers) {
        return dividers.map((divider, index) => ({
            name: divider.type === 'vertical' ? `Стойка ${index + 1}` : `Полка ${index + 1}`,
            w: divider.type === 'vertical' ? 16 : divider.width,
            h: divider.type === 'vertical' ? divider.height : 16,
            d: 500, // стандартная глубина
            material: 'ЛДСП 16мм'
        }));
    }

    calculateTotalVolume(panels) {
        return panels.reduce((total, panel) => {
            return total + (panel.w * panel.h * panel.d) / (1000 * 1000 * 1000);
        }, 0);
    }

    estimateCost(volumeM3) {
        // Простая оценка стоимости
        const avgPricePerM3 = 25000; // руб/м³
        return Math.round(volumeM3 * avgPricePerM3);
    }
}