/**
 * Event Manager Module
 * Handles event delegation and custom events
 */

export class EventManager {
    constructor(app) {
        this.app = app;
        this.listeners = new Map();
    }
    
    /**
     * Subscribe to event
     */
    on(eventName, callback) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(callback);
    }
    
    /**
     * Unsubscribe from event
     */
    off(eventName, callback) {
        if (!this.listeners.has(eventName)) return;
        
        const callbacks = this.listeners.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }
    
    /**
     * Emit event
     */
    emit(eventName, data) {
        if (!this.listeners.has(eventName)) return;
        
        const callbacks = this.listeners.get(eventName);
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event handler for ${eventName}:`, error);
            }
        });
    }
    
    /**
     * Setup cabinet events
     */
    setupCabinetEvents(cabinet) {
        if (!cabinet) return;
        
        // Listen to cabinet events
        cabinet.on('panel-added', (data) => {
            this.emit('cabinet-changed', { type: 'panel-added', data });
            this.app.ui.updateAll();
        });
        
        cabinet.on('panel-removed', (data) => {
            this.emit('cabinet-changed', { type: 'panel-removed', data });
            this.app.ui.updateAll();
        });
        
        cabinet.on('section-changed', (data) => {
            this.emit('cabinet-changed', { type: 'section-changed', data });
            this.app.ui.updateAll();
        });
    }
}