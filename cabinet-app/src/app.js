/**
 * Cabinet Designer Application
 * Главный модуль приложения
 * Координирует работу всех компонентов
 */

import { CabinetCoreService } from './services/CabinetCoreService.js';
import { UIController } from './ui/UIController.js';
import { Universal2DRenderer } from './renderers/Universal2DRenderer.js';
import { Renderer3D } from './renderers/Renderer3D.js';
import { StateManager } from './services/StateManager.js';
import { NotificationService } from './services/NotificationService.js';

class CabinetDesignerApp {
    constructor() {
        // Сервисы
        this.coreService = new CabinetCoreService();
        this.stateManager = new StateManager();
        this.notifications = new NotificationService();
        
        // UI
        this.uiController = null;
        
        // Рендереры
        this.renderer2D = null;
        this.renderer3D = null;
        this.currentRenderer = null;
        
        // Состояние приложения
        this.state = {
            mode: '2d',
            cabinet: null,
            selectedElement: null,
            hoveredElement: null,
            scale: 1,
            offset: { x: 0, y: 0 }
        };
    }
    
    /**
     * Инициализация приложения
     */
    async initialize() {
        try {
            console.log('Initializing Cabinet Designer App...');
            
            // Инициализируем сервис ядра
            await this.coreService.initialize();
            
            // Инициализируем UI
            this.uiController = new UIController(this);
            await this.uiController.initialize();
            
            // Инициализируем рендереры
            const canvas = document.getElementById('cabinet-canvas');
            this.renderer2D = new Universal2DRenderer(canvas);
            this.renderer3D = new Renderer3D(canvas);
            this.currentRenderer = this.renderer2D;
            
            // Создаем дефолтный шкаф
            this.createDefaultCabinet();
            
            // Показываем уведомление
            this.notifications.success('Приложение готово к работе');
            
            console.log('Cabinet Designer App initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.notifications.error('Ошибка инициализации: ' + error.message);
        }
    }
    
    /**
     * Создать шкаф с дефолтными параметрами
     */
    createDefaultCabinet() {
        try {
            const defaultParams = {
                width: 800,
                height: 2000,
                depth: 600,
                baseHeight: 100
            };
            
            this.createCabinet(defaultParams);
        } catch (error) {
            console.error('Failed to create default cabinet:', error);
        }
    }
    
    /**
     * Создать новый шкаф
     */
    createCabinet(params) {
        try {
            // Сохраняем текущее состояние для undo
            this.stateManager.saveState(this.state);
            
            // Создаем шкаф через сервис
            const cabinetData = this.coreService.createCabinet(params);
            
            // Обновляем состояние
            this.state.cabinet = cabinetData;
            
            // Обновляем UI
            this.uiController.updateCabinetInfo(cabinetData);
            
            // Перерисовываем
            this.render();
            
            this.notifications.success('Шкаф создан');
            
        } catch (error) {
            console.error('Failed to create cabinet:', error);
            this.notifications.error(error.message);
        }
    }
    
    /**
     * Изменить режим отображения
     */
    setMode(mode) {
        if (mode === this.state.mode) return;
        
        this.state.mode = mode;
        this.currentRenderer = mode === '3d' ? this.renderer3D : this.renderer2D;
        
        this.uiController.setMode(mode);
        this.render();
    }
    
    /**
     * Отрисовка
     */
    render() {
        if (!this.state.cabinet || !this.currentRenderer) return;
        
        this.currentRenderer.clear();
        this.currentRenderer.setTransform(this.state.scale, this.state.offset);
        this.currentRenderer.render(this.state.cabinet);
        
        // Отрисовка выделения
        if (this.state.selectedElement) {
            this.currentRenderer.highlightElement(this.state.selectedElement);
        }
        
        // Отрисовка hover
        if (this.state.hoveredElement) {
            this.currentRenderer.hoverElement(this.state.hoveredElement);
        }
    }
    
    /**
     * Масштабирование
     */
    zoom(factor) {
        this.state.scale *= factor;
        this.state.scale = Math.max(0.1, Math.min(5, this.state.scale));
        this.render();
    }
    
    zoomIn() {
        this.zoom(1.2);
    }
    
    zoomOut() {
        this.zoom(0.8);
    }
    
    zoomFit() {
        if (!this.state.cabinet) return;
        
        const canvas = this.currentRenderer.canvas;
        const dims = this.state.cabinet.dimensions;
        const padding = 60;
        
        const scaleX = (canvas.width - padding * 2) / dims.width;
        const scaleY = (canvas.height - padding * 2) / dims.height;
        
        this.state.scale = Math.min(scaleX, scaleY);
        this.state.offset = { x: 0, y: 0 };
        this.render();
    }
    
    /**
     * Отмена последнего действия
     */
    undo() {
        const prevState = this.stateManager.undo();
        if (prevState) {
            this.state = { ...prevState };
            this.render();
            this.uiController.updateCabinetInfo(this.state.cabinet);
            this.notifications.info('Действие отменено');
        }
    }
    
    /**
     * Повтор действия
     */
    redo() {
        const nextState = this.stateManager.redo();
        if (nextState) {
            this.state = { ...nextState };
            this.render();
            this.uiController.updateCabinetInfo(this.state.cabinet);
            this.notifications.info('Действие повторено');
        }
    }
    
    /**
     * Экспорт данных
     */
    export() {
        try {
            const data = this.coreService.exportToJSON();
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { 
                type: 'application/json' 
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cabinet_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.notifications.success('Данные экспортированы');
            
        } catch (error) {
            console.error('Export failed:', error);
            this.notifications.error('Ошибка экспорта: ' + error.message);
        }
    }
    
    /**
     * Обработка события мыши
     */
    handleMouseMove(x, y) {
        // Преобразуем координаты
        const worldX = (x - this.state.offset.x) / this.state.scale;
        const worldY = (y - this.state.offset.y) / this.state.scale;
        
        // Проверяем hover
        this.checkHover(worldX, worldY);
    }
    
    /**
     * Проверка наведения на элемент
     */
    checkHover(x, y) {
        // TODO: Реализовать определение элемента под курсором
    }
}

// Создаем и экспортируем экземпляр приложения
const app = new CabinetDesignerApp();
export default app;

// Запускаем при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.initialize());
} else {
    app.initialize();
}