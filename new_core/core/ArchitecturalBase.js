// 🏗️ АРХИТЕКТУРНАЯ БАЗА - Фундамент всех сущностей
// Обеспечивает полную инкапсуляцию и единые принципы

"use strict";

import { ArchitecturalGuardian } from './ArchitecturalGuardian.js';

/**
 * 🏗️ БАЗОВЫЙ КЛАСС ВСЕХ АРХИТЕКТУРНЫХ СУЩНОСТЕЙ
 * Обеспечивает полную инкапсуляцию, иерархию, события и валидацию
 * Все сущности системы наследуются от этого класса
 */
export class ArchitecturalBase {
    constructor(type, id) {
        // 🔒 Приватные данные через замыкания (полная инкапсуляция)
        let _id = id || `${type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        let _type = type;
        let _created = Date.now();
        let _modified = _created;
        let _parent = null;
        let _children = new Map();
        let _properties = new Map();
        let _eventListeners = new Map();
        
        // 🛡️ Страж архитектуры для каждой сущности
        const guardian = new ArchitecturalGuardian();
        
        // 🔒 Защищенные геттеры (только чтение)
        Object.defineProperty(this, 'id', {
            get: () => _id,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'type', {
            get: () => _type,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'created', {
            get: () => _created,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'modified', {
            get: () => _modified,
            enumerable: true,
            configurable: false
        });
        
        Object.defineProperty(this, 'parent', {
            get: () => _parent,
            enumerable: true,
            configurable: false
        });
        
        // 🔐 Маркер инкапсуляции (для стража)
        Object.defineProperty(this, '_isEncapsulated', {
            value: true,
            enumerable: false,
            configurable: false
        });
        
        // ===============================================
        // 🔄 УПРАВЛЕНИЕ ИЕРАРХИЕЙ (защищенные методы)
        // ===============================================
        
        /**
         * 🔗 Установка родителя (только для внутреннего использования)
         * @param {ArchitecturalBase|null} newParent 
         */
        this._setParent = (newParent) => {
            if (_parent === newParent) return;
            
            // Валидация через стража
            if (!guardian.validateEntity(this, 'SET_PARENT')) {
                guardian.enforceOrThrow('SET_PARENT');
            }
            
            const oldParent = _parent;
            _parent = newParent;
            _modified = Date.now();
            
            this._emit('parent-changed', { oldParent, newParent });
        };
        
        /**
         * ➕ Добавление дочернего элемента
         * @param {ArchitecturalBase} child 
         */
        this._addChild = (child) => {
            if (!child || !child.id) {
                throw new Error('Child must have valid id');
            }
            
            if (_children.has(child.id)) {
                throw new Error(`Child with id ${child.id} already exists`);
            }
            
            // Валидация через стража
            if (!guardian.validateEntity(child, 'ADD_CHILD')) {
                guardian.enforceOrThrow('ADD_CHILD');
            }
            
            _children.set(child.id, child);
            child._setParent(this);
            _modified = Date.now();
            
            this._emit('child-added', { child });
            return child;
        };
        
        /**
         * ➖ Удаление дочернего элемента
         * @param {string} childId 
         */
        this._removeChild = (childId) => {
            const child = _children.get(childId);
            if (!child) return null;
            
            _children.delete(childId);
            child._setParent(null);
            _modified = Date.now();
            
            this._emit('child-removed', { child });
            return child;
        };
        
        // ===============================================
        // 🔍 МЕТОДЫ ДОСТУПА К ИЕРАРХИИ (только чтение)
        // ===============================================
        
        /**
         * 🔍 Получить дочерний элемент по ID
         * @param {string} childId 
         * @returns {ArchitecturalBase|null}
         */
        this.getChild = (childId) => {
            return _children.get(childId) || null;
        };
        
        /**
         * 📋 Получить всех детей
         * @returns {ArchitecturalBase[]}
         */
        this.getChildren = () => {
            return Array.from(_children.values());
        };
        
        /**
         * ❓ Есть ли дети
         * @returns {boolean}
         */
        this.hasChildren = () => {
            return _children.size > 0;
        };
        
        /**
         * ❓ Есть ли конкретный ребенок
         * @param {string} childId 
         * @returns {boolean}
         */
        this.hasChild = (childId) => {
            return _children.has(childId);
        };
        
        /**
         * 🔍 Поиск в иерархии по предикату
         * @param {Function} predicate 
         * @returns {ArchitecturalBase[]}
         */
        this.findInHierarchy = (predicate) => {
            const results = [];
            
            // Проверяем себя
            if (predicate(this)) {
                results.push(this);
            }
            
            // Рекурсивно проверяем детей
            for (const child of _children.values()) {
                if (child.findInHierarchy) {
                    results.push(...child.findInHierarchy(predicate));
                }
            }
            
            return results;
        };
        
        // ===============================================
        // 🏷️ УПРАВЛЕНИЕ СВОЙСТВАМИ
        // ===============================================
        
        /**
         * 📝 Установка свойства (защищенный метод)
         * @param {string} key 
         * @param {any} value 
         */
        this._setProperty = (key, value) => {
            const oldValue = _properties.get(key);
            _properties.set(key, value);
            _modified = Date.now();
            
            this._emit('property-changed', { key, oldValue, newValue: value });
        };
        
        /**
         * 🔍 Получение свойства
         * @param {string} key 
         * @returns {any}
         */
        this.getProperty = (key) => {
            return _properties.get(key);
        };
        
        /**
         * ❓ Есть ли свойство
         * @param {string} key 
         * @returns {boolean}
         */
        this.hasProperty = (key) => {
            return _properties.has(key);
        };
        
        /**
         * 📋 Получить все свойства
         * @returns {Map}
         */
        this.getProperties = () => {
            return new Map(_properties);
        };
        
        // ===============================================
        // 📡 СИСТЕМА СОБЫТИЙ
        // ===============================================
        
        /**
         * 👂 Подписка на событие
         * @param {string} event 
         * @param {Function} listener 
         * @returns {Function} - функция отписки
         */
        this.on = (event, listener) => {
            if (typeof listener !== 'function') {
                throw new Error('Listener must be a function');
            }
            
            if (!_eventListeners.has(event)) {
                _eventListeners.set(event, new Set());
            }
            _eventListeners.get(event).add(listener);
            
            // Возвращаем функцию отписки
            return () => {
                const listeners = _eventListeners.get(event);
                if (listeners) {
                    listeners.delete(listener);
                }
            };
        };
        
        /**
         * 📡 Отправка события (защищенный метод)
         * @param {string} event 
         * @param {Object} data 
         */
        this._emit = (event, data = {}) => {
            const listeners = _eventListeners.get(event);
            if (listeners) {
                for (const listener of listeners) {
                    try {
                        listener({ 
                            ...data, 
                            source: this, 
                            event, 
                            timestamp: Date.now() 
                        });
                    } catch (error) {
                        console.error(`Error in event listener for ${event}:`, error);
                    }
                }
            }
            
            // Пробрасываем событие к родителю (bubble up)
            if (_parent && _parent._emit) {
                _parent._emit(`child-${event}`, { ...data, child: this });
            }
        };
        
        // ===============================================
        // 🔄 ВАЛИДАЦИЯ АРХИТЕКТУРЫ
        // ===============================================
        
        /**
         * ✅ Валидация сущности
         * @returns {boolean}
         */
        this.validate = () => {
            return guardian.validateEntity(this, 'VALIDATE');
        };
        
        /**
         * 📋 Получение отчета о валидации
         * @returns {Object}
         */
        this.getValidationReport = () => {
            guardian.validateEntity(this, 'VALIDATE');
            return guardian.getViolationReport();
        };
        
        // ===============================================
        // 💾 СЕРИАЛИЗАЦИЯ
        // ===============================================
        
        /**
         * 💾 Сериализация в JSON
         * @returns {Object}
         */
        this.serialize = () => {
            return Object.freeze({
                id: _id,
                type: _type,
                created: _created,
                modified: _modified,
                parent: _parent?.id || null,
                children: Array.from(_children.values()).map(child => child.serialize()),
                properties: Object.fromEntries(_properties),
                ...this.getSpecificData()
            });
        };
        
        /**
         * 🎯 Получение специфичных данных сущности
         * Переопределяется в наследниках
         * @returns {Object}
         */
        this.getSpecificData = () => {
            return {};
        };
        
        // ===============================================
        // 🔒 ФИНАЛЬНАЯ ЗАЩИТА
        // ===============================================
        
        // ПОЛНОЕ ЗАМОРАЖИВАНИЕ ПЕРЕНОСИМ В НАСЛЕДНИКИ!
        // Чтобы наследники могли добавлять свои свойства
        
        // Блокируем изменение критичных методов
        Object.freeze(this.getChild);
        Object.freeze(this.getChildren);
        Object.freeze(this.findInHierarchy);
        Object.freeze(this.validate);
        Object.freeze(this.serialize);
        
        // Метод для финальной защиты (вызывается в наследниках)
        this._finalizeEntity = () => {
            Object.preventExtensions(this);
        };
    }
}

console.log('🏗️ Architectural Base loaded');