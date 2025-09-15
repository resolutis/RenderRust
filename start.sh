#!/bin/bash

echo "🚀 Starting Web 3D Development Server..."

# Check if WASM module is built
if [ ! -d "wgpu_engine/pkg" ] || [ ! -f "wgpu_engine/pkg/wgpu_engine.js" ]; then
    echo "📦 Building WASM module first..."
    cd wgpu_engine
    wasm-pack build --target web --out-dir pkg
    if [ $? -ne 0 ]; then
        echo "❌ Failed to build WASM module"
        exit 1
    fi
    cd ..
    echo "✅ WASM module built successfully"
else
    echo "✅ WASM module already built"
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi

# Start the development server
echo "🌐 Starting development server..."
cd frontend
npm run dev
