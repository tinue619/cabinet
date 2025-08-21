// Главный менеджер приложения
export class AppManager {
    constructor() {
        this.version = '3.1';
        this.isInitialized = false;
    }
    
    initialize() {
        this.isInitialized = true;
        console.log(`🚀 AppManager initialized - Cabinet Designer v${this.version}`);
    }
    
    getApplicationInfo() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            hasSystem: !!window.CabinetApp.result,
            hasRenderer: !!window.CabinetApp.renderer,
            hasCabinet: !!window.CabinetApp.currentCabinet,
            currentMode: window.CabinetApp.currentMode,
            settings: { ...window.CabinetApp.settings }
        };
    }
    
    exportApplicationState() {
        const info = this.getApplicationInfo();
        
        if (!info.hasCabinet) {
            window.CabinetApp.notificationManager.show(
                'warning', 
                'Нет данных', 
                'Создайте шкаф для экспорта состояния'
            );
            return null;
        }
        
        const exportData = {
            version: this.version,
            timestamp: Date.now(),
            application: info,
            cabinet: window.CabinetApp.currentCabinet.serialize(),
            renderer: window.CabinetApp.renderer.getDebugInfo()
        };
        
        return exportData;
    }
    
    reset() {
        window.CabinetApp.currentMode = 'view';
        window.CabinetApp.settings = {
            showPanels: true,
            showSections: true,
            showDimensions: false
        };
        
        if (window.CabinetApp.notificationManager) {
            window.CabinetApp.notificationManager.clear();
        }
        
        console.log('🔄 Application state reset');
    }
}
