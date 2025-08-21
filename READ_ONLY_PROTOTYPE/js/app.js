/**
 * Основной файл приложения Cabinet Designer
 */

// Сохраняем текущее состояние в историю
function saveHistory() {
  if (app.cabinet) {
    historyManager.push(app.cabinet.getState());
    updateHistoryButtons();
  }
}

// Обновляем состояние кнопок undo/redo
function updateHistoryButtons() {
  const info = historyManager.getInfo();
  
  const undoBtn = document.getElementById('undo');
  const redoBtn = document.getElementById('redo');
  
  if (undoBtn) {
    undoBtn.disabled = !info.canUndo;
    if (info.canUndo) {
      undoBtn.classList.remove('disabled');
    } else {
      undoBtn.classList.add('disabled');
    }
  }
  
  if (redoBtn) {
    redoBtn.disabled = !info.canRedo;
    if (info.canRedo) {
      redoBtn.classList.remove('disabled');
    } else {
      redoBtn.classList.add('disabled');
    }
  }
}

function applyDimensions() {
  const width = parseInt(document.getElementById('width').value);
  const height = parseInt(document.getElementById('height').value);
  const depth = parseInt(document.getElementById('depth').value);
  const base = parseInt(document.getElementById('base').value);

  if (width < 132 || width > 2000 ||
      height < 132 || height > 3000 ||
      depth < 100 || depth > 1000 ||
      base < 60 || base > 200) {
    showNotification('Проверьте размеры', 'error');
    return;
  }

  // Сохраняем текущее состояние перед изменением
  if (app.cabinet) {
    saveHistory();
  }

  app.cabinet = new Cabinet(width, height, depth, base);
  app.targetScale = 1;
  app.scale = 1;
  
  // Сохраняем новое состояние
  saveHistory();
  
  render();
  updatePartsList();
  showNotification('Размеры применены', 'success');
}

function setMode(mode) {
  app.mode = mode;
  app.hoveredSection = null;
  app.hoveredDivider = null;
  
  // Отключаем режим изменения размеров при смене режима
  if (mode !== 'none') {
    setResizeMode(null);
  }
  
  if (mode !== 'edit') {
    app.selectedDivider = null;
  }

  // Сбрасываем режим деления
  if (mode !== 'divide') {
    app.divideType = null;
    app.divideCount = null;
    hideAllDropdowns();
  }

  const keyboardHint = document.getElementById('keyboardHint');
  if (mode !== 'edit') {
    keyboardHint.classList.remove('show');
  }

  document.querySelectorAll('.btn-secondary, .btn-dropdown-main').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelectorAll('.btn-dropdown').forEach(cont => {
    cont.classList.remove('active');
  });

  if (mode === 'edit') {
    document.getElementById('editMode').classList.add('active');
    showNotification('Кликните на разделитель для редактирования', 'info');
    setTimeout(() => keyboardHint.classList.add('show'), 300);
  } else if (mode === 'shelf') {
    document.getElementById('addShelf').classList.add('active');
    showNotification('Выберите место для полки', 'info');
  } else if (mode === 'stand') {
    document.getElementById('addStand').classList.add('active');
    showNotification('Выберите место для стойки', 'info');
  } else if (mode === 'rod') {
    document.getElementById('addRod').classList.add('active');
    showNotification('Выберите место для штанги', 'info');
  } else if (mode === 'delete') {
    document.getElementById('deleteMode').classList.add('active');
    showNotification('Кликните на разделитель или штангу для удаления', 'info');
    app.canvas.style.cursor = 'crosshair';
  } else if (mode === 'divide') {
    let typeName;
    if (app.divideType === 'rod') {
      typeName = 'штанг';
    } else {
      typeName = app.divideType === 'shelf' ? 'полок' : 'стоек';
    }
    showNotification(`Кликните на секцию для добавления ${app.divideCount} ${typeName}`, 'info');
    app.canvas.style.cursor = 'crosshair';
  } else {
    app.canvas.style.cursor = 'default';
  }

  render();
}

function setDivideMode(type, count) {
  app.mode = 'divide';
  app.divideType = type;
  app.divideCount = count;
  
  // Очищаем все обычные кнопки
  document.querySelectorAll('.btn-secondary').forEach(btn => btn.classList.remove('active'));
  
  let typeName;
  if (type === 'rod') {
    typeName = 'штанг';
  } else {
    typeName = type === 'shelf' ? 'полок' : 'стоек';
  }
  
  showNotification(`Кликните на секцию для добавления ${count} ${typeName}`, 'info');
  
  app.canvas.style.cursor = 'crosshair';
}

function toggleDimensions() {
  app.showDimensions = !app.showDimensions;
  document.getElementById('toggleDimensions').classList.toggle('active', app.showDimensions);
  render();
}

function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

function reset() {
  // Сохраняем текущее состояние
  saveHistory();
  
  app.cabinet = new Cabinet(800, 1800, 500, 100);
  document.getElementById('width').value = 800;
  document.getElementById('height').value = 1800;
  document.getElementById('depth').value = 500;
  document.getElementById('base').value = 100;
  app.targetScale = 1;
  app.scale = 1;
  setMode('none');
  
  // Очищаем историю и сохраняем новое начальное состояние
  historyManager.clear();
  saveHistory();
  
  render();
  updatePartsList();
  showNotification('Конфигурация сброшена', 'success');
}

// Функция отмены последнего действия
function undo() {
  const state = historyManager.undo();
  if (state) {
    app.cabinet.setState(state);
    updateUIFromCabinet();
    render();
    updatePartsList();
    updateHistoryButtons();
    showNotification('Действие отменено', 'info');
  }
}

// Функция повтора отменённого действия
function redo() {
  const state = historyManager.redo();
  if (state) {
    app.cabinet.setState(state);
    updateUIFromCabinet();
    render();
    updatePartsList();
    updateHistoryButtons();
    showNotification('Действие повторено', 'info');
  }
}

// Обновляем UI элементы из состояния шкафа
function updateUIFromCabinet() {
  if (app.cabinet) {
    document.getElementById('width').value = app.cabinet.width;
    document.getElementById('height').value = app.cabinet.height;
    document.getElementById('depth').value = app.cabinet.depth;
    document.getElementById('base').value = app.cabinet.base;
  }
}

// ===========================
// UI LAYER: Обновление списка панелей и информации
// ===========================
function updatePartsList() {
  const container = document.getElementById('partsList');
  if (!container) return;
  
  container.innerHTML = '';

  if (!app.cabinet) {
    document.getElementById('partsCount').textContent = '0';
    return;
  }

  const parts = app.cabinet.getAllParts();
  const totalVolume = app.cabinet.getTotalVolume();
  const totalCost = app.cabinet.getTotalCost();
  
  // Обновляем счетчики в правой панели
  document.getElementById('partsCount').textContent = parts.length;
  
  // Ищем элементы для объема и стоимости
  let volumeElement = document.querySelector('.volume-info .value');
  let costElement = document.querySelector('.cost-info .value');
  
  // Если элементов нет, создаем их
  if (!volumeElement) {
    updateInfoSection(totalVolume, totalCost);
  } else {
    volumeElement.textContent = `${totalVolume.toFixed(3)} м³`;
    costElement.textContent = `${totalCost.toLocaleString('ru-RU')} ₽`;
  }

  // Создаем список панелей
  parts.forEach((part, index) => {
    const item = document.createElement('div');
    item.className = 'part-item';
    item.innerHTML = `
      <div class="part-name">${part.name}</div>
      <div class="part-dimensions">
        <span class="dim">${Math.round(part.w)}</span>×<span class="dim">${Math.round(part.h)}</span>×<span class="dim">${Math.round(part.d)}</span>мм
      </div>
      <div class="part-material">${part.material}</div>
    `;
    container.appendChild(item);
  });
}

// ===========================
// UI LAYER: Обновление информационной секции
// ===========================
function updateInfoSection(volume, cost) {
  // Ищем секцию с информацией или создаем её
  let infoSection = document.querySelector('.info-section');
  
  if (!infoSection) {
    // Создаем секцию информации
    infoSection = document.createElement('div');
    infoSection.className = 'info-section';
    infoSection.innerHTML = `
      <div class="info-header">
        <h3>Информация</h3>
      </div>
      <div class="info-item volume-info">
        <span class="label">Объем:</span>
        <span class="value">${volume.toFixed(3)} м³</span>
      </div>
      <div class="info-item cost-info">
        <span class="label">Стоимость:</span>
        <span class="value">${cost.toLocaleString('ru-RU')} ₽</span>
      </div>
    `;
    
    // Вставляем перед секцией панелей
    const partsSection = document.querySelector('.parts-section');
    if (partsSection && partsSection.parentNode) {
      partsSection.parentNode.insertBefore(infoSection, partsSection);
    }
  }
}

function showNotification(text, type = 'info') {
  const notification = document.getElementById('notification');
  const textElement = notification.querySelector('.notification-text');
  const iconElement = notification.querySelector('.notification-icon');
  
  notification.className = 'notification';
  notification.classList.add(type);
  
  textElement.textContent = text;
  
  const icons = {
    success: 'm4.5 12.75 6 6 9-13.5',
    error: 'M6 18 18 6M6 6l12 12',
    warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
    info: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
  };
  
  iconElement.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="${icons[type] || icons.info}" />`;
  
  if (notification.hideTimeout) {
    clearTimeout(notification.hideTimeout);
  }
  
  setTimeout(() => notification.classList.add('show'), 10);
  
  notification.hideTimeout = setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function init() {
  console.log('🚀 Начало инициализации...');
  
  try {
    // 1. Создаем шкаф
    console.log('📋 Создание шкафа...');
    app.cabinet = new Cabinet(800, 1800, 500, 100);
    console.log('✅ Шкаф создан:', app.cabinet.width + 'x' + app.cabinet.height);
    
    // 2. Инициализируем историю
    console.log('📆 Инициализация истории...');
    historyManager.clear();
    saveHistory();
    
    // 3. Canvas
    console.log('🖼️ Инициализация Canvas...');
    initCanvas();
    if (app.canvas && app.ctx) {
      console.log('✅ Canvas готов:', app.canvas.width + 'x' + app.canvas.height);
    } else {
      console.error('❌ Canvas не инициализирован');
    }
    
    // 4. Остальное
    console.log('🔧 Остальная инициализация...');
    
    // Пропускаем проблемные части
    try {
      app.resizeHandler = new ResizeHandler();
    } catch (e) {
      console.warn('⚠️ ResizeHandler не удалось создать:', e.message);
    }
    
    try {
      init3D();
    } catch (e) {
      console.warn('⚠️ 3D не удалось инициализировать:', e.message);
    }
    
    try {
      setupEvents();
    } catch (e) {
      console.warn('⚠️ Events не удалось настроить:', e.message);
    }
    
    try {
      setupInteractiveResize();
    } catch (e) {
      console.warn('⚠️ InteractiveResize не удалось настроить:', e.message);
    }
    
    // 5. Рендеринг
    console.log('🎨 Первый рендер...');
    render();
    
    // 6. Обновление UI
    console.log('📊 Обновление списка панелей...');
    updatePartsList();
    
    console.log('✅ Инициализация завершена!');
    showNotification('Добро пожаловать в Cabinet Designer!', 'success');
    
  } catch (error) {
    console.error('❌ Критическая ошибка инициализации:', error);
    
    // Пытаемся создать минимальный работающий стать
    try {
      if (!app.cabinet) {
        app.cabinet = new Cabinet(800, 1800, 500, 100);
      }
      if (!app.canvas) {
        app.canvas = document.getElementById('canvas');
        if (app.canvas) {
          app.ctx = app.canvas.getContext('2d');
        }
      }
      render();
    } catch (fallbackError) {
      console.error('❌ Даже fallback не сработал:', fallbackError);
    }
  }
}

// Инициализация 3D
function init3D() {
  // Проверяем доступность Three.js
  if (typeof THREE === 'undefined') {
    console.warn('Three.js не загружен, 3D режим недоступен');
    document.getElementById('view3d').disabled = true;
    return;
  }
  
  app.canvas3d = document.getElementById('canvas3d');
  
  try {
    app.renderer3d = new Renderer3D(app.canvas3d);
    console.log('3D рендерер инициализирован');
  } catch (error) {
    console.error('Ошибка инициализации 3D рендерера:', error);
    document.getElementById('view3d').disabled = true;
  }
}

// Переключение видов
function switchView(view) {
  const canvas2d = document.getElementById('canvas');
  const canvas3d = document.getElementById('canvas3d');
  const controls3d = document.getElementById('canvas3dControls');
  const info3d = document.getElementById('canvas3dInfo');
  const view2dBtn = document.getElementById('view2d');
  const view3dBtn = document.getElementById('view3d');
  
  app.currentView = view;
  
  if (view === '3d') {
    if (!app.renderer3d) {
      showNotification('3D режим недоступен', 'error');
      return;
    }
    
    canvas2d.style.display = 'none';
    canvas3d.style.display = 'block';
    controls3d.style.display = 'flex';
    info3d.style.display = 'block';
    
    view2dBtn.classList.remove('active');
    view3dBtn.classList.add('active');
    
    // Отключаем редактирование в 3D
    if (app.mode !== 'none') {
      setMode('none');
      showNotification('Редактирование доступно только в 2D режиме', 'info');
    }
    
    // Отменяем режим изменения размеров
    setResizeMode(null);
    
    // Принудительно обновляем размеры canvas
    setTimeout(() => {
      if (app.renderer3d) {
        app.renderer3d.setCanvasSize();
        app.renderer3d.render(app.cabinet);
      }
    }, 50);
    
    app.renderer3d.render(app.cabinet);
    
    setTimeout(() => {
      showNotification('🎆 3D просмотр активирован!', 'success');
    }, 100);
    
  } else {
    canvas3d.style.display = 'none';
    canvas2d.style.display = 'block';
    controls3d.style.display = 'none';
    info3d.style.display = 'none';
    
    view3dBtn.classList.remove('active');
    view2dBtn.classList.add('active');
    
    render();
    showNotification('⚙️ 2D редактор активирован', 'info');
  }
}

// Настройка интерактивного изменения размеров
function setupInteractiveResize() {
  // Обработчики для полей ввода
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const depthInput = document.getElementById('depth');
  const baseInput = document.getElementById('base');
  
  widthInput.addEventListener('focus', () => setResizeMode('width'));
  heightInput.addEventListener('focus', () => setResizeMode('height'));
  baseInput.addEventListener('focus', () => setResizeMode('base'));
  
  // Глубина не поддерживает интерактивное изменение
  depthInput.addEventListener('focus', () => setResizeMode(null));
  
  // НЕ очищаем режим при потере фокуса - это будет мешать перетаскиванию
  // Режим будет очищаться только при клике вне области canvas или смене режима
}

// Установка режима интерактивного изменения размеров
function setResizeMode(mode) {
  app.resizeMode = mode;
  app.hoveredWall = null;
  app.draggedWall = null;
  
  if (mode) {
    showNotification(`Перетаскивайте ${getResizeModeText(mode)} для изменения размера`, 'info');
  }
  
  render();
}

// Получить текст для режима изменения размеров
function getResizeModeText(mode) {
  switch(mode) {
    case 'width': return 'боковины';
    case 'height': return 'верх и низ';
    case 'depth': return 'переднюю стенку';
    case 'base': return 'цоколь';
    default: return '';
  }
}

// Инициализация приложения
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===========================
// МОБИЛЬНАЯ ИНТЕГРАЦИЯ
// ===========================

// Проверяем мобильное устройство
function isMobileDevice() {
  return window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Мобильные функции для добавления элементов
app.addShelfMobile = function(section) {
  if (!section) return false;
  
  saveHistory();
  
  // Находим индекс секции
  const sectionIndex = app.cabinet.sections.indexOf(section);
  if (sectionIndex === -1) return false;
  
  // Добавляем горизонтальный разделитель в центре секции
  const dividerPos = section.y + section.h / 2;
  const result = app.cabinet.addDivider('h', dividerPos, section.x, section.x + section.w);
  
  if (result) {
    render();
    updatePartsList();
    return true;
  }
  return false;
};

app.addStandMobile = function(section) {
  if (!section) return false;
  
  saveHistory();
  
  // Находим индекс секции
  const sectionIndex = app.cabinet.sections.indexOf(section);
  if (sectionIndex === -1) return false;
  
  // Проверяем наличие штанг в секции
  const hasRods = app.cabinet.rods.some(rod => rod.sectionId === sectionIndex);
  if (hasRods) {
    if (window.mobileUI) {
      window.mobileUI.showNotification('Нельзя добавить стойку в секцию со штангами');
    }
    return false;
  }
  
  // Добавляем вертикальный разделитель в центре секции
  const dividerPos = section.x + section.w / 2;
  const result = app.cabinet.addDivider('v', dividerPos, section.y, section.y + section.h);
  
  if (result) {
    render();
    updatePartsList();
    return true;
  }
  return false;
};

app.addRodMobile = function(section) {
  if (!section) return false;
  
  saveHistory();
  
  // Находим индекс секции
  const sectionIndex = app.cabinet.sections.indexOf(section);
  if (sectionIndex === -1) return false;
  
  // Добавляем штангу в секцию
  const result = app.cabinet.addRod(sectionIndex);
  
  if (result) {
    render();
    updatePartsList();
    return true;
  }
  return false;
};

// Найти секцию по координатам для мобильной версии
app.findSectionAtCoords = function(x, y) {
  if (!app.cabinet || !app.renderer2d || !app.renderer2d.transform) return null;
  
  const transform = app.renderer2d.transform;
  // Преобразуем координаты экрана в координаты интерьера
  const interiorX = (x - transform.offsetX - CONFIG.PANEL_THICKNESS * transform.scale) / transform.scale;
  const interiorY = app.cabinet.interiorHeight - (y - transform.offsetY - CONFIG.PANEL_THICKNESS * transform.scale) / transform.scale;
  
  return app.cabinet.findSectionAt(interiorX, interiorY);
};

// Обработчик клика для мобильной версии
app.handleMobileClick = function(x, y) {
  const section = app.findSectionAtCoords(x, y);
  
  if (!section) {
    if (window.mobileUI) {
      window.mobileUI.showNotification('Выберите секцию для добавления элемента');
    }
    return false;
  }
  
  switch (app.mode) {
    case 'shelf':
      return app.addShelfMobile(section);
    case 'stand':
      return app.addStandMobile(section);
    case 'rod':
      return app.addRodMobile(section);
    default:
      return false;
  }
};

// Экспортируем функции для мобильного интерфейса
window.app = app;
window.setMode = setMode;
window.toggleDimensions = toggleDimensions;
window.undo = undo;
window.redo = redo;
window.applyDimensions = applyDimensions;
window.switchView = switchView;
window.isMobileDevice = isMobileDevice;

// Дополнительные функции для мобильного интерфейса
app.getAddMode = function() {
  return app.mode;
};

app.cancelAddMode = function() {
  setMode('none');
};

app.saveHistory = saveHistory;
app.updatePartsList = updatePartsList;
app.isMobile = isMobileDevice();

// Инициализация мобильной версии при необходимости
if (isMobileDevice()) {
  console.log('📱 Мобильное устройство обнаружено - инициализация мобильного UI');
  
  document.addEventListener('DOMContentLoaded', function() {
    // Создаем мобильную панель уведомлений
    if (!document.querySelector('.mobile-notifications')) {
      const notifications = document.createElement('div');
      notifications.className = 'mobile-notifications';
      document.body.appendChild(notifications);
    }
    
    // Показываем мобильное приветствие
    setTimeout(() => {
      if (window.mobileUI && window.mobileUI.showNotification) {
        window.mobileUI.showNotification('Добро пожаловать! Используйте панель снизу для редактирования', 3000);
      }
    }, 1000);
  });
}

// Экспортируем глобальные функции для мобильного интерфейса
window.app = app;
window.setMode = setMode;
window.toggleDimensions = toggleDimensions;
window.undo = undo;
window.redo = redo;
window.applyDimensions = applyDimensions;
window.switchView = switchView;

// Дополнительные функции для мобильного интерфейса
app.getAddMode = function() {
  return app.mode;
};

app.cancelAddMode = function() {
  setMode('none');
};

app.saveHistory = saveHistory;
app.updatePartsList = updatePartsList;

app.handleCanvasClick = function(event) {
  // Передаем событие в основной обработчик
  if (typeof onCanvasClick === 'function') {
    onCanvasClick(event);
  }
};

app.handleCanvasMouseMove = function(event) {
  // Передаем событие в основной обработчик
  if (typeof onMouseMove === 'function') {
    onMouseMove(event);
  }
};

// =========================== 
// ФУНКЦИИ ДЛЯ МОБИЛЬНОГО РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ
// ===========================

// Поиск элемента по координатам
app.findElementAt = function(canvasX, canvasY) {
  if (!app.cabinet || !app.renderer2d) {
    return null;
  }
  
  const transform = app.renderer2d.transform;
  if (!transform) {
    return null;
  }
  
  // Преобразуем координаты canvas в координаты интерьера
  const interiorX = (canvasX - transform.offsetX - 16 * transform.scale) / transform.scale;
  const interiorY = app.cabinet.getInteriorHeight() - (canvasY - transform.offsetY - 16 * transform.scale) / transform.scale;
  
  // Проверяем разделители (полки и стойки)
  for (const line of app.cabinet.lines) {
    const dims = line.getDimensions();
    
    if (line.type === 'horizontal') {
      // Проверяем полку
      if (interiorX >= dims.x && interiorX <= dims.x + dims.width &&
          interiorY >= dims.y && interiorY <= dims.y + dims.height) {
        return line;
      }
    } else if (line.type === 'vertical') {
      // Проверяем стойку
      if (interiorX >= dims.x && interiorX <= dims.x + dims.width &&
          interiorY >= dims.y && interiorY <= dims.y + dims.height) {
        return line;
      }
    }
  }
  
  return null;
};

// Перемещение элемента
app.moveElement = function(element, deltaX, deltaY) {
  if (!element || !app.cabinet) {
    console.error('Элемент или шкаф не найден для перемещения');
    return false;
  }
  
  console.log('Перемещение элемента:', element.type, 'на', deltaX, deltaY);
  
  // Сохраняем состояние перед перемещением
  saveHistory();
  
  try {
    if (element.type === 'vertical') {
      // Перемещаем стойку
      const limits = element.findLimits();
      const newX = Math.max(limits.left, Math.min(limits.right, element.x + deltaX));
      element.moveTo(newX);
    } else if (element.type === 'horizontal') {
      // Перемещаем полку
      const limits = element.findLimits();
      const newY = Math.max(limits.top, Math.min(limits.bottom, element.y + deltaY));
      element.moveTo(newY);
    }
    
    // Перестраиваем секции и обновляем отображение
    app.cabinet.rebuildSections();
    render();
    updatePartsList();
    
    return true;
  } catch (error) {
    console.error('Ошибка при перемещении элемента:', error);
    return false;
  }
};

// Удаление элемента
app.deleteElement = function(element) {
  if (!element || !app.cabinet) {
    console.error('Элемент или шкаф не найден для удаления');
    return false;
  }
  
  console.log('Удаление элемента:', element.type, element.id);
  
  // Сохраняем состояние перед удалением
  saveHistory();
  
  try {
    // Находим индекс элемента в массиве
    const index = app.cabinet.lines.indexOf(element);
    if (index > -1) {
      // Удаляем элемент
      app.cabinet.lines.splice(index, 1);
      
      // Перестраиваем секции и обновляем отображение
      app.cabinet.rebuildSections();
      render();
      updatePartsList();
      
      return true;
    } else {
      console.error('Элемент не найден в списке разделителей');
      return false;
    }
  } catch (error) {
    console.error('Ошибка при удалении элемента:', error);
    return false;
  }
};

// Подсветка элемента
app.highlightElement = function(element) {
  app.selectedDivider = element;
  render();
};

// Очистка подсветки
app.clearHighlight = function() {
  app.selectedDivider = null;
  render();
};

// Экспортируем новые функции для мобильного интерфейса
window.findElementAt = app.findElementAt;
window.moveElement = app.moveElement;
window.deleteElement = app.deleteElement;