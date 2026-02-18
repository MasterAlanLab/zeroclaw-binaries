import type { Release } from '../lib/manifest'
import { ALL_TARGETS, targetLabel, formatBytes } from '../lib/platform'

interface Props {
  releases: Record<string, Release>
}

export function Versions({ releases }: Props) {
  const entries = Object.entries(releases).reverse()

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-10">Nightly Builds</h2>
      <div className="space-y-4">
        {entries.map(([version, release]) => (
          <div
            key={version}
            className="border border-zc-border rounded-lg p-5 bg-zc-surface"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-lg">{version}</span>
              <span className="text-sm text-zc-muted">{release.date}</span>
            </div>
            <div className="text-xs text-zc-muted font-mono mb-3">
              commit: {release.commit}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {ALL_TARGETS.map((target) => {
                const asset = release.assets[target]
                return (
                  <a
                    key={target}
                    href={asset.url}
                    className="text-xs font-mono text-zc-muted hover:text-zc-accent transition-colors truncate"
                    title={targetLabel(target)}
                  >
                    {targetLabel(target)} · {formatBytes(asset.size)}
                  </a>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
