import sys
import os
import importlib.util

backend_dir = os.path.join(os.path.dirname(__file__), "backend-python")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

spec = importlib.util.spec_from_file_location(
    "backend_python_main", os.path.join(backend_dir, "main.py")
)
module = importlib.util.module_from_spec(spec)
sys.modules["backend_python_main"] = module
spec.loader.exec_module(module)

app = module.app

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
