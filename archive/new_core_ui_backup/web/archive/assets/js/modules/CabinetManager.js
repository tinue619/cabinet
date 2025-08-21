// Менеджер управления шкафами
export class CabinetManager {
    constructor() {
        this.elements = {
            width: document.getElementById('cabinet-width'),
            height: document.getElementById('cabinet-height'),
            depth: document.getElementById('cabinet-depth'),
            base: document.getElementById('cabinet-base')
        };
    }
    
    initialize() {
        console.log('✅ CabinetManager initialized');
    }
    
    applyDimensions() {
        const width = parseInt(this.elements.width.value);
        const height = parseInt(this.elements.height.value);
        const depth = parseInt(this.elements.depth.value);
        const base = parseInt(this.elements.base.value);
        
        // Валидация
        if (!this.validateDimensions(width, height, depth, base)) {
            return;
        }
        
        try {
            // Создание нового шкафа
            const newCabinet = window.CabinetApp.result.system.createCabinet({
                width,
                height,
                depth,
                baseHeight: base
            });
            
            newCabinet.generate();
            window.CabinetApp.currentCabinet = newCabinet;
            window.CabinetApp.renderer.setCabinet(newCabinet);
            
            // Обновление интерфейса
            window.CabinetApp.uiManager.updateInterface();
            
            window.CabinetApp.notificationManager.show(
                'success', 
                'Размеры применены', 
                `Создан шкаф ${width}×${height}×${depth} мм`
            );
            
        } catch (error) {
            console.error('Error creating cabinet:', error);
            window.CabinetApp.notificationManager.show('error', 'Ошибка создания', error.message);
        }
    }
    
    validateDimensions(width, height, depth, base) {
        const validations = [
            { value: width, min: 400, max: 2000, name: 'Ширина' },
            { value: height, min: 600, max: 3000, name: 'Высота' },
            { value: depth, min: 300, max: 800, name: 'Глубина' },
            { value: base, min: 60, max: 200, name: 'Высота цоколя' }
        ];
        
        for (const validation of validations) {
            if (validation.value < validation.min || validation.value > validation.max) {
                window.CabinetApp.notificationManager.show(
                    'error', 
                    'Ошибка размеров', 
                    `${validation.name} должна быть от ${validation.min} до ${validation.max} мм`
                );
                return false;
            }
        }
        
        return true;
    }
    
    setPreset(width, height, depth, base) {
        this.elements.width.value = width;
        this.elements.height.value = height;
        this.elements.depth.value = depth;
        this.elements.base.value = base;
        
        this.applyDimensions();
    }
    
    createRandomCabinet() {
        const width = 600 + Math.random() * 800; // 600-1400
        const height = 1800 + Math.random() * 600; // 1800-2400
        const depth = 400 + Math.random() * 300; // 400-700
        const base = 80 + Math.random() * 40; // 80-120
        
        this.setPreset(
            Math.round(width / 10) * 10,
            Math.round(height / 10) * 10,
            Math.round(depth / 10) * 10,
            Math.round(base / 5) * 5
        );
    }
    
    getCabinetStats() {
        if (!window.CabinetApp.currentCabinet) {
            return null;
        }
        
        return {
            dimensions: window.CabinetApp.currentCabinet.dimensions,
            stats: window.CabinetApp.currentCabinet.getStats(),
            panels: window.CabinetApp.currentCabinet.getPanels().length,
            sections: window.CabinetApp.currentCabinet.getSections().length
        };
    }
}
