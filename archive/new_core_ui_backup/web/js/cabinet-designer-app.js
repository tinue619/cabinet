/**
 * Cabinet Designer v3 - Main Application Module
 * Integrates v2.0 functionality with new architectural core
 */

import { SystemFactory } from '../../../index.js';
import { CabinetRenderer } from './modules/CabinetRenderer.js';
import { UIManager } from './modules/UIManager.js';
import { EventManager } from './modules/EventManager.js';
import { HistoryManager } from './modules/HistoryManager.js';
import { NotificationManager } from './modules/NotificationManager.js';

// Application state
const app = {
    // Core system
    system: null,
    cabinet: null,
    
    // UI state
    mode: '2d',
    scale: 1,
    targetScale: 1,
    offset: { x: 0, y: 0 },
    
    // Selection state
    selectedElement: null,
    hoveredElement: null,
    hoveredSection: null,
    
    // Edit state
    isEditing: false,
    isDragging: false,
    dragStart: null,
    
    // Managers
    renderer: null,
    ui: null,
    events: null,
    history: null,
    notifications: null
};

// Make app global for debugging
window.app = app;

// Add render function reference to app
app.render = () => render();

/**
 * Initialize the application
 */
async function initialize() {
    try {
        // Show loading
        showLoading('Инициализация системы...');
        
        // Initialize core system
        app.system = SystemFactory.create();
        
        // Initialize managers
        app.renderer = new CabinetRenderer('cabinet-canvas');
        app.ui = new UIManager(app);
        app.events = new EventManager(app);
        app.history = new HistoryManager(50);
        app.notifications = new NotificationManager();
        
        // Setup event listeners
        setupEventListeners();
        
        // Create default cabinet
        createDefaultCabinet();
        
        // Hide loading
        hideLoading();
        
        // Show welcome notification
        app.notifications.show('Система готова к работе', 'success');
        
        console.log('Cabinet Designer v3 initialized', app);
        
    } catch (error) {
        console.error('Initialization failed:', error);
        app.notifications.show('Ошибка инициализации: ' + error.message, 'error');
        hideLoading();
    }
}

/**
 * Create default cabinet
 */
function createDefaultCabinet() {
    try {
        const width = parseInt(document.getElementById('cabinet-width').value) || 800;
        const height = parseInt(document.getElementById('cabinet-height').value) || 2000;
        const depth = parseInt(document.getElementById('cabinet-depth').value) || 600;
        const baseHeight = parseInt(document.getElementById('cabinet-base').value) || 100;
        
        app.cabinet = app.system.createCabinet({
            width,
            height,
            depth,
            baseHeight
        });
        
        // Generate panels
        app.cabinet.generate();
        
        // Save initial state
        app.history.push(getCabinetState());
        
        // Update UI
        app.ui.updateAll();
        
        // Render
        render();
    } catch (error) {
        console.error('Error creating cabinet:', error);
        app.notifications.show('Ошибка создания шкафа: ' + error.message, 'error');
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Dimension controls
    document.getElementById('btn-apply-dimensions').addEventListener('click', applyDimensions);
    
    // Element buttons
    document.querySelectorAll('.element-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const element = e.currentTarget.dataset.element;
            handleElementAdd(element);
        });
    });
    
    // Mode toggle
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.currentTarget.dataset.mode;
            setMode(mode);
        });
    });
    
    // Toolbar buttons
    document.getElementById('btn-zoom-in').addEventListener('click', () => zoomIn());
    document.getElementById('btn-zoom-out').addEventListener('click', () => zoomOut());
    document.getElementById('btn-zoom-fit').addEventListener('click', () => zoomFit());
    
    // Header actions
    document.getElementById('btn-undo').addEventListener('click', undo);
    document.getElementById('btn-redo').addEventListener('click', redo);
    document.getElementById('btn-export').addEventListener('click', exportCabinet);
    document.getElementById('btn-settings').addEventListener('click', showSettings);
    
    // Canvas events
    const canvas = document.getElementById('cabinet-canvas');
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('wheel', handleCanvasWheel);
    canvas.addEventListener('contextmenu', handleCanvasContextMenu);
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Window resize
    window.addEventListener('resize', handleResize);
}

/**
 * Apply dimensions
 */
function applyDimensions() {
    const width = parseInt(document.getElementById('cabinet-width').value) || 800;
    const height = parseInt(document.getElementById('cabinet-height').value) || 2000;
    const depth = parseInt(document.getElementById('cabinet-depth').value) || 600;
    const baseHeight = parseInt(document.getElementById('cabinet-base').value) || 100;
    
    // Validate
    if (width < 400 || width > 2000) {
        app.notifications.show('Ширина должна быть от 400 до 2000 мм', 'error');
        return;
    }
    if (height < 600 || height > 3000) {
        app.notifications.show('Высота должна быть от 600 до 3000 мм', 'error');
        return;
    }
    if (depth < 300 || depth > 800) {
        app.notifications.show('Глубина должна быть от 300 до 800 мм', 'error');
        return;
    }
    if (baseHeight < 60 || baseHeight > 200) {
        app.notifications.show('Высота цоколя должна быть от 60 до 200 мм', 'error');
        return;
    }
    
    // Save current state
    app.history.push(getCabinetState());
    
    // Create new cabinet
    app.cabinet = app.system.createCabinet({
        width,
        height,
        depth,
        baseHeight
    });
    
    app.cabinet.generate();
    
    // Update UI
    app.ui.updateAll();
    
    // Render
    render();
    
    app.notifications.show('Размеры применены', 'success');
}

/**
 * Handle element add
 */
function handleElementAdd(elementType) {
    if (!app.cabinet) {
        app.notifications.show('Сначала создайте шкаф', 'warning');
        return;
    }
    
    switch (elementType) {
        case 'shelf':
            addShelf();
            break;
        case 'divider':
            addDivider();
            break;
        case 'rod':
            addRod();
            break;
        case 'drawer':
            app.notifications.show('Ящики будут доступны в следующей версии', 'info');
            break;
    }
}

/**
 * Add shelf
 */
function addShelf() {
    app.notifications.show('Выберите секцию для добавления полки', 'info');
    app.mode = 'add-shelf';
}

/**
 * Add divider
 */
function addDivider() {
    app.notifications.show('Выберите секцию для добавления стойки', 'info');
    app.mode = 'add-divider';
}

/**
 * Add rod
 */
function addRod() {
    app.notifications.show('Выберите секцию для добавления штанги', 'info');
    app.mode = 'add-rod';
}

/**
 * Set mode
 */
function setMode(mode) {
    app.mode = mode;
    
    // Update UI
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Update canvas class
    const canvas = document.getElementById('cabinet-canvas');
    canvas.classList.toggle('mode-3d', mode === '3d');
    
    // Re-render
    render();
}

/**
 * Zoom controls
 */
function zoomIn() {
    app.targetScale = Math.min(app.scale * 1.2, 5);
    animateZoom();
}

function zoomOut() {
    app.targetScale = Math.max(app.scale * 0.8, 0.2);
    animateZoom();
}

function zoomFit() {
    if (!app.cabinet || !app.cabinet.dimensions) return;
    
    const canvas = document.getElementById('cabinet-canvas');
    const padding = 60;
    
    const dims = app.cabinet.dimensions;
    const scaleX = (canvas.width - padding * 2) / dims.width;
    const scaleY = (canvas.height - padding * 2) / dims.height;
    
    app.targetScale = Math.min(scaleX, scaleY);
    app.offset = { x: 0, y: 0 };
    animateZoom();
}

function animateZoom() {
    const step = () => {
        const diff = app.targetScale - app.scale;
        if (Math.abs(diff) > 0.01) {
            app.scale += diff * 0.2;
            render();
            requestAnimationFrame(step);
        } else {
            app.scale = app.targetScale;
            render();
            updateZoomLevel();
        }
    };
    step();
}

function updateZoomLevel() {
    const zoomLevel = document.querySelector('.zoom-level');
    if (zoomLevel) {
        zoomLevel.textContent = Math.round(app.scale * 100) + '%';
    }
}

/**
 * History management
 */
function undo() {
    const state = app.history.undo();
    if (state) {
        restoreCabinetState(state);
        app.ui.updateAll();
        render();
        app.notifications.show('Действие отменено', 'info');
    }
}

function redo() {
    const state = app.history.redo();
    if (state) {
        restoreCabinetState(state);
        app.ui.updateAll();
        render();
        app.notifications.show('Действие повторено', 'info');
    }
}

function getCabinetState() {
    if (!app.cabinet) return null;
    
    try {
        const dims = app.cabinet.dimensions;
        const panels = app.cabinet.getPanels ? app.cabinet.getPanels() : [];
        const sections = app.cabinet.getSections ? app.cabinet.getSections() : [];
        
        return {
            dimensions: dims ? { ...dims } : null,
            panels: panels.map(p => ({
                id: p.id,
                type: p.panelType,
                position: p.position ? { ...p.position } : {},
                dimensions: p.dimensions ? { ...p.dimensions } : {}
            })),
            sections: sections.map(s => ({
                id: s.id,
                bounds: s.bounds ? { ...s.bounds } : {}
            }))
        };
    } catch (error) {
        console.error('Error getting cabinet state:', error);
        return null;
    }
}

function restoreCabinetState(state) {
    if (!state) return;
    
    // Recreate cabinet with saved dimensions
    app.cabinet = app.system.createCabinet(state.dimensions);
    app.cabinet.generate();
    
    // TODO: Restore additional elements (shelves, dividers, etc.)
}

/**
 * Export functionality
 */
function exportCabinet() {
    if (!app.cabinet) {
        app.notifications.show('Нет шкафа для экспорта', 'warning');
        return;
    }
    
    const exportData = {
        version: '3.0',
        timestamp: new Date().toISOString(),
        cabinet: {
            dimensions: app.cabinet.dimensions,
            stats: app.cabinet.getStats(),
            panels: app.cabinet.getPanels().map(p => ({
                id: p.id,
                name: p.name,
                type: p.panelType,
                material: p.material.name,
                dimensions: p.dimensions,
                position: p.position
            })),
            sections: app.cabinet.getSections()
        }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cabinet_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    app.notifications.show('Данные экспортированы', 'success');
}

/**
 * Settings
 */
function showSettings() {
    app.notifications.show('Настройки будут доступны в следующей версии', 'info');
}

/**
 * Canvas event handlers
 */
function handleCanvasMouseDown(e) {
    app.isDragging = true;
    app.dragStart = {
        x: e.clientX - app.offset.x,
        y: e.clientY - app.offset.y
    };
}

function handleCanvasMouseMove(e) {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / app.scale - app.offset.x;
    const y = (e.clientY - rect.top) / app.scale - app.offset.y;
    
    // Update mouse coordinates
    const coords = document.getElementById('mouse-coords');
    if (coords) {
        coords.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
    }
    
    if (app.isDragging && app.dragStart) {
        app.offset.x = e.clientX - app.dragStart.x;
        app.offset.y = e.clientY - app.dragStart.y;
        render();
    } else {
        // Check hover
        checkHover(x, y);
    }
}

function handleCanvasMouseUp(e) {
    app.isDragging = false;
    app.dragStart = null;
}

function handleCanvasWheel(e) {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    app.targetScale = Math.max(0.2, Math.min(5, app.scale * delta));
    animateZoom();
}

function handleCanvasContextMenu(e) {
    e.preventDefault();
    // TODO: Show context menu
}

/**
 * Keyboard handlers
 */
function handleKeyDown(e) {
    // Ctrl+Z - Undo
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
    }
    // Ctrl+Y - Redo
    else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
    }
    // Delete - Remove selected
    else if (e.key === 'Delete' && app.selectedElement) {
        removeSelectedElement();
    }
    // Escape - Cancel mode
    else if (e.key === 'Escape') {
        cancelCurrentMode();
    }
}

function handleKeyUp(e) {
    // Handle key up if needed
}

/**
 * Window resize
 */
function handleResize() {
    app.renderer.resize();
    render();
}

/**
 * Helper functions
 */
function checkHover(x, y) {
    // TODO: Check what element is under cursor
    // Update hoveredElement, hoveredSection
}

function removeSelectedElement() {
    // TODO: Remove selected element
    app.notifications.show('Элемент удален', 'info');
}

function cancelCurrentMode() {
    app.mode = '2d';
    app.selectedElement = null;
    app.hoveredElement = null;
    render();
}

/**
 * Main render function
 */
function render() {
    if (!app.cabinet || !app.renderer) return;
    
    app.renderer.clear();
    app.renderer.setTransform(app.scale, app.offset);
    
    if (app.mode === '3d') {
        app.renderer.render3D(app.cabinet);
    } else {
        app.renderer.render2D(app.cabinet);
    }
    
    // Render overlays
    if (app.hoveredSection) {
        app.renderer.highlightSection(app.hoveredSection);
    }
    if (app.selectedElement) {
        app.renderer.highlightElement(app.selectedElement);
    }
}

/**
 * Loading indicator
 */
function showLoading(message) {
    // TODO: Show loading overlay
    console.log('Loading:', message);
}

function hideLoading() {
    // TODO: Hide loading overlay
    console.log('Loading complete');
}

// Make render function available globally for app object
window.render = render;

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}