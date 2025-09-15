# RenderRust - wgpu + React

This is a modern 3D web application that combines Rust's wgpu for high-performance 3D graphics with React for the user interface. This project demonstrates real-time 3D sphere rendering with hot reload development capabilities.

If you want to know how to create a Rust WASM project and embed wgpu into a React application, this is the project you need.

## 🏗️ Project Structure

```
web_3d/
├── wgpu_engine/         # Rust WASM module with 3D rendering
│   ├── src/
│   │   ├── lib.rs       # Main WASM module with sphere rendering
│   │   └── shader.wgsl  # WebGPU shaders (for future use)
│   ├── pkg/             # Generated WASM package (after build)
│   └── Cargo.toml       # Rust dependencies
├── frontend/            # React Vite application
│   ├── src/
│   │   ├── components/
│   │   │   └── WgpuCanvas.tsx  # React component for 3D canvas
│   │   ├── App.tsx      # Main app component
│   │   └── main.tsx     # Entry point
│   ├── package.json     # Node.js dependencies
│   └── vite.config.ts   # Vite configuration
├── start.sh             # Quick start script
├── dev.sh               # Development with hot reload
├── build.sh             # Production build script
└── README.md            # This file
```

## Features

- **Rust + WebAssembly**: High-performance 3D rendering with wgpu
- **React + TypeScript**: Modern frontend with Vite
- **Real-time 3D Graphics**: Animated sphere-like visualization
- **Hot Reload Development**: Auto-rebuild WASM on Rust changes
- **Fast Development**: Instant feedback with cargo watch + Vite
- **Responsive Design**: Works on desktop and mobile browsers
- **Easy Setup**: One-command start scripts

## Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable)
- [Node.js](https://nodejs.org/) (v18 or later)
- [wasm-pack](https://rustwasm.github.io/wasmpack/installer/)
- [cargo-watch](https://crates.io/crates/cargo-watch) (for hot reload development)

Install required tools:

```bash
# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Install cargo-watch for hot reload
cargo install cargo-watch
```

### Build and Run

1. **Quick start (builds if needed, then starts dev server):**

   ```bash
   ./start.sh
   ```

2. **Development with hot reload (recommended for development):**

   ```bash
   ./dev.sh
   ```

   This will:

   - Auto-rebuild WASM module when you change Rust code
   - Run the frontend dev server with hot reload
   - Both servers run simultaneously

3. **Build everything for production:**

   ```bash
   ./build.sh
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## Development Workflow

### Hot Reload Development (Recommended)

For active development, use the hot reload setup:

```bash
./dev.sh
```

This starts both:

- **WASM Watcher**: Automatically rebuilds when you edit Rust code
- **Frontend Dev Server**: Hot reloads when you edit React/TypeScript code

**Benefits:**

- ⚡ **Instant feedback** - see changes as you code
- 🔄 **No manual rebuilds** - everything happens automatically
- 🎯 **Focus on coding** - no context switching to build commands
- 🚀 **Faster iteration** - especially when tweaking 3D rendering logic

### Development Tips

1. **Edit Rust code** in `wgpu_engine/src/lib.rs`:

   - Changes trigger automatic WASM rebuild
   - Browser refreshes with new WASM module

2. **Edit React code** in `frontend/src/`:

   - Changes trigger hot reload
   - State is preserved during development

3. **Test changes**:
   - Open browser dev tools to see console logs
   - Check for any build errors in terminal

## Scripts

| Script       | Purpose                | When to Use                     |
| ------------ | ---------------------- | ------------------------------- |
| `./start.sh` | Quick start            | First time setup or quick demo  |
| `./dev.sh`   | Hot reload development | Active development with changes |
| `./build.sh` | Production build       | Deploy or test production build |

### Script Details

- **`start.sh`**: Checks dependencies, builds if needed, starts dev server
- **`dev.sh`**: Runs cargo watch + Vite simultaneously for hot reload
- **`build.sh`**: Builds WASM module and frontend for production

## Browser Requirements

This project requires a browser that supports:

- **WebGPU** (Chrome 113+, Edge 113+, or Firefox with experimental flags)
- **WebAssembly** (all modern browsers)

### Enabling WebGPU in Firefox:

1. Go to `about:config`
2. Set `dom.webgpu.enabled` to `true`
3. Set `gfx.webrender.all` to `true`

## Development

### Building WASM Module Only

```bash
cd wgpu_engine
wasm-pack build --target web --out-dir pkg
```

### Frontend Development

```bash
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

### Manual Build Process

```bash
# 1. Build WASM module
cd wgpu_engine
wasm-pack build --target web --out-dir pkg

# 2. Install frontend dependencies
cd ../frontend
npm install

# 3. Start development server
npm run dev
```

## 🎮 Technical Details

### Current Implementation

- **Rendering**: Canvas 2D context with animated circles simulating 3D sphere
- **Animation**: Continuous rotation with smooth interpolation
- **Visual Effects**: Gradient colors and transparency for depth perception
- **Performance**: Optimized for 60fps rendering

### Future WebGPU Implementation

The project is structured to easily upgrade to full WebGPU:

- **Geometry**: Procedurally generated sphere with 32 rings and 16 sectors
- **Shaders**: Custom WGSL vertex and fragment shaders (ready in `shader.wgsl`)
- **Lighting**: Directional lighting with ambient and diffuse components
- **Features**: Vertex/index buffers, uniform buffers, render pipeline

### Architecture

- **wgpu_engine**: Rust crate that compiles to WASM, contains 3D rendering logic
- **frontend**: React application that imports and uses the WASM module
- **Communication**: JavaScript ↔ WASM via wasm-bindgen
- **Hot Reload**: cargo watch + Vite for instant development feedback

## 🐛 Troubleshooting

### WebGPU Not Supported

If you see "WebGPU not supported" error:

1. Ensure you're using a compatible browser
2. Enable experimental WebGPU features if needed
3. Check browser console for additional error details

### Build Issues

- Make sure Rust and wasm-pack are properly installed
- Try cleaning the build: `cd wgpu_engine && wasm-pack clean`
- Check that all dependencies are installed: `cd frontend && npm install`

### Performance Issues

- The sphere uses 32x16 resolution for good performance
- Reduce rings/sectors in `create_sphere()` for lower-end devices
- Monitor browser dev tools for memory usage

### Common Issues

- **Module not found**: Make sure you've built the WASM module first
- **CORS errors**: Use a local development server (Vite handles this)
- **Canvas not rendering**: Check browser WebGPU support

## 📝 Customization

### Changing the 3D Visualization

Edit `wgpu_engine/src/lib.rs`:

- **Animation speed**: Modify `self.rotation += 0.01;`
- **Circle count**: Change `for i in 0..10` loop
- **Colors**: Update the `rgba()` color calculations
- **Pattern**: Modify the circle positioning logic

### Styling the Frontend

Edit `frontend/src/App.css`:

- **Canvas styling**: Modify `.canvas-container` and `canvas` styles
- **Layout**: Change `.app` flexbox properties
- **Colors**: Update gradient and text colors
- **UI elements**: Add controls, buttons, or information panels

### Adding WebGPU Support

To upgrade to full WebGPU rendering:

1. **Update dependencies** in `wgpu_engine/Cargo.toml`
2. **Implement WebGPU code** in `wgpu_engine/src/lib.rs`
3. **Use shaders** from `wgpu_engine/src/shader.wgsl`
4. **Test with WebGPU-enabled browsers**

### Development Tips

- **Use `./dev.sh`** for active development
- **Check browser console** for errors
- **Test in multiple browsers** for compatibility
- **Monitor performance** with browser dev tools

## License

MIT License - feel free to use this project as a starting point for your own 3D web applications!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Useful Resources that I have used a lot

- [WebGPU Specification](https://www.w3.org/TR/webgpu/)
- [wgpu Documentation](https://docs.rs/wgpu/)
- [wasm-bindgen Guide](https://rustwasm.github.io/wasm-bindgen/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
