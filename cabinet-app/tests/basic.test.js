/**
 * Базовые тесты для Cabinet App
 */

import { CabinetCoreService } from '../src/services/CabinetCoreService.js';
import { StateManager } from '../src/services/StateManager.js';
import { NotificationService } from '../src/services/NotificationService.js';

/**
 * Простая тестовая утилита
 */
class SimpleTest {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }
    
    test(name, fn) {
        try {
            fn();
            this.passed++;
            this.tests.push({ name, status: 'pass' });
            console.log(`✅ ${name}`);
        } catch (error) {
            this.failed++;
            this.tests.push({ name, status: 'fail', error: error.message });
            console.error(`❌ ${name}: ${error.message}`);
        }
    }
    
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }
    
    summary() {
        console.log('\n📊 Test Summary:');
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Total: ${this.passed + this.failed}`);
        return this.failed === 0;
    }
}

// Запуск тестов
export async function runTests() {
    const test = new SimpleTest();
    
    console.log('🧪 Running Cabinet App Tests...\n');
    
    // Тест StateManager
    test.test('StateManager: should save and restore state', () => {
        const manager = new StateManager();
        const state = { test: 'value' };
        
        manager.saveState(state);
        test.assert(manager.canUndo() === false, 'Should not undo initial state');
        
        manager.saveState({ test: 'value2' });
        test.assert(manager.canUndo() === true, 'Should be able to undo');
        
        const restored = manager.undo();
        test.assert(restored.test === 'value', 'Should restore previous state');
    });
    
    // Тест NotificationService
    test.test('NotificationService: should create notifications', () => {
        const service = new NotificationService();
        
        const id = service.show('Test message', 'info', 0);
        test.assert(id > 0, 'Should return notification ID');
        test.assert(service.notifications.has(id), 'Should store notification');
        
        service.remove(id);
        test.assert(!service.notifications.has(id), 'Should remove notification');
    });
    
    // Тест CabinetCoreService
    test.test('CabinetCoreService: should initialize', async () => {
        const service = new CabinetCoreService();
        test.assert(service.system === null, 'System should be null initially');
        
        // Note: Actual initialization would require the core to be loaded
        // This is just a structural test
        test.assert(typeof service.initialize === 'function', 'Should have initialize method');
        test.assert(typeof service.createCabinet === 'function', 'Should have createCabinet method');
    });
    
    // Тест валидации параметров
    test.test('CabinetCoreService: should validate parameters', () => {
        const service = new CabinetCoreService();
        
        try {
            service.validateCabinetParams({ width: 100 }); // Too small
            test.assert(false, 'Should throw on invalid params');
        } catch (e) {
            test.assert(e.message.includes('Ширина'), 'Should have width error');
        }
        
        // Valid params should not throw
        service.validateCabinetParams({
            width: 800,
            height: 2000,
            depth: 600,
            baseHeight: 100
        });
    });
    
    return test.summary();
}

// Если запущено напрямую
if (typeof window === 'undefined' && process.argv[1] === import.meta.url) {
    runTests();
}