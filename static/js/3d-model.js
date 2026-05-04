document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.3d-container');
    const cube = document.querySelector('.floating-cube');
    const sphere = document.querySelector('.floating-sphere');
    const pyramid = document.querySelector('.floating-pyramid');
    
    // Mouse move parallax effect
    document.addEventListener('mousemove', function(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        if (cube) {
            cube.style.transform = `translate(-50%, -50%) rotateX(${y}deg) rotateY(${x}deg)`;
        }
        
        if (sphere) {
            sphere.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
        }
        
        if (pyramid) {
            pyramid.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) rotateY(${x * 2}deg)`;
        }
    });
    
    // Add interactive click effects
    if (sphere) {
        sphere.addEventListener('click', function() {
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = 'float 4s ease-in-out infinite 1s';
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100px;
                height: 100px;
                border: 2px solid rgba(99, 102, 241, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: ripple 1s ease-out;
            `;
            container.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 1000);
        });
    }
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);