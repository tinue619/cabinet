// Менеджер уведомлений
export class NotificationManager {
    constructor() {
        this.container = document.getElementById('notifications');
        this.notifications = [];
    }
    
    show(type, title, message, duration = 5000) {
        const notification = this.createNotification(type, title, message);
        
        // Добавляем в контейнер
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Автоматическое удаление
        setTimeout(() => {
            this.remove(notification);
        }, duration);
        
        return notification;
    }
    
    createNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">×</button>
        `;
        
        // Обработчик закрытия
        notification.querySelector('.notification-close').onclick = () => {
            this.remove(notification);
        };
        
        return notification;
    }
    
    remove(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    }
    
    clear() {
        this.notifications.forEach(notification => {
            notification.remove();
        });
        this.notifications = [];
    }
}
