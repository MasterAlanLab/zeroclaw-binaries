import type { Release, Target } from '../lib/manifest'
import {
  detectPlatform,
  targetLabel,
  formatBytes,
  DESKTOP_TARGETS,
  ARM_TARGETS,
} from '../lib/platform'

interface Props {
  release: Release
  version: string
}

export function Downloads({ release, version }: Props) {
  const detected = detectPlatform()

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-2">
        Download <span className="font-mono text-zc-accent">{version}</span>
      </h2>
      <p className="text-center text-zc-muted mb-10">
        Built on {release.date} · <span className="font-mono">{release.commit}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DESKTOP_TARGETS.map((target) => (
          <DownloadCard
            key={target}
            target={target}
            asset={release.assets[target]}
            recommended={target === detected}
          />
        ))}
      </div>

      <h3 className="text-lg font-semibold text-zc-muted mt-10 mb-4 text-center uppercase tracking-wider text-sm">
        Embedded / ARM
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ARM_TARGETS.map((target) => (
          <DownloadCard
            key={target}
            target={target}
            asset={release.assets[target]}
            recommended={false}
          />
        ))}
      </div>
    </section>
  )
}

function DownloadCard({
  target,
  asset,
  recommended,
}: {
  target: Target
  asset: { url: string; size: number; sha256: string }
  recommended: boolean
}) {
  return (
    <a
      href={asset.url}
      className={`block p-6 rounded-lg border transition-all duration-200 group ${
        recommended
          ? 'border-zc-accent bg-zc-accent/5 ring-1 ring-zc-accent/20'
          : 'border-zc-border bg-zc-surface hover:border-zc-accent/50 hover:bg-zc-accent/5'
      }`}
    >
      {recommended && (
        <span className="inline-block text-xs font-mono text-zc-accent uppercase tracking-wider mb-2">
          Recommended for your system
        </span>
      )}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg group-hover:text-zc-accent transition-colors">
          {targetLabel(target)}
        </span>
        <span className="text-sm text-zc-muted font-mono">{formatBytes(asset.size)}</span>
      </div>
      <div className="text-xs text-zc-muted mt-3 font-mono truncate" title={asset.sha256}>
        sha256:{asset.sha256.slice(0, 16)}…
      </div>
    </a>
  )
}
