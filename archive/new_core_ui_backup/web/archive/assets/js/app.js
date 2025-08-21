// Главный файл приложения Cabinet Designer
import { quickStart, Renderer2D } from '../../index.js';
import { AppManager } from './modules/AppManager.js';
import { UIManager } from './modules/UIManager.js';
import { CabinetManager } from './modules/CabinetManager.js';
import { NotificationManager } from './modules/NotificationManager.js';

console.log('🚀 Starting Cabinet Designer Web App...');

// Глобальное состояние приложения
window.CabinetApp = {
    // Менеджеры
    appManager: null,
    uiManager: null,
    cabinetManager: null,
    notificationManager: null,
    
    // Система
    result: null,
    renderer: null,
    currentCabinet: null,
    
    // Состояние
    currentMode: 'view',
    settings: {
        showPanels: true,
        showSections: true,
        showDimensions: false
    }
};

// Инициализация приложения
async function initializeApp() {
    try {
        // Показываем экран загрузки
        showLoadingScreen('Инициализация системы...');
        await sleep(300);
        
        // Создаем менеджеры
        window.CabinetApp.notificationManager = new NotificationManager();
        window.CabinetApp.appManager = new AppManager();
        
        showLoadingScreen('Загрузка ядра...');
        await sleep(500);
        
        // Инициализация ядра
        window.CabinetApp.result = quickStart();
        
        showLoadingScreen('Создание рендерера...');
        await sleep(300);
        
        // Создание рендерера
        const canvas = document.getElementById('cabinet-canvas');
        window.CabinetApp.renderer = new Renderer2D(canvas, window.CabinetApp.result.system);
        window.CabinetApp.renderer.init();
        
        showLoadingScreen('Настройка интерфейса...');
        await sleep(300);
        
        // Создание менеджеров
        window.CabinetApp.uiManager = new UIManager();
        window.CabinetApp.cabinetManager = new CabinetManager();
        
        // Установка первого шкафа
        window.CabinetApp.currentCabinet = window.CabinetApp.result.cabinet;
        window.CabinetApp.renderer.setCabinet(window.CabinetApp.currentCabinet);
        
        // Инициализация интерфейса
        window.CabinetApp.uiManager.initialize();
        window.CabinetApp.cabinetManager.initialize();
        
        // Скрытие загрузки
        hideLoadingScreen();
        
        // Показ уведомления о готовности
        window.CabinetApp.notificationManager.show('success', 'Система готова', 'Cabinet Designer успешно загружен');
        
        console.log('✅ Cabinet Designer initialized successfully');
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        window.CabinetApp.notificationManager?.show('error', 'Ошибка загрузки', error.message);
        hideLoadingScreen();
    }
}

// Утилиты загрузки
function showLoadingScreen(message) {
    const loading = document.getElementById('loading-screen');
    const text = loading.querySelector('p');
    text.textContent = message;
    loading.style.display = 'flex';
    document.getElementById('app').style.display = 'none';
}

function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});
