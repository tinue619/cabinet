// 🔍 ТЕСТ ПОЗИЦИОНИРОВАНИЯ ПАНЕЛЕЙ
// Проверяем как рассчитываются позиции дна и цоколей

import { CABINET_DNA } from '../new_core/cabinet-dna.js';

// Стандартные размеры шкафа
const x = 800;  // ширина
const y = 2000; // высота  
const z = 600;  // глубина
const t = 16;   // толщина материала
const b = 100;  // высота цоколя

console.log('🧮 ТЕСТ ПОЗИЦИОНИРОВАНИЯ ПАНЕЛЕЙ');
console.log(`📏 Шкаф: ${x}×${y}×${z}мм, материал: ${t}мм, цоколь: ${b}мм`);
console.log('');

// Тестируем все формулы позиций
const positions = {
    'Крыша': CABINET_DNA.GENERATION.POSITION_FORMULAS.TOP(x, y, z, t, b),
    'Дно': CABINET_DNA.GENERATION.POSITION_FORMULAS.BOTTOM(x, y, z, t, b),
    'Цоколь передний': CABINET_DNA.GENERATION.POSITION_FORMULAS.FRONT_BASE(x, y, z, t, b),
    'Цоколь задний': CABINET_DNA.GENERATION.POSITION_FORMULAS.BACK_BASE(x, y, z, t, b),
    'Боковина левая': CABINET_DNA.GENERATION.POSITION_FORMULAS.LEFT_SIDE(x, y, z, t, b),
    'Боковина правая': CABINET_DNA.GENERATION.POSITION_FORMULAS.RIGHT_SIDE(x, y, z, t, b)
};

const sizes = {
    'Крыша': CABINET_DNA.GENERATION.SIZE_FORMULAS.TOP(x, y, z, t, b),
    'Дно': CABINET_DNA.GENERATION.SIZE_FORMULAS.BOTTOM(x, y, z, t, b),
    'Цоколь передний': CABINET_DNA.GENERATION.SIZE_FORMULAS.FRONT_BASE(x, y, z, t, b),
    'Цоколь задний': CABINET_DNA.GENERATION.SIZE_FORMULAS.BACK_BASE(x, y, z, t, b),
    'Боковина левая': CABINET_DNA.GENERATION.SIZE_FORMULAS.LEFT_SIDE(x, y, z, t, b),
    'Боковина правая': CABINET_DNA.GENERATION.SIZE_FORMULAS.RIGHT_SIDE(x, y, z, t, b)
};

console.log('📍 ПОЗИЦИИ ПАНЕЛЕЙ:');
for (const [name, pos] of Object.entries(positions)) {
    console.log(`${name}: x=${pos.x}, y=${pos.y}, z=${pos.z}`);
}

console.log('');
console.log('📐 РАЗМЕРЫ ПАНЕЛЕЙ:');
for (const [name, size] of Object.entries(sizes)) {
    console.log(`${name}: w=${size.width}, h=${size.height}, d=${size.depth}`);
}

console.log('');
console.log('🎯 АНАЛИЗ РАСПОЛОЖЕНИЯ ПО Y (высота):');
console.log(`Крыша верх: y=${positions['Крыша'].y}`);
console.log(`Крыша низ: y=${positions['Крыша'].y + sizes['Крыша'].height}`);
console.log(`Дно верх: y=${positions['Дно'].y}`);  
console.log(`Дно низ: y=${positions['Дно'].y + sizes['Дно'].height}`);
console.log(`Цоколь верх: y=${positions['Цоколь передний'].y}`);
console.log(`Цоколь низ: y=${positions['Цоколь передний'].y + sizes['Цоколь передний'].height}`);

console.log('');
console.log('⚠️ ПРОБЛЕМЫ:');
const bottomTop = positions['Дно'].y;
const bottomBottom = positions['Дно'].y + sizes['Дно'].height;
const baseTop = positions['Цоколь передний'].y;

console.log(`Дно находится на высоте: ${bottomTop}мм от верха`);
console.log(`Цоколь находится на высоте: ${baseTop}мм от верха`);
console.log(`Разница между дном и цоколем: ${baseTop - bottomTop}мм`);

if (baseTop - bottomTop < 20) {
    console.log('❌ ПРОБЛЕМА: Дно слишком близко к цоколю!');
    console.log('   На схеме они могут перекрываться или быть неразличимы');
}
