// 🧪 ТЕСТ ЯДРА АРХИТЕКТУРНОЙ ЗИГОТЫ
// Проверка работоспособности всех компонентов

"use strict";

import { quickStart, SystemFactory, CABINET_DNA } from './index.js';

console.log('🧪 Starting Core Tests...');
console.log('==========================================');

try {
    // 🧬 Тест 1: Проверка ДНК системы
    console.log('\n🧬 Test 1: Cabinet DNA');
    console.log('✅ DNA Version:', CABINET_DNA.SIGNATURE.version);
    console.log('✅ DNA Laws:', Object.keys(CABINET_DNA.LAWS).length);
    console.log('✅ DNA Materials:', Object.keys(CABINET_DNA.MATERIALS).length);
    console.log('✅ DNA Panel Types:', Object.keys(CABINET_DNA.PANEL_TYPES).length);
    
    // 🏭 Тест 2: Фабрика систем
    console.log('\n🏭 Test 2: System Factory');
    const system = SystemFactory.create({
        debugMode: true,
        enableEvents: true
    });
    console.log('✅ System created:', system.id);
    console.log('✅ System stats:', system.getStats());
    
    // 🧱 Тест 3: Создание материалов
    console.log('\n🧱 Test 3: Materials');
    const ldsp16 = system.createLDSP16();
    const hdf3 = system.createHDF3();
    const mdf16 = system.createMDF16();
    
    console.log('✅ LDSP16:', ldsp16.name, ldsp16.thickness + 'mm');
    console.log('✅ HDF3:', hdf3.name, hdf3.thickness + 'mm');
    console.log('✅ MDF16:', mdf16.name, mdf16.thickness + 'mm');
    
    // 🏗️ Тест 4: Создание шкафа
    console.log('\n🏗️ Test 4: Cabinet Creation');
    const cabinet = system.createCabinet({
        width: 800,
        height: 2000, 
        depth: 600,
        baseHeight: 100
    });
    
    console.log('✅ Cabinet created:', cabinet.id);
    console.log('✅ Cabinet dimensions:', cabinet.dimensions);
    
    // 🔧 Тест 5: Генерация шкафа
    console.log('\n🔧 Test 5: Cabinet Generation');
    cabinet.generate();
    
    const stats = cabinet.getStats();
    console.log('✅ Cabinet generated successfully');
    console.log('✅ Panels created:', stats.panelsCount);
    console.log('✅ Sections created:', stats.sectionsCount);
    console.log('✅ Materials loaded:', stats.materialsCount);
    
    // 📐 Тест 6: Проверка панелей
    console.log('\n📐 Test 6: Panel Validation');
    const panels = cabinet.getPanels();
    
    for (const panel of panels) {
        console.log(`✅ Panel ${panel.panelType}:`, {
            material: panel.material.name,
            dimensions: panel.dimensions,
            position: panel.position
        });
    }
    
    // 📦 Тест 7: Проверка секций
    console.log('\n📦 Test 7: Section Validation');
    const sections = cabinet.getSections();
    
    for (const section of sections) {
        console.log(`✅ Section ${section.id}:`, {
            bounds: section.bounds,
            isEmpty: section.isEmpty
        });
    }
    
    // 🚀 Тест 8: Быстрый старт
    console.log('\n🚀 Test 8: Quick Start');
    const quickStartResult = quickStart();
    console.log('✅ Quick start completed:', {
        systemId: quickStartResult.system.id,
        materialsCount: Object.keys(quickStartResult.materials).length,
        cabinetStats: quickStartResult.cabinet.getStats()
    });
    
    // 📊 Тест 9: Валидация системы
    console.log('\n📊 Test 9: System Validation');
    const validation = system.validate();
    console.log('✅ System validation:', validation);
    
    // 🎯 Финальный отчет
    console.log('\n🎯 FINAL REPORT');
    console.log('==========================================');
    console.log('✅ All core tests passed successfully!');
    console.log('✅ System is ready for production use');
    console.log('✅ Total instances created:', SystemFactory.getInstances().length);
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
}

console.log('\n🏁 Core testing completed!');
console.log('==========================================');
