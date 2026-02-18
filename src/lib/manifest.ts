export interface Asset {
  url: string
  size: number
  sha256: string
}

export type Target =
  | 'x86_64-unknown-linux-gnu'
  | 'aarch64-unknown-linux-musl'
  | 'armv7-unknown-linux-musleabihf'
  | 'x86_64-apple-darwin'
  | 'aarch64-apple-darwin'
  | 'x86_64-pc-windows-msvc'

export interface Release {
  date: string
  commit: string
  assets: Record<Target, Asset>
}

export interface Manifest {
  latest: string
  releases: Record<string, Release>
}

const MANIFEST_URL =
  import.meta.env.VITE_MANIFEST_URL ?? 'https://zeroclaw.mdzz.uk/manifest.json'

export async function fetchManifest(): Promise<Manifest> {
  const res = await fetch(MANIFEST_URL)
  if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`)
  return res.json()
}
