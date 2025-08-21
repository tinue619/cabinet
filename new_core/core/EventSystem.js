// 📡 СИСТЕМА СОБЫТИЙ - Реактивное ядро архитектуры
// Обеспечивает децентрализованную связь между компонентами

"use strict";

/**
 * 📡 ГЛОБАЛЬНАЯ СИСТЕМА СОБЫТИЙ
 * Централизованная система для межкомпонентной коммуникации
 * Обеспечивает слабую связанность и реактивность
 */
export class EventSystem {
    constructor() {
        // 🔒 Приватные данные через замыкания
        let _globalListeners = new Map(); // event -> Set<listener>
        let _namespaceListeners = new Map(); // namespace -> Map<event, Set<listener>>
        let _eventHistory = []; // история событий для отладки
        let _maxHistorySize = 1000;
        let _isEnabled = true;
        
        // Статистика системы
        let _stats = {
            totalEvents: 0,
            totalListeners: 0,
            namespaces: 0,
            errors: 0
        };
        
        // ===============================================
        // 📡 ПОДПИСКА НА СОБЫТИЯ
        // ===============================================
        
        /**
         * 👂 Подписка на глобальное событие
         * @param {string} eventName - название события
         * @param {Function} listener - обработчик события  
         * @param {Object} options - опции подписки
         * @returns {Function} - функция отписки
         */
        this.on = (eventName, listener, options = {}) => {
            if (typeof listener !== 'function') {
                throw new Error('Listener must be a function');
            }
            
            if (!_isEnabled) {
                console.warn('EventSystem is disabled');
                return () => {};
            }
            
            // Создаем Set для события если его нет
            if (!_globalListeners.has(eventName)) {
                _globalListeners.set(eventName, new Set());
            }
            
            // Расширенный listener с метаданными
            const wrappedListener = {
                original: listener,
                created: Date.now(),
                options: { ...options },
                namespace: 'global',
                calls: 0
            };
            
            _globalListeners.get(eventName).add(wrappedListener);
            _stats.totalListeners++;
            
            // Возвращаем функцию отписки
            return () => {
                const listeners = _globalListeners.get(eventName);
                if (listeners) {
                    listeners.delete(wrappedListener);
                    _stats.totalListeners--;
                }
            };
        };
        
        /**
         * 👂 Подписка на событие в пространстве имен
         * @param {string} namespace - пространство имен 
         * @param {string} eventName - название события
         * @param {Function} listener - обработчик события
         * @param {Object} options - опции подписки
         * @returns {Function} - функция отписки
         */
        this.onNamespace = (namespace, eventName, listener, options = {}) => {
            if (typeof listener !== 'function') {
                throw new Error('Listener must be a function');
            }
            
            if (!_isEnabled) {
                console.warn('EventSystem is disabled');
                return () => {};
            }
            
            // Создаем namespace если его нет
            if (!_namespaceListeners.has(namespace)) {
                _namespaceListeners.set(namespace, new Map());
                _stats.namespaces++;
            }
            
            const nsMap = _namespaceListeners.get(namespace);
            
            // Создаем Set для события если его нет
            if (!nsMap.has(eventName)) {
                nsMap.set(eventName, new Set());
            }
            
            // Расширенный listener с метаданными
            const wrappedListener = {
                original: listener,
                created: Date.now(),
                options: { ...options },
                namespace: namespace,
                calls: 0
            };
            
            nsMap.get(eventName).add(wrappedListener);
            _stats.totalListeners++;
            
            // Возвращаем функцию отписки
            return () => {
                const listeners = nsMap.get(eventName);
                if (listeners) {
                    listeners.delete(wrappedListener);
                    _stats.totalListeners--;
                }
            };
        };
        
        // ===============================================
        // 📤 ОТПРАВКА СОБЫТИЙ
        // ===============================================
        
        /**
         * 📤 Отправка глобального события
         * @param {string} eventName - название события
         * @param {Object} data - данные события
         * @param {Object} options - опции отправки
         */
        this.emit = (eventName, data = {}, options = {}) => {
            if (!_isEnabled) {
                return;
            }
            
            const event = this._createEvent(eventName, data, 'global', options);
            this._recordEvent(event);
            
            // Отправляем глобальным слушателям
            this._dispatchToListeners(_globalListeners.get(eventName), event);
            
            _stats.totalEvents++;
        };
        
        /**
         * 📤 Отправка события в пространство имен
         * @param {string} namespace - пространство имен
         * @param {string} eventName - название события
         * @param {Object} data - данные события
         * @param {Object} options - опции отправки
         */
        this.emitNamespace = (namespace, eventName, data = {}, options = {}) => {
            if (!_isEnabled) {
                return;
            }
            
            const event = this._createEvent(eventName, data, namespace, options);
            this._recordEvent(event);
            
            // Отправляем слушателям в namespace
            const nsMap = _namespaceListeners.get(namespace);
            if (nsMap) {
                this._dispatchToListeners(nsMap.get(eventName), event);
            }
            
            // Также отправляем глобальным слушателям если разрешено
            if (!options.namespaceOnly) {
                this._dispatchToListeners(_globalListeners.get(eventName), event);
            }
            
            _stats.totalEvents++;
        };
        
        /**
         * 📤 Широковещательная отправка (всем namespace)
         * @param {string} eventName - название события
         * @param {Object} data - данные события
         * @param {Object} options - опции отправки
         */
        this.broadcast = (eventName, data = {}, options = {}) => {
            if (!_isEnabled) {
                return;
            }
            
            const event = this._createEvent(eventName, data, 'broadcast', options);
            this._recordEvent(event);
            
            // Отправляем всем namespace
            for (const [namespace, nsMap] of _namespaceListeners) {
                this._dispatchToListeners(nsMap.get(eventName), event);
            }
            
            // И глобальным тоже
            this._dispatchToListeners(_globalListeners.get(eventName), event);
            
            _stats.totalEvents++;
        };
        
        // ===============================================
        // 🔧 ВНУТРЕННИЕ МЕТОДЫ
        // ===============================================
        
        /**
         * 🏗️ Создание объекта события
         * @private
         */
        this._createEvent = (eventName, data, namespace, options) => {
            return Object.freeze({
                name: eventName,
                data: Object.freeze({ ...data }),
                namespace: namespace,
                timestamp: Date.now(),
                id: `${namespace}_${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                options: Object.freeze({ ...options }),
                source: 'EventSystem'
            });
        };
        
        /**
         * 📝 Запись события в историю
         * @private
         */
        this._recordEvent = (event) => {
            _eventHistory.push(event);
            
            // Ограничиваем размер истории
            if (_eventHistory.length > _maxHistorySize) {
                _eventHistory = _eventHistory.slice(-_maxHistorySize);
            }
        };
        
        /**
         * 📡 Отправка события слушателям
         * @private
         */
        this._dispatchToListeners = (listeners, event) => {
            if (!listeners || listeners.size === 0) {
                return;
            }
            
            for (const wrappedListener of listeners) {
                try {
                    // Увеличиваем счетчик вызовов
                    wrappedListener.calls++;
                    
                    // Проверяем лимит вызовов если есть
                    if (wrappedListener.options.maxCalls && 
                        wrappedListener.calls > wrappedListener.options.maxCalls) {
                        continue;
                    }
                    
                    // Вызываем оригинальный listener
                    wrappedListener.original(event);
                    
                } catch (error) {
                    _stats.errors++;
                    console.error(`Error in event listener for ${event.name}:`, error);
                    
                    // Отправляем событие об ошибке
                    this._safeEmit('system:listener-error', {
                        originalEvent: event,
                        error: error.message,
                        listener: wrappedListener
                    });
                }
            }
        };
        
        /**
         * 🔒 Безопасная отправка (без рискования зацикливания)
         * @private
         */
        this._safeEmit = (eventName, data) => {
            // Простая отправка без записи в историю
            const listeners = _globalListeners.get(eventName);
            if (listeners) {
                for (const listener of listeners) {
                    try {
                        listener.original({ name: eventName, data, timestamp: Date.now() });
                    } catch (error) {
                        console.error('Error in safe emit:', error);
                    }
                }
            }
        };
        
        // ===============================================
        // 📊 УПРАВЛЕНИЕ И МОНИТОРИНГ
        // ===============================================
        
        /**
         * 📊 Получить статистику системы
         * @returns {Object}
         */
        this.getStats = () => {
            return Object.freeze({
                ..._stats,
                globalEvents: _globalListeners.size,
                historySize: _eventHistory.length,
                isEnabled: _isEnabled
            });
        };
        
        /**
         * 📋 Получить историю событий
         * @param {number} limit - лимит записей
         * @returns {Array}
         */
        this.getHistory = (limit = 100) => {
            return _eventHistory.slice(-limit);
        };
        
        /**
         * 🔍 Поиск в истории событий
         * @param {Function} predicate - функция фильтрации
         * @returns {Array}
         */
        this.searchHistory = (predicate) => {
            return _eventHistory.filter(predicate);
        };
        
        /**
         * 🧹 Очистка истории событий
         */
        this.clearHistory = () => {
            _eventHistory = [];
        };
        
        /**
         * 🔌 Включение/выключение системы
         * @param {boolean} enabled
         */
        this.setEnabled = (enabled) => {
            _isEnabled = !!enabled;
        };
        
        /**
         * 🧹 Полная очистка системы
         */
        this.reset = () => {
            _globalListeners.clear();
            _namespaceListeners.clear();
            _eventHistory = [];
            _stats = {
                totalEvents: 0,
                totalListeners: 0,
                namespaces: 0,
                errors: 0
            };
        };
        
        /**
         * 📋 Получить все активные слушатели
         * @returns {Object}
         */
        this.getActiveListeners = () => {
            const result = {
                global: {},
                namespaces: {}
            };
            
            // Глобальные слушатели
            for (const [event, listeners] of _globalListeners) {
                result.global[event] = listeners.size;
            }
            
            // Слушатели в namespace
            for (const [namespace, nsMap] of _namespaceListeners) {
                result.namespaces[namespace] = {};
                for (const [event, listeners] of nsMap) {
                    result.namespaces[namespace][event] = listeners.size;
                }
            }
            
            return Object.freeze(result);
        };
        
        // ===============================================
        // 🔒 ФИНАЛЬНАЯ ЗАЩИТА
        // ===============================================
        
        // Замораживаем методы
        Object.freeze(this.on);
        Object.freeze(this.onNamespace);
        Object.freeze(this.emit);
        Object.freeze(this.emitNamespace);
        Object.freeze(this.broadcast);
        Object.freeze(this.getStats);
        Object.freeze(this.getHistory);
        Object.freeze(this.searchHistory);
        Object.freeze(this.clearHistory);
        Object.freeze(this.setEnabled);
        Object.freeze(this.reset);
        Object.freeze(this.getActiveListeners);
        
        // Система готова
        Object.preventExtensions(this);
    }
}

// ===============================================
// 🌐 ГЛОБАЛЬНЫЙ ЭКЗЕМПЛЯР СИСТЕМЫ СОБЫТИЙ
// ===============================================

/**
 * 🌐 Глобальный экземпляр системы событий
 * Используется всеми компонентами архитектуры
 */
export const GlobalEventSystem = new EventSystem();

// Экспортируем систему для удобства
export { GlobalEventSystem as Events };

console.log('📡 Event System loaded');
console.log('📊 Global Event System ready:', GlobalEventSystem.getStats());
