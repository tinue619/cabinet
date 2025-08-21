/**
 * ТЕСТ ИСПРАВЛЕННЫХ СЕКЦИЙ
 * Domain Layer - Testing Fixed Section Geometry
 */

console.log('🔧 Testing FIXED sections...');

// Импортируем все что нужно для системы
import('../../new_core/index.js')
    .then(coreModule => {
        console.log('✅ Core module loaded:', coreModule);
        
        const { SystemFactory } = coreModule;
        
        // Создаем систему с включенной валидацией
        console.log('🏭 Creating system with validation...');
        const system = SystemFactory.create({
            enableEvents: true,
            enableValidation: true, // ВКЛЮЧАЕМ валидацию обратно
            debugMode: true
        });
        
        console.log('✅ System created:', system);
        
        // Создаем материалы  
        console.log('🧱 Creating materials...');
        const ldsp16 = system.createLDSP16();
        const hdf3 = system.createHDF3();
        const mdf16 = system.createMDF16();
        
        console.log('✅ Materials created:', {
            ldsp16: ldsp16.name,
            hdf3: hdf3.name, 
            mdf16: mdf16.name
        });
        
        // Создаем шкаф
        console.log('🏗️ Creating cabinet...');
        const cabinet = system.createCabinet({
            width: 800,
            height: 2000,
            depth: 600,
            baseHeight: 100
        });
        
        console.log('✅ Cabinet created:', cabinet);
        
        // Пытаемся генерировать ВСЁ - включая секции!
        console.log('⚙️ Generating FULL cabinet with sections...');
        try {
            // Полная генерация - все компоненты
            cabinet.generate();
            
            console.log('🎉 FULL cabinet generation SUCCESSFUL!');
            console.log('📊 Cabinet stats:', cabinet.getStats());
            
        } catch (error) {
            console.error('❌ CABINET GENERATION FAILED:', error);
            console.error('📊 Stack trace:', error.stack);
            
            // Fallback на упрощенную версию
            console.log('🔄 Falling back to simplified generation...');
            try {
                cabinet._createMaterials();
                cabinet._createRequiredPanels();
                cabinet._establishPanelConnections();
                console.log('✅ Simplified generation successful');
            } catch (fallbackError) {
                console.error('❌ Even simplified generation failed:', fallbackError);
            }
        }
        
        // Получаем данные для отрисовки
        const cabinetData = {
            dimensions: cabinet.dimensions,
            panels: cabinet.getPanels(),
            sections: cabinet.getSections(),
            stats: {
                panelsCount: cabinet.getPanels().length,
                sectionsCount: cabinet.getSections().length,
                volume: (cabinet.dimensions.width * cabinet.dimensions.height * cabinet.dimensions.depth) / 1000000000
            }
        };
        
        console.log('📊 Final cabinet data:', cabinetData);
        
        // Проверяем что получилось
        if (cabinetData.sections.length > 0) {
            console.log('🎯 SECTIONS CREATED SUCCESSFULLY!');
            console.log('📐 Section details:');
            cabinetData.sections.forEach((section, index) => {
                console.log(`  Section ${index + 1}:`, section.bounds);
            });
            
            // Полная отрисовка с секциями
            drawFullCabinetOnCanvas(cabinetData);
        } else {
            console.log('⚠️ No sections created, drawing simplified version');
            // Упрощенная отрисовка без секций
            drawSimplifiedCabinetOnCanvas(cabinetData);
        }
        
        // Обновляем UI
        updateCabinetInfo(cabinetData);
        
        // Сигнализируем о готовности
        const eventType = cabinetData.sections.length > 0 ? 'cabinet-sections-working' : 'cabinet-sections-failed';
        window.dispatchEvent(new CustomEvent(eventType, {
            detail: { 
                message: cabinetData.sections.length > 0 
                    ? 'Sections fix successful!'
                    : 'Sections still not working',
                cabinet: cabinetData,
                sectionsWorking: cabinetData.sections.length > 0
            }
        }));
        
    })
    .catch(error => {
        console.error('❌ SECTIONS FIX TEST FAILED:', error);
        
        window.dispatchEvent(new CustomEvent('cabinet-sections-failed', {
            detail: { 
                message: `Sections fix test failed: ${error.message}`,
                stack: error.stack
            }
        }));
    });

/**
 * 🎨 ПОЛНАЯ отрисовка шкафа на Canvas (С секциями!)
 * UI Layer - Complete Rendering
 */
function drawFullCabinetOnCanvas(cabinetData) {
    console.log('🎨 Drawing FULL cabinet with sections on canvas...');
    
    const canvas = document.getElementById('cabinet-canvas');
    if (!canvas) {
        console.error('❌ Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('❌ Canvas context not found');
        return;
    }
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Устанавливаем размеры canvas
    canvas.width = 800;
    canvas.height = 600;
    
    if (!cabinetData.dimensions) {
        console.error('❌ No cabinet dimensions');
        return;
    }
    
    const dims = cabinetData.dimensions;
    
    // Масштаб для отображения
    const scale = Math.min(700 / dims.width, 500 / dims.height);
    const offsetX = (canvas.width - dims.width * scale) / 2;
    const offsetY = (canvas.height - dims.height * scale) / 2;
    
    // 1. Рисуем общий контур шкафа
    ctx.fillStyle = '#f5f5f5';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    const cabinetWidth = dims.width * scale;
    const cabinetHeight = dims.height * scale;
    
    ctx.fillRect(offsetX, offsetY, cabinetWidth, cabinetHeight);
    ctx.strokeRect(offsetX, offsetY, cabinetWidth, cabinetHeight);
    
    // 2. Рисуем секции (главная фича!)
    ctx.fillStyle = 'rgba(100, 200, 100, 0.3)';
    ctx.strokeStyle = '#006600';
    ctx.lineWidth = 2;
    
    if (cabinetData.sections && cabinetData.sections.length > 0) {
        cabinetData.sections.forEach((section, index) => {
            if (section.bounds) {
                const bounds = section.bounds;
                const sectionX = offsetX + bounds.left * scale;
                const sectionY = offsetY + (dims.height - bounds.bottom) * scale; // Инвертируем Y
                const sectionW = (bounds.right - bounds.left) * scale;
                const sectionH = (bounds.bottom - bounds.top) * scale;
                
                ctx.fillRect(sectionX, sectionY, sectionW, sectionH);
                ctx.strokeRect(sectionX, sectionY, sectionW, sectionH);
                
                // Подписываем секцию
                ctx.fillStyle = '#006600';
                ctx.font = '12px Arial bold';
                ctx.fillText(`Секция ${index + 1}`, sectionX + 5, sectionY + 20);
                ctx.fillText(`${Math.round(bounds.width)}×${Math.round(bounds.height)}мм`, sectionX + 5, sectionY + 35);
                ctx.fillStyle = 'rgba(100, 200, 100, 0.3)';
            }
        });
    }
    
    // 3. Заголовок
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial bold';
    const title = cabinetData.sections.length > 0 
        ? `✅ СЕКЦИИ РАБОТАЮТ! ${dims.width}×${dims.height}×${dims.depth}мм`
        : `❌ Секции не работают ${dims.width}×${dims.height}×${dims.depth}мм`;
    ctx.fillText(title, offsetX, offsetY - 20);
    
    ctx.font = '12px Arial';
    const subtitle = `${cabinetData.stats.panelsCount} панелей, ${cabinetData.stats.sectionsCount} секций`;
    ctx.fillText(subtitle, offsetX, offsetY - 5);
    
    console.log('✅ Cabinet drawn with sections status!');
}

/**
 * 🎨 Упрощенная отрисовка шкафа на Canvas (БЕЗ секций)
 * UI Layer - Fallback Rendering
 */
function drawSimplifiedCabinetOnCanvas(cabinetData) {
    console.log('🎨 Drawing simplified cabinet on canvas...');
    
    const canvas = document.getElementById('cabinet-canvas');
    if (!canvas) {
        console.error('❌ Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('❌ Canvas context not found');
        return;
    }
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Устанавливаем размеры canvas
    canvas.width = 800;
    canvas.height = 600;
    
    if (!cabinetData.dimensions) {
        console.error('❌ No cabinet dimensions');
        return;
    }
    
    const dims = cabinetData.dimensions;
    
    // Масштаб для отображения
    const scale = Math.min(700 / dims.width, 500 / dims.height);
    const offsetX = (canvas.width - dims.width * scale) / 2;
    const offsetY = (canvas.height - dims.height * scale) / 2;
    
    // Рисуем только общий контур шкафа
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    const cabinetWidth = dims.width * scale;
    const cabinetHeight = dims.height * scale;
    
    ctx.fillRect(offsetX, offsetY, cabinetWidth, cabinetHeight);
    ctx.strokeRect(offsetX, offsetY, cabinetWidth, cabinetHeight);
    
    // Добавляем текст
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText(`❌ Секции не работают ${dims.width}×${dims.height}×${dims.depth}мм`, offsetX, offsetY - 20);
    ctx.fillText(`(${cabinetData.stats.panelsCount} панелей, секции отключены)`, offsetX, offsetY - 5);
    
    console.log('✅ Simplified cabinet drawn on canvas');
}

/**
 * Обновление информации о шкафе в UI
 */
function updateCabinetInfo(cabinetData) {
    console.log('📋 Updating cabinet info...');
    
    // Обновляем статистику
    const statVolume = document.getElementById('stat-volume');
    const statPanels = document.getElementById('stat-panels');
    const statSections = document.getElementById('stat-sections');
    
    if (statVolume && cabinetData.stats) {
        const volume = (cabinetData.stats.volume || 0).toFixed(3);
        statVolume.textContent = `${volume} м³`;
    }
    
    if (statPanels && cabinetData.stats) {
        statPanels.textContent = cabinetData.stats.panelsCount || 0;
    }
    
    if (statSections && cabinetData.stats) {
        const sectionsText = cabinetData.stats.sectionsCount > 0 
            ? `${cabinetData.stats.sectionsCount} ✅`
            : `${cabinetData.stats.sectionsCount} ❌`;
        statSections.textContent = sectionsText;
    }
    
    console.log('✅ Cabinet info updated');
}

// Экспорт для тестирования
export default {
    name: 'Sections Fix Test',
    version: '1.0-fix-test'
};
