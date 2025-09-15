#!/bin/bash

echo "🚀 Building Web 3D Project..."

echo "📦 Building WASM module..."
cd wgpu_engine
wasm-pack build --target web --out-dir pkg
if [ $? -ne 0 ]; then
    echo "❌ Failed to build WASM module"
    exit 1
fi
cd ..

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo "✅ Build complete!"
echo ""
echo "To start the development server:"
echo "  cd frontend && npm run dev"
echo ""
echo "To build for production:"
echo "  cd frontend && npm run build"