// Noise Map Visualization for EchoLytix Landing Page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize noise map
    initNoiseMap();
});

// Initialize noise map
function initNoiseMap() {
    const container = document.getElementById('noise-map');
    if (!container) return;
    
    // Create canvas for noise map
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Responsive handling
    window.addEventListener('resize', function() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawNoiseMap(ctx, canvas.width, canvas.height);
    });
    
    // Draw initial noise map
    drawNoiseMap(ctx, canvas.width, canvas.height);
    
    // Add interactivity
    addNoiseMapInteractivity(canvas, ctx);
}

// Draw noise map
function drawNoiseMap(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, width, height);
    
    // Draw city grid
    drawCityGrid(ctx, width, height);
    
    // Draw noise hotspots
    drawNoiseHotspots(ctx, width, height);
    
    // Draw legend
    drawLegend(ctx, width, height);
}

// Draw city grid
function drawCityGrid(ctx, width, height) {
    // Grid settings
    const gridSize = 30;
    const gridColor = 'rgba(255, 255, 255, 0.1)';
    
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw main roads
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    
    // Horizontal main road
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Vertical main road
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Draw city blocks
    drawCityBlocks(ctx, width, height, gridSize);
}

// Draw city blocks
function drawCityBlocks(ctx, width, height, gridSize) {
    const blockColors = [
        'rgba(30, 41, 59, 0.7)',   // Dark blue (residential)
        'rgba(55, 65, 81, 0.7)',   // Gray (commercial)
        'rgba(75, 85, 99, 0.7)',   // Light gray (industrial)
        'rgba(17, 24, 39, 0.7)'    // Very dark (parks)
    ];
    
    // Number of blocks in each direction
    const blocksX = Math.floor(width / gridSize);
    const blocksY = Math.floor(height / gridSize);
    
    // Draw blocks
    for (let x = 0; x < blocksX; x++) {
        for (let y = 0; y < blocksY; y++) {
            // Skip blocks on main roads
            if (x === Math.floor(blocksX / 2) || y === Math.floor(blocksY / 2)) {
                continue;
            }
            
            // Determine block type based on position
            let blockType;
            
            // Downtown area (center)
            if (x > blocksX / 3 && x < 2 * blocksX / 3 && y > blocksY / 3 && y < 2 * blocksY / 3) {
                blockType = 1; // Commercial
            }
            // Industrial area (bottom right)
            else if (x > 2 * blocksX / 3 && y > 2 * blocksY / 3) {
                blockType = 2; // Industrial
            }
            // Parks (random)
            else if (Math.random() < 0.1) {
                blockType = 3; // Parks
            }
            // Residential (default)
            else {
                blockType = 0; // Residential
            }
            
            // Draw block
            ctx.fillStyle = blockColors[blockType];
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
    }
}

// Draw noise hotspots
function drawNoiseHotspots(ctx, width, height) {
    // Define hotspot locations and intensities
    const hotspots = [
        { x: width * 0.75, y: height * 0.25, intensity: 0.8, radius: 100, type: 'industrial' },
        { x: width * 0.25, y: height * 0.75, intensity: 0.9, radius: 120, type: 'entertainment' },
        { x: width * 0.5, y: height * 0.5, intensity: 0.95, radius: 150, type: 'traffic' },
        { x: width * 0.15, y: height * 0.3, intensity: 0.7, radius: 80, type: 'construction' },
        { x: width * 0.85, y: height * 0.85, intensity: 0.85, radius: 110, type: 'traffic' }
    ];
    
    // Draw each hotspot
    hotspots.forEach(hotspot => {
        drawNoiseHotspot(ctx, hotspot);
    });
}

// Draw individual noise hotspot
function drawNoiseHotspot(ctx, hotspot) {
    // Create gradient
    const gradient = ctx.createRadialGradient(
        hotspot.x, hotspot.y, 0,
        hotspot.x, hotspot.y, hotspot.radius
    );
    
    // Set gradient colors based on intensity
    let color;
    
    switch(hotspot.type) {
        case 'industrial':
            color = [255, 0, 0]; // Red
            break;
        case 'entertainment':
            color = [255, 165, 0]; // Orange
            break;
        case 'traffic':
            color = [255, 255, 0]; // Yellow
            break;
        case 'construction':
            color = [255, 0, 255]; // Magenta
            break;
        default:
            color = [255, 0, 0]; // Default red
    }
    
    gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${hotspot.intensity})`);
    gradient.addColorStop(0.7, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${hotspot.intensity * 0.3})`);
    gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
    
    // Draw hotspot
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(hotspot.x, hotspot.y, hotspot.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add label
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Format noise level
    const noiseLevel = Math.round(hotspot.intensity * 100);
    
    ctx.fillText(`${hotspot.type.toUpperCase()}`, hotspot.x, hotspot.y - 10);
    ctx.fillText(`${noiseLevel} dB`, hotspot.x, hotspot.y + 10);
}

// Draw legend
function drawLegend(ctx, width, height) {
    const legendWidth = 150;
    const legendHeight = 120;
    const padding = 10;
    
    // Legend background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    // Position legend relative to canvas height for better responsive layout
    const legendY = Math.min(padding, height * 0.05);
    ctx.fillRect(width - legendWidth - padding, legendY, legendWidth, legendHeight);
    
    // Legend title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Noise Sources', width - legendWidth - padding + 10, padding + 20);
    
    // Legend items
    const items = [
        { color: 'red', label: 'Industrial' },
        { color: 'orange', label: 'Entertainment' },
        { color: 'yellow', label: 'Traffic' },
        { color: 'magenta', label: 'Construction' }
    ];
    
    items.forEach((item, index) => {
        const y = padding + 40 + (index * 20);
        
        // Color box
        ctx.fillStyle = item.color;
        ctx.fillRect(width - legendWidth - padding + 10, y - 10, 15, 15);
        
        // Label
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, width - legendWidth - padding + 35, y);
    });
}

// Add interactivity to noise map
function addNoiseMapInteractivity(canvas, ctx) {
    // Mouse move event for hover effects
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Redraw map
        drawNoiseMap(ctx, canvas.width, canvas.height);
        
        // Draw hover indicator
        drawHoverIndicator(ctx, x, y);
    });
    
    // Click event for showing detailed information
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Show detailed information popup
        showNoiseDetailPopup(x, y, canvas);
    });
}

// Draw hover indicator
function drawHoverIndicator(ctx, x, y) {
    // Draw crosshair
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1;
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
    ctx.stroke();
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.stroke();
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Show coordinates and estimated noise level
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    // Calculate noise level based on position (simplified)
    const noiseLevel = calculateNoiseLevel(x, y, ctx.canvas.width, ctx.canvas.height);
    
    ctx.fillText(`Position: (${Math.round(x)}, ${Math.round(y)})`, x + 10, y - 10);
    ctx.fillText(`Estimated Noise: ${noiseLevel} dB`, x + 10, y + 10);
}

// Calculate estimated noise level based on position
function calculateNoiseLevel(x, y, width, height) {
    // Define hotspot locations and intensities (same as in drawNoiseHotspots)
    const hotspots = [
        { x: width * 0.75, y: height * 0.25, intensity: 0.8, radius: 100, baseNoise: 80 },
        { x: width * 0.25, y: height * 0.75, intensity: 0.9, radius: 120, baseNoise: 90 },
        { x: width * 0.5, y: height * 0.5, intensity: 0.95, radius: 150, baseNoise: 95 },
        { x: width * 0.15, y: height * 0.3, intensity: 0.7, radius: 80, baseNoise: 70 },
        { x: width * 0.85, y: height * 0.85, intensity: 0.85, radius: 110, baseNoise: 85 }
    ];
    
    // Base ambient noise level
    let noiseLevel = 45;
    
    // Calculate contribution from each hotspot
    hotspots.forEach(hotspot => {
        // Calculate distance to hotspot
        const dx = x - hotspot.x;
        const dy = y - hotspot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If within radius, add noise contribution
        if (distance < hotspot.radius) {
            // Linear falloff from center to edge
            const factor = 1 - (distance / hotspot.radius);
            noiseLevel += (hotspot.baseNoise - 45) * factor;
        }
    });
    
    // Add some randomness
    noiseLevel += Math.random() * 5 - 2.5;
    
    return Math.round(noiseLevel);
}

// Show detailed noise information popup
function showNoiseDetailPopup(x, y, canvas) {
    // Get parent container
    const container = canvas.parentElement;
    
    // Calculate noise level
    const noiseLevel = calculateNoiseLevel(x, y, canvas.width, canvas.height);
    
    // Create popup element if it doesn't exist
    let popup = container.querySelector('.noise-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.className = 'noise-popup';
        popup.style.position = 'absolute';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.padding = '15px';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '100';
        popup.style.width = '200px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        container.appendChild(popup);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            popup.style.display = 'none';
        };
        popup.appendChild(closeButton);
    }
    
    // Position popup
    popup.style.left = `${x + 10}px`;
    popup.style.top = `${y + 10}px`;
    
    // Ensure popup stays within container
    const rect = container.getBoundingClientRect();
    if (parseFloat(popup.style.left) + 200 > rect.width) {
        popup.style.left = `${x - 220}px`;
    }
    if (parseFloat(popup.style.top) + 200 > rect.height) {
        popup.style.top = `${y - 220}px`;
    }
    
    // Determine noise category
    let category, color, impact;
    if (noiseLevel < 55) {
        category = 'Low';
        color = 'green';
        impact = 'Minimal health impact. Safe for long-term exposure.';
    } else if (noiseLevel < 70) {
        category = 'Moderate';
        color = 'yellow';
        impact = 'May cause stress and sleep disturbance with prolonged exposure.';
    } else if (noiseLevel < 85) {
        category = 'High';
        color = 'orange';
        impact = 'Risk of hearing damage with prolonged exposure. Significant stress impact.';
    } else {
        category = 'Dangerous';
        color = 'red';
        impact = 'Immediate risk to hearing. Severe health impacts with even short exposure.';
    }
    
    // Update popup content
    popup.innerHTML = `
        <div style="text-align: right;"><button style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;" onclick="this.parentElement.parentElement.style.display='none'">×</button></div>
        <h3 style="margin-top: 0; font-size: 16px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 5px;">Noise Analysis</h3>
        <p><strong>Noise Level:</strong> <span style="color: ${color};">${noiseLevel} dB</span></p>
        <p><strong>Category:</strong> <span style="color: ${color};">${category}</span></p>
        <p><strong>Health Impact:</strong> ${impact}</p>
        <p><strong>Recommended Action:</strong> ${noiseLevel >= 85 ? 'Immediate noise reduction measures required.' : noiseLevel >= 70 ? 'Implement noise control strategies.' : 'Monitor noise levels periodically.'}</p>
    `;
    
    // Show popup
    popup.style.display = 'block';
}
