// In your existing ai-section.js, update the generateImage function:

async function generateImage() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        showStatus('Please enter a prompt description', 'error');
        promptInput.focus();
        return;
    }

    // Disable generate button
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating HQ Image...';
    
    showStatus('🎨 AI is creating your high-quality image. This may take 30-60 seconds...', 'info');
    
    try {
        // Get current values from inputs
        const steps = stepsInput ? parseInt(stepsInput.value) : 25; // Updated default
        const guidanceScale = scaleInput ? parseFloat(scaleInput.value) : 7.5; // Updated default
        const negativePrompt = negativePromptInput ? negativePromptInput.value.trim() : '';
        
        console.log('Sending HQ request with:', { 
            prompt, 
            steps, 
            guidanceScale, 
            negativePrompt 
        });
        
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                negative_prompt: negativePrompt,
                steps: steps,
                guidance_scale: guidanceScale
            })
        });
        
        const data = await response.json();
        console.log('HQ Response received:', data);
        
        if (data.success) {
            // Show generated image
            generatedImage.src = data.image;
            generatedImage.alt = 'Generated: ' + (data.prompt_used || prompt);
            
            imageInfo.innerHTML = `
                <div><strong>Generation Time:</strong> ${data.generation_time}</div>
                <div><strong>Steps:</strong> ${data.steps_used || steps}</div>
                <div><strong>Guidance Scale:</strong> ${data.guidance_scale_used || guidanceScale}</div>
                <div><strong>Prompt:</strong> ${data.prompt_used || prompt}</div>
                <div><strong>Quality:</strong> High Definition 512x512</div>
            `;
            
            // Show result, hide placeholder
            placeholder.style.display = 'none';
            result.style.display = 'block';
            downloadBtn.style.display = 'inline-flex';
            
            // Add quality class to container
            outputContainer.classList.add('has-image');
            
            showStatus('✅ High-quality AI image created successfully!', 'success');
            
            // Setup download button
            downloadBtn.onclick = function() {
                const link = document.createElement('a');
                link.href = data.image;
                link.download = data.filename || 'hq_ai_image.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            
        } else {
            showStatus('❌ Error: ' + (data.error || 'Unknown error'), 'error');
            console.error('Server error:', data.error);
        }
        
    } catch (error) {
        console.error('Network error:', error);
        showStatus('❌ Network error. Please check connection and try again.', 'error');
    } finally {
        // Re-enable generate button
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate HQ Image';
    }
}

// Update the checkModelStatus function:
async function checkModelStatus() {
    try {
        const response = await fetch('/status');
        const data = await response.json();
        
        if (data.model_loaded) {
            showStatus('✅ HQ AI Model Ready! Enter a prompt and click Generate', 'success');
        } else if (data.model_loading) {
            showStatus('🔄 HQ AI Model is loading... This may take a few minutes', 'info');
            // Check again in 5 seconds
            setTimeout(checkModelStatus, 5000);
        } else if (data.load_error) {
            showStatus('❌ Model loading failed: ' + data.load_error, 'error');
        }
    } catch (error) {
        console.error('Error checking model status:', error);
        if (statusDiv) {
            statusDiv.textContent = '⚠️ Unable to check model status';
            statusDiv.className = 'status-message error';
            statusDiv.style.display = 'block';
        }
    }
}