/**
 * APPLICATION LAYER - Advanced Cabinet Renderer
 * High-quality 2D/3D rendering with interactivity
 */

export class CabinetRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas element '${canvasId}' not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Rendering state
        this.zoom = 1;
        this.offset = { x: 0, y: 0 };
        this.mode = '2D'; // '2D' or '3D'
        this.selectedElement = null;
        this.hoveredElement = null;
        
        // High-DPI support
        this.setupHighDPI();
        
        // Colors and styles
        this.theme = {
            background: '#ffffff',
            grid: 'rgba(0, 0, 0, 0.05)',
            panel: {
                ldsp: '#f8f9fa',
                hdf: '#e9ecef',
                mdf: '#dee2e6'
            },
            stroke: '#2c3e50',
            selected: '#4a9eff',
            hover: '#74b9ff',
            section: 'rgba(74, 158, 255, 0.1)',
            sectionStroke: 'rgba(74, 158, 255, 0.3)',
            dimension: '#657786',
            text: '#2c3e50'
        };
        
        // Bind mouse events
        this.bindEvents();
        
        // Initial resize
        this.resize();
        
        console.log('✅ CabinetRenderer initialized');
    }
    
    /**
     * Setup high-DPI display support
     */
    setupHighDPI() {
        const dpr = window.devicePixelRatio || 1;
        this.dpr = dpr;
        
        // Scale canvas for crisp rendering
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
    }
    
    /**
     * Bind mouse events for interactivity
     */
    bindEvents() {
        // Mouse wheel for zoom
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoomAt(mouseX, mouseY, delta);
        });
        
        // Mouse pan
        let isPanning = false;
        let lastMouse = { x: 0, y: 0 };
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle click or Ctrl+click
                isPanning = true;
                lastMouse = { x: e.clientX, y: e.clientY };
                this.canvas.style.cursor = 'grab';
                e.preventDefault();
            }
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (isPanning) {
                const deltaX = e.clientX - lastMouse.x;
                const deltaY = e.clientY - lastMouse.y;
                
                this.offset.x += deltaX / this.zoom;
                this.offset.y += deltaY / this.zoom;
                
                lastMouse = { x: e.clientX, y: e.clientY };
                this.render();
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            isPanning = false;
            this.canvas.style.cursor = 'default';
        });
        
        // Double click to zoom fit
        this.canvas.addEventListener('dblclick', () => {
            this.zoomFit();
        });
    }
    
    /**
     * Resize canvas
     */
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = this.dpr || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        this.render();
    }
    
    /**
     * Set rendering mode
     */
    setMode(mode) {
        this.mode = mode;
        this.render();
    }
    
    /**
     * Set selected element
     */
    setSelectedElement(element) {
        this.selectedElement = element;
        this.render();
    }
    
    /**
     * Main render function
     */
    render(cabinet = null) {
        if (!cabinet && !this.lastCabinet) return;
        
        const cabinetData = cabinet || this.lastCabinet;
        this.lastCabinet = cabinetData;
        
        // Clear canvas
        this.clear();
        
        // Apply transform
        this.ctx.save();
        this.applyTransform();
        
        if (this.mode === '2D') {
            this.render2D(cabinetData);
        } else {
            this.render3D(cabinetData);
        }
        
        this.ctx.restore();
    }
    
    /**
     * Clear canvas
     */
    clear() {
        this.ctx.fillStyle = this.theme.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Apply current transform
     */
    applyTransform() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.translate(rect.width / 2, rect.height / 2);
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.translate(this.offset.x, this.offset.y);
    }
    
    /**
     * Render cabinet in 2D
     */
    render2D(cabinetData) {
        if (!cabinetData || !cabinetData.dimensions) return;
        
        const dims = cabinetData.dimensions;
        const panels = cabinetData.panels || [];
        const sections = cabinetData.sections || [];
        
        // Calculate cabinet bounds
        const bounds = {
            x: -dims.width / 2,
            y: -dims.height / 2,
            width: dims.width,
            height: dims.height
        };
        
        // Draw grid
        this.drawGrid(bounds);
        
        // Draw cabinet outline
        this.drawCabinetOutline(bounds);
        
        // Draw sections first (background)
        sections.forEach(section => {
            this.drawSection2D(section, bounds);
        });
        
        // Draw panels
        panels.forEach(panel => {
            this.drawPanel2D(panel, bounds);
        });
        
        // Draw selection highlight
        if (this.selectedElement) {
            this.drawSelectionHighlight(this.selectedElement, bounds);
        }
        
        // Draw dimensions
        this.drawDimensions2D(dims, bounds);
    }
    
    /**
     * Render cabinet in 3D (isometric)
     */
    render3D(cabinetData) {
        if (!cabinetData || !cabinetData.dimensions) return;
        
        const dims = cabinetData.dimensions;
        const panels = cabinetData.panels || [];
        
        // 3D isometric projection
        const iso = {
            angleX: Math.PI / 6,
            angleY: Math.PI / 6
        };
        
        this.draw3DCabinet(dims, panels, iso);
    }
    
    /**
     * Draw grid
     */
    drawGrid(bounds) {
        const ctx = this.ctx;
        const gridSize = 100; // 100mm grid
        
        ctx.strokeStyle = this.theme.grid;
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = bounds.x; x <= bounds.x + bounds.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, bounds.y - 50);
            ctx.lineTo(x, bounds.y + bounds.height + 50);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = bounds.y; y <= bounds.y + bounds.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(bounds.x - 50, y);
            ctx.lineTo(bounds.x + bounds.width + 50, y);
            ctx.stroke();
        }
    }
    
    /**
     * Draw cabinet outline
     */
    drawCabinetOutline(bounds) {
        const ctx = this.ctx;
        
        ctx.strokeStyle = this.theme.stroke;
        ctx.lineWidth = 3;
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    }
    
    /**
     * Draw panel in 2D
     */
    drawPanel2D(panel, cabinetBounds) {
        if (!panel.position || !panel.dimensions) return;
        
        const ctx = this.ctx;
        
        // Calculate panel position
        const x = cabinetBounds.x + panel.position.x;
        const y = cabinetBounds.y + (cabinetBounds.height - panel.position.y - panel.dimensions.height);
        
        // Choose color based on material
        let fillColor = this.theme.panel.ldsp;
        if (panel.material?.name?.includes('ХДФ')) {
            fillColor = this.theme.panel.hdf;
        } else if (panel.material?.name?.includes('МДФ')) {
            fillColor = this.theme.panel.mdf;
        }
        
        // Draw panel
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, panel.dimensions.width, panel.dimensions.height);
        
        ctx.strokeStyle = this.theme.stroke;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, panel.dimensions.width, panel.dimensions.height);
        
        // Draw panel label
        if (panel.dimensions.width > 50 && panel.dimensions.height > 20) {
            ctx.fillStyle = this.theme.text;
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(
                panel.name || panel.panelType || 'Panel',
                x + panel.dimensions.width / 2,
                y + panel.dimensions.height / 2 + 4
            );
        }
    }
    
    /**
     * Draw section in 2D
     */
    drawSection2D(section, cabinetBounds) {
        if (!section.bounds) return;
        
        const ctx = this.ctx;
        const bounds = section.bounds;
        
        const x = cabinetBounds.x + bounds.left;
        const y = cabinetBounds.y + (cabinetBounds.height - bounds.bottom);
        const width = bounds.right - bounds.left;
        const height = bounds.bottom - bounds.top;
        
        // Draw section background
        ctx.fillStyle = this.theme.section;
        ctx.fillRect(x, y, width, height);
        
        // Draw section border
        ctx.strokeStyle = this.theme.sectionStroke;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x, y, width, height);
        ctx.setLineDash([]);
        
        // Draw section label
        if (width > 100 && height > 50) {
            ctx.fillStyle = this.theme.text;
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(
                'Секция',
                x + width / 2,
                y + height / 2 - 10
            );
            
            ctx.font = '12px sans-serif';
            ctx.fillText(
                `${Math.round(width)}×${Math.round(height)}мм`,
                x + width / 2,
                y + height / 2 + 10
            );
        }
    }
    
    /**
     * Draw selection highlight
     */
    drawSelectionHighlight(element, cabinetBounds) {
        if (!element.position || !element.dimensions) return;
        
        const ctx = this.ctx;
        
        const x = cabinetBounds.x + element.position.x;
        const y = cabinetBounds.y + (cabinetBounds.height - element.position.y - element.dimensions.height);
        
        ctx.strokeStyle = this.theme.selected;
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 2, y - 2, element.dimensions.width + 4, element.dimensions.height + 4);
    }
    
    /**
     * Draw dimensions
     */
    drawDimensions2D(dims, bounds) {
        const ctx = this.ctx;
        const offset = 50;
        
        ctx.strokeStyle = this.theme.dimension;
        ctx.fillStyle = this.theme.dimension;
        ctx.font = '14px sans-serif';
        ctx.lineWidth = 1;
        
        // Width dimension (top)
        this.drawDimensionLine(
            bounds.x, bounds.y - offset,
            bounds.x + bounds.width, bounds.y - offset,
            `${dims.width} мм`
        );
        
        // Height dimension (left)
        this.drawDimensionLine(
            bounds.x - offset, bounds.y,
            bounds.x - offset, bounds.y + bounds.height,
            `${dims.height} мм`,
            true
        );
    }
    
    /**
     * Draw dimension line with arrows and text
     */
    drawDimensionLine(x1, y1, x2, y2, text, vertical = false) {
        const ctx = this.ctx;
        const arrowSize = 8;
        
        // Draw main line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Draw arrows
        if (vertical) {
            // Top arrow
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 - arrowSize/2, y1 + arrowSize);
            ctx.lineTo(x1 + arrowSize/2, y1 + arrowSize);
            ctx.closePath();
            ctx.fill();
            
            // Bottom arrow
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - arrowSize/2, y2 - arrowSize);
            ctx.lineTo(x2 + arrowSize/2, y2 - arrowSize);
            ctx.closePath();
            ctx.fill();
        } else {
            // Left arrow
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + arrowSize, y1 - arrowSize/2);
            ctx.lineTo(x1 + arrowSize, y1 + arrowSize/2);
            ctx.closePath();
            ctx.fill();
            
            // Right arrow
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - arrowSize, y2 - arrowSize/2);
            ctx.lineTo(x2 - arrowSize, y2 + arrowSize/2);
            ctx.closePath();
            ctx.fill();
        }
        
        // Draw text
        ctx.save();
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (vertical) {
            ctx.translate(centerX, centerY);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(text, 0, 0);
        } else {
            ctx.fillText(text, centerX, centerY - 10);
        }
        ctx.restore();
    }
    
    /**
     * Draw 3D cabinet (isometric view)
     */
    draw3DCabinet(dims, panels, iso) {
        const ctx = this.ctx;
        
        // Isometric projection helper
        const project = (x, y, z) => {
            return {
                x: (x - z) * Math.cos(iso.angleX),
                y: y + (x + z) * Math.sin(iso.angleY) / 2
            };
        };
        
        const w = dims.width;
        const h = dims.height;
        const d = dims.depth;
        
        // Draw cabinet faces
        ctx.strokeStyle = this.theme.stroke;
        ctx.lineWidth = 2;
        
        // Front face
        ctx.fillStyle = this.theme.panel.ldsp;
        const p1 = project(-w/2, -h/2, d/2);
        const p2 = project(w/2, -h/2, d/2);
        const p3 = project(w/2, h/2, d/2);
        const p4 = project(-w/2, h/2, d/2);
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Top face
        ctx.fillStyle = 'rgba(248, 249, 250, 0.8)';
        const p5 = project(-w/2, -h/2, -d/2);
        const p6 = project(w/2, -h/2, -d/2);
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Right face
        ctx.fillStyle = 'rgba(248, 249, 250, 0.6)';
        const p7 = project(w/2, h/2, -d/2);
        
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    // ======== ZOOM CONTROLS ========
    
    /**
     * Zoom in
     */
    zoomIn() {
        this.zoom *= 1.2;
        this.render();
    }
    
    /**
     * Zoom out
     */
    zoomOut() {
        this.zoom *= 0.8;
        this.render();
    }
    
    /**
     * Zoom at specific point
     */
    zoomAt(mouseX, mouseY, delta) {
        const rect = this.canvas.getBoundingClientRect();
        
        // Convert mouse to world coordinates
        const worldX = (mouseX - rect.width / 2) / this.zoom - this.offset.x;
        const worldY = (mouseY - rect.height / 2) / this.zoom - this.offset.y;
        
        // Apply zoom
        this.zoom *= delta;
        this.zoom = Math.max(0.1, Math.min(5, this.zoom)); // Clamp zoom
        
        // Adjust offset to keep world point under mouse
        this.offset.x = (mouseX - rect.width / 2) / this.zoom - worldX;
        this.offset.y = (mouseY - rect.height / 2) / this.zoom - worldY;
        
        this.render();
    }
    
    /**
     * Zoom to fit cabinet
     */
    zoomFit() {
        if (!this.lastCabinet) return;
        
        const dims = this.lastCabinet.dimensions;
        const rect = this.canvas.getBoundingClientRect();
        
        const padding = 100; // pixels
        const scaleX = (rect.width - padding) / dims.width;
        const scaleY = (rect.height - padding) / dims.height;
        
        this.zoom = Math.min(scaleX, scaleY);
        this.offset = { x: 0, y: 0 };
        
        this.render();
    }
    
    /**
     * Get current zoom level
     */
    getZoom() {
        return this.zoom;
    }
}
