/**
 * Cabinet Renderer Module
 * Handles 2D and 3D rendering of cabinet
 */

export class CabinetRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Default colors
        this.colors = {
            background: '#ffffff',
            grid: 'rgba(0, 0, 0, 0.05)',
            panel: '#f8f9fa',
            panelStroke: '#2c3e50',
            panelSelected: '#4a9eff',
            dimension: '#657786',
            section: 'rgba(74, 158, 255, 0.1)',
            sectionHover: 'rgba(74, 158, 255, 0.2)'
        };
        
        // Transform state
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        
        this.resize();
    }
    
    /**
     * Resize canvas to fit container
     */
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Set transform
     */
    setTransform(scale, offset) {
        this.scale = scale;
        this.offset = offset;
    }
    
    /**
     * Render cabinet in 2D
     */
    render2D(cabinet) {
        if (!cabinet) return;
        
        const ctx = this.ctx;
        ctx.save();
        
        // Apply transform
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offset.x, this.offset.y);
        
        // Get cabinet dimensions - handle both old and new format
        const dims = cabinet.dimensions || {
            width: cabinet.width,
            height: cabinet.height,
            depth: cabinet.depth
        };
        const panels = cabinet.getPanels ? cabinet.getPanels() : [];
        const sections = cabinet.getSections ? cabinet.getSections() : [];
        
        // Calculate drawing bounds
        const x = -dims.width / 2;
        const y = -dims.height / 2;
        
        // Draw grid
        this.drawGrid();
        
        // Draw cabinet outline
        ctx.strokeStyle = this.colors.panelStroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, dims.width, dims.height);
        
        // Draw panels
        panels.forEach(panel => {
            this.drawPanel2D(panel, x, y);
        });
        
        // Draw sections
        sections.forEach(section => {
            this.drawSection2D(section, x, y);
        });
        
        // Draw dimensions
        this.drawDimensions(dims, x, y);
        
        ctx.restore();
    }
    
    /**
     * Render cabinet in 3D (isometric view)
     */
    render3D(cabinet) {
        if (!cabinet) return;
        
        const ctx = this.ctx;
        ctx.save();
        
        // Apply transform
        ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offset.x, this.offset.y);
        
        // Get cabinet dimensions - handle both old and new format
        const dims = cabinet.dimensions || {
            width: cabinet.width,
            height: cabinet.height,
            depth: cabinet.depth
        };
        const panels = cabinet.getPanels ? cabinet.getPanels() : [];
        
        // Isometric angles
        const angleX = Math.PI / 6; // 30 degrees
        const angleY = Math.PI / 6;
        
        // Draw 3D representation
        this.draw3DCabinet(dims, panels, angleX, angleY);
        
        ctx.restore();
    }
    
    /**
     * Draw panel in 2D
     */
    drawPanel2D(panel, offsetX, offsetY) {
        const ctx = this.ctx;
        
        // Calculate panel position relative to cabinet
        const x = offsetX + panel.position.x;
        const y = offsetY + panel.position.y;
        
        // Draw panel based on type
        if (panel.panelType === 'VERTICAL') {
            // Draw vertical panel (stojka)
            ctx.fillStyle = this.colors.panel;
            ctx.fillRect(x, y, panel.dimensions.thickness, panel.dimensions.height);
            
            ctx.strokeStyle = this.colors.panelStroke;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, panel.dimensions.thickness, panel.dimensions.height);
        } else if (panel.panelType === 'HORIZONTAL') {
            // Draw horizontal panel (polka)
            ctx.fillStyle = this.colors.panel;
            ctx.fillRect(x, y, panel.dimensions.width, panel.dimensions.thickness);
            
            ctx.strokeStyle = this.colors.panelStroke;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, panel.dimensions.width, panel.dimensions.thickness);
        }
    }
    
    /**
     * Draw section in 2D
     */
    drawSection2D(section, offsetX, offsetY) {
        const ctx = this.ctx;
        
        if (!section.bounds) return;
        
        const x = offsetX + section.bounds.x;
        const y = offsetY + section.bounds.y;
        
        // Draw section background
        ctx.fillStyle = this.colors.section;
        ctx.fillRect(x, y, section.bounds.width, section.bounds.height);
    }
    
    /**
     * Draw dimensions
     */
    drawDimensions(dims, x, y) {
        const ctx = this.ctx;
        ctx.save();
        
        ctx.strokeStyle = this.colors.dimension;
        ctx.fillStyle = this.colors.dimension;
        ctx.font = '12px sans-serif';
        ctx.lineWidth = 1;
        
        const offset = 30;
        
        // Width dimension
        this.drawDimensionLine(
            x, y - offset,
            x + dims.width, y - offset,
            `${dims.width} мм`
        );
        
        // Height dimension
        this.drawDimensionLine(
            x - offset, y,
            x - offset, y + dims.height,
            `${dims.height} мм`,
            true
        );
        
        ctx.restore();
    }
    
    /**
     * Draw dimension line with text
     */
    drawDimensionLine(x1, y1, x2, y2, text, vertical = false) {
        const ctx = this.ctx;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Draw arrows
        const arrowSize = 8;
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
        
        if (vertical) {
            ctx.translate(centerX, centerY);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(text, 0, -5);
        } else {
            ctx.fillText(text, centerX - ctx.measureText(text).width / 2, centerY - 5);
        }
        ctx.restore();
    }
    
    /**
     * Draw 3D cabinet (simplified isometric view)
     */
    draw3DCabinet(dims, panels, angleX, angleY) {
        const ctx = this.ctx;
        
        // Calculate 3D projection points
        const iso = (x, y, z) => {
            return {
                x: (x - z) * Math.cos(angleX),
                y: y + (x + z) * Math.sin(angleY) / 2
            };
        };
        
        // Draw faces
        const w = dims.width;
        const h = dims.height;
        const d = dims.depth;
        
        // Front face
        ctx.fillStyle = this.colors.panel;
        ctx.strokeStyle = this.colors.panelStroke;
        ctx.lineWidth = 2;
        
        const p1 = iso(0, 0, 0);
        const p2 = iso(w, 0, 0);
        const p3 = iso(w, h, 0);
        const p4 = iso(0, h, 0);
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Top face
        const p5 = iso(0, 0, d);
        const p6 = iso(w, 0, d);
        
        ctx.fillStyle = 'rgba(248, 249, 250, 0.8)';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Right face
        const p7 = iso(w, h, d);
        
        ctx.fillStyle = 'rgba(248, 249, 250, 0.6)';
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    /**
     * Draw grid
     */
    drawGrid() {
        const ctx = this.ctx;
        ctx.save();
        
        const gridSize = 50;
        const bounds = 2000;
        
        ctx.strokeStyle = this.colors.grid;
        ctx.lineWidth = 0.5;
        
        for (let x = -bounds; x <= bounds; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, -bounds);
            ctx.lineTo(x, bounds);
            ctx.stroke();
        }
        
        for (let y = -bounds; y <= bounds; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(-bounds, y);
            ctx.lineTo(bounds, y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    /**
     * Highlight section
     */
    highlightSection(section) {
        const ctx = this.ctx;
        ctx.save();
        
        ctx.fillStyle = this.colors.sectionHover;
        ctx.fillRect(
            section.bounds.x,
            section.bounds.y,
            section.bounds.width,
            section.bounds.height
        );
        
        ctx.restore();
    }
    
    /**
     * Highlight element
     */
    highlightElement(element) {
        const ctx = this.ctx;
        ctx.save();
        
        ctx.strokeStyle = this.colors.panelSelected;
        ctx.lineWidth = 3;
        ctx.strokeRect(
            element.position.x,
            element.position.y,
            element.dimensions.width,
            element.dimensions.height
        );
        
        ctx.restore();
    }
}