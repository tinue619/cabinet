/**
 * State Manager Service
 * Управление состоянием приложения и историей
 */

export class StateManager {
    constructor(maxHistorySize = 50) {
        this.history = [];
        this.currentIndex = -1;
        this.maxHistorySize = maxHistorySize;
    }
    
    /**
     * Сохранить состояние
     */
    saveState(state) {
        // Удаляем все состояния после текущего индекса
        this.history = this.history.slice(0, this.currentIndex + 1);
        
        // Глубокое копирование состояния
        const stateCopy = this.deepCopy(state);
        
        // Добавляем новое состояние
        this.history.push(stateCopy);
        
        // Ограничиваем размер истории
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }
    }
    
    /**
     * Отменить
     */
    undo() {
        if (this.canUndo()) {
            this.currentIndex--;
            return this.deepCopy(this.history[this.currentIndex]);
        }
        return null;
    }
    
    /**
     * Повторить
     */
    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            return this.deepCopy(this.history[this.currentIndex]);
        }
        return null;
    }
    
    /**
     * Можно ли отменить
     */
    canUndo() {
        return this.currentIndex > 0;
    }
    
    /**
     * Можно ли повторить
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }
    
    /**
     * Очистить историю
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
    }
    
    /**
     * Глубокое копирование объекта
     */
    deepCopy(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.map(item => this.deepCopy(item));
        }
        
        if (obj instanceof Object) {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepCopy(obj[key]);
                }
            }
            return clonedObj;
        }
    }
}