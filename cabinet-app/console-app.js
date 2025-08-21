#!/usr/bin/env node

// 🖥️ КОНСОЛЬНОЕ ПРИЛОЖЕНИЕ - Cabinet Designer
// Простой интерфейс без раздражающего UI

"use strict";

console.log(`
🚀 ===============================================
   CABINET DESIGNER - Консольное приложение
===============================================
🧬 Архитектурное ядро: new_core/
📋 Никакого раздражающего UI - только логика!
🎯 Создаем шкафы через чистую архитектуру
===============================================
`);

// Импортируем ядро системы
import('./new_core/index.js').then(async ({ SystemFactory }) => {
    
    console.log('✅ Ядро системы загружено');
    
    // Создаем систему
    const system = SystemFactory.create();
    console.log('✅ Фабрика систем создана');
    
    // Создаем тестовый шкаф
    console.log('\\n🏗️ Создаем тестовый шкаф...');
    
    const cabinet = system.createCabinet({
        width: 800,      // 80см ширина
        height: 2000,    // 200см высота  
        depth: 600,      // 60см глубина
        baseHeight: 100  // 10см цоколь
    });
    
    console.log('✅ Шкаф создан с параметрами:');
    console.log('   📏 Ширина: 800мм');
    console.log('   📏 Высота: 2000мм'); 
    console.log('   📏 Глубина: 600мм');
    console.log('   📏 Цоколь: 100мм');
    
    // Генерируем панели
    console.log('\\n⚙️ Генерируем панели...');
    cabinet.generate();
    console.log('✅ Панели сгенерированы по архитектурным правилам');
    
    // Получаем статистику
    const stats = cabinet.getStats();
    console.log('\\n📊 СТАТИСТИКА ШКАФА:');
    console.log('====================');
    console.log(\`📦 Всего панелей: \${stats.totalPanels}\`);
    console.log(\`🔧 Материалов: \${stats.materialsUsed}\`);
    console.log(\`📐 Общий объем: \${stats.totalVolume} м³\`);
    console.log(\`💰 Примерная стоимость: \${stats.estimatedCost} руб.\`);
    
    // Получаем список панелей
    const panels = cabinet.getPanels();
    console.log('\\n📋 СПИСОК ПАНЕЛЕЙ:');
    console.log('==================');
    
    panels.forEach((panel, index) => {
        const data = panel.getData();
        console.log(\`\${index + 1}. \${data.name}\`);
        console.log(\`   📏 \${data.width}×\${data.height}×\${data.thickness}мм\`);
        console.log(\`   🏗️ \${data.material.name}\`);
        console.log(\`   📍 Позиция: (\${data.position.x}, \${data.position.y}, \${data.position.z})\`);
        console.log('');
    });
    
    // Получаем секции
    const sections = cabinet.getSections();
    console.log(\`\\n🏢 СЕКЦИИ (\${sections.length} шт.):\`);
    console.log('===================');
    
    sections.forEach((section, index) => {
        const data = section.getData();
        console.log(\`\${index + 1}. Секция \${data.id}\`);
        console.log(\`   📏 \${data.dimensions.width}×\${data.dimensions.height}мм\`);
        console.log(\`   📍 Позиция: (\${data.position.x}, \${data.position.y})\`);
        console.log(\`   ✅ Готова для наполнения: \${data.readyForFilling ? 'Да' : 'Нет'}\`);
        console.log('');
    });
    
    console.log('\\n🎉 ГОТОВО! Шкаф успешно спроектирован.');
    console.log('📝 Все данные доступны через API ядра');
    console.log('🔧 Для интеграции используйте: import { SystemFactory } from "./new_core/index.js"');
    console.log('\\n💡 Хотите визуализацию? Откройте simple-demo.html в браузере');
    
}).catch(error => {
    console.error('❌ Ошибка загрузки ядра:', error.message);
    console.error('🔧 Проверьте, что файл new_core/index.js существует');
});
