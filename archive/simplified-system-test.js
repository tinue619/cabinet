/**
 * ВРЕМЕННОЕ ИСПРАВЛЕНИЕ - УПРОЩЕННАЯ ГЕНЕРАЦИЯ БЕЗ СЕКЦИЙ
 * Domain Layer - Cabinet Entity Hotfix
 */

console.log('🛠️ Using simplified cabinet generation (no sections)...');

// Импортируем все что нужно для системы
import('../../new_core/index.js')
    .then(coreModule => {
        console.log('✅ Core module loaded:', coreModule);
        
        const { SystemFactory } = coreModule;
        
        // Создаем систему
        console.log('🏭 Creating system...');
        const system = SystemFactory.create({
            enableEvents: true,
            enableValidation: false, // ОТКЛЮЧАЕМ валидацию временно
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
        
        // Пытаемся генерировать ТОЛЬКО панели (без секций)
        console.log('⚙️ Generating panels only...');
        try {
            // Вызываем только создание панелей минуя секции
            cabinet._createMaterials();
            cabinet._createRequiredPanels();
            cabinet._establishPanelConnections();
            // НЕ ВЫЗЫВАЕМ _createBaseSections!
            
            console.log('✅ Panels generated (sections skipped)');
        } catch (error) {
            console.error('❌ Panel generation failed:', error);
        }
        
        // Получаем данные для отрисовки
        const cabinetData = {
            dimensions: cabinet.dimensions,
            panels: cabinet.getPanels(),
            sections: [], // Пустой массив вместо реальных секций
            stats: {
                panelsCount: cabinet.getPanels().length,
                sectionsCount: 0,
                volume: (cabinet.dimensions.width * cabinet.dimensions.height * cabinet.dimensions.depth) / 1000000000
            }
        };
        
        console.log('📊 Cabinet data (simplified):', cabinetData);
        
        // Простая отрисовка на Canvas
        drawSimplifiedCabinetOnCanvas(cabinetData);
        
        // Обновляем UI
        updateCabinetInfo(cabinetData);
        
        // Сигнализируем о готовности
        window.dispatchEvent(new CustomEvent('cabinet-app-ready', {
            detail: { 
                message: 'Simplified system test successful',
                cabinet: cabinetData
            }
        }));
        
    })
    .catch(error => {
        console.error('❌ SIMPLIFIED SYSTEM TEST FAILED:', error);
        
        window.dispatchEvent(new CustomEvent('cabinet-app-error', {
            detail: { 
                message: `Simplified system test failed: ${error.message}`,
                stack: error.stack
            }
        }));
    });

/**
 * Упрощенная отрисовка шкафа на Canvas (БЕЗ секций)
 * UI Layer - Simplified Rendering
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
    ctx.fillText(`Упрощенный шкаф ${dims.width}×${dims.height}×${dims.depth}мм`, offsetX, offsetY - 20);
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
        statSections.textContent = `${cabinetData.stats.sectionsCount} (отключены)`;
    }
    
    // Обновляем список деталей
    const partsList = document.getElementById('parts-list');
    if (partsList && cabinetData.panels) {
        partsList.innerHTML = '';
        
        if (cabinetData.panels.length === 0) {
            const div = document.createElement('div');
            div.className = 'empty-state';
            div.textContent = 'Панели создаются...';
            partsList.appendChild(div);
        } else {
            cabinetData.panels.forEach(panel => {
                const div = document.createElement('div');
                div.className = 'part-item';
                div.innerHTML = `
                    <span class="part-name">${panel.name || 'Панель'}</span>
                    <span class="part-material">${panel.material || 'Материал'}</span>
                `;
                partsList.appendChild(div);
            });
        }
    }
    
    console.log('✅ Cabinet info updated');
}

// Экспорт для тестирования
export default {
    name: 'Simplified System Test',
    version: '1.0-no-sections'
};
