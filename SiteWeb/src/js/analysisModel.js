// Web-based Analysis Model for EchoLytix Landing Page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the analysis model
    initAnalysisModel();
});

// Initialize the analysis model
function initAnalysisModel() {
    // Set up event listeners for the simulation controls
    setupSimulationControls();
    
    // Initialize the data visualization components
    initDataVisualizations();
    
    // Load initial data
    loadInitialData();
}

// Set up simulation controls
function setupSimulationControls() {
    // Location selector
    const locationSelect = document.getElementById('location-select');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            updateAnalysisData(this.value);
        });
    }
    
    // Time of day buttons
    const timeButtons = document.querySelectorAll('[data-time]');
    if (timeButtons.length > 0) {
        timeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                timeButtons.forEach(btn => {
                    btn.classList.remove('bg-primary', 'text-white');
                });
                
                // Add active class to clicked button
                this.classList.add('bg-primary', 'text-white');
                
                // Update data based on selected time
                const time = this.getAttribute('data-time');
                const location = locationSelect ? locationSelect.value : 'downtown';
                updateAnalysisData(location, time);
            });
        });
        
        // Set first button as active by default
        timeButtons[0].classList.add('bg-primary', 'text-white');
    }
    
    // Add run analysis button functionality
    const runAnalysisBtn = document.getElementById('run-analysis-btn');
    if (runAnalysisBtn) {
        runAnalysisBtn.addEventListener('click', function() {
            runNoiseAnalysis();
        });
    }
}

// Initialize data visualizations
function initDataVisualizations() {
    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        // Noise level chart
        initNoiseChart();
        
        // Noise sources chart
        initSourcesChart();
        
        // Health impact chart
        initHealthImpactChart();
    }
}

// Initialize noise level chart
function initNoiseChart() {
    const ctx = document.getElementById('noise-chart');
    if (!ctx) return;
    
    // Create chart
    window.noiseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
            datasets: [{
                label: 'Noise Level (dB)',
                data: [45, 40, 55, 75, 80, 85, 90, 70],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Noise Level: ${context.raw} dB`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 30,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Noise Level (dB)'
                    }
                }
            }
        }
    });
}

// Initialize noise sources chart
function initSourcesChart() {
    const ctx = document.getElementById('sources-chart');
    if (!ctx) return;
    
    // Create chart
    window.sourcesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Traffic', 'Construction', 'Human Activity', 'Entertainment'],
            datasets: [{
                data: [65, 15, 10, 10],
                backgroundColor: [
                    '#3B82F6', // Blue
                    '#F59E0B', // Amber
                    '#10B981', // Green
                    '#8B5CF6'  // Purple
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// Initialize health impact chart
function initHealthImpactChart() {
    const ctx = document.getElementById('health-impact-chart');
    if (!ctx) return;
    
    // Create chart
    window.healthImpactChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Stress', 'Sleep Disruption', 'Cognitive Impact', 'Hearing Risk'],
            datasets: [{
                label: 'Impact Level',
                data: [70, 60, 45, 30],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',  // Red
                    'rgba(139, 92, 246, 0.7)', // Purple
                    'rgba(59, 130, 246, 0.7)', // Blue
                    'rgba(245, 158, 11, 0.7)'  // Amber
                ],
                borderColor: [
                    'rgb(239, 68, 68)',
                    'rgb(139, 92, 246)',
                    'rgb(59, 130, 246)',
                    'rgb(245, 158, 11)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Impact Level (%)'
                    }
                }
            }
        }
    });
}

// Load initial data
function loadInitialData() {
    // Default location and time
    const location = 'downtown';
    const time = 'morning';
    
    // Update analysis data with defaults
    updateAnalysisData(location, time);
}

// Update analysis data based on location and time
function updateAnalysisData(location, time) {
    // Default to morning if time not specified
    time = time || 'morning';
    
    // Get noise data for the selected location and time
    const data = getNoiseData(location, time);
    
    // Update noise level indicator
    updateNoiseLevel(data.level);
    
    // Update noise sources
    updateNoiseSources(data.sources);
    
    // Update health impact data
    updateHealthImpact(data.level);
    
    // Update charts if they exist
    updateCharts(location, time, data);
}

// Get noise data for a specific location and time
function getNoiseData(location, time) {
    // Noise data by location and time
    const noiseData = {
        downtown: {
            morning: {
                level: 75,
                sources: [
                    { name: 'Traffic', percentage: 70 },
                    { name: 'Construction', percentage: 20 },
                    { name: 'Human Activity', percentage: 10 }
                ],
                hourly: [55, 60, 65, 75, 80, 85, 80, 75]
            },
            afternoon: {
                level: 85,
                sources: [
                    { name: 'Traffic', percentage: 60 },
                    { name: 'Construction', percentage: 30 },
                    { name: 'Human Activity', percentage: 10 }
                ],
                hourly: [75, 80, 85, 85, 90, 85, 80, 75]
            },
            night: {
                level: 65,
                sources: [
                    { name: 'Traffic', percentage: 40 },
                    { name: 'Entertainment', percentage: 50 },
                    { name: 'Human Activity', percentage: 10 }
                ],
                hourly: [65, 70, 75, 70, 65, 60, 55, 50]
            }
        },
        residential: {
            morning: {
                level: 55,
                sources: [
                    { name: 'Traffic', percentage: 60 },
                    { name: 'Construction', percentage: 10 },
                    { name: 'Human Activity', percentage: 30 }
                ],
                hourly: [45, 50, 55, 60, 55, 50, 45, 40]
            },
            afternoon: {
                level: 60,
                sources: [
                    { name: 'Traffic', percentage: 50 },
                    { name: 'Construction', percentage: 20 },
                    { name: 'Human Activity', percentage: 30 }
                ],
                hourly: [50, 55, 60, 65, 60, 55, 50, 45]
            },
            night: {
                level: 45,
                sources: [
                    { name: 'Traffic', percentage: 30 },
                    { name: 'Entertainment', percentage: 20 },
                    { name: 'Human Activity', percentage: 50 }
                ],
                hourly: [45, 40, 35, 30, 35, 40, 45, 50]
            }
        },
        industrial: {
            morning: {
                level: 80,
                sources: [
                    { name: 'Industrial Machinery', percentage: 60 },
                    { name: 'Traffic', percentage: 30 },
                    { name: 'Human Activity', percentage: 10 }
                ],
                hourly: [70, 75, 80, 85, 80, 75, 70, 65]
            },
            afternoon: {
                level: 90,
                sources: [
                    { name: 'Industrial Machinery', percentage: 70 },
                    { name: 'Traffic', percentage: 20 },
                    { name: 'Human Activity', percentage: 10 }
                ],
                hourly: [80, 85, 90, 95, 90, 85, 80, 75]
            },
            night: {
                level: 70,
                sources: [
                    { name: 'Industrial Machinery', percentage: 80 },
                    { name: 'Traffic', percentage: 15 },
                    { name: 'Human Activity', percentage: 5 }
                ],
                hourly: [70, 65, 60, 55, 60, 65, 70, 75]
            }
        },
        entertainment: {
            morning: {
                level: 50,
                sources: [
                    { name: 'Traffic', percentage: 60 },
                    { name: 'Human Activity', percentage: 30 },
                    { name: 'Music', percentage: 10 }
                ],
                hourly: [40, 45, 50, 55, 50, 45, 40, 35]
            },
            afternoon: {
                level: 70,
                sources: [
                    { name: 'Traffic', percentage: 40 },
                    { name: 'Human Activity', percentage: 40 },
                    { name: 'Music', percentage: 20 }
                ],
                hourly: [60, 65, 70, 75, 70, 65, 60, 55]
            },
            night: {
                level: 95,
                sources: [
                    { name: 'Music', percentage: 60 },
                    { name: 'Human Activity', percentage: 30 },
                    { name: 'Traffic', percentage: 10 }
                ],
                hourly: [85, 90, 95, 100, 95, 90, 85, 80]
            }
        }
    };
    
    // Return data for the selected location and time
    return noiseData[location][time];
}

// Update noise level indicator
function updateNoiseLevel(level) {
    const noiseValue = document.getElementById('noise-value');
    const noiseLevelIndicator = document.getElementById('noise-level-indicator');
    
    if (noiseValue) {
        noiseValue.textContent = `${level} dB`;
    }
    
    if (noiseLevelIndicator) {
        noiseLevelIndicator.style.width = `${level}%`;
        
        // Update color based on noise level
        if (level < 60) {
            noiseLevelIndicator.className = 'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500';
        } else if (level < 80) {
            noiseLevelIndicator.className = 'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500';
        } else {
            noiseLevelIndicator.className = 'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500';
        }
    }
}

// Update noise sources
function updateNoiseSources(sources) {
    const noiseSources = document.getElementById('noise-sources');
    
    if (noiseSources) {
        let sourcesHTML = '';
        sources.forEach(source => {
            sourcesHTML += `
                <div class="flex justify-between">
                    <span>${source.name}</span>
                    <span>${source.percentage}%</span>
                </div>
            `;
        });
        noiseSources.innerHTML = sourcesHTML;
    }
}

// Update health impact data
function updateHealthImpact(noiseLevel) {
    // Calculate health impact based on noise level
    const stressImpact = Math.min(100, Math.max(0, (noiseLevel - 40) * 1.5));
    const sleepImpact = Math.min(100, Math.max(0, (noiseLevel - 35) * 1.6));
    const cognitiveImpact = Math.min(100, Math.max(0, (noiseLevel - 50) * 1.4));
    const hearingRisk = Math.min(100, Math.max(0, (noiseLevel - 70) * 3));
    
    // Update health impact chart if it exists
    if (window.healthImpactChart) {
        window.healthImpactChart.data.datasets[0].data = [
            stressImpact,
            sleepImpact,
            cognitiveImpact,
            hearingRisk
        ];
        window.healthImpactChart.update();
    }
    
    // Update health impact text elements
    updateHealthImpactText('stress-impact', stressImpact);
    updateHealthImpactText('sleep-impact', sleepImpact);
    updateHealthImpactText('cognitive-impact', cognitiveImpact);
    updateHealthImpactText('hearing-impact', hearingRisk);
}

// Update health impact text element
function updateHealthImpactText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        let impactText = 'Low';
        let impactClass = 'text-green-500';
        
        if (value > 75) {
            impactText = 'Severe';
            impactClass = 'text-red-500';
        } else if (value > 50) {
            impactText = 'Moderate';
            impactClass = 'text-yellow-500';
        } else if (value > 25) {
            impactText = 'Mild';
            impactClass = 'text-blue-500';
        }
        
        element.textContent = impactText;
        element.className = impactClass;
    }
}

// Update charts with new data
function updateCharts(location, time, data) {
    // Update noise level chart
    if (window.noiseChart && data.hourly) {
        window.noiseChart.data.datasets[0].data = data.hourly;
        window.noiseChart.update();
    }
    
    // Update sources chart
    if (window.sourcesChart && data.sources) {
        // Extract labels and data from sources
        const labels = data.sources.map(source => source.name);
        const values = data.sources.map(source => source.percentage);
        
        window.sourcesChart.data.labels = labels;
        window.sourcesChart.data.datasets[0].data = values;
        window.sourcesChart.update();
    }
}

// Run noise analysis
function runNoiseAnalysis() {
    // Get current values
    const locationSelect = document.getElementById('location-select');
    const location = locationSelect ? locationSelect.value : 'downtown';
    
    // Get active time button
    let time = 'morning';
    const activeTimeButton = document.querySelector('[data-time].bg-primary');
    if (activeTimeButton) {
        time = activeTimeButton.getAttribute('data-time');
    }
    
    // Get noise data
    const data = getNoiseData(location, time);
    
    // Show analysis results
    showAnalysisResults(location, time, data);
}

// Show analysis results
function showAnalysisResults(location, time, data) {
    // Create results container if it doesn't exist
    let resultsContainer = document.getElementById('analysis-results');
    
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'analysis-results';
        resultsContainer.className = 'mt-8 p-6 bg-white rounded-xl shadow-lg';
        
        // Find parent container to append results
        const parentContainer = document.querySelector('.noise-map-container').parentNode;
        parentContainer.appendChild(resultsContainer);
    }
    
    // Determine location name for display
    let locationName = 'Downtown';
    switch (location) {
        case 'residential':
            locationName = 'Residential Area';
            break;
        case 'industrial':
            locationName = 'Industrial Zone';
            break;
        case 'entertainment':
            locationName = 'Entertainment District';
            break;
    }
    
    // Determine time period for display
    let timePeriod = 'Morning (6AM-12PM)';
    switch (time) {
        case 'afternoon':
            timePeriod = 'Afternoon (12PM-6PM)';
            break;
        case 'night':
            timePeriod = 'Night (6PM-12AM)';
            break;
    }
    
    // Determine risk level and recommendations
    let riskLevel, riskClass, recommendations;
    
    if (data.level >= 85) {
        riskLevel = 'High Risk';
        riskClass = 'text-red-600';
        recommendations = [
            'Immediate noise reduction measures required',
            'Install sound barriers and noise insulation',
            'Restrict high-noise activities to limited hours',
            'Implement traffic calming measures',
            'Regular hearing protection for residents and workers'
        ];
    } else if (data.level >= 70) {
        riskLevel = 'Moderate Risk';
        riskClass = 'text-yellow-600';
        recommendations = [
            'Implement noise control strategies',
            'Monitor noise levels regularly',
            'Urban planning to separate noisy activities from residential areas',
            'Noise awareness campaigns for residents',
            'Consider time restrictions for construction activities'
        ];
    } else {
        riskLevel = 'Low Risk';
        riskClass = 'text-green-600';
        recommendations = [
            'Maintain current noise levels',
            'Periodic monitoring to prevent increases',
            'Proactive urban planning to preserve quiet areas',
            'Encourage green spaces as noise buffers',
            'Develop noise standards for new developments'
        ];
    }
    
    // Calculate health impact metrics
    const stressImpact = Math.min(100, Math.max(0, (data.level - 40) * 1.5));
    const sleepImpact = Math.min(100, Math.max(0, (data.level - 35) * 1.6));
    const cognitiveImpact = Math.min(100, Math.max(0, (data.level - 50) * 1.4));
    const hearingRisk = Math.min(100, Math.max(0, (data.level - 70) * 3));
    
    // Build recommendations HTML
    let recommendationsHTML = '';
    recommendations.forEach(rec => {
        recommendationsHTML += `<li class="mb-2">• ${rec}</li>`;
    });
    
    // Update results container
    resultsContainer.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold">Noise Analysis Results</h3>
            <span class="text-gray-500">${new Date().toLocaleString()}</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <h4 class="font-bold mb-2">Location</h4>
                <p>${locationName}</p>
                
                <h4 class="font-bold mt-4 mb-2">Time Period</h4>
                <p>${timePeriod}</p>
                
                <h4 class="font-bold mt-4 mb-2">Average Noise Level</h4>
                <p class="text-xl font-bold ${data.level >= 85 ? 'text-red-600' : data.level >= 70 ? 'text-yellow-600' : 'text-green-600'}">
                    ${data.level} dB
                </p>
                
                <h4 class="font-bold mt-4 mb-2">Risk Assessment</h4>
                <p class="text-xl font-bold ${riskClass}">${riskLevel}</p>
            </div>
            
            <div>
                <h4 class="font-bold mb-2">Health Impact Assessment</h4>
                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between mb-1">
                            <span>Stress Impact</span>
                            <span class="${stressImpact > 75 ? 'text-red-600' : stressImpact > 50 ? 'text-yellow-600' : 'text-green-600'}">${Math.round(stressImpact)}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="${stressImpact > 75 ? 'bg-red-600' : stressImpact > 50 ? 'bg-yellow-600' : 'bg-green-600'} h-2 rounded-full" style="width: ${stressImpact}%"></div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex justify-between mb-1">
                            <span>Sleep Disruption</span>
                            <span class="${sleepImpact > 75 ? 'text-red-600' : sleepImpact > 50 ? 'text-yellow-600' : 'text-green-600'}">${Math.round(sleepImpact)}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="${sleepImpact > 75 ? 'bg-red-600' : sleepImpact > 50 ? 'bg-yellow-600' : 'bg-green-600'} h-2 rounded-full" style="width: ${sleepImpact}%"></div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex justify-between mb-1">
                            <span>Cognitive Impact</span>
                            <span class="${cognitiveImpact > 75 ? 'text-red-600' : cognitiveImpact > 50 ? 'text-yellow-600' : 'text-green-600'}">${Math.round(cognitiveImpact)}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="${cognitiveImpact > 75 ? 'bg-red-600' : cognitiveImpact > 50 ? 'bg-yellow-600' : 'bg-green-600'} h-2 rounded-full" style="width: ${cognitiveImpact}%"></div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex justify-between mb-1">
                            <span>Hearing Risk</span>
                            <span class="${hearingRisk > 75 ? 'text-red-600' : hearingRisk > 50 ? 'text-yellow-600' : 'text-green-600'}">${Math.round(hearingRisk)}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="${hearingRisk > 75 ? 'bg-red-600' : hearingRisk > 50 ? 'bg-yellow-600' : 'bg-green-600'} h-2 rounded-full" style="width: ${hearingRisk}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-6">
            <h4 class="font-bold mb-3">Recommendations</h4>
            <ul class="text-gray-700">
                ${recommendationsHTML}
            </ul>
        </div>
        
        <div class="mt-8 text-center">
            <button id="download-report-btn" class="btn-primary">
                <i class="fas fa-download mr-2"></i> Download Full Report
            </button>
        </div>
    `;
    
    // Add event listener to download button
    const downloadBtn = document.getElementById('download-report-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            simulateReportDownload(location, time, data);
        });
    }
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Simulate report download
function simulateReportDownload(location, time, data) {
    // Create a download button that would normally trigger a real download
    const downloadBtn = document.getElementById('download-report-btn');
    
    if (downloadBtn) {
        const originalText = downloadBtn.innerHTML;
        
        // Show loading state
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Generating Report...';
        downloadBtn.disabled = true;
        
        // Simulate processing time
        setTimeout(() => {
            // Show success message
            downloadBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Report Downloaded';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = originalText;
            }, 3000);
        }, 2000);
    }
}
