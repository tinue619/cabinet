/**
 * Notification Service
 * Сервис уведомлений
 */

export class NotificationService {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.idCounter = 0;
        this.createContainer();
    }
    
    /**
     * Создать контейнер для уведомлений
     */
    createContainer() {
        this.container = document.getElementById('notifications');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notifications';
            this.container.className = 'notifications-container';
            document.body.appendChild(this.container);
        }
    }
    
    /**
     * Показать уведомление
     */
    show(message, type = 'info', duration = 3000) {
        const id = ++this.idCounter;
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.dataset.id = id;
        
        notification.innerHTML = `
            <div class="notification-icon">${this.getIcon(type)}</div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" data-id="${id}">×</button>
        `;
        
        // Добавляем в контейнер
        this.container.appendChild(notification);
        
        // Сохраняем ссылку
        this.notifications.set(id, notification);
        
        // Анимация появления
        requestAnimationFrame(() => {
            notification.classList.add('notification-show');
        });
        
        // Обработчик закрытия
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.remove(id);
        });
        
        // Автоудаление
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
        
        return id;
    }
    
    /**
     * Удалить уведомление
     */
    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;
        
        notification.classList.remove('notification-show');
        notification.classList.add('notification-hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(id);
        }, 300);
    }
    
    /**
     * Получить иконку для типа
     */
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
    
    /**
     * Методы для разных типов уведомлений
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }
    
    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }
    
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
    
    /**
     * Очистить все уведомления
     */
    clear() {
        this.notifications.forEach((notification, id) => {
            this.remove(id);
        });
    }
}