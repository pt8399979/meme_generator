# fix_numpy.py - Fix NumPy compatibility issue
import subprocess
import sys

print("🔧 Fixing NumPy compatibility...")
subprocess.check_call([sys.executable, "-m", "pip", "install", "numpy==1.24.3"])
print("✅ NumPy downgraded to 1.24.3")
print("🔄 Please restart the app: python app.py")