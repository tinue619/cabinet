/**
 * ДИАГНОСТИЧЕСКАЯ ВЕРСИЯ APP.JS
 * Упрощенная версия для выявления проблем
 */

console.log('🚀 Starting diagnostic version...');

// Пробуем загрузить только ядро для начала
import('./services/CabinetCoreService.js')
    .then(module => {
        console.log('✅ CabinetCoreService loaded:', module);
        
        // Создаем сервис
        const service = new module.CabinetCoreService();
        console.log('✅ Service created:', service);
        
        // Пробуем инициализировать
        return service.initialize();
    })
    .then(() => {
        console.log('✅ Service initialized successfully');
        
        // Отправляем событие о готовности
        window.dispatchEvent(new CustomEvent('cabinet-app-ready', {
            detail: { message: 'Diagnostic version ready' }
        }));
    })
    .catch(error => {
        console.error('❌ Diagnostic failed:', error);
        
        // Отправляем событие об ошибке
        window.dispatchEvent(new CustomEvent('cabinet-app-error', {
            detail: { message: error.message, stack: error.stack }
        }));
    });

// Экспортируем простой объект для тестирования
export default {
    name: 'Cabinet Designer Diagnostic',
    version: '1.0-diagnostic',
    status: 'testing'
};
