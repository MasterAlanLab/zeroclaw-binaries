import { useState } from 'react'

const GITHUB_RAW =
  'https://raw.githubusercontent.com/MasterAlanLab/zeroclaw-binaries/main/scripts'
const PROXY_RAW =
  'https://gh-proxy.com/https://raw.githubusercontent.com/MasterAlanLab/zeroclaw-binaries/main/scripts'

type Region = 'global' | 'cn'

export function Install() {
  const [region, setRegion] = useState<Region>('global')
  const base = region === 'cn' ? PROXY_RAW : GITHUB_RAW

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-6">Install</h2>

      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-zc-surface border border-zc-border rounded-lg p-1">
          <RegionButton
            active={region === 'global'}
            onClick={() => setRegion('global')}
          >
            Global
          </RegionButton>
          <RegionButton
            active={region === 'cn'}
            onClick={() => setRegion('cn')}
          >
            中国大陆
          </RegionButton>
        </div>
      </div>

      <div className="space-y-6">
        <CodeBlock
          label="macOS / Linux"
          code={`curl -fsSL ${base}/install.sh | bash`}
        />
        <CodeBlock
          label="Windows (PowerShell)"
          code={`irm ${base}/install.ps1 | iex`}
        />
      </div>

      {region === 'cn' && (
        <p className="text-center text-xs text-zc-muted mt-4">
          通过 gh-proxy.com 加速下载安装脚本，二进制文件从 Cloudflare R2 直接下载
        </p>
      )}
    </section>
  )
}

function RegionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-zc-accent text-white'
          : 'text-zc-muted hover:text-zc-text'
      }`}
    >
      {children}
    </button>
  )
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="text-sm text-zc-muted mb-2">{label}</div>
      <div className="relative group">
        <pre className="bg-zc-surface border border-zc-border rounded-lg p-4 pr-12 font-mono text-sm overflow-x-auto">
          <code>{code}</code>
        </pre>
        <button
          onClick={copy}
          className="absolute top-3 right-3 text-zc-muted hover:text-zc-accent transition-colors p-1"
          title="Copy to clipboard"
        >
          {copied ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
