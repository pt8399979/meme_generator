import os
import io
import time
import threading
from datetime import datetime
from flask import Flask, render_template, request, jsonify
import torch
from PIL import Image
import base64
import warnings

warnings.filterwarnings("ignore")

app = Flask(__name__)

# Better balanced model for quality vs speed
MODEL_ID = "runwayml/stable-diffusion-v1-5"  # Better quality than small model
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
TORCH_DTYPE = torch.float16 if torch.cuda.is_available() else torch.float32

pipe = None
model_loading = False
model_loaded = False
load_error = None

def load_model_in_thread():
    global pipe, model_loading, model_loaded, load_error
    
    if model_loading or model_loaded:
        return
        
    model_loading = True
    try:
        print("🔄 Loading HIGH QUALITY AI Model...")
        print(f"💻 Device: {DEVICE.upper()}")
        print(f"📦 Model: {MODEL_ID} (Optimized for Quality)")
        
        from diffusers import StableDiffusionPipeline
        
        print("📥 Downloading model...")
        
        pipe = StableDiffusionPipeline.from_pretrained(
            MODEL_ID,
            torch_dtype=TORCH_DTYPE,
            safety_checker=None,
            requires_safety_checker=False,
            use_safetensors=True
        )
        
        pipe = pipe.to(DEVICE)
        
        # Optimizations for better quality
        if DEVICE == "cuda":
            pipe.enable_attention_slicing()
            pipe.enable_memory_efficient_attention()
            print("🚀 Enabled GPU optimizations")
        else:
            pipe.enable_attention_slicing()
            print("💾 Enabled CPU optimizations")
        
        model_loaded = True
        print("✅ HIGH QUALITY AI MODEL LOADED SUCCESSFULLY!")
        print("🎨 Ready for professional image generation!")
        
    except Exception as e:
        load_error = str(e)
        print(f"❌ Error: {e}")
    finally:
        model_loading = False

print("🚀 Starting PNP AI High Quality Image Generator...")
load_thread = threading.Thread(target=load_model_in_thread)
load_thread.daemon = True
load_thread.start()

@app.route('/')
def index():
    return render_template('index.html', device=DEVICE.upper())

@app.route('/generate', methods=['POST'])
def generate_image():
    if not model_loaded:
        if model_loading:
            return jsonify({'error': 'Model is loading, please wait...'}), 503
        elif load_error:
            return jsonify({'error': f'Load failed: {load_error}'}), 500
        else:
            return jsonify({'error': 'Model not ready'}), 500
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data received'}), 400
            
        prompt = data.get('prompt', '').strip()
        negative_prompt = data.get('negative_prompt', '').strip()
        steps = data.get('steps', 25)  # Increased default steps for better quality
        guidance_scale = data.get('guidance_scale', 7.5)  # Better default guidance
        
        if not prompt:
            return jsonify({'error': 'Please enter a prompt'}), 400
        
        # Validate and use the values from frontend with better defaults
        steps = max(20, min(40, int(steps)))  # Increased min steps for quality
        guidance_scale = max(5.0, min(15.0, float(guidance_scale)))
        
        print(f"🎨 Generating: {prompt}")
        print(f"⚡ Quality Settings: {steps} steps, {guidance_scale} guidance scale")
        start_time = time.time()
        
        # Enhanced prompt engineering for better results
        enhanced_prompt = f"high quality, professional, detailed, sharp focus, 4k, {prompt}"
        
        # Generate image with optimized settings
        with torch.no_grad():
            result = pipe(
                prompt=enhanced_prompt,
                negative_prompt=f"blurry, low quality, distorted, ugly, bad anatomy, {negative_prompt}",
                num_inference_steps=steps,
                guidance_scale=guidance_scale,
                width=512,  # Increased resolution for better quality
                height=512,
                generator=torch.Generator(device=DEVICE).manual_seed(int(time.time()))  # Add some randomness
            )
        
        image = result.images[0]
        generation_time = time.time() - start_time
        
        print(f"✅ Generated in {generation_time:.2f}s using {steps} steps")
        
        # Convert to base64
        buffered = io.BytesIO()
        image.save(buffered, format="PNG", optimize=True)
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        # Save image
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"hq_ai_image_{timestamp}.png"
        os.makedirs("generated_images", exist_ok=True)
        image.save(f"generated_images/{filename}", "PNG", optimize=True)
        
        return jsonify({
            'success': True,
            'image': f"data:image/png;base64,{img_str}",
            'generation_time': f"{generation_time:.2f}s",
            'filename': filename,
            'prompt_used': prompt,
            'steps_used': steps,
            'guidance_scale_used': guidance_scale
        })
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/status')
def status():
    return jsonify({
        'model_loaded': model_loaded,
        'model_loading': model_loading,
        'load_error': load_error,
        'device': DEVICE.upper(),
        'model': MODEL_ID
    })

if __name__ == '__main__':
    os.makedirs("generated_images", exist_ok=True)
    print("🌐 Server: http://localhost:5000")
    print("🎨 High Quality Mode: Better model for professional results")
    app.run(host='0.0.0.0', port=5000, debug=False)