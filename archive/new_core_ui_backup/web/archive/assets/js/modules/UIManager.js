// Менеджер пользовательского интерфейса
export class UIManager {
    constructor() {
        this.elements = {};
        this.bindElements();
    }
    
    bindElements() {
        // Размеры шкафа
        this.elements.cabinetWidth = document.getElementById('cabinet-width');
        this.elements.cabinetHeight = document.getElementById('cabinet-height');
        this.elements.cabinetDepth = document.getElementById('cabinet-depth');
        this.elements.cabinetBase = document.getElementById('cabinet-base');
        this.elements.applyDimensions = document.getElementById('apply-dimensions');
        this.elements.presetSmall = document.getElementById('preset-small');
        this.elements.presetStandard = document.getElementById('preset-standard');
        this.elements.randomCabinet = document.getElementById('random-cabinet');
        
        // Отображение
        this.elements.togglePanels = document.getElementById('toggle-panels');
        this.elements.toggleSections = document.getElementById('toggle-sections');
        this.elements.toggleDimensions = document.getElementById('toggle-dimensions');
        this.elements.zoomIn = document.getElementById('zoom-in');
        this.elements.zoomOut = document.getElementById('zoom-out');
        this.elements.resetView = document.getElementById('reset-view');
        
        // Информация
        this.elements.cabinetInfo = document.getElementById('cabinet-info');
        this.elements.debugInfo = document.getElementById('debug-info');
        this.elements.consoleLog = document.getElementById('console-log');
        
        // Overlay
        this.elements.scaleDisplay = document.getElementById('scale-display');
        this.elements.modeDisplay = document.getElementById('mode-display');
        
        // Шапка
        this.elements.saveProject = document.getElementById('save-project');
        this.elements.loadProject = document.getElementById('load-project');
        this.elements.exportData = document.getElementById('export-data');
        
        // Инструменты
        this.elements.modeButtons = document.querySelectorAll('[data-mode]');
        this.elements.toolButtons = document.querySelectorAll('[data-tool]');
    }
    
    initialize() {
        this.setupEventHandlers();
        this.updateInterface();
        
        // Периодическое обновление
        setInterval(() => {
            this.updateDebugInfo();
        }, 1000);
    }
    
    setupEventHandlers() {
        // Размеры шкафа
        this.elements.applyDimensions.onclick = () => window.CabinetApp.cabinetManager.applyDimensions();
        this.elements.presetSmall.onclick = () => window.CabinetApp.cabinetManager.setPreset(600, 1800, 450, 80);
        this.elements.presetStandard.onclick = () => window.CabinetApp.cabinetManager.setPreset(800, 2000, 600, 100);
        this.elements.randomCabinet.onclick = () => window.CabinetApp.cabinetManager.createRandomCabinet();
        
        // Отображение
        this.elements.togglePanels.onclick = () => this.toggleSetting('showPanels');
        this.elements.toggleSections.onclick = () => this.toggleSetting('showSections');
        this.elements.toggleDimensions.onclick = () => this.toggleSetting('showDimensions');
        
        // Масштаб
        this.elements.zoomIn.onclick = () => this.zoom(1.2);
        this.elements.zoomOut.onclick = () => this.zoom(0.8);
        this.elements.resetView.onclick = () => this.resetView();
        
        // Отладка
        this.elements.consoleLog.onclick = () => this.logToConsole();
        
        // Режимы и инструменты
        this.elements.modeButtons.forEach(btn => {
            btn.onclick = () => this.setMode(btn.dataset.mode);
        });
        
        this.elements.toolButtons.forEach(btn => {
            btn.onclick = () => this.setTool(btn.dataset.tool);
        });
        
        // Файловые операции (заглушки)
        this.elements.saveProject.onclick = () => this.showFeatureInDevelopment('Сохранение проектов');
        this.elements.loadProject.onclick = () => this.showFeatureInDevelopment('Загрузка проектов');
        this.elements.exportData.onclick = () => this.showFeatureInDevelopment('Экспорт данных');
    }
    
    toggleSetting(setting) {
        window.CabinetApp.settings[setting] = !window.CabinetApp.settings[setting];
        
        const button = document.getElementById(`toggle-${setting.replace('show', '').toLowerCase()}`);
        button.classList.toggle('active');
        
        // Применяем к рендереру
        if (setting === 'showDimensions') {
            window.CabinetApp.renderer.showDimensions(window.CabinetApp.settings[setting]);
        } else {
            const renderOptions = {
                showPanels: window.CabinetApp.settings.showPanels,
                showSections: window.CabinetApp.settings.showSections
            };
            window.CabinetApp.renderer.setRenderOptions(renderOptions);
        }
        
        this.updateDebugInfo();
    }
    
    zoom(factor) {
        // Эмуляция колеса мыши
        const canvas = document.getElementById('cabinet-canvas');
        const deltaY = factor > 1 ? -100 : 100;
        const event = new WheelEvent('wheel', {
            deltaY,
            bubbles: true,
            cancelable: true
        });
        canvas.dispatchEvent(event);
        this.updateDebugInfo();
    }
    
    resetView() {
        window.CabinetApp.renderer.resetScale();
        this.updateDebugInfo();
        window.CabinetApp.notificationManager.show('success', 'Вид сброшен', 'Масштаб возвращен к исходному');
    }
    
    setMode(mode) {
        // Убираем активный класс
        this.elements.modeButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем к выбранной
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        window.CabinetApp.currentMode = mode;
        this.updateModeDisplay();
        
        const modeNames = {
            'view': 'Просмотр',
            'edit': 'Редактирование',
            'measure': 'Измерения'
        };
        
        window.CabinetApp.notificationManager.show('info', 'Режим изменен', `Активирован: ${modeNames[mode]}`);
    }
    
    setTool(tool) {
        // Убираем активный класс
        this.elements.toolButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем к выбранной
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        
        const toolNames = {
            'shelf': 'Полка',
            'divider': 'Стойка', 
            'rod': 'Штанга'
        };
        
        window.CabinetApp.notificationManager.show('info', 'Инструмент выбран', `Активирован: ${toolNames[tool]}`);
    }
    
    updateInterface() {
        this.updateCabinetInfo();
        this.updateDebugInfo();
        this.updateModeDisplay();
    }
    
    updateCabinetInfo() {
        if (!window.CabinetApp.currentCabinet) return;
        
        const cabinet = window.CabinetApp.currentCabinet;
        const stats = cabinet.getStats();
        const dims = cabinet.dimensions;
        
        this.elements.cabinetInfo.innerHTML = `
            <div class="info-item">
                <span class="info-label">Статус</span>
                <span class="info-value">
                    <span class="status-dot status-ok"></span>
                    Активен
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">Размеры</span>
                <span class="info-value">${dims.width}×${dims.height}×${dims.depth}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Панелей</span>
                <span class="info-value">${stats.panelsCount}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Секций</span>
                <span class="info-value">${stats.sectionsCount}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Объем</span>
                <span class="info-value">${(stats.volume / 1000000).toFixed(2)} м³</span>
            </div>
        `;
    }
    
    updateDebugInfo() {
        if (!window.CabinetApp.renderer) return;
        
        const debugInfo = window.CabinetApp.renderer.getDebugInfo();
        const transform = debugInfo.transform;
        
        this.elements.debugInfo.innerHTML = `
            <div class="info-item">
                <span class="info-label">Рендерер</span>
                <span class="info-value">
                    <span class="status-dot status-ok"></span>
                    Активен
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">Масштаб</span>
                <span class="info-value">${transform.scale.toFixed(2)}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Canvas</span>
                <span class="info-value">${debugInfo.canvasSize.width}×${debugInfo.canvasSize.height}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Шкаф</span>
                <span class="info-value">${debugInfo.hasCabinet ? 'Загружен' : 'Отсутствует'}</span>
            </div>
        `;
        
        // Обновляем overlay
        this.elements.scaleDisplay.textContent = transform.scale.toFixed(2);
    }
    
    updateModeDisplay() {
        const modeNames = {
            'view': 'Просмотр',
            'edit': 'Редактирование', 
            'measure': 'Измерения'
        };
        this.elements.modeDisplay.textContent = modeNames[window.CabinetApp.currentMode];
    }
    
    logToConsole() {
        console.group('🐛 Cabinet Designer Debug Info');
        console.log('System:', window.CabinetApp.result.system.getStats());
        console.log('Cabinet:', window.CabinetApp.currentCabinet?.getStats());
        console.log('Renderer:', window.CabinetApp.renderer?.getDebugInfo());
        console.log('Settings:', window.CabinetApp.settings);
        console.log('Mode:', window.CabinetApp.currentMode);
        console.groupEnd();
        
        window.CabinetApp.notificationManager.show('success', 'Отладка', 'Информация выведена в консоль браузера');
    }
    
    showFeatureInDevelopment(feature) {
        window.CabinetApp.notificationManager.show('info', 'В разработке', `${feature} будет добавлено в следующих версиях`);
    }
}
