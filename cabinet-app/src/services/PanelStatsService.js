/**
 * APPLICATION LAYER: Сервис управления статистикой панелей
 * Слой: Application - координация между слоями, БЕЗ деталей реализации
 */

import { PanelStatsAdapter } from '../infrastructure/PanelStatsAdapter.js';
import { PanelStatsDisplay } from '../ui/PanelStatsDisplay.js';

// ===========================
// APPLICATION SERVICE - КООРДИНАЦИЯ СЛОЕВ
// ===========================
export class PanelStatsService {
    constructor() {
        this.display = null;
        this.adapter = null;
        this.cabinet = null;
    }

    // Инициализация сервиса
    initialize(displayContainerId) {
        try {
            // Создаем UI компонент
            this.display = new PanelStatsDisplay(displayContainerId);
            
            console.log('✅ PanelStatsService инициализирован');
            return true;
        } catch (error) {
            console.error('❌ Ошибка инициализации PanelStatsService:', error);
            return false;
        }
    }

    // Установка шкафа (из new_core)
    setCabinet(cabinet) {
        this.cabinet = cabinet;
        
        // Создаем адаптер для этого шкафа
        this.adapter = new PanelStatsAdapter(cabinet);
        
        // Связываем адаптер с UI
        if (this.display) {
            this.display.setAdapter(this.adapter);
        }
        
        // Обновляем отображение
        this.updateStats();
    }

    // Обновление статистики (вызывается при изменении шкафа)
    updateStats() {
        if (!this.display) {
            console.warn('PanelStatsDisplay не инициализирован');
            return;
        }

        if (!this.adapter) {
            console.warn('Шкаф не установлен');
            this.display.clear();
            return;
        }

        // Делегируем отображение UI слою
        this.display.updateDisplay();
    }

    // Очистка статистики
    clearStats() {
        if (this.display) {
            this.display.clear();
        }
    }

    // Получение текущей статистики (для других сервисов)
    getCurrentStats() {
        if (!this.adapter) return null;
        return this.adapter.getPanelStats();
    }
}