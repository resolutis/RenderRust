#!/bin/bash

echo "🚀 Starting Web 3D Development with Hot Reload..."

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

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping development servers..."
    kill $WASM_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "🔄 Starting WASM watcher (cargo watch)..."
cd wgpu_engine
cargo watch -x "build --target wasm32-unknown-unknown" -x "wasm-pack build --target web --out-dir pkg" &
WASM_PID=$!
cd ..

echo "🌐 Starting frontend development server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Development environment ready!"
echo "   🔄 WASM module will auto-rebuild on Rust changes"
echo "   🌐 Frontend server: http://localhost:5173/"
echo "   📝 Edit Rust code in wgpu_engine/src/ to see changes"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $WASM_PID $FRONTEND_PID
