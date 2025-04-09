// 3D Model and Scene for EchoLytix Landing Page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D scenes
    initHero3DScene();
    initDemo3DScene();
});

// Hero 3D Scene
function initHero3DScene() {
    const container = document.getElementById('hero-3d-scene');
    if (!container) return;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Responsive handling
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // City model
    createCityModel(scene);
    
    // Sound waves
    const soundWaves = createSoundWaves(scene);
    
    // Camera position
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate city slightly
        scene.rotation.y += 0.002;
        
        // Animate sound waves
        animateSoundWaves(soundWaves);
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Demo 3D Scene
function initDemo3DScene() {
    const container = document.getElementById('demo-3d-scene');
    if (!container) return;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Responsive handling
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Create detailed city model with noise hotspots
    createDetailedCityModel(scene);
    
    // Camera position
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);
    
    // Controls for demo scene
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update controls
        controls.update();
        
        // Animate noise hotspots
        animateNoiseHotspots(scene);
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Create city model
function createCityModel(scene) {
    // City base
    const cityGeometry = new THREE.BoxGeometry(20, 1, 20);
    const cityMaterial = new THREE.MeshPhongMaterial({ color: 0x7c9cb0 });
    const cityBase = new THREE.Mesh(cityGeometry, cityMaterial);
    cityBase.position.y = -0.5;
    scene.add(cityBase);
    
    // Buildings
    const buildingCount = 40;
    const buildingColors = [0x4a6b8a, 0x5a7b9a, 0x3a5b7a, 0x6a8baa];
    
    for (let i = 0; i < buildingCount; i++) {
        const width = Math.random() * 2 + 1;
        const height = Math.random() * 6 + 2;
        const depth = Math.random() * 2 + 1;
        
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshPhongMaterial({ 
            color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
            flatShading: true
        });
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        
        // Position buildings on the city base
        building.position.x = Math.random() * 18 - 9;
        building.position.y = height / 2;
        building.position.z = Math.random() * 18 - 9;
        
        scene.add(building);
    }
    
    // Roads
    const roadGeometry = new THREE.PlaneGeometry(20, 2);
    const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x222222, side: THREE.DoubleSide });
    
    // Main roads
    const road1 = new THREE.Mesh(roadGeometry, roadMaterial);
    road1.rotation.x = Math.PI / 2;
    road1.position.y = 0.01;
    scene.add(road1);
    
    const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
    road2.rotation.x = Math.PI / 2;
    road2.rotation.z = Math.PI / 2;
    road2.position.y = 0.01;
    scene.add(road2);
}

// Create sound waves
function createSoundWaves(scene) {
    const waves = [];
    const waveCount = 5;
    const colors = [0x3B82F6, 0x10B981, 0xF59E0B];
    
    for (let i = 0; i < waveCount; i++) {
        const radius = 3 + i * 1.5;
        const geometry = new THREE.TorusGeometry(radius, 0.2, 16, 100);
        const material = new THREE.MeshPhongMaterial({ 
            color: colors[i % colors.length],
            transparent: true,
            opacity: 0.7 - (i * 0.1)
        });
        
        const wave = new THREE.Mesh(geometry, material);
        wave.rotation.x = Math.PI / 2;
        wave.position.y = 5;
        wave.scale.y = 0.1; // Flatten initially
        
        scene.add(wave);
        waves.push({
            mesh: wave,
            initialScale: 0.1,
            targetScale: 1,
            speed: 0.01 + (i * 0.005),
            direction: 1
        });
    }
    
    return waves;
}

// Animate sound waves
function animateSoundWaves(waves) {
    waves.forEach(wave => {
        // Pulse animation
        wave.mesh.scale.y += wave.speed * wave.direction;
        
        if (wave.mesh.scale.y >= wave.targetScale) {
            wave.direction = -1;
        } else if (wave.mesh.scale.y <= wave.initialScale) {
            wave.direction = 1;
        }
        
        // Rotate wave
        wave.mesh.rotation.z += 0.01;
    });
}

// Create detailed city model with noise hotspots
function createDetailedCityModel(scene) {
    // City base
    const cityGeometry = new THREE.BoxGeometry(30, 1, 30);
    const cityMaterial = new THREE.MeshPhongMaterial({ color: 0x7c9cb0 });
    const cityBase = new THREE.Mesh(cityGeometry, cityMaterial);
    cityBase.position.y = -0.5;
    scene.add(cityBase);
    
    // Buildings
    const buildingCount = 80;
    const buildingColors = [0x4a6b8a, 0x5a7b9a, 0x3a5b7a, 0x6a8baa];
    
    for (let i = 0; i < buildingCount; i++) {
        const width = Math.random() * 2 + 1;
        const height = Math.random() * 8 + 2;
        const depth = Math.random() * 2 + 1;
        
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshPhongMaterial({ 
            color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
            flatShading: true
        });
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        
        // Position buildings on the city base
        building.position.x = Math.random() * 28 - 14;
        building.position.y = height / 2;
        building.position.z = Math.random() * 28 - 14;
        
        scene.add(building);
    }
    
    // Roads
    const roadGeometry = new THREE.PlaneGeometry(30, 2);
    const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x222222, side: THREE.DoubleSide });
    
    // Main roads
    const road1 = new THREE.Mesh(roadGeometry, roadMaterial);
    road1.rotation.x = Math.PI / 2;
    road1.position.y = 0.01;
    scene.add(road1);
    
    const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
    road2.rotation.x = Math.PI / 2;
    road2.rotation.z = Math.PI / 2;
    road2.position.y = 0.01;
    scene.add(road2);
    
    // Add noise hotspots
    addNoiseHotspots(scene);
}

// Add noise hotspots to the scene
function addNoiseHotspots(scene) {
    // Define hotspot locations and intensities
    const hotspots = [
        { x: 8, z: 8, intensity: 'high' },    // Downtown area
        { x: -7, z: 10, intensity: 'medium' }, // Industrial zone
        { x: 10, z: -5, intensity: 'high' },   // Entertainment district
        { x: -10, z: -8, intensity: 'low' },   // Residential area
        { x: 0, z: 0, intensity: 'medium' }    // City center
    ];
    
    // Create hotspots
    hotspots.forEach(hotspot => {
        // Determine color based on intensity
        let color;
        let size;
        
        switch(hotspot.intensity) {
            case 'high':
                color = 0xff0000; // Red
                size = 2.5;
                break;
            case 'medium':
                color = 0xffaa00; // Orange
                size = 2;
                break;
            case 'low':
                color = 0x00ff00; // Green
                size = 1.5;
                break;
            default:
                color = 0xffaa00;
                size = 2;
        }
        
        // Create outer glow sphere
        const glowGeometry = new THREE.SphereGeometry(size, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.2
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(hotspot.x, 1, hotspot.z);
        glow.userData.isHotspot = true;
        glow.userData.pulseDirection = 1;
        glow.userData.originalSize = size;
        scene.add(glow);
        
        // Create inner core
        const coreGeometry = new THREE.SphereGeometry(size * 0.4, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.set(hotspot.x, 1, hotspot.z);
        scene.add(core);
        
        // Add vertical beam
        const beamGeometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.set(hotspot.x, 6, hotspot.z);
        scene.add(beam);
    });
}

// Animate noise hotspots
function animateNoiseHotspots(scene) {
    scene.children.forEach(child => {
        if (child.userData && child.userData.isHotspot) {
            // Pulse animation
            const pulseSpeed = 0.01;
            const pulseAmount = 0.2;
            
            child.scale.x += pulseSpeed * child.userData.pulseDirection;
            child.scale.y += pulseSpeed * child.userData.pulseDirection;
            child.scale.z += pulseSpeed * child.userData.pulseDirection;
            
            const maxScale = 1 + pulseAmount;
            const minScale = 1 - pulseAmount;
            
            if (child.scale.x >= maxScale) {
                child.userData.pulseDirection = -1;
            } else if (child.scale.x <= minScale) {
                child.userData.pulseDirection = 1;
            }
        }
    });
}

// Add OrbitControls if not included in the HTML
if (typeof THREE.OrbitControls === 'undefined') {
    // Simple implementation of OrbitControls
    THREE.OrbitControls = function(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.enableDamping = false;
        this.dampingFactor = 0.05;
        this.screenSpacePanning = false;
        this.minDistance = 0;
        this.maxDistance = Infinity;
        this.maxPolarAngle = Math.PI;
        
        this.update = function() {
            // Simple update function
        };
    };
}
