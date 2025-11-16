/**
 * Animated Lines Background
 * Creates a network-like animation with moving nodes and connecting lines
 */

class AnimatedLines {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        // Mark as initialized
        this.canvas.dataset.initialized = 'true';

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.nodes = [];
        this.animationId = null;
        this.resizeObserver = null;

        // Configuration - Artistic & Organic style
        this.config = {
            nodeCount: 35,               // More particles for richness
            nodeRadius: 4,               // Larger, visible particles
            connectionDistance: 280,     // Wider connections for organic web
            baseOpacity: 0.25,           // Base opacity for dynamic variation
            speed: 0.15,                 // Very slow, flowing movement
            minSpeed: 0.1,
            maxSpeed: 0.25,
            pulseSpeed: 0.002,           // Breathing effect speed
            colorShift: 0                // For organic color variation
        };

        this.init();
    }

    init() {
        this.setupCanvas();
        this.createNodes();
        this.startAnimation();
        this.setupResize();
    }

    setupCanvas() {
        const container = this.canvas.parentElement;
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        
        // Get dimensions - use offsetWidth/offsetHeight as fallback
        let width = rect.width || container.offsetWidth;
        let height = rect.height || container.offsetHeight;
        
        // If still 0, use CSS computed style
        if (!width || !height) {
            const computedStyle = window.getComputedStyle(container);
            width = parseFloat(computedStyle.width) || 1400;
            height = parseFloat(computedStyle.height) || 600;
        }
        
        // Ensure we have valid dimensions
        if (!width || width === 0) width = 1400;
        if (!height || height === 0) height = 600;
        
        // Set canvas internal size (actual pixels)
        this.canvas.width = width;
        this.canvas.height = height;

        // Set display size (CSS pixels) - this should match container
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.backgroundColor = '#ffffff';
        this.canvas.style.position = 'relative';
        this.canvas.style.zIndex = '10';
        
    }

    createNodes() {
        this.nodes = [];
        for (let i = 0; i < this.config.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                radius: this.config.nodeRadius + Math.random() * 2, // Varying sizes
                phase: Math.random() * Math.PI * 2,  // For pulsing effect
                pulseOffset: Math.random() * 0.5     // Individual pulse timing
            });
        }
    }

    updateNodes() {
        this.nodes.forEach(node => {
            // Simple linear movement
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x <= 0 || node.x >= this.canvas.width) {
                node.vx = -node.vx;
                node.x = Math.max(0, Math.min(this.canvas.width, node.x));
            }
            if (node.y <= 0 || node.y >= this.canvas.height) {
                node.vy = -node.vy;
                node.y = Math.max(0, Math.min(this.canvas.height, node.y));
            }

            // Very subtle random variation
            node.vx += (Math.random() - 0.5) * 0.002;
            node.vy += (Math.random() - 0.5) * 0.002;

            // Clamp velocity
            node.vx = Math.max(-this.config.maxSpeed, Math.min(this.config.maxSpeed, node.vx));
            node.vy = Math.max(-this.config.maxSpeed, Math.min(this.config.maxSpeed, node.vy));
        });
    }

    drawConnections() {
        this.ctx.lineWidth = 0.5;  // Very thin lines
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node1 = this.nodes[i];
                const node2 = this.nodes[j];
                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    // Simple opacity based on distance
                    const opacity = (1 - (distance / this.config.connectionDistance)) * this.config.baseOpacity;
                    this.ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(node1.x, node1.y);
                    this.ctx.lineTo(node2.x, node2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawNodes() {
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.config.baseOpacity * 2})`;
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        // Check if canvas is still valid
        if (!this.canvas || !this.ctx) return;
        
        // Ensure canvas has valid dimensions
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            this.setupCanvas();
            this.createNodes();
        }
        
        // Clear canvas completely
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw
        if (this.nodes.length > 0) {
            this.updateNodes();
            this.drawConnections();
            this.drawNodes();
        }

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setupResize() {
        // Use ResizeObserver for better performance
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => {
                this.handleResize();
            });
            this.resizeObserver.observe(this.canvas.parentElement);
        } else {
            // Fallback to window resize
            window.addEventListener('resize', () => {
                this.handleResize();
            });
        }
    }

    handleResize() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Get dimensions with fallback
        const width = rect.width || container.offsetWidth || this.canvas.width;
        const height = rect.height || container.offsetHeight || this.canvas.height;
        
        // Only resize if dimensions actually changed
        if (this.canvas.width !== width || this.canvas.height !== height) {
            const oldWidth = this.canvas.width;
            const oldHeight = this.canvas.height;
            
            this.canvas.width = width;
            this.canvas.height = height;
            
            // Scale node positions proportionally if canvas size changed significantly
            if (oldWidth > 0 && oldHeight > 0) {
                const scaleX = width / oldWidth;
                const scaleY = height / oldHeight;
                
                this.nodes.forEach(node => {
                    node.x = node.x * scaleX;
                    node.y = node.y * scaleY;
                });
            } else {
                // If old dimensions were 0, recreate nodes
                this.createNodes();
            }
        }
    }

    destroy() {
        this.stopAnimation();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}

// Initialize when DOM is ready
const initAnimatedLines = () => {
    const canvas = document.getElementById('animated-lines-canvas');
    if (!canvas) {
        setTimeout(initAnimatedLines, 100);
        return;
    }
    
    const container = canvas.parentElement;
    if (!container) {
        return;
    }
    
    // Check if already initialized
    if (canvas.dataset.initialized) return;
    
    // Function to try initialization
    const tryInit = () => {
        const rect = container.getBoundingClientRect();
        const width = rect.width || container.offsetWidth || 1400;
        const height = rect.height || container.offsetHeight || 600;
        
        if (width > 0 && height > 0) {
            new AnimatedLines('animated-lines-canvas');
        } else {
            // Layout not ready yet, retry
            setTimeout(tryInit, 100);
        }
    };
    
    // Try initialization immediately, then retry if needed
    tryInit();
};

// Start initialization - try multiple times to ensure it works
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initAnimatedLines, 50);
    });
} else if (document.readyState === 'interactive') {
    setTimeout(initAnimatedLines, 100);
} else {
    // Document already loaded
    setTimeout(initAnimatedLines, 200);
}

// Also try on window load as backup
window.addEventListener('load', () => {
    const canvas = document.getElementById('animated-lines-canvas');
    if (canvas && !canvas.dataset.initialized) {
        setTimeout(initAnimatedLines, 100);
    }
});

