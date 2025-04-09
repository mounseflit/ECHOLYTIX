// Main JavaScript file for EchoLytix Landing Page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            // Toggle icon between bars and times
            const icon = mobileMenuButton.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
            
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                submitButton.innerHTML = '<i class="fas fa-check mr-2"></i> Message Sent!';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }, 3000);
            }, 2000);
        });
    }
    
    // Subscribe form handling
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate form submission
            const submitButton = subscribeForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                // Reset form
                subscribeForm.reset();
                
                // Show success message
                submitButton.innerHTML = '<i class="fas fa-check"></i>';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }, 3000);
            }, 1500);
        });
    }
    
    // Noise monitoring simulation
    initNoiseSimulation();
    
    // Initialize GSAP animations
    initGSAPAnimations();
});

// Noise monitoring simulation
function initNoiseSimulation() {
    const locationSelect = document.getElementById('location-select');
    const timeButtons = document.querySelectorAll('[data-time]');
    const noiseValue = document.getElementById('noise-value');
    const noiseLevelIndicator = document.getElementById('noise-level-indicator');
    const noiseSources = document.getElementById('noise-sources');
    
    // Noise data by location and time
    const noiseData = {
        downtown: {
            morning: {
                level: 75,
                sources: [
                    { name: 'Traffic', percentage: 70 },
                    { name: 'Construction', percentage: 20 },
                    { name: 'Human Activity', percentage: 10 }
                ]
            },
            afternoon: {
                level: 85,
                sources: [
                    { name: 'Traffic', percentage: 60 },
                    { name: 'Construction', percentage: 30 },
                    { name: 'Human Activity', percentage: 10 }
                ]
            },
            night: {
                level: 65,
                sources: [
                    { name: 'Traffic', percentage: 40 },
                    { name: 'Entertainment', percentage: 50 },
                    { name: 'Human Activity', percentage: 10 }
                ]
            }
        },
        residential: {
            morning: {
                level: 55,
                sources: [
                    { name: 'Traffic', percentage: 60 },
                    { name: 'Construction', percentage: 10 },
                    { name: 'Human Activity', percentage: 30 }
                ]
            },
            afternoon: {
                level: 60,
                sources: [
                    { name: 'Traffic', percentage: 50 },
                    { name: 'Construction', percentage: 20 },
                    { name: 'Human Activity', percentage: 30 }
                ]
            },
            night: {
                level: 45,
                sources: [
                    { name: 'Traffic', percentage: 30 },
                    { name: 'Entertainment', percentage: 20 },
                    { name: 'Human Activity', percentage: 50 }
                ]
            }
        },
        industrial: {
            morning: {
                level: 80,
                sources: [
                    { name: 'Industrial Machinery', percentage: 60 },
                    { name: 'Traffic', percentage: 30 },
                    { name: 'Human Activity', percentage: 10 }
                ]
            },
            afternoon: {
                level: 90,
                sources: [
                    { name: 'Industrial Machinery', percentage: 70 },
                    { name: 'Traffic', percentage: 20 },
                    { name: 'Human Activity', percentage: 10 }
                ]
            },
            night: {
                level: 70,
                sources: [
                    { name: 'Industrial Machinery', percentage: 80 },
                    { name: 'Traffic', percentage: 15 },
                    { name: 'Human Activity', percentage: 5 }
                ]
            }
        },
        entertainment: {
            morning: {
                level: 50,
                sources: [
                    { name: 'Traffic', percentage: 60 },
                    { name: 'Human Activity', percentage: 30 },
                    { name: 'Music', percentage: 10 }
                ]
            },
            afternoon: {
                level: 70,
                sources: [
                    { name: 'Traffic', percentage: 40 },
                    { name: 'Human Activity', percentage: 40 },
                    { name: 'Music', percentage: 20 }
                ]
            },
            night: {
                level: 95,
                sources: [
                    { name: 'Music', percentage: 60 },
                    { name: 'Human Activity', percentage: 30 },
                    { name: 'Traffic', percentage: 10 }
                ]
            }
        }
    };
    
    // Default values
    let currentLocation = 'downtown';
    let currentTime = 'morning';
    
    // Update noise data display
    function updateNoiseData() {
        const data = noiseData[currentLocation][currentTime];
        
        // Update noise level
        noiseValue.textContent = `${data.level} dB`;
        noiseLevelIndicator.style.width = `${data.level}%`;
        
        // Update color based on noise level
        if (data.level < 60) {
            noiseLevelIndicator.className = 'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500';
        } else if (data.level < 80) {
            noiseLevelIndicator.className = 'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500';
        } else {
            noiseLevelIndicator.className = 'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500';
        }
        
        // Update noise sources
        let sourcesHTML = '';
        data.sources.forEach(source => {
            sourcesHTML += `
                <div class="flex justify-between">
                    <span>${source.name}</span>
                    <span>${source.percentage}%</span>
                </div>
            `;
        });
        noiseSources.innerHTML = sourcesHTML;
    }
    
    // Event listeners
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            currentLocation = this.value;
            updateNoiseData();
        });
    }
    
    if (timeButtons.length > 0) {
        timeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                timeButtons.forEach(btn => {
                    btn.classList.remove('bg-primary', 'text-white');
                });
                
                // Add active class to clicked button
                this.classList.add('bg-primary', 'text-white');
                
                currentTime = this.getAttribute('data-time');
                updateNoiseData();
            });
        });
        
        // Set first button as active by default
        timeButtons[0].classList.add('bg-primary', 'text-white');
    }
    
    // Initialize with default values
    updateNoiseData();
}

// GSAP animations
function initGSAPAnimations() {
    // Only initialize if GSAP is loaded
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate hero section
        gsap.from('.hero h1', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.2
        });
        
        gsap.from('.hero p', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.5
        });
        
        gsap.from('.hero .btn-primary, .hero .btn-secondary', {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 0.8,
            stagger: 0.2
        });
        
        // Animate stats
        gsap.from('.stats .text-4xl', {
            textContent: 0,
            duration: 2,
            ease: 'power1.inOut',
            snap: { textContent: 1 },
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.stats',
                start: 'top 80%'
            },
            onUpdate: function() {
                // Add appropriate suffix
                if (this.targets()[0].textContent.indexOf('dB') > -1) {
                    this.targets()[0].textContent = Math.ceil(this.targets()[0].textContent) + ' dB';
                } else if (this.targets()[0].textContent.indexOf('%') > -1) {
                    this.targets()[0].textContent = Math.ceil(this.targets()[0].textContent) + '%';
                }
            }
        });
        
        // Animate feature cards
        gsap.from('#features .card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '#features .card',
                start: 'top 80%'
            }
        });
        
        // Animate about section
        gsap.from('#about h2', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#about',
                start: 'top 80%'
            }
        });
        
        gsap.from('#about .noise-level-bar', {
            width: 0,
            duration: 1.5,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '#about .noise-level',
                start: 'top 80%'
            }
        });
        
        // Animate technology section
        gsap.from('#technology h2', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#technology',
                start: 'top 80%'
            }
        });
        
        // Animate impact section
        gsap.from('#impact .card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '#impact .card',
                start: 'top 80%'
            }
        });
        
        // Animate team section
        gsap.from('#team .card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '#team .card',
                start: 'top 80%'
            }
        });
        
        // Animate contact section
        gsap.from('#contact form', {
            opacity: 0,
            x: -50,
            duration: 0.8,
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%'
            }
        });
        
        gsap.from('#contact .card:not(:first-child)', {
            opacity: 0,
            x: 50,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 80%'
            }
        });
    }
}

// Include the analysis model script in index.html
document.addEventListener('DOMContentLoaded', function() {
    // Load the analysis model script dynamically
    const script = document.createElement('script');
    script.src = 'src/js/analysisModel.js';
    document.body.appendChild(script);
});
