/**
 * Оптимизированный Touch Handler с поддержкой редактирования и удаления
 * Версия 3.0 - Добавлены функции редактирования и удаления элементов
 */

class TouchHandler {
  constructor(app) {
    this.app = app;
    this.canvas = document.getElementById('canvas');
    this.isInitialized = false;
    
    // Состояние touch
    this.touches = new Map();
    this.lastTouch = null;
    this.gestureStartTime = 0;
    this.gestureTimeout = null;
    
    // Параметры жестов
    this.tapThreshold = 150; // мс
    this.moveThreshold = 10; // пикселей
    this.swipeThreshold = 50; // пикселей для свайпа
    this.swipeVelocityThreshold = 0.5; // пикселей/мс
    
    // Состояние редактирования и удаления
    this.editMode = false;
    this.deleteMode = false;
    this.selectedElement = null;
    this.dragOffset = { x: 0, y: 0 };
    
    // Проверяем поддержку touch
    if ('ontouchstart' in window) {
      this.init();
    }
  }

  init() {
    if (this.isInitialized || !this.canvas) return;
    
    console.log('🤏 Инициализация Touch Handler v3.0...');
    
    this.setupTouchEvents();
    this.setupSwipeGestures();
    this.createTouchIndicators();
    
    this.isInitialized = true;
    console.log('✅ Touch Handler v3.0 инициализирован');
  }

  // =========================== 
  // НАСТРОЙКА СОБЫТИЙ
  // ===========================

  setupTouchEvents() {
    // Основные touch события
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    this.canvas.addEventListener('touchcancel', (e) => this.handleTouchCancel(e), { passive: false });

    // Предотвращаем стандартные жесты браузера
    this.canvas.addEventListener('gesturestart', (e) => e.preventDefault());
    this.canvas.addEventListener('gesturechange', (e) => e.preventDefault());
    this.canvas.addEventListener('gestureend', (e) => e.preventDefault());
  }

  setupSwipeGestures() {
    // Обработка свайпов для открытия панели настроек
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;
        const endTime = Date.now();
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const deltaTime = endTime - startTime;
        const velocity = Math.abs(deltaX) / deltaTime;
        
        // Свайп влево с правого края экрана
        if (startX > window.innerWidth - 50 && 
            deltaX < -this.swipeThreshold && 
            Math.abs(deltaY) < 100 && 
            velocity > this.swipeVelocityThreshold) {
          
          if (window.mobileUI && !window.mobileUI.settingsOpen) {
            window.mobileUI.openSettings();
          }
        }
        
        // Свайп вправо для закрытия панели
        if (window.mobileUI && window.mobileUI.settingsOpen && 
            deltaX > this.swipeThreshold && 
            Math.abs(deltaY) < 100) {
          window.mobileUI.closeSettings();
        }
      }
    }, { passive: true });
  }

  createTouchIndicators() {
    // Создаем индикаторы touch для визуальной обратной связи
    this.touchIndicator = document.createElement('div');
    this.touchIndicator.className = 'touch-indicator';
    document.body.appendChild(this.touchIndicator);
  }

  // =========================== 
  // ОБРАБОТКА TOUCH СОБЫТИЙ
  // ===========================

  handleTouchStart(e) {
    e.preventDefault();
    
    const touches = Array.from(e.touches);
    this.gestureStartTime = Date.now();
    
    // Сохраняем информацию о touch
    touches.forEach(touch => {
      this.touches.set(touch.identifier, {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        startTime: this.gestureStartTime
      });
    });

    this.showTouchIndicator(touches[0].clientX, touches[0].clientY);

    if (touches.length === 1) {
      this.handleSingleTouchStart(touches[0]);
    } else if (touches.length === 2) {
      this.handleMultiTouchStart(touches);
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    
    const touches = Array.from(e.touches);
    
    // Обновляем информацию о touch
    touches.forEach(touch => {
      if (this.touches.has(touch.identifier)) {
        const touchData = this.touches.get(touch.identifier);
        touchData.currentX = touch.clientX;
        touchData.currentY = touch.clientY;
      }
    });

    if (touches.length === 1) {
      this.handleSingleTouchMove(touches[0]);
    } else if (touches.length === 2) {
      this.handleMultiTouchMove(touches);
    }

    this.updateTouchIndicator(touches[0].clientX, touches[0].clientY);
  }

  handleTouchEnd(e) {
    e.preventDefault();
    
    const touches = Array.from(e.changedTouches);
    const remainingTouches = Array.from(e.touches);
    
    touches.forEach(touch => {
      if (this.touches.has(touch.identifier)) {
        const touchData = this.touches.get(touch.identifier);
        const duration = Date.now() - touchData.startTime;
        const distance = this.calculateDistance(
          touchData.startX, touchData.startY,
          touch.clientX, touch.clientY
        );
        
        // Определяем тип жеста
        if (duration < this.tapThreshold && distance < this.moveThreshold) {
          this.handleTap(touch);
        }
        
        this.touches.delete(touch.identifier);
      }
    });

    this.hideTouchIndicator();

    // Сбрасываем состояние если больше нет touch
    if (remainingTouches.length === 0) {
      this.resetTouchState();
    }
  }

  handleTouchCancel(e) {
    e.preventDefault();
    this.resetTouchState();
    this.hideTouchIndicator();
  }

  // =========================== 
  // ОБРАБОТКА ЖЕСТОВ
  // ===========================

  handleSingleTouchStart(touch) {
    // Пока не реализуем drag для простоты
    console.log('Single touch start');
  }

  handleSingleTouchMove(touch) {
    // Пока не реализуем drag для простоты
    console.log('Single touch move');
  }

  handleMultiTouchStart(touches) {
    // Двухпальцевые жесты для 3D вида
    if (touches.length === 2) {
      const distance = this.calculateDistance(
        touches[0].clientX, touches[0].clientY,
        touches[1].clientX, touches[1].clientY
      );
      
      this.initialPinchDistance = distance;
      this.lastPinchDistance = distance;
    }
  }

  handleMultiTouchMove(touches) {
    if (touches.length === 2 && this.initialPinchDistance) {
      const currentDistance = this.calculateDistance(
        touches[0].clientX, touches[0].clientY,
        touches[1].clientX, touches[1].clientY
      );
      
      const scale = currentDistance / this.initialPinchDistance;
      const deltaScale = currentDistance / this.lastPinchDistance;
      
      // Применяем масштабирование для 3D вида
      if (this.app && this.app.renderer3d && this.app.currentView === '3d') {
        this.app.renderer3d.handlePinch(deltaScale);
      }
      
      this.lastPinchDistance = currentDistance;
    }
  }

  handleTap(touch) {
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = touch.clientX - rect.left;
    const canvasY = touch.clientY - rect.top;
    
    // Преобразуем координаты в координаты приложения
    const appCoords = this.convertCanvasToAppCoords(canvasX, canvasY);
    
    console.log('🤏 Touch tap обнаружен в координатах:', { canvasX, canvasY, appCoords });
    
    // Проверяем, какой режим активен
    const activeTool = document.querySelector('.mobile-tool-btn.active');
    if (activeTool) {
      const toolType = activeTool.dataset.tool;
      console.log('Активный инструмент:', toolType);
      
      // Обработка режимов редактирования и удаления
      if (toolType === 'edit' || toolType === 'delete') {
        const element = this.app && this.app.findElementAt ? this.app.findElementAt(canvasX, canvasY) : null;
        if (element) {
          if (toolType === 'edit') {
            this.handleElementEdit(element);
          } else if (toolType === 'delete') {
            this.handleElementDelete(element);
          }
          return;
        } else {
          if (window.mobileUI) {
            window.mobileUI.showNotification('Элемент не найден. Нажмите на полку или стойку.');
          }
          return;
        }
      }
    }
    
    // Обычная обработка тапа для добавления элементов
    this.forwardTapToApp(appCoords.x, appCoords.y);
  }

  // =========================== 
  // ФУНКЦИИ РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ
  // ===========================

  handleElementEdit(element) {
    console.log('Редактирование элемента:', element);
    
    if (window.mobileUI && window.mobileUI.editMode) {
      window.mobileUI.selectElementForEdit(element);
    }
    
    // Подсветка элемента
    this.highlightElement(element);
    
    if (window.mobileUI) {
      window.mobileUI.showNotification(`Элемент ${element.displayName || 'выбран'} для редактирования`);
    }
  }

  handleElementDelete(element) {
    console.log('Удаление элемента:', element);
    
    // Создаем диалог подтверждения удаления
    this.showDeleteConfirmation(element);
  }

  showDeleteConfirmation(element) {
    // Удаляем существующий диалог если есть
    const existingDialog = document.querySelector('.delete-confirmation');
    if (existingDialog) {
      existingDialog.remove();
    }
    
    const dialog = document.createElement('div');
    dialog.className = 'delete-confirmation';
    dialog.innerHTML = `
      <h4>Удалить элемент?</h4>
      <p>Вы действительно хотите удалить ${element.displayName || 'этот элемент'}?</p>
      <div class="button-group">
        <button class="btn-cancel">Отмена</button>
        <button class="btn-confirm">Удалить</button>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Обработчики кнопок
    dialog.querySelector('.btn-cancel').addEventListener('click', () => {
      dialog.remove();
    });
    
    dialog.querySelector('.btn-confirm').addEventListener('click', () => {
      this.confirmElementDelete(element);
      dialog.remove();
    });
    
    // Автоматическое закрытие через 10 секунд
    setTimeout(() => {
      if (dialog.parentNode) {
        dialog.remove();
      }
    }, 10000);
  }

  confirmElementDelete(element) {
    if (this.app && this.app.deleteElement) {
      this.app.deleteElement(element);
      if (window.mobileUI) {
        window.mobileUI.showNotification(`${element.displayName || 'Элемент'} удален`);
      }
    } else {
      console.error('Функция удаления не найдена в приложении');
      if (window.mobileUI) {
        window.mobileUI.showNotification('Ошибка: не удалось удалить элемент');
      }
    }
  }

  // =========================== 
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // ===========================

  forwardTapToApp(x, y) {
    // Передаем событие тапа в основное приложение
    if (this.app && this.app.handleCanvasClick) {
      // Создаем искусственное событие клика
      const fakeEvent = {
        clientX: x,
        clientY: y,
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      this.app.handleCanvasClick(fakeEvent);
    } else if (typeof onCanvasClick === 'function') {
      // Прямое обращение к глобальной функции
      const fakeEvent = {
        clientX: x,
        clientY: y,
        preventDefault: () => {},
        stopPropagation: () => {}
      };
      onCanvasClick(fakeEvent);
    } else {
      console.log('Обработчик клика не найден');
    }
  }

  highlightElement(element) {
    // Подсветка выбранного элемента
    if (this.app && this.app.highlightElement) {
      this.app.highlightElement(element);
    }
  }

  convertCanvasToAppCoords(canvasX, canvasY) {
    // Преобразование координат canvas в координаты приложения
    if (!this.app || !this.app.renderer2d || !this.app.renderer2d.transform) {
      return { x: canvasX, y: canvasY };
    }
    
    const transform = this.app.renderer2d.transform;
    const x = (canvasX - transform.offsetX) / transform.scale;
    const y = (canvasY - transform.offsetY) / transform.scale;
    
    return { x, y };
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  // =========================== 
  // ВИЗУАЛЬНАЯ ОБРАТНАЯ СВЯЗЬ
  // ===========================

  showTouchIndicator(x, y) {
    if (!this.touchIndicator) return;
    
    this.touchIndicator.style.left = x + 'px';
    this.touchIndicator.style.top = y + 'px';
    this.touchIndicator.classList.add('active');
  }

  updateTouchIndicator(x, y) {
    if (!this.touchIndicator) return;
    
    this.touchIndicator.style.left = x + 'px';
    this.touchIndicator.style.top = y + 'px';
  }

  hideTouchIndicator() {
    if (!this.touchIndicator) return;
    
    this.touchIndicator.classList.remove('active');
  }

  // =========================== 
  // СИНХРОНИЗАЦИЯ С МОБИЛЬНЫМ UI
  // ===========================

  setEditMode(enabled) {
    this.editMode = enabled;
    if (window.mobileUI) {
      window.mobileUI.editMode = enabled;
    }
  }

  setDeleteMode(enabled) {
    this.deleteMode = enabled;
    if (window.mobileUI) {
      window.mobileUI.deleteMode = enabled;
    }
  }

  deactivateAllModes() {
    this.editMode = false;
    this.deleteMode = false;
    this.selectedElement = null;
    
    if (window.mobileUI) {
      window.mobileUI.deactivateAllModes();
    }
  }

  resetTouchState() {
    this.touches.clear();
    this.deactivateAllModes();
    this.dragOffset = { x: 0, y: 0 };
    this.initialPinchDistance = null;
    this.lastPinchDistance = null;
    
    // Убираем подсветку
    if (this.app && this.app.clearHighlight) {
      this.app.clearHighlight();
    }
  }

  // =========================== 
  // ОЧИСТКА
  // ===========================

  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', this.handleTouchStart);
      this.canvas.removeEventListener('touchmove', this.handleTouchMove);
      this.canvas.removeEventListener('touchend', this.handleTouchEnd);
      this.canvas.removeEventListener('touchcancel', this.handleTouchCancel);
    }
    
    if (this.touchIndicator && this.touchIndicator.parentNode) {
      this.touchIndicator.parentNode.removeChild(this.touchIndicator);
    }
    
    this.resetTouchState();
    this.isInitialized = false;
  }
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TouchHandler;
} else {
  window.TouchHandler = TouchHandler;
}
