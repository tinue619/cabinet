/**
 * History Manager Module
 * Handles undo/redo functionality
 */

export class HistoryManager {
    constructor(maxSize = 50) {
        this.maxSize = maxSize;
        this.history = [];
        this.currentIndex = -1;
    }
    
    /**
     * Push state to history
     */
    push(state) {
        // Remove any states after current index
        this.history = this.history.slice(0, this.currentIndex + 1);
        
        // Add new state
        this.history.push(JSON.parse(JSON.stringify(state)));
        
        // Limit history size
        if (this.history.length > this.maxSize) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }
    }
    
    /**
     * Undo to previous state
     */
    undo() {
        if (this.canUndo()) {
            this.currentIndex--;
            return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
        }
        return null;
    }
    
    /**
     * Redo to next state
     */
    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
        }
        return null;
    }
    
    /**
     * Check if can undo
     */
    canUndo() {
        return this.currentIndex > 0;
    }
    
    /**
     * Check if can redo
     */
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }
    
    /**
     * Clear history
     */
    clear() {
        this.history = [];
        this.currentIndex = -1;
    }
    
    /**
     * Get current state
     */
    getCurrentState() {
        if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
            return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
        }
        return null;
    }
    
    /**
     * Get history info
     */
    getInfo() {
        return {
            size: this.history.length,
            currentIndex: this.currentIndex,
            canUndo: this.canUndo(),
            canRedo: this.canRedo()
        };
    }
}