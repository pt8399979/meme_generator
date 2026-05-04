# install.py - Run this first to install dependencies
import subprocess
import sys

def install_packages():
    packages = [
        "flask==2.3.3",
        "torch==2.0.1",
        "torchvision==0.15.2",
        "diffusers==0.26.3", 
        "transformers==4.36.2",
        "accelerate==0.27.2",
        "pillow==10.2.0",
        "huggingface-hub==0.20.3",
        "safetensors==0.4.2"
    ]
    
    print("🔧 Installing dependencies...")
    for package in packages:
        try:
            print(f"📦 Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ {package} installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {package}: {e}")
    
    print("\n🎉 All dependencies installed! Now run: python app.py")

if __name__ == "__main__":
    install_packages()