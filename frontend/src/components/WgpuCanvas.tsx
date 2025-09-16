import React, { useRef, useEffect, useState } from 'react'

// Import the WASM module from the wgpu_engine
// This imports the compiled WebAssembly module and the WgpuRenderer class
import init, { WgpuRenderer } from '../../../wgpu_engine/pkg/renderrust_engine.js'

/**
 * Props interface for the WgpuCanvas component
 */
interface WgpuCanvasProps {
  width?: number   // Canvas width in pixels (default: 800)
  height?: number  // Canvas height in pixels (default: 600)
}

/**
 * WgpuCanvas Component
 * 
 * A React component that integrates with the Rust WASM module to render 3D graphics.
 * This component handles:
 * - WASM module initialization
 * - Canvas setup and management
 * - Render loop coordination
 * - Error handling and loading states
 * - Window resize handling
 */
const WgpuCanvas: React.FC<WgpuCanvasProps> = ({ 
  width = 800, 
  height = 600 
}) => {
  // Canvas element reference for direct DOM manipulation
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Reference to the WASM renderer instance
  const rendererRef = useRef<WgpuRenderer | null>(null)
  
  // Reference to the current animation frame ID for cleanup
  const animationFrameRef = useRef<number | null>(null)
  
  // Loading state to show spinner while WASM initializes
  const [isLoading, setIsLoading] = useState(true)
  
  // Error state to display any initialization or runtime errors
  const [error, setError] = useState<string | null>(null)

  /**
   * Main initialization effect - runs once when component mounts
   * Handles WASM module initialization and render loop setup
   */
  useEffect(() => {
    const initWgpu = async () => {
      try {
        // Reset states for fresh initialization
        setIsLoading(true)
        setError(null)

        // Initialize the WASM module
        // This loads the WebAssembly binary and sets up the JavaScript bindings
        await init()

        // Ensure canvas element is available
        if (!canvasRef.current) {
          throw new Error('Canvas ref is null')
        }

        // Create the WASM renderer instance
        // This instantiates the Rust WgpuRenderer struct in WebAssembly
        const renderer = new WgpuRenderer(canvasRef.current)
        rendererRef.current = renderer

        // Mark initialization as complete
        setIsLoading(false)

        /**
         * Render loop function
         * Called every frame to update the 3D scene
         * Uses requestAnimationFrame for smooth 60fps animation
         */
        const renderLoop = () => {
          if (rendererRef.current) {
            try {
              // Call the WASM render method to draw the current frame
              rendererRef.current.render()
            } catch (err) {
              console.error('Render error:', err)
              setError(`Render error: ${err}`)
            }
          }
          // Schedule the next frame
          animationFrameRef.current = requestAnimationFrame(renderLoop)
        }

        // Start the render loop
        renderLoop()
      } catch (err) {
        console.error('Failed to initialize wgpu:', err)
        setError(`Failed to initialize: ${err}`)
        setIsLoading(false)
      }
    }

    // Start the initialization process
    initWgpu()

    /**
     * Cleanup function - runs when component unmounts
     * Cancels the animation frame to prevent memory leaks
     */
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, []) // Empty dependency array means this runs only once on mount

  /**
   * Window resize effect - handles canvas resizing
   * Updates the WASM renderer when the window size changes
   */
  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current && canvasRef.current) {
        // Get the current canvas dimensions
        const rect = canvasRef.current.getBoundingClientRect()
        
        // Update the WASM renderer with new dimensions
        rendererRef.current.resize(rect.width, rect.height)
      }
    }

    // Add resize event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup: remove event listener on unmount
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty dependency array means this runs once on mount

  /**
   * Error state render - displays error message if initialization fails
   */
  if (error) {
    return (
      <div className="canvas-container" style={{ width, height }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#ff6b6b',
          fontSize: '1.2em'
        }}>
          Error: {error}
        </div>
      </div>
    )
  }

  /**
   * Main render - displays canvas and loading state
   */
  return (
    <div className="canvas-container" style={{ width, height }}>
      {/* HTML5 Canvas element for 3D rendering */}
      <canvas
        ref={canvasRef}                    // Reference for direct DOM access
        width={width}                      // Canvas internal width
        height={height}                    // Canvas internal height
        style={{
          width: '100%',                  // CSS width (responsive)
          height: '100%',                 // CSS height (responsive)
          display: isLoading ? 'none' : 'block'  // Hide canvas while loading
        }}
      />
      
      {/* Loading indicator - shown while WASM initializes */}
      {isLoading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#646cff',
          fontSize: '1.2em'
        }}>
          Loading WebGPU renderer...
        </div>
      )}
    </div>
  )
}

export default WgpuCanvas
