/**
 * Оптимизированный Mobile UI Manager
 * Версия 2.0 - Полностью переработанная мобильная версия
 */

class MobileUIManager {
  constructor() {
    this.isInitialized = false;
    this.isExpanded = false;
    this.settingsOpen = false;
    this.editMode = false;
    this.deleteMode = false;
    this.selectedElement = null;
    
    // Проверяем, что мы на мобильном устройстве
    if (!this.isMobileDevice()) {
      return;
    }
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;

    console.log('🚀 Инициализация оптимизированного мобильного UI...');
    
    this.setupViewport();
    this.loadMobileStyles();
    this.createMobileElements();
    this.setupEventListeners();
    this.optimizeForMobile();
    
    this.isInitialized = true;
    console.log('✅ Мобильный UI инициализирован');
  }

  // =========================== 
  // ИНИЦИАЛИЗАЦИЯ
  // ===========================

  setupViewport() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover';
  }

  loadMobileStyles() {
    // Загружаем оптимизированные мобильные стили
    if (!document.getElementById('mobile-optimized-styles')) {
      const link = document.createElement('link');
      link.id = 'mobile-optimized-styles';
      link.rel = 'stylesheet';
      link.href = 'css/mobile-optimized.css';
      document.head.appendChild(link);
    }
  }

  createMobileElements() {
    this.createToolbar();
    this.createSettingsPanel();
    this.createNotifications();
    this.createOverlay();
    this.createSwipeIndicator();
  }

  // =========================== 
  // СОЗДАНИЕ ЭЛЕМЕНТОВ
  // ===========================

  createToolbar() {
    if (document.querySelector('.mobile-toolbar')) {
      console.log('Панель инструментов уже существует');
      return;
    }
    
    console.log('Создание панели инструментов...');
    
    const toolbar = document.createElement('div');
    toolbar.className = 'mobile-toolbar';
    toolbar.innerHTML = `
      <button class="mobile-tool-btn" data-tool="shelf" title="Добавить полку">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18"/>
        </svg>
        <span>Полка</span>
      </button>
      
      <button class="mobile-tool-btn" data-tool="stand" title="Добавить стойку">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v18"/>
        </svg>
        <span>Стойка</span>
      </button>
      
      <button class="mobile-tool-btn" data-tool="rod" title="Добавить штангу">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
          <circle cx="19" cy="12" r="1" stroke="currentColor" fill="none"/>
          <circle cx="5" cy="12" r="1" stroke="currentColor" fill="none"/>
        </svg>
        <span>Штанга</span>
      </button>
      
      <button class="mobile-tool-btn" data-tool="edit" title="Редактировать элемент">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
        </svg>
        <span>Редакт.</span>
      </button>
      
      <button class="mobile-tool-btn" data-tool="delete" title="Удалить элемент">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
        </svg>
        <span>Удалить</span>
      </button>
      
      <button class="mobile-tool-btn mobile-tool-btn-hidden" data-tool="undo" title="Отменить действие">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
        </svg>
        <span>Отмена</span>
      </button>
      
      <button class="mobile-tool-btn" data-tool="settings" title="Настройки шкафа">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z"/>
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
        </svg>
        <span>Габариты</span>
      </button>
      
      <button class="mobile-expand-btn" data-tool="expand" title="Развернуть панель">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
        </svg>
      </button>
      
      <!-- Скрытые кнопки (появляются при развертывании) -->
      <button class="mobile-tool-btn mobile-tool-btn-hidden" data-tool="view" title="Переключить вид">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"/>
        </svg>
        <span>Вид</span>
      </button>
      
      <button class="mobile-tool-btn mobile-tool-btn-hidden" data-tool="redo" title="Повторить действие">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"/>
        </svg>
        <span>Повтор</span>
      </button>
      
      <button class="mobile-tool-btn mobile-tool-btn-hidden" data-tool="dimensions" title="Показать размеры">
        <svg fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
        </svg>
        <span>Размеры</span>
      </button>
    `;

    document.body.appendChild(toolbar);
    console.log('🔨 Панель инструментов создана и добавлена на страницу');
    
    // Проверяем, что кнопки действительно добавились
    const createdBtns = toolbar.querySelectorAll('.mobile-tool-btn');
    console.log('🔨 Создано кнопок:', createdBtns.length);
    createdBtns.forEach((btn, i) => {
      console.log(`🔨 Кнопка ${i}:`, btn.dataset.tool);
    });
  }
  }

  createSettingsPanel() {
    if (document.querySelector('.mobile-settings-panel')) {
      console.log('Панель настроек уже существует');
      return;
    }
    
    console.log('Создание панели настроек...');
    
    const panel = document.createElement('div');
    panel.className = 'mobile-settings-panel';
    panel.innerHTML = `
      <div class="mobile-settings-header">
        <h3>Габариты шкафа</h3>
        <button class="mobile-close-btn" title="Закрыть">
          <svg fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="mobile-settings-content">
        <div class="control-group">
          <label class="control-label">Ширина (мм)</label>
          <input type="number" id="mobile-width" class="input-field" value="800" min="132" max="2000">
        </div>
        
        <div class="control-group">
          <label class="control-label">Высота (мм)</label>
          <input type="number" id="mobile-height" class="input-field" value="1800" min="132" max="3000">
        </div>
        
        <div class="control-group">
          <label class="control-label">Глубина (мм)</label>
          <input type="number" id="mobile-depth" class="input-field" value="500" min="100" max="1000">
        </div>
        
        <div class="control-group">
          <label class="control-label">Цоколь (мм)</label>
          <input type="number" id="mobile-base" class="input-field" value="100" min="60" max="200">
        </div>
        
        <div class="control-group">
          <button id="mobile-apply" class="btn-primary">
            <svg fill="none" viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-right: 8px;">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
            Применить изменения
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    console.log('Панель настроек создана и добавлена');
  }

  createNotifications() {
    if (document.querySelector('.mobile-notifications')) return;
    
    const notifications = document.createElement('div');
    notifications.className = 'mobile-notifications';
    document.body.appendChild(notifications);
  }

  createOverlay() {
    if (document.querySelector('.mobile-settings-overlay')) {
      console.log('Оверлей уже существует');
      return;
    }
    
    console.log('Создание оверлея...');
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-settings-overlay';
    document.body.appendChild(overlay);
    
    console.log('Оверлей создан и добавлен');
  }

  createSwipeIndicator() {
    if (document.querySelector('.swipe-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'swipe-indicator pulse';
    indicator.title = 'Свайпните влево для настроек';
    document.body.appendChild(indicator);
    
    // Убираем анимацию после первого использования
    setTimeout(() => {
      indicator.classList.remove('pulse');
    }, 5000);
  }

  // =========================== 
  // ОБРАБОТЧИКИ СОБЫТИЙ
  // ===========================

  setupEventListeners() {
    console.log('👆 Настройка обработчиков событий...');
    
    // Используем делегирование событий для надежности
    document.body.addEventListener('click', (e) => {
      console.log('👆 Клик по:', e.target);
      
      const toolBtn = e.target.closest('.mobile-tool-btn');
      const expandBtn = e.target.closest('.mobile-expand-btn');
      
      if (toolBtn && toolBtn.dataset.tool) {
        console.log('👆 Нажата кнопка с tool:', toolBtn.dataset.tool);
        e.preventDefault();
        e.stopPropagation();
        this.handleToolClick(toolBtn.dataset.tool, toolBtn);
        return;
      }
      
      if (expandBtn && expandBtn.dataset.tool === 'expand') {
        console.log('👆 Нажата кнопка разворота');
        e.preventDefault();
        e.stopPropagation();
        this.handleToolClick('expand', expandBtn);
        return;
      }
      
      // Обработка других кнопок
      if (e.target.closest('.mobile-close-btn')) {
        e.preventDefault();
        this.closeSettings();
        return;
      }
      
      if (e.target.closest('.mobile-settings-overlay')) {
        e.preventDefault();
        this.closeSettings();
        return;
      }
      
      if (e.target.closest('#mobile-apply')) {
        e.preventDefault();
        this.applySettings();
        return;
      }
    });

    // Синхронизация с основными полями
    this.syncInputs();

    // Обработчик изменения ориентации
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleOrientationChange(), 100);
    });
  }

  syncInputs() {
    // Синхронизируем мобильные поля с основными
    const pairs = [
      ['width', 'mobile-width'],
      ['height', 'mobile-height'],
      ['depth', 'mobile-depth'],
      ['base', 'mobile-base']
    ];

    pairs.forEach(([mainId, mobileId]) => {
      const mainInput = document.getElementById(mainId);
      const mobileInput = document.getElementById(mobileId);
      
      if (mainInput && mobileInput) {
        // Синхронизируем значения при загрузке
        mobileInput.value = mainInput.value;
        
        // Синхронизируем изменения
        mainInput.addEventListener('input', () => {
          mobileInput.value = mainInput.value;
        });
        
        mobileInput.addEventListener('input', () => {
          mainInput.value = mobileInput.value;
        });
      }
    });
  }

  // =========================== 
  // ОБРАБОТКА ДЕЙСТВИЙ
  // ===========================

  handleToolClick(tool, button) {
    console.log('🔧 handleToolClick вызван с:', { tool, button, app: window.app, setMode: window.setMode });
    
    // Убираем активное состояние со всех кнопок
    document.querySelectorAll('.mobile-tool-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    switch (tool) {
      case 'shelf':
        console.log('🔧 Обработка shelf');
        this.activateTool('shelf', button);
        break;
        
      case 'stand':
        console.log('🔧 Обработка stand');
        this.activateTool('stand', button);
        break;
        
      case 'rod':
        console.log('🔧 Обработка rod');
        this.activateTool('rod', button);
        break;
        
      case 'edit':
        console.log('🔧 Обработка edit');
        this.activateEditMode(button);
        break;
        
      case 'delete':
        console.log('🔧 Обработка delete');
        this.activateDeleteMode(button);
        break;
        
      case 'undo':
        console.log('🔧 Обработка undo');
        this.executeUndo();
        break;
        
      case 'redo':
        console.log('🔧 Обработка redo');
        this.executeRedo();
        break;
        
      case 'view':
        console.log('🔧 Обработка view');
        this.toggleView();
        break;
        
      case 'dimensions':
        console.log('🔧 Обработка dimensions');
        this.toggleDimensions(button);
        break;
        
      case 'settings':
        console.log('🔧 Обработка settings');
        this.openSettings();
        break;
        
      case 'expand':
        console.log('🔧 Обработка expand');
        this.toggleExpand();
        break;
        
      default:
        console.log('🔧 Неизвестный инструмент:', tool);
    }
  }

  activateTool(mode, button) {
    console.log('Активация инструмента:', mode);
    
    if (window.app && window.setMode) {
      window.setMode(mode);
      button.classList.add('active');
      
      const modeText = {
        'shelf': 'полки',
        'stand': 'стойки',
        'rod': 'штанги'
      };
      
      this.showNotification(`Режим добавления ${modeText[mode] || mode} активирован. Кликните на секцию шкафа.`);
    } else {
      console.error('Основное приложение не готово');
      this.showNotification('Ошибка: приложение еще не загружено');
    }
  }

  executeUndo() {
    if (window.app && window.app.undo) {
      window.app.undo();
      this.showNotification('Действие отменено');
    }
  }

  // =========================== 
  // ФУНКЦИИ РЕДАКТИРОВАНИЯ И УДАЛЕНИЯ
  // ===========================

  createEditPanel() {
    // Удаляем старую панель если она есть
    this.removeEditPanel();
    
    const editPanel = document.createElement('div');
    editPanel.className = 'mobile-edit-panel show';
    editPanel.innerHTML = `
      <div class="edit-panel-header">
        <h4>Редактирование элемента</h4>
        <button class="edit-panel-close">
          <svg fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="edit-panel-content">
        <p class="edit-instruction">Выберите элемент на чертеже для редактирования</p>
        <div class="edit-controls" id="editControls" style="display: none;">
          <div class="control-group">
            <label>Позиция:</label>
            <div class="position-controls">
              <button class="btn-control" data-action="move-left">←</button>
              <button class="btn-control" data-action="move-right">→</button>
              <button class="btn-control" data-action="move-up">↑</button>
              <button class="btn-control" data-action="move-down">↓</button>
            </div>
          </div>
          <div class="control-group">
            <button class="btn-danger" data-action="delete">Удалить элемент</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(editPanel);
    
    // Добавляем обработчики
    editPanel.querySelector('.edit-panel-close').addEventListener('click', () => {
      this.closeEditMode();
    });
    
    editPanel.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleEditAction(e.target.dataset.action);
      });
    });
  }

  removeEditPanel() {
    const existingPanel = document.querySelector('.mobile-edit-panel');
    if (existingPanel) {
      existingPanel.remove();
    }
  }

  closeEditMode() {
    this.deactivateAllModes();
    
    // Убираем активное состояние с кнопки редактирования
    const editBtn = document.querySelector('[data-tool="edit"]');
    if (editBtn) {
      editBtn.classList.remove('active');
    }
    
    // Отменяем режим в основном приложении
    if (window.app && window.setMode) {
      window.setMode('none');
    }
  }

  selectElementForEdit(element) {
    this.selectedElement = element;
    
    const editControls = document.getElementById('editControls');
    const instruction = document.querySelector('.edit-instruction');
    
    if (editControls && instruction) {
      instruction.textContent = `Выбран: ${element.displayName || 'Элемент'}`;
      editControls.style.display = 'block';
    }
    
    this.showNotification(`Выбран элемент: ${element.displayName || 'Элемент'}`);
  }

  handleEditAction(action) {
    if (!this.selectedElement) {
      this.showNotification('Сначала выберите элемент для редактирования');
      return;
    }
    
    console.log('Действие редактирования:', action, 'для элемента:', this.selectedElement);
    
    switch (action) {
      case 'move-left':
        this.moveElement(this.selectedElement, -10, 0);
        break;
      case 'move-right':
        this.moveElement(this.selectedElement, 10, 0);
        break;
      case 'move-up':
        this.moveElement(this.selectedElement, 0, 10);
        break;
      case 'move-down':
        this.moveElement(this.selectedElement, 0, -10);
        break;
      case 'delete':
        this.deleteElement(this.selectedElement);
        break;
    }
  }

  moveElement(element, deltaX, deltaY) {
    if (window.app && window.app.moveElement) {
      window.app.moveElement(element, deltaX, deltaY);
      this.showNotification('Элемент перемещен');
    } else {
      console.error('Функция перемещения не найдена');
      this.showNotification('Ошибка: не удалось переместить элемент');
    }
  }

  deleteElement(element) {
    if (confirm('Удалить выбранный элемент?')) {
      if (window.app && window.app.deleteElement) {
        window.app.deleteElement(element);
        this.selectedElement = null;
        this.closeEditMode();
        this.showNotification('Элемент удален');
      } else {
        console.error('Функция удаления не найдена');
        this.showNotification('Ошибка: не удалось удалить элемент');
      }
    }
  }

  handleElementClick(element) {
    if (this.editMode) {
      this.selectElementForEdit(element);
    } else if (this.deleteMode) {
      this.deleteElement(element);
    }
  }

  executeRedo() {
    console.log('Выполнение повтора');
    if (window.redo) {
      window.redo();
      this.showNotification('Действие повторено');
    } else {
      console.error('Функция redo не найдена');
      this.showNotification('Ошибка: не удалось повторить действие');
    }
  }

  toggleView() {
    console.log('Переключение вида');
    if (window.switchView) {
      // Проверяем текущий вид
      const view2d = document.getElementById('view2d');
      const view3d = document.getElementById('view3d');
      
      if (view2d && view3d) {
        if (view2d.classList.contains('active')) {
          window.switchView('3d');
          this.showNotification('Переключено на 3D вид');
        } else {
          window.switchView('2d');
          this.showNotification('Переключено на 2D вид');
        }
      }
    } else {
      console.error('Функция switchView не найдена');
      this.showNotification('Ошибка: не удалось переключить вид');
    }
  }

  toggleDimensions(button) {
    console.log('Переключение размеров');
    if (window.toggleDimensions) {
      window.toggleDimensions();
      const isActive = button.classList.toggle('active');
      this.showNotification(isActive ? 'Размеры показаны' : 'Размеры скрыты');
    } else {
      console.error('Функция toggleDimensions не найдена');
      this.showNotification('Ошибка: не удалось переключить размеры');
    }
  }

  toggleExpand() {
    console.log('Переключение разворота панели');
    
    const toolbar = document.querySelector('.mobile-toolbar');
    const expandBtn = document.querySelector('.mobile-expand-btn');
    
    if (!toolbar || !expandBtn) {
      console.error('Панель или кнопка разворота не найдены');
      return;
    }
    
    this.isExpanded = !this.isExpanded;
    
    if (this.isExpanded) {
      toolbar.classList.add('expanded');
      console.log('Панель развернута');
      this.showNotification('Панель развернута - доступны дополнительные инструменты');
    } else {
      toolbar.classList.remove('expanded');
      console.log('Панель свернута');
      this.showNotification('Панель свернута');
    }
  }

  openSettings() {
    console.log('Открытие настроек');
    
    // Проверяем, что панель существует
    const panel = document.querySelector('.mobile-settings-panel');
    const overlay = document.querySelector('.mobile-settings-overlay');
    
    if (!panel) {
      console.error('Панель настроек не найдена!');
      // Пытаемся создать панель
      this.createSettingsPanel();
      this.createOverlay();
    }
    
    if (!overlay) {
      console.error('Оверлей не найден!');
      this.createOverlay();
    }
    
    this.settingsOpen = true;
    document.body.classList.add('mobile-settings-open');
    
    console.log('Класс mobile-settings-open добавлен к body');
    this.showNotification('Настройки габаритов открыты');
  }

  closeSettings() {
    this.settingsOpen = false;
    document.body.classList.remove('mobile-settings-open');
    
    // Убираем активное состояние с кнопки настроек
    const settingsBtn = document.querySelector('[data-tool="settings"]');
    if (settingsBtn) {
      settingsBtn.classList.remove('active');
    }
  }

  applySettings() {
    console.log('Применение настроек');
    
    // Используем существующую функцию применения размеров
    if (window.applyDimensions) {
      window.applyDimensions();
      this.closeSettings();
      this.showNotification('Габариты применены успешно');
    } else {
      console.error('Функция applyDimensions не найдена');
      this.showNotification('Ошибка: не удалось применить настройки');
    }
  }

  // =========================== 
  // УВЕДОМЛЕНИЯ
  // ===========================

  showNotification(message, duration = 2500) {
    const container = document.querySelector('.mobile-notifications');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = 'mobile-notification';
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Автоматическое удаление
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, duration);
  }

  // =========================== 
  // ОПТИМИЗАЦИЯ
  // ===========================

  optimizeForMobile() {
    // Отключаем контекстное меню
    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('#canvas')) {
        e.preventDefault();
      }
    });

    // Предотвращаем zoom при двойном тапе
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Оптимизируем canvas для touch
    const canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.style.touchAction = 'none';
    }
  }

  handleOrientationChange() {
    // Обновляем размеры при изменении ориентации
    setTimeout(() => {
      if (window.app && window.app.renderer2d && window.app.renderer2d.updateCanvas) {
        window.app.renderer2d.updateCanvas();
      }
    }, 300);
  }

  // =========================== 
  // ОТЛАДКА И ТЕСТИРОВАНИЕ
  // ===========================
  
  // =========================== 
  // ОТЛАДКА И ТЕСТИРОВАНИЕ
  // ===========================
  
  testOpenSettings() {
    this.openSettings();
  }
  
  testCloseSettings() {
    this.closeSettings();
  }

  testEditMode() {
    console.log('🧪 Тест режима редактирования');
    
    // Проверяем, что кнопка существует
    const editBtn = document.querySelector('[data-tool="edit"]');
    console.log('🧪 Кнопка редактирования:', editBtn);
    
    if (editBtn) {
      console.log('🧪 Вызываем handleToolClick напрямую');
      this.handleToolClick('edit', editBtn);
    } else {
      console.error('🧪 Кнопка редактирования не найдена!');
      
      // Показываем все мобильные кнопки
      const allMobileBtns = document.querySelectorAll('.mobile-tool-btn');
      console.log('🧪 Все мобильные кнопки:', allMobileBtns);
      allMobileBtns.forEach((btn, i) => {
        console.log(`🧪 Кнопка ${i}:`, btn, 'data-tool:', btn.dataset.tool);
      });
    }
  }

  testDeleteMode() {
    const deleteBtn = document.querySelector('[data-tool="delete"]');
    if (deleteBtn) {
      this.handleToolClick('delete', deleteBtn);
    }
  }

  isMobileDevice() {
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    console.log('Проверка мобильного устройства:', {
      innerWidth: window.innerWidth,
      hasTouch: 'ontouchstart' in window,
      maxTouchPoints: navigator.maxTouchPoints,
      isMobile: isMobile
    });
    return isMobile;
  }

  // Очистка при уничтожении
  destroy() {
    const mobileElements = document.querySelectorAll(
      '.mobile-toolbar, .mobile-settings-panel, .mobile-notifications, .mobile-settings-overlay'
    );
    mobileElements.forEach(el => el.remove());
    
    const mobileStyles = document.getElementById('mobile-optimized-styles');
    if (mobileStyles) {
      mobileStyles.remove();
    }
    
    this.isInitialized = false;
  }
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileUIManager;
} else {
  window.MobileUIManager = MobileUIManager;
}
