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

        // Configuration - Global connectivity theme
        this.config = {
            nodeCount: 80,               // More nodes for global network feel
            nodeRadius: 2,               // Visible connection points
            connectionDistance: 200,     // Wide connection range
            baseOpacity: 0.2,            // Slightly more visible
            speed: 0.25,                 // Smooth movement
            minSpeed: 0.2,
            maxSpeed: 0.35,
            hubNodeCount: 5,             // Major hub nodes (like global cities)
            hubRadius: 4,                // Larger hub nodes
            pulseSpeed: 0.0015           // Gentle pulse for hubs
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
        
        // Create hub nodes (major connection points - like global cities)
        for (let i = 0; i < this.config.hubNodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.speed * 0.5,  // Slower movement
                vy: (Math.random() - 0.5) * this.config.speed * 0.5,
                radius: this.config.hubRadius,
                isHub: true,
                phase: Math.random() * Math.PI * 2,
                importance: 0.8 + Math.random() * 0.2,  // Hub importance factor
                id: i  // Unique ID for connection color determination
            });
        }
        
        // Create regular nodes (smaller connection points)
        for (let i = 0; i < this.config.nodeCount - this.config.hubNodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.config.speed,
                vy: (Math.random() - 0.5) * this.config.speed,
                radius: this.config.nodeRadius,
                isHub: false,
                phase: Math.random() * Math.PI * 2,
                importance: 0.3 + Math.random() * 0.3,
                id: this.config.hubNodeCount + i  // Unique ID for connection color determination
            });
        }
    }

    updateNodes() {
        const time = Date.now() * 0.001;
        
        this.nodes.forEach(node => {
            // Movement with slight orbital feel (like satellites)
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

            // Subtle random variation
            node.vx += (Math.random() - 0.5) * 0.003;
            node.vy += (Math.random() - 0.5) * 0.003;

            // Clamp velocity
            const maxSpeed = node.isHub ? this.config.maxSpeed * 0.5 : this.config.maxSpeed;
            node.vx = Math.max(-maxSpeed, Math.min(maxSpeed, node.vx));
            node.vy = Math.max(-maxSpeed, Math.min(maxSpeed, node.vy));
            
            // Update phase for pulsing effect
            node.phase += this.config.pulseSpeed;
        });
    }

    drawConnections() {
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node1 = this.nodes[i];
                const node2 = this.nodes[j];
                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    // Calculate connection strength based on node importance
                    const connectionStrength = (node1.importance + node2.importance) / 2;
                    
                    // Stronger connections for hub nodes
                    const baseOpacity = (node1.isHub || node2.isHub) 
                        ? this.config.baseOpacity * 1.5 
                        : this.config.baseOpacity;
                    
                    // Distance-based opacity with importance factor
                    let opacity = (1 - (distance / this.config.connectionDistance)) * baseOpacity * connectionStrength;
                    
                    // Subtle pulse effect for hub connections
                    if (node1.isHub || node2.isHub) {
                        const pulse = Math.sin(time * 0.5 + node1.phase + node2.phase) * 0.15 + 0.85;
                        opacity *= pulse;
                        this.ctx.lineWidth = 0.8;
                    } else {
                        this.ctx.lineWidth = 0.5;
                    }
                    
                    // Draw connection line
                    this.ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
                    this.ctx.beginPath();
                    this.ctx.moveTo(node1.x, node1.y);
                    this.ctx.lineTo(node2.x, node2.y);
                    this.ctx.stroke();
                    
                    // Add subtle data flow effect on hub connections
                    if ((node1.isHub || node2.isHub) && Math.random() < 0.02) {
                        const flowPos = (time * 0.3) % 1;
                        const flowX = node1.x + (node2.x - node1.x) * flowPos;
                        const flowY = node1.y + (node2.y - node1.y) * flowPos;
                        
                        this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 2})`;
                        this.ctx.beginPath();
                        this.ctx.arc(flowX, flowY, 1, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
            }
        }
    }

    drawNodes() {
        const time = Date.now() * 0.001;
        
        this.nodes.forEach(node => {
            if (node.isHub) {
                // Hub nodes: Larger with pulsing glow effect in brand blue
                const pulse = Math.sin(time + node.phase) * 0.2 + 0.8;
                const glowRadius = node.radius * (1 + pulse * 0.3);
                
                // Outer glow - Blue color for hubs
                const gradient = this.ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, glowRadius * 2
                );
                gradient.addColorStop(0, `rgba(31, 100, 246, ${this.config.baseOpacity * 2.5 * pulse})`);
                gradient.addColorStop(0.4, `rgba(31, 100, 246, ${this.config.baseOpacity * 1.5 * pulse})`);
                gradient.addColorStop(1, `rgba(31, 100, 246, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, glowRadius * 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Core - Blue color for hubs
                this.ctx.fillStyle = `rgba(31, 100, 246, ${this.config.baseOpacity * 3 * pulse})`;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // Regular nodes: Simple dots
                const opacity = this.config.baseOpacity * 2 * node.importance;
                this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
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

