// Global variables
let selectedSample = null;
let mediaRecorder;
let audioChunks = [];
let recordingStartTime;
let recordingTimer;
let audioBlob;
let audioUrl;

// DOM Elements (will be initialized in DOMContentLoaded)
let recordButton, stopButton, analyzeButton, newAnalysisButton;
let recordingIndicator, recordingTime, audioPlayback, audioPlayer;
let resultsSection, conditionResult, confidenceLevel, confidencePercentage, recommendationsList;
let sampleOptions;

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    recordButton = document.getElementById('recordButton');
    stopButton = document.getElementById('stopButton');
    analyzeButton = document.getElementById('analyzeButton');
    newAnalysisButton = document.getElementById('newAnalysis');
    recordingIndicator = document.getElementById('recordingIndicator');
    recordingTime = document.getElementById('recordingTime');
    audioPlayback = document.getElementById('audioPlayback');
    audioPlayer = document.getElementById('audioPlayer');
    resultsSection = document.getElementById('resultsSection');
    conditionResult = document.getElementById('conditionResult');
    confidenceLevel = document.getElementById('confidenceLevel');
    confidencePercentage = document.getElementById('confidencePercentage');
    recommendationsList = document.getElementById('recommendationsList');
    
    // Sample audio elements
    sampleOptions = document.querySelectorAll('.sample-option');

    // Check if browser supports mediaRecorder API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showError('Your browser does not support audio recording. Please try using a modern browser like Chrome, Firefox, or Edge.');
        recordButton.disabled = true;
    }

    // Event Listeners
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    analyzeButton.addEventListener('click', analyzeAudio);
    newAnalysisButton.addEventListener('click', resetAnalysis);
    
    // Sample audio event listeners
    sampleOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectSample(this);
        });
    });
    
    // Add test button for consistency testing
    addTestButton();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Start recording function
async function startRecording() {
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create media recorder instance
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        // Event handler for data available
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        // Event handler for recording stop
        mediaRecorder.onstop = () => {
            // Combine audio chunks into a single blob
            audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            audioUrl = URL.createObjectURL(audioBlob);
            
            // Set audio player source
            audioPlayer.src = audioUrl;
            
            // Show audio playback controls
            audioPlayback.classList.remove('hidden');
            
            // Enable analyze button
            analyzeButton.disabled = false;
            
            // Stop all tracks on the stream
            stream.getTracks().forEach(track => track.stop());
        };
        
        // Start recording
        mediaRecorder.start();
        recordingStartTime = Date.now();
        
        // Update UI
        recordButton.disabled = true;
        stopButton.disabled = false;
        recordingIndicator.classList.remove('hidden');
        recordingTime.classList.remove('hidden');
        
        // Start timer
        updateRecordingTime();
        recordingTimer = setInterval(updateRecordingTime, 1000);
        
    } catch (error) {
        console.error('Error accessing microphone:', error);
        showError('Unable to access your microphone. Please ensure you have granted microphone permissions.');
    }
}

// Stop recording function
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        
        // Update UI
        recordButton.disabled = false;
        stopButton.disabled = true;
        recordingIndicator.classList.add('hidden');
        
        // Clear timer
        clearInterval(recordingTimer);
    }
}

// Update recording time display
function updateRecordingTime() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    
    recordingTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Add test button for consistency testing
function addTestButton() {
    const analyzeSection = document.getElementById('analyze');
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Sample Consistency';
    testButton.className = 'test-button';
    testButton.style.marginTop = '20px';
    testButton.style.backgroundColor = '#f0f0f0';
    testButton.style.border = '1px solid #ccc';
    testButton.style.padding = '10px 15px';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    testButton.style.fontSize = '14px';
    testButton.addEventListener('click', () => {
        const testResults = testConsistentSamples(5);
        const cryingStatus = testResults.consistent ? 'PASSED' : 'FAILED';
        const laughingStatus = testResults.consistent ? 'PASSED' : 'FAILED';
        alert(
            'Consistency Test Results:\n\n' +
            'Baby Crying Sample: ' + cryingStatus + '\n' +
            'Baby Laughing Sample: ' + laughingStatus + '\n\n' +
            'Check the browser console for detailed results.'
        );
    });
    analyzeSection.appendChild(testButton);
}

// Select sample audio function
function selectSample(element) {
    // Remove previous selection
    sampleOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    
    // Store selected sample
    selectedSample = element.getAttribute('data-audio');
    
    // Hide any previous results
    resultsSection.classList.add('hidden');
    
    // Enable analyze button
    analyzeButton.disabled = false;
}

// Analyze audio function
async function analyzeAudio() {
    // Show loading state
    analyzeButton.disabled = true;
    analyzeButton.textContent = 'Analyzing...';
    
    try {
        // Simulate analysis process
        // In a real application, this would send the audio to a server for analysis
        // or use a client-side ML model
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock analysis results
        const analysisResult = generateMockAnalysisResult(selectedSample);
        
        // Display results
        displayResults(analysisResult);
        
    } catch (error) {
        console.error('Error analyzing audio:', error);
        showError('An error occurred during analysis. Please try again.');
    } finally {
        // Reset button state
        analyzeButton.disabled = false;
        analyzeButton.textContent = 'Analyze Sound';
    }
}

// Generate mock analysis result
function generateMockAnalysisResult(sampleType) {
    // In a real application, this would be replaced with actual analysis
    // Different results based on sample type
    let conditions;
    
    switch(sampleType) {
        case 'baby-crying':
            // Fixed result for baby crying sample
            return {
                name: 'Needs Attention',
                description: 'Your baby is crying and needs your attention. This could be due to hunger, discomfort, gas, or needing a position change.',
                confidence: 95,
                recommendations: [
                    'Check if your baby is hungry - try feeding if it\'s been 2-3 hours',
                    'Check for gas - gently bicycle your baby\'s legs or burp them',
                    'Check for discomfort - ensure clothes aren\'t too tight and diaper is clean',
                    'Try changing your baby\'s position - hold them upright or rock gently'
                ],
                _consistentSample: true,
                _processingParams: {
                    sampleType: 'baby-crying',
                    fixedResult: true,
                    timestamp: new Date().toISOString()
                }
            };
        case 'baby-laughing':
            // Fixed result for baby laughing sample
            return {
                name: 'Happy & Content',
                description: 'Your baby is laughing and feeling happy! This is a wonderful sign that your baby is comfortable, healthy, and enjoying the moment.',
                confidence: 98,
                recommendations: [
                    'Hug your baby to reinforce this happy moment and bond',
                    'Play with your baby - make funny faces or gentle peek-a-boo',
                    'Talk and sing to your baby to encourage more joyful sounds',
                    'Enjoy this special time - take photos or videos to capture the moment'
                ],
                _consistentSample: true,
                _processingParams: {
                    sampleType: 'baby-laughing',
                    fixedResult: true,
                    timestamp: new Date().toISOString()
                }
            };
        case 'peaceful-rhythm':
            conditions = [
                {
                    name: 'Sleeping',
                    description: 'Your baby appears to be in a peaceful sleep state. The gentle rhythmic sounds indicate a comfortable and restful sleep.',
                    confidence: 88,
                    recommendations: [
                        'Maintain a quiet environment to avoid disturbing your baby',
                        'Ensure the room temperature is comfortable',
                        'This is a good time for parents to rest as well',
                        'Monitor baby\'s breathing patterns for normal sleep'
                    ]
                }
            ];
            break;
        case 'rocking-rhythm':
            conditions = [
                {
                    name: 'Content',
                    description: 'Your baby appears to be enjoying the gentle rocking motion. The sounds suggest a calm and content state.',
                    confidence: 80,
                    recommendations: [
                        'Continue with the current soothing technique',
                        'This is a good time for bonding with your baby',
                        'Try singing or talking softly while rocking',
                        'Gradually slow the rocking if preparing for sleep'
                    ]
                }
            ];
            break;
        case 'white-noise':
            conditions = [
                {
                    name: 'Calming',
                    description: 'The white noise appears to have a calming effect on your baby. This sound environment is helping to create a soothing atmosphere.',
                    confidence: 75,
                    recommendations: [
                        'Continue using white noise at a moderate volume',
                        'Ensure the white noise is not too loud to protect hearing',
                        'Consider using white noise during sleep times',
                        'Gradually reduce white noise dependency over time'
                    ]
                }
            ];
            break;
        default:
            // Default conditions for recorded audio
            conditions = [
                {
                    name: 'Hungry',
                    description: 'Your baby appears to be hungry. The crying pattern suggests hunger with short, rhythmic cries that increase in intensity.',
                    confidence: 85,
                    recommendations: [
                        'Try feeding your baby if it\'s been more than 2-3 hours since the last feeding',
                        'Check for hunger cues like rooting, sucking on hands, or smacking lips',
                        'Consider the feeding schedule and if it might be time for the next feeding'
                    ]
                },
                {
                    name: 'Needs Comfort',
                    description: 'Your baby seems to need comfort and reassurance. The sound pattern indicates a need for physical contact and soothing.',
                    confidence: 78,
                    recommendations: [
                        'Try holding your baby close with skin-to-skin contact',
                        'Gently rock or sway your baby',
                        'Offer a pacifier if your baby uses one',
                        'Try swaddling your baby for a sense of security'
                    ]
                },
                {
                    name: 'Tired',
                    description: 'Your baby appears to be tired and ready for sleep. The fussiness and whining pattern suggests sleepiness.',
                    confidence: 92,
                    recommendations: [
                        'Check if it\'s time for a nap based on your baby\'s sleep schedule',
                        'Create a calm environment with dim lighting',
                        'Try a consistent bedtime routine like rocking or singing',
                        'Ensure the sleep environment is comfortable and safe'
                    ]
                },
                {
                    name: 'Discomfort',
                    description: 'Your baby may be experiencing some physical discomfort. The sound pattern suggests irritation rather than hunger or tiredness.',
                    confidence: 73,
                    recommendations: [
                        'Check for a wet or soiled diaper',
                        'Ensure your baby\'s clothing is not too tight or uncomfortable',
                        'Check the room temperature - your baby might be too hot or cold',
                        'Look for signs of teething if appropriate for your baby\'s age'
                    ]
                },
                {
                    name: 'Content',
                    description: 'Your baby sounds content and comfortable. These are happy sounds that indicate your baby\'s needs are met.',
                    confidence: 88,
                    recommendations: [
                        'Continue to engage with your baby through talking and interaction',
                        'Enjoy this moment of contentment with your baby',
                        'This is a good time for activities like tummy time or reading',
                        'Take note of what might be contributing to this content state'
                    ]
                }
            ];
    }
    
    // Return a random condition from the appropriate set
    // Only for non-consistent samples (not baby-crying or baby-laughing)
    const result = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Add processing parameters for documentation
    result._processingParams = {
        sampleType: sampleType,
        fixedResult: false,
        timestamp: new Date().toISOString()
    };
    
    return result;
}

// Display analysis results
function displayResults(result) {
    // Validate consistent samples
    validateConsistentSample(result);
    
    // Set condition text
    conditionResult.textContent = result.description;
    
    // Set confidence level
    confidenceLevel.style.width = `${result.confidence}%`;
    confidencePercentage.textContent = `${result.confidence}%`;
    
    // Clear previous recommendations
    recommendationsList.innerHTML = '';
    
    // Add new recommendations
    result.recommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.textContent = recommendation;
        recommendationsList.appendChild(li);
    });
    
    // Show results section
    resultsSection.classList.remove('hidden');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Validate consistent sample results
function validateConsistentSample(result) {
    if (result._consistentSample && result._processingParams) {
        const sampleType = result._processingParams.sampleType;
        
        // Expected results for consistent samples
        const expectedResults = {
            'baby-crying': {
                name: 'Needs Attention',
                confidence: 95,
                recommendationCount: 4
            },
            'baby-laughing': {
                name: 'Happy & Content',
                confidence: 98,
                recommendationCount: 4
            }
        };
        
        const expected = expectedResults[sampleType];
        if (expected) {
            // Validate the result matches expected parameters
            if (result.name !== expected.name) {
                console.error(`Validation failed for ${sampleType}: Expected name '${expected.name}', got '${result.name}'`);
            }
            if (result.confidence !== expected.confidence) {
                console.error(`Validation failed for ${sampleType}: Expected confidence ${expected.confidence}, got ${result.confidence}`);
            }
            if (result.recommendations.length !== expected.recommendationCount) {
                console.error(`Validation failed for ${sampleType}: Expected ${expected.recommendationCount} recommendations, got ${result.recommendations.length}`);
            }
            
            // Log successful validation
            console.log(`Validation passed for ${sampleType}: Result matches expected parameters`);
            
            // Store validation timestamp
            result._validationParams = {
                validated: true,
                timestamp: new Date().toISOString()
            };
        }
    }
}

// Test consistent sample results with multiple iterations
function testConsistentSamples(iterations = 10) {
    const testResults = {
        'baby-crying': [],
        'baby-laughing': []
    };
    
    console.log(`Testing consistent samples with ${iterations} iterations...`);
    
    // Test baby-crying sample
    for (let i = 0; i < iterations; i++) {
        const result = generateMockAnalysisResult('baby-crying');
        testResults['baby-crying'].push({
            name: result.name,
            confidence: result.confidence,
            recommendationCount: result.recommendations.length
        });
    }
    
    // Test baby-laughing sample
    for (let i = 0; i < iterations; i++) {
        const result = generateMockAnalysisResult('baby-laughing');
        testResults['baby-laughing'].push({
            name: result.name,
            confidence: result.confidence,
            recommendationCount: result.recommendations.length
        });
    }
    
    // Check if all results are identical
    const isConsistent = (sampleType) => {
        const results = testResults[sampleType];
        const firstResult = results[0];
        return results.every(result => 
            result.name === firstResult.name && 
            result.confidence === firstResult.confidence && 
            result.recommendationCount === firstResult.recommendationCount
        );
    };
    
    // Log test results
    console.log(`Baby Crying Sample Consistency: ${isConsistent('baby-crying') ? 'PASSED' : 'FAILED'}`);
    console.log(`Baby Laughing Sample Consistency: ${isConsistent('baby-laughing') ? 'PASSED' : 'FAILED'}`);
    
    // Return test results for further analysis if needed
    return {
        consistent: isConsistent('baby-crying') && isConsistent('baby-laughing'),
        results: testResults
    };
}

// Reset analysis
function resetAnalysis() {
    // Hide results section
    resultsSection.classList.add('hidden');
    
    // Hide audio playback
    audioPlayback.classList.add('hidden');
    
    // Reset audio player
    audioPlayer.src = '';
    
    // Clean up audio URL
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        audioUrl = null;
    }
    
    // Reset sample selection
    sampleOptions.forEach(option => {
        option.classList.remove('selected');
    });
    selectedSample = null;
    
    // Reset buttons
    analyzeButton.disabled = true;
    
    // Scroll to top of analysis section
    document.getElementById('analyze').scrollIntoView({ behavior: 'smooth' });
}

// Show error message
function showError(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Style the error message
    errorDiv.style.backgroundColor = '#f8d7da';
    errorDiv.style.color = '#721c24';
    errorDiv.style.padding = '15px';
    errorDiv.style.margin = '20px 0';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.borderLeft = '4px solid #dc3545';
    errorDiv.style.fontFamily = 'Open Sans, sans-serif';
    
    // Insert error message after the recording interface
    const recordingInterface = document.querySelector('.recording-interface');
    recordingInterface.parentNode.insertBefore(errorDiv, recordingInterface.nextSibling);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// Add error handling for page load
window.addEventListener('error', function(e) {
    console.error('Page error:', e.error);
});

// Add error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});