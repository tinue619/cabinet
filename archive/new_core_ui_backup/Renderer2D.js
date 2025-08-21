// 🎨 2D РЕНДЕРЕР - Система отрисовки на Canvas
// Адаптация логики из версии 2.0 для ядра v3.1

"use strict";

import { CABINET_DNA } from '../cabinet-dna.js';

/**
 * 🎨 2D РЕНДЕРЕР
 * Отрисовка шкафов на Canvas с интерактивностью
 * Основан на проверенной логике из версии 2.0
 */
export class Renderer2D {
    constructor(canvas, system) {
        if (!canvas || !system) {
            throw new Error('Renderer2D requires canvas and system');
        }
        
        // 🔒 Приватные данные через замыкания
        let _canvas = canvas;
        let _ctx = canvas.getContext('2d');
        let _system = system;
        let _cabinet = null;
        let _transform = { scale: 1, offsetX: 0, offsetY: 0 };
        let _config = {
            padding: CABINET_DNA.CONSTANTS.PADDING,
            panelThickness: CABINET_DNA.CONSTANTS.DEFAULT_PANEL_THICKNESS,
            minSection: CABINET_DNA.CONSTANTS.MIN_SECTION_SIZE
        };
        let _renderOptions = {
            showDimensions: false,
            showSections: true,
            showPanels: true,
            highlightHovered: true
        };
        let _interactive = {
            hoveredSection: null,
            hoveredPanel: null,
            mousePos: { x: 0, y: 0 }
        };
        
        // ===============================================
        // 🔍 ПУБЛИЧНЫЕ ГЕТТЕРЫ
        // ===============================================
        
        Object.defineProperty(this, 'canvas', {
            get: () => _canvas,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'transform', {
            get: () => Object.freeze({ ..._transform }),
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'renderOptions', {
            get: () => Object.freeze({ ..._renderOptions }),
            enumerable: true,
            configurable: false
        });
        
        // ===============================================
        // 🎛️ НАСТРОЙКА И ИНИЦИАЛИЗАЦИЯ
        // ===============================================
        
        /**
         * 🚀 Инициализация рендерера
         */
        this.init = () => {
            this._setupCanvas();
            this._setupEventListeners();
            this._setupSystemEvents();
            console.log('🎨 Renderer2D initialized');
        };
        
        /**
         * 🖼️ Настройка canvas
         * @private
         */
        this._setupCanvas = () => {
            this._resizeCanvas();
            window.addEventListener('resize', this._resizeCanvas);
        };
        
        /**
         * 📏 Изменение размера canvas (адаптировано из v2.0)
         * @private
         */
        this._resizeCanvas = () => {
            const rect = _canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            _canvas.width = rect.width * dpr;
            _canvas.height = rect.height * dpr;
            _canvas.style.width = rect.width + 'px';
            _canvas.style.height = rect.height + 'px';
            
            _ctx.scale(dpr, dpr);
            this._render();
        };
        
        /**
         * 🎧 Подписка на события системы
         * @private
         */
        this._setupSystemEvents = () => {
            // Подписываемся на события ядра
            _system.events.onNamespace('cabinets', 'cabinet-generated', (event) => {
                console.log('🎨 Renderer received cabinet-generated event');
            });
            
            _system.events.onNamespace('cabinets', 'cabinet-geometry-changed', () => {
                this._render();
            });
            
            _system.events.onNamespace('panels', 'panel-dimensions-changed', () => {
                this._render();
            });
        };
        
        /**
         * 🖱️ Настройка событий мыши
         * @private
         */
        this._setupEventListeners = () => {
            _canvas.addEventListener('mousemove', this._onMouseMove);
            _canvas.addEventListener('mousedown', this._onMouseDown);
            _canvas.addEventListener('mouseup', this._onMouseUp);
            _canvas.addEventListener('mouseleave', this._onMouseLeave);
            _canvas.addEventListener('wheel', this._onWheel);
            _canvas.addEventListener('click', this._onClick);
        };
        
        // ===============================================
        // 🎯 ОСНОВНЫЕ МЕТОДЫ РЕНДЕРИНГА
        // ===============================================
        
        /**
         * 🏗️ Установка шкафа для рендеринга
         * @param {Cabinet} cabinet 
         */
        this.setCabinet = (cabinet) => {
            _cabinet = cabinet;
            this._updateTransform();
            this._render();
        };
        
        /**
         * 🎨 Главный метод рендеринга
         */
        this.render = () => {
            this._render();
        };
        
        /**
         * 🎨 Внутренний метод рендеринга
         * @private
         */
        this._render = () => {
            if (!_cabinet) {
                this._clearCanvas();
                this._drawNoData();
                return;
            }
            
            this._clearCanvas();
            this._updateTransform();
            
            // Рендерим компоненты в правильном порядке
            this._drawBackground();
            this._drawPanels();
            this._drawSections();
            this._drawDimensions();
            this._drawInteractive();
        };
        
        /**
         * 🧹 Очистка canvas
         * @private
         */
        this._clearCanvas = () => {
            const rect = _canvas.getBoundingClientRect();
            _ctx.clearRect(0, 0, rect.width, rect.height);
        };
        
        /**
         * 📐 Обновление трансформации (адаптировано из v2.0)
         * @private
         */
        this._updateTransform = () => {
            if (!_cabinet) return;
            
            const canvasRect = _canvas.getBoundingClientRect();
            const availableW = canvasRect.width - 2 * _config.padding;
            const availableH = canvasRect.height - 2 * _config.padding;
            
            const scale = Math.min(
                availableW / _cabinet.dimensions.width,
                availableH / _cabinet.dimensions.height
            );
            
            const cabinetW = _cabinet.dimensions.width * scale;
            const cabinetH = _cabinet.dimensions.height * scale;
            
            _transform = {
                scale: scale,
                offsetX: (canvasRect.width - cabinetW) / 2,
                offsetY: (canvasRect.height - cabinetH) / 2
            };
        };
        
        // ===============================================
        // 🎨 МЕТОДЫ ОТРИСОВКИ КОМПОНЕНТОВ
        // ===============================================
        
        /**
         * 🎨 Отрисовка фона
         * @private
         */
        this._drawBackground = () => {
            const rect = _canvas.getBoundingClientRect();
            _ctx.fillStyle = '#f8f9fa';
            _ctx.fillRect(0, 0, rect.width, rect.height);
        };
        
        /**
         * 📐 Отрисовка панелей (адаптировано из v2.0)
         * @private
         */
        this._drawPanels = () => {
            if (!_renderOptions.showPanels) return;
            
            const panels = _cabinet.getPanels();
            
            panels.forEach(panel => {
                this._drawPanel(panel);
            });
        };
        
        /**
         * 📐 Отрисовка одной панели
         * @private
         */
        this._drawPanel = (panel) => {
            const pos = panel.position;
            const dim = panel.dimensions;
            
            // Преобразуем координаты
            const x = _transform.offsetX + pos.x * _transform.scale;
            const y = _transform.offsetY + pos.y * _transform.scale;
            const w = dim.width * _transform.scale;
            const h = dim.height * _transform.scale;
            
            // Цвет панели в зависимости от материала
            _ctx.fillStyle = this._getPanelColor(panel);
            _ctx.fillRect(x, y, w, h);
            
            // Обводка
            _ctx.strokeStyle = '#333';
            _ctx.lineWidth = 1;
            _ctx.strokeRect(x, y, w, h);
            
            // Подпись панели (если место есть)
            if (w > 50 && h > 20) {
                _ctx.fillStyle = '#333';
                _ctx.font = '12px Arial';
                _ctx.textAlign = 'center';
                _ctx.fillText(
                    panel.name, 
                    x + w/2, 
                    y + h/2 + 4
                );
            }
        };
        
        /**
         * 🎨 Цвет панели по материалу
         * @private
         */
        this._getPanelColor = (panel) => {
            const materialColors = {
                'LDSP_16': '#d4ac7a',
                'HDF_3': '#8b4513',
                'MDF_16': '#deb887'
            };
            return materialColors[panel.material.materialType] || '#ccc';
        };
        
        /**
         * 📦 Отрисовка секций
         * @private
         */
        this._drawSections = () => {
            if (!_renderOptions.showSections) return;
            
            const sections = _cabinet.getSections();
            
            sections.forEach(section => {
                this._drawSection(section);
            });
        };
        
        /**
         * 📦 Отрисовка одной секции
         * @private
         */
        this._drawSection = (section) => {
            const bounds = section.bounds;
            
            const x = _transform.offsetX + bounds.left * _transform.scale;
            const y = _transform.offsetY + bounds.top * _transform.scale;
            const w = bounds.width * _transform.scale;
            const h = bounds.height * _transform.scale;
            
            // Полупрозрачная заливка
            _ctx.fillStyle = 'rgba(173, 216, 230, 0.3)';
            _ctx.fillRect(x, y, w, h);
            
            // Пунктирная обводка
            _ctx.setLineDash([5, 5]);
            _ctx.strokeStyle = '#87ceeb';
            _ctx.lineWidth = 1;
            _ctx.strokeRect(x, y, w, h);
            _ctx.setLineDash([]);
        };
        
        /**
         * 📏 Отрисовка размеров
         * @private
         */
        this._drawDimensions = () => {
            if (!_renderOptions.showDimensions || !_cabinet) return;
            
            const dims = _cabinet.dimensions;
            
            // Размеры шкафа
            _ctx.fillStyle = '#007bff';
            _ctx.font = 'bold 14px Arial';
            _ctx.textAlign = 'center';
            
            // Ширина (сверху)
            _ctx.fillText(
                `${dims.width}мм`,
                _transform.offsetX + dims.width * _transform.scale / 2,
                _transform.offsetY - 10
            );
            
            // Высота (справа)
            _ctx.save();
            _ctx.translate(
                _transform.offsetX + dims.width * _transform.scale + 20,
                _transform.offsetY + dims.height * _transform.scale / 2
            );
            _ctx.rotate(-Math.PI / 2);
            _ctx.fillText(`${dims.height}мм`, 0, 4);
            _ctx.restore();
        };
        
        /**
         * 🖱️ Отрисовка интерактивных элементов
         * @private
         */
        this._drawInteractive = () => {
            if (!_renderOptions.highlightHovered) return;
            
            // Подсветка наведенной секции
            if (_interactive.hoveredSection) {
                this._highlightSection(_interactive.hoveredSection);
            }
            
            // Подсветка наведенной панели
            if (_interactive.hoveredPanel) {
                this._highlightPanel(_interactive.hoveredPanel);
            }
        };
        
        /**
         * ✨ Подсветка секции
         * @private
         */
        this._highlightSection = (section) => {
            const bounds = section.bounds;
            
            const x = _transform.offsetX + bounds.left * _transform.scale;
            const y = _transform.offsetY + bounds.top * _transform.scale;
            const w = bounds.width * _transform.scale;
            const h = bounds.height * _transform.scale;
            
            _ctx.strokeStyle = '#ffc107';
            _ctx.lineWidth = 3;
            _ctx.strokeRect(x, y, w, h);
        };
        
        /**
         * ✨ Подсветка панели
         * @private
         */
        this._highlightPanel = (panel) => {
            const pos = panel.position;
            const dim = panel.dimensions;
            
            const x = _transform.offsetX + pos.x * _transform.scale;
            const y = _transform.offsetY + pos.y * _transform.scale;
            const w = dim.width * _transform.scale;
            const h = dim.height * _transform.scale;
            
            _ctx.strokeStyle = '#dc3545';
            _ctx.lineWidth = 3;
            _ctx.strokeRect(x, y, w, h);
        };
        
        /**
         * 🚫 Отрисовка сообщения "нет данных"
         * @private
         */
        this._drawNoData = () => {
            _ctx.fillStyle = '#6c757d';
            _ctx.font = '18px Arial';
            _ctx.textAlign = 'center';
            
            const rect = _canvas.getBoundingClientRect();
            _ctx.fillText(
                'Создайте шкаф для начала работы',
                rect.width / 2,
                rect.height / 2
            );
        };
        
        // ===============================================
        // 🖱️ ОБРАБОТКА СОБЫТИЙ МЫШИ
        // ===============================================
        
        /**
         * 🖱️ Движение мыши
         * @private
         */
        this._onMouseMove = (event) => {
            const rect = _canvas.getBoundingClientRect();
            _interactive.mousePos = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            
            this._updateHover();
            this._render();
        };
        
        /**
         * 🖱️ Нажатие мыши
         * @private
         */
        this._onMouseDown = (event) => {
            console.log('Mouse down at:', _interactive.mousePos);
        };
        
        /**
         * 🖱️ Отпускание мыши
         * @private
         */
        this._onMouseUp = (event) => {
            // Логика для завершения взаимодействия
        };
        
        /**
         * 🖱️ Выход мыши за пределы canvas
         * @private
         */
        this._onMouseLeave = (event) => {
            _interactive.hoveredSection = null;
            _interactive.hoveredPanel = null;
            this._render();
        };
        
        /**
         * 🖱️ Колесо мыши (масштабирование)
         * @private
         */
        this._onWheel = (event) => {
            event.preventDefault();
            
            const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
            _transform.scale = Math.max(0.1, Math.min(3, _transform.scale * scaleFactor));
            
            this._render();
        };
        
        /**
         * 🖱️ Клик мыши
         * @private
         */
        this._onClick = (event) => {
            if (_interactive.hoveredSection) {
                console.log('Clicked section:', _interactive.hoveredSection.id);
            }
        };
        
        /**
         * 🎯 Обновление наведения
         * @private
         */
        this._updateHover = () => {
            if (!_cabinet) return;
            
            const worldPos = this._screenToWorld(_interactive.mousePos);
            
            // Проверяем секции
            const sections = _cabinet.getSections();
            _interactive.hoveredSection = sections.find(section => 
                section.containsPoint(worldPos.x, worldPos.y)
            ) || null;
            
            // Проверяем панели
            const panels = _cabinet.getPanels();
            _interactive.hoveredPanel = panels.find(panel => 
                panel.containsPoint2D && panel.containsPoint2D(worldPos.x, worldPos.y)
            ) || null;
        };
        
        /**
         * 🌍 Преобразование экранных координат в мировые
         * @private
         */
        this._screenToWorld = (screenPos) => {
            return {
                x: (screenPos.x - _transform.offsetX) / _transform.scale,
                y: (screenPos.y - _transform.offsetY) / _transform.scale
            };
        };
        
        // ===============================================
        // 🎛️ НАСТРОЙКИ РЕНДЕРИНГА
        // ===============================================
        
        /**
         * 🎛️ Обновление настроек рендеринга
         * @param {Object} options 
         */
        this.setRenderOptions = (options) => {
            Object.assign(_renderOptions, options);
            this._render();
        };
        
        /**
         * 📏 Включение/выключение размеров
         * @param {boolean} show 
         */
        this.showDimensions = (show) => {
            _renderOptions.showDimensions = !!show;
            this._render();
        };
        
        /**
         * 🔄 Сброс масштаба
         */
        this.resetScale = () => {
            _transform.scale = 1;
            this._render();
        };
        
        // ===============================================
        // 💡 УТИЛИТЫ ДЛЯ ОТЛАДКИ
        // ===============================================
        
        /**
         * 📊 Получить информацию о состоянии рендерера
         * @returns {Object}
         */
        this.getDebugInfo = () => {
            return Object.freeze({
                hasCabinet: !!_cabinet,
                transform: _transform,
                config: _config,
                renderOptions: _renderOptions,
                interactive: _interactive,
                canvasSize: {
                    width: _canvas.width,
                    height: _canvas.height
                }
            });
        };
        
        // ===============================================
        // 🔒 ФИНАЛЬНАЯ ЗАЩИТА
        // ===============================================
        
        // Замораживаем методы
        Object.freeze(this.init);
        Object.freeze(this.setCabinet);
        Object.freeze(this.render);
        Object.freeze(this.setRenderOptions);
        Object.freeze(this.showDimensions);
        Object.freeze(this.resetScale);
        Object.freeze(this.getDebugInfo);
        
        // Защищаем объект
        Object.preventExtensions(this);
    }
}

console.log('🎨 Renderer2D loaded');
