import { useState, useEffect } from 'react'
import type { Manifest } from './lib/manifest'
import { fetchManifest } from './lib/manifest'
import { Hero } from './components/Hero'
import { Downloads } from './components/Downloads'
import { Install } from './components/Install'
import { Versions } from './components/Versions'

export default function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchManifest().then(setManifest).catch((e) => setError(e.message))
  }, [])

  return (
    <div className="min-h-screen">
      <Hero />
      {error ? (
        <p className="text-center text-red-400 py-12">{error}</p>
      ) : (
        manifest && (
          <>
            <Downloads
              release={manifest.releases[manifest.latest]!}
              version={manifest.latest}
            />
            <Install />
            <Versions releases={manifest.releases} />
          </>
        )
      )}
      <footer className="text-center text-zc-muted py-8 text-sm border-t border-zc-border">
        <a
          href="https://github.com/zeroclaw-labs/zeroclaw"
          className="hover:text-zc-accent transition-colors"
        >
          zeroclaw-labs/zeroclaw
        </a>
        {' · MIT License'}
      </footer>
    </div>
  )
}
