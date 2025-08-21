"use client"

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { easing } from 'maath'
import { useState } from 'react'
import { Group, Mesh } from 'three'

// Store pour gérer l'état de l'interaction
const useTabletStore = () => {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}

export default function Tablet3DSection() {
  const [showVideo, setShowVideo] = useState(false)
  const store = useTabletStore()

  return (
    <section className="w-full bg-gradient-to-br from-laha-background via-laha-surface to-laha-gold-light-new py-16 px-4 flex flex-col items-center">
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-laha-text mb-4 text-center">La Tablette Tout-en-Un</h2>
      <p className="text-laha-text-secondary text-lg mb-8 text-center max-w-2xl">
        Découvrez la tablette éducative la plus avancée pour l'apprentissage en Afrique francophone.
      </p>
      
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="w-full h-[400px] bg-laha-surface/20 rounded-xl border border-laha-border overflow-hidden">
          <Canvas 
            camera={{ position: [0, 0, 4], fov: 40 }}
            style={{ borderRadius: '1rem' }}
          >
            <ambientLight intensity={0.7} />
            <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, -5]} castShadow />
            <Environment preset="city" background blur={0.5} />
            <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={0.6} scale={10} blur={2} far={0.8} />
            <Selector store={store}>
              <TabletModel rotation={[0.2, Math.PI / 3, 0]} scale={0.8} />
            </Selector>
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
        </div>

        {/* Fiche technique qui apparaît au survol */}
                <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
            store.open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          } bg-laha-surface/90 backdrop-blur-md border border-laha-border rounded-xl p-6 text-laha-text shadow-2xl z-10 w-80`}
        >
          <h3 className="text-laha-gold font-bold text-lg mb-4">Fiche Technique</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-laha-gold rounded-full"></span>
              <span><b>Autonomie :</b> 12h</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-laha-gold rounded-full"></span>
              <span><b>Écran :</b> 10 pouces anti-reflet</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-laha-gold rounded-full"></span>
              <span><b>Fonctionnalités exclusives :</b></span>
            </li>
            <ul className="ml-6 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-laha-gold-soft rounded-full"></span>
                <span>Géolocalisation anti-vol</span>
            </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-laha-gold-soft rounded-full"></span>
                <span>Mise à jour automatique des programmes</span>
            </li>
            </ul>
          </ul>
        </div>
      </div>

      <button
        className="mt-10 px-8 py-4 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-xl hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all text-lg flex items-center gap-3 shadow-lg hover:shadow-xl"
        onClick={() => setShowVideo(true)}
      >
        <span>Voir la tablette en action</span>
      </button>

      {showVideo && (
        <div className="fixed inset-0 bg-laha-text/90 flex items-center justify-center z-50">
          <div className="bg-laha-surface rounded-xl p-6 max-w-2xl w-full mx-4 relative border border-laha-border">
            <button 
              className="absolute top-4 right-4 text-laha-text text-3xl hover:text-laha-gold transition-colors" 
              onClick={() => setShowVideo(false)}
            >
              ×
            </button>
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Vidéo démo tablette"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-80 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

interface SelectorProps {
  children: React.ReactNode
  store: { open: boolean; setOpen: (open: boolean) => void }
}

function Selector({ children, store }: SelectorProps) {
  const ref = useRef<Mesh>(null)
  
  useFrame(({ viewport, camera, pointer }, delta) => {
    if (ref.current) {
      const { width, height } = viewport.getCurrentViewport(camera, [0, 0, 3])
      easing.damp3(
        ref.current.position, 
        [(pointer.x * width) / 2, (pointer.y * height) / 2, 3], 
        store.open ? 0 : 0.1, 
        delta
      )
      easing.damp3(
        ref.current.scale, 
        store.open ? 4 : 0.01, 
        store.open ? 0.5 : 0.2, 
        delta
      )
      easing.dampC(
        (ref.current.material as any).color, 
        store.open ? '#f0f0f0' : '#ccc', 
        0.1, 
        delta
      )
    }
  })
  
  return (
    <>
      <mesh ref={ref}>
        <circleGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial 
          samples={16} 
          resolution={512} 
          anisotropicBlur={0.1} 
          thickness={0.1} 
          roughness={0.4} 
          toneMapped={true} 
        />
      </mesh>
      <group
        onPointerOver={() => store.setOpen(true)}
        onPointerOut={() => store.setOpen(false)}
        onPointerDown={() => store.setOpen(true)}
        onPointerUp={() => store.setOpen(false)}
      >
        {children}
      </group>
    </>
  )
}

interface TabletModelProps {
  rotation?: [number, number, number]
  scale?: number
}

function TabletModel(props: TabletModelProps) {
  const ref = useRef<Group>(null)
  const { scene } = useGLTF('/tablet.glb')
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime()
      ref.current.rotation.set(
        Math.cos(t / 4) / 8, 
        Math.sin(t / 3) / 4, 
        0.15 + Math.sin(t / 2) / 8
      )
      ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7
    }
  })
  
  return (
    <group ref={ref}>
      <primitive object={scene} {...props} />
    </group>
  )
}

// Préchargement du modèle
useGLTF.preload('/tablet.glb')