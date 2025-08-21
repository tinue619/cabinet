/**
 * ПОЛНЫЙ ТЕСТ СИСТЕМЫ С UI
 * Application Layer - Full System Integration
 */

console.log('🏗️ Testing full cabinet system...');

// Импортируем все что нужно для полной системы
import('../../new_core/index.js')
    .then(coreModule => {
        console.log('✅ Core module loaded:', coreModule);
        
        const { SystemFactory } = coreModule;
        
        // Создаем систему
        console.log('🏭 Creating system...');
        const system = SystemFactory.create({
            enableEvents: true,
            enableValidation: true,
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
        
        // Генерируем панели
        console.log('⚙️ Generating panels...');
        cabinet.generate();
        
        console.log('✅ Cabinet generated');
        
        // Получаем данные для отрисовки
        const cabinetData = {
            dimensions: cabinet.dimensions,
            panels: cabinet.getPanels(),
            sections: cabinet.getSections(),
            stats: cabinet.getStats()
        };
        
        console.log('📊 Cabinet data:', cabinetData);
        
        // Простая отрисовка на Canvas
        drawCabinetOnCanvas(cabinetData);
        
        // Обновляем UI
        updateCabinetInfo(cabinetData);
        
        // Сигнализируем о готовности
        window.dispatchEvent(new CustomEvent('cabinet-app-ready', {
            detail: { 
                message: 'Full system test successful',
                cabinet: cabinetData
            }
        }));
        
    })
    .catch(error => {
        console.error('❌ FULL SYSTEM TEST FAILED:', error);
        
        window.dispatchEvent(new CustomEvent('cabinet-app-error', {
            detail: { 
                message: `Full system test failed: ${error.message}`,
                stack: error.stack
            }
        }));
    });

/**
 * Простая отрисовка шкафа на Canvas
 * UI Layer - Basic Rendering
 */
function drawCabinetOnCanvas(cabinetData) {
    console.log('🎨 Drawing cabinet on canvas...');
    
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
    
    // Настройки отрисовки
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Рисуем основной корпус шкафа
    const cabinetWidth = dims.width * scale;
    const cabinetHeight = dims.height * scale;
    
    ctx.fillRect(offsetX, offsetY, cabinetWidth, cabinetHeight);
    ctx.strokeRect(offsetX, offsetY, cabinetWidth, cabinetHeight);
    
    // Рисуем панели если есть
    if (cabinetData.panels && cabinetData.panels.length > 0) {
        ctx.fillStyle = '#d4af37';
        
        cabinetData.panels.forEach(panel => {
            if (panel.position && panel.dimensions) {
                const x = offsetX + panel.position.x * scale;
                const y = offsetY + panel.position.y * scale;
                const w = panel.dimensions.width * scale;
                const h = panel.dimensions.height * scale;
                
                ctx.fillRect(x, y, w, h);
                ctx.strokeRect(x, y, w, h);
            }
        });
    }
    
    // Добавляем подпись
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText(`Шкаф ${dims.width}×${dims.height}×${dims.depth}мм`, offsetX, offsetY - 10);
    
    console.log('✅ Cabinet drawn on canvas');
}

/**
 * Обновление информации о шкафе в UI
 * UI Layer - Info Display
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
        statSections.textContent = cabinetData.stats.sectionsCount || 0;
    }
    
    // Обновляем список деталей
    const partsList = document.getElementById('parts-list');
    if (partsList && cabinetData.panels) {
        partsList.innerHTML = '';
        
        cabinetData.panels.forEach(panel => {
            const div = document.createElement('div');
            div.className = 'part-item';
            div.innerHTML = `
                <span class="part-name">${panel.name}</span>
                <span class="part-material">${panel.material}</span>
            `;
            partsList.appendChild(div);
        });
    }
    
    console.log('✅ Cabinet info updated');
}

// Экспорт для тестирования
export default {
    name: 'Full System Test',
    version: '1.0-full-integration'
};
