/**
 * ВРЕМЕННОЕ ИСПРАВЛЕНИЕ - ПРЯМОЙ ТЕСТ МАТЕРИАЛОВ
 * Infrastructure Layer - Material Testing Fix
 */

console.log('🔧 Testing materials directly...');

// Импортируем напрямую без лишних обверток
import('../../new_core/entities/Material.js')
    .then(materialModule => {
        console.log('✅ Material module loaded:', materialModule);
        
        // Тестируем статические методы
        const Material = materialModule.Material;
        
        console.log('🧪 Testing Material.createLDSP16()...');
        const ldsp16 = Material.createLDSP16();
        console.log('✅ LDSP16 created:', ldsp16);
        console.log('  - Name:', ldsp16.name);
        console.log('  - Thickness:', ldsp16.thickness);
        console.log('  - Material Kind:', ldsp16.materialKind);
        
        console.log('🧪 Testing Material.createHDF3()...');
        const hdf3 = Material.createHDF3();
        console.log('✅ HDF3 created:', hdf3);
        
        console.log('🧪 Testing Material.createMDF16()...');
        const mdf16 = Material.createMDF16();
        console.log('✅ MDF16 created:', mdf16);
        
        // Сигнализируем о успехе
        window.dispatchEvent(new CustomEvent('cabinet-app-ready', {
            detail: { 
                message: 'Materials test successful',
                materials: { ldsp16, hdf3, mdf16 }
            }
        }));
        
    })
    .catch(error => {
        console.error('❌ MATERIALS TEST FAILED:', error);
        
        // Детальная диагностика
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        window.dispatchEvent(new CustomEvent('cabinet-app-error', {
            detail: { 
                message: `Materials test failed: ${error.message}`,
                stack: error.stack
            }
        }));
    });

// Экспорт для тестирования
export default {
    name: 'Materials Test',
    version: '1.0-materials-direct'
};
