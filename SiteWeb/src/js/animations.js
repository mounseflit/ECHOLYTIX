// Animations for EchoLytix Landing Page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sound wave visualization
    initSoundWaveVisualization();
    
    // Initialize scroll animations if not handled by GSAP
    initScrollAnimations();
    
    // Initialize number counters
    initNumberCounters();
});

// Sound wave visualization
function initSoundWaveVisualization() {
    const container = document.getElementById('sound-wave-visualization');
    if (!container) return;
    
    // Create canvas for sound wave
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Responsive handling
    window.addEventListener('resize', function() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    });
    
    // Animation variables
    let animationFrame;
    const waves = [];
    const waveCount = 5;
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    
    // Create waves
    for (let i = 0; i < waveCount; i++) {
        waves.push({
            frequency: 0.05 + (i * 0.01),
            amplitude: 30 + (i * 5),
            speed: 0.05 + (i * 0.01),
            offset: Math.random() * Math.PI * 2,
            color: colors[i % colors.length],
            opacity: 0.7 - (i * 0.1)
        });
    }
    
    // Animation function
    function animate() {
        animationFrame = requestAnimationFrame(animate);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw each wave
        waves.forEach(wave => {
            drawWave(ctx, wave, canvas.width, canvas.height);
            
            // Update offset for animation
            wave.offset += wave.speed;
        });
    }
    
    // Start animation
    animate();
    
    // Add interactivity
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Increase amplitude of waves based on mouse position
        const centerX = canvas.width / 2;
        const distanceFromCenter = Math.abs(x - centerX) / centerX;
        
        waves.forEach((wave, index) => {
            // Adjust amplitude based on mouse position
            wave.amplitude = 30 + (index * 5) + (1 - distanceFromCenter) * 20;
        });
    });
}

// Draw a single wave
function drawWave(ctx, wave, width, height) {
    const centerY = height / 2;
    
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    // Draw wave path
    for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
        ctx.lineTo(x, y);
    }
    
    // Complete the path to create a closed shape
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    // Fill with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, wave.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = wave.opacity;
    ctx.fill();
    
    // Reset global alpha
    ctx.globalAlpha = 1;
    
    // Draw the line on top
    ctx.strokeStyle = wave.color;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
}

// Scroll animations (if not using GSAP)
function initScrollAnimations() {
    // Only initialize if GSAP is not available
    if (typeof gsap === 'undefined') {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe all animated elements
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Number counter animations
function initNumberCounters() {
    const counters = document.querySelectorAll('.counter');
    
    // Intersection Observer for counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = parseInt(counter.getAttribute('data-duration') || '2000');
                
                let start = 0;
                const increment = target / (duration / 16);
                
                const updateCounter = () => {
                    start += increment;
                    if (start < target) {
                        counter.textContent = Math.floor(start);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe all counters
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Create animated sound bars
function createSoundBars() {
    const containers = document.querySelectorAll('.sound-wave');
    
    containers.forEach(container => {
        // Clear existing bars
        container.innerHTML = '';
        
        // Create bars
        const barCount = 10;
        
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'sound-wave-bar';
            
            // Random height for initial state
            const height = Math.floor(Math.random() * 30) + 10;
            bar.style.height = `${height}px`;
            
            // Add animation delay
            bar.style.animationDelay = `${i * 0.1}s`;
            
            container.appendChild(bar);
        }
        
        // Start animation
        animateSoundBars(container);
    });
}

// Animate sound bars
function animateSoundBars(container) {
    const bars = container.querySelectorAll('.sound-wave-bar');
    
    // Animate each bar
    setInterval(() => {
        bars.forEach(bar => {
            const height = Math.floor(Math.random() * 30) + 10;
            bar.style.height = `${height}px`;
        });
    }, 500);
}

// Add dynamic particle background
function addParticleBackground() {
    const sections = document.querySelectorAll('.particle-bg');
    
    sections.forEach(section => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        
        // Insert canvas as first child
        section.insertBefore(canvas, section.firstChild);
        
        // Make section position relative if not already
        if (getComputedStyle(section).position === 'static') {
            section.style.position = 'relative';
        }
        
        // Initialize particles
        initParticles(canvas);
    });
}

// Initialize particles
function initParticles(canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    
    // Particle settings
    const particleCount = 50;
    const particles = [];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: 'rgba(255, 255, 255, 0.5)',
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        // Draw connections
        drawConnections(ctx, particles, canvas.width, canvas.height);
    }
    
    // Start animation
    animate();
    
    // Resize handling
    window.addEventListener('resize', function() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// Draw connections between particles
function drawConnections(ctx, particles, width, height) {
    const maxDistance = 100;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                // Calculate opacity based on distance
                const opacity = 1 - (distance / maxDistance);
                
                // Draw line
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Call additional initialization functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sound bars
    createSoundBars();
    
    // Add particle backgrounds
    addParticleBackground();
});
