/**
 * UI LAYER: Компонент счетчика панелей
 * Слой: UI - ТОЛЬКО отображение, БЕЗ бизнес-логики
 */

// ===========================
// UI КОМПОНЕНТ СЧЕТЧИКА ПАНЕЛЕЙ
// ===========================
export class PanelStatsDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.panelStatsAdapter = null;
        this.initializeDisplay();
    }

    // Связывание с адаптером (Dependency Injection)
    setAdapter(panelStatsAdapter) {
        this.panelStatsAdapter = panelStatsAdapter;
    }

    // Инициализация UI элементов
    initializeDisplay() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="panel-stats-section">
                <div class="stats-header">
                    <h3>Информация</h3>
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Панелей</span>
                        <span class="stat-value" id="stat-panels">-</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Объем</span>
                        <span class="stat-value" id="stat-volume">- м³</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Стоимость</span>
                        <span class="stat-value" id="stat-cost">- ₽</span>
                    </div>
                </div>
                <div class="panels-list-section">
                    <h4>Список панелей</h4>
                    <div class="panels-list" id="panels-list">
                        <div class="empty-state">Нет данных</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Обновление отображения (вызывается из Application layer)
    updateDisplay() {
        if (!this.panelStatsAdapter) {
            console.warn('PanelStatsAdapter не установлен');
            return;
        }

        try {
            const stats = this.panelStatsAdapter.getPanelStats();
            this.renderStats(stats);
            this.renderPanelsList(stats.panels);
        } catch (error) {
            console.error('Ошибка обновления статистики панелей:', error);
            this.showError('Ошибка загрузки данных');
        }
    }

    // Отображение статистики
    renderStats(stats) {
        const panelsEl = document.getElementById('stat-panels');
        const volumeEl = document.getElementById('stat-volume');
        const costEl = document.getElementById('stat-cost');

        if (panelsEl) panelsEl.textContent = stats.count;
        if (volumeEl) volumeEl.textContent = `${stats.volume} м³`;
        if (costEl) costEl.textContent = `${stats.cost} ₽`;
    }

    // Отображение списка панелей
    renderPanelsList(panels) {
        const listEl = document.getElementById('panels-list');
        if (!listEl) return;

        if (!panels || panels.length === 0) {
            listEl.innerHTML = '<div class="empty-state">Нет панелей</div>';
            return;
        }

        const html = panels.map((panel, index) => `
            <div class="panel-item">
                <div class="panel-info">
                    <div class="panel-name">${panel.name}</div>
                    <div class="panel-dimensions">${Math.round(panel.w)}×${Math.round(panel.h)}×${Math.round(panel.d)}мм</div>
                    <div class="panel-material">${panel.material}</div>
                </div>
            </div>
        `).join('');

        listEl.innerHTML = html;
    }

    // Отображение ошибки
    showError(message) {
        const listEl = document.getElementById('panels-list');
        if (listEl) {
            listEl.innerHTML = `<div class="error-state">${message}</div>`;
        }
    }

    // Очистка отображения
    clear() {
        this.renderStats({ count: 0, volume: '0.000', cost: '0' });
        this.renderPanelsList([]);
    }
}