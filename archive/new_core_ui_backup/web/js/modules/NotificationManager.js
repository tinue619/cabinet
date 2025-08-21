/**
 * Notification Manager Module
 * Handles toast notifications
 */

export class NotificationManager {
    constructor() {
        this.container = document.getElementById('notifications');
        this.notifications = new Map();
        this.idCounter = 0;
    }
    
    /**
     * Show notification
     */
    show(message, type = 'info', duration = 3000) {
        const id = ++this.idCounter;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type} fade-in`;
        notification.dataset.id = id;
        
        // Add icon based on type
        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            ${icon}
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        // Add to container
        if (this.container) {
            this.container.appendChild(notification);
        }
        
        // Store reference
        this.notifications.set(id, notification);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
        
        return id;
    }
    
    /**
     * Remove notification
     */
    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;
        
        // Add fade out animation
        notification.style.animation = 'slideOut 0.3s ease forwards';
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }
    
    /**
     * Clear all notifications
     */
    clear() {
        this.notifications.forEach((notification, id) => {
            this.remove(id);
        });
    }
    
    /**
     * Get icon for notification type
     */
    getIcon(type) {
        const icons = {
            success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z"/>
            </svg>`,
            error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15h-2v-2h2v2zm0-4h-2V5h2v6z"/>
            </svg>`,
            warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M1 17h18L10 2 1 17zm10-2H9v-2h2v2zm0-4H9V7h2v4z"/>
            </svg>`,
            info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-6h2v6zm0-8H9V5h2v2z"/>
            </svg>`
        };
        
        return icons[type] || icons.info;
    }
    
    /**
     * Show success notification
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }
    
    /**
     * Show error notification
     */
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }
    
    /**
     * Show warning notification
     */
    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }
    
    /**
     * Show info notification
     */
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}