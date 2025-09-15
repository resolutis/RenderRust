import React from 'react'
import WgpuCanvas from './components/WgpuCanvas'
import './App.css'

function App() {
  return (
    <div className="app">
      <h1>Web 3D with wgpu + React</h1>
      <p>Real-time 3D sphere rendering powered by WebGPU</p>
      <WgpuCanvas />
    </div>
  )
}

export default App
