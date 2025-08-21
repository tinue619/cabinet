/**
 * ПРОСТЕЙШАЯ ДИАГНОСТИКА - ТОЛЬКО ЯДРО
 * Infrastructure Layer - Basic Core Testing
 */

console.log('🧪 Testing core loading directly...');

// Пробуем загрузить ядро напрямую
const CORE_PATH = '../../new_core/index.js';

console.log('📍 Attempting to load core from:', CORE_PATH);

import(CORE_PATH)
    .then(coreModule => {
        console.log('✅ CORE LOADED SUCCESSFULLY!', coreModule);
        
        // Проверяем экспорты
        if (coreModule.SystemFactory) {
            console.log('✅ SystemFactory found:', coreModule.SystemFactory);
            
            // Пробуем создать систему
            const system = coreModule.SystemFactory.create();
            console.log('✅ System created:', system);
            
            // Пробуем создать материалы
            const ldsp = system.createLDSP16();
            console.log('✅ Material created:', ldsp);
            
            // Пробуем создать шкаф
            const cabinet = system.createCabinet({
                width: 800,
                height: 2000, 
                depth: 600,
                baseHeight: 100
            });
            console.log('✅ Cabinet created:', cabinet);
            
            // Генерируем панели
            cabinet.generate();
            console.log('✅ Cabinet generated');
            
            // Получаем данные
            const stats = cabinet.getStats();
            console.log('✅ Cabinet stats:', stats);
            
            // Сигнализируем о успехе
            window.dispatchEvent(new CustomEvent('cabinet-app-ready', {
                detail: { 
                    message: 'Core test successful',
                    system: system,
                    cabinet: cabinet
                }
            }));
            
        } else {
            throw new Error('SystemFactory not found in core module');
        }
    })
    .catch(error => {
        console.error('❌ CORE TEST FAILED:', error);
        
        // Детальная диагностика
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            attempted_path: CORE_PATH
        });
        
        window.dispatchEvent(new CustomEvent('cabinet-app-error', {
            detail: { 
                message: `Core test failed: ${error.message}`,
                path: CORE_PATH,
                stack: error.stack
            }
        }));
    });

// Экспорт для тестирования
export default {
    name: 'Core Diagnostic',
    version: '1.0-core-test',
    corePath: CORE_PATH
};
