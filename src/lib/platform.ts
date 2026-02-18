import type { Target } from './manifest'

const PLATFORM_RULES: Array<{ pattern: RegExp; target: Target }> = [
  { pattern: /Win/, target: 'x86_64-pc-windows-msvc' },
  { pattern: /Mac/, target: 'aarch64-apple-darwin' },
  { pattern: /Linux/, target: 'x86_64-unknown-linux-gnu' },
]

export function detectPlatform(ua: string = navigator.userAgent): Target | null {
  return PLATFORM_RULES.find((r) => r.pattern.test(ua))?.target ?? null
}

const TARGET_LABELS: Record<Target, string> = {
  'x86_64-unknown-linux-gnu': 'Linux x86_64',
  'aarch64-unknown-linux-musl': 'Linux ARM64 (musl)',
  'armv7-unknown-linux-musleabihf': 'Linux ARMv7 (musl)',
  'aarch64-apple-darwin': 'macOS Apple Silicon',
  'x86_64-pc-windows-msvc': 'Windows x86_64',
}

const TARGET_ICONS: Record<Target, string> = {
  'x86_64-unknown-linux-gnu': 'linux',
  'aarch64-unknown-linux-musl': 'linux',
  'armv7-unknown-linux-musleabihf': 'linux',
  'aarch64-apple-darwin': 'apple',
  'x86_64-pc-windows-msvc': 'windows',
}

export function targetLabel(t: Target): string {
  return TARGET_LABELS[t]
}

export function targetIcon(t: Target): string {
  return TARGET_ICONS[t]
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

export const DESKTOP_TARGETS: Target[] = [
  'aarch64-apple-darwin',
  'x86_64-unknown-linux-gnu',
  'x86_64-pc-windows-msvc',
]

export const ARM_TARGETS: Target[] = [
  'aarch64-unknown-linux-musl',
  'armv7-unknown-linux-musleabihf',
]

export const ALL_TARGETS: Target[] = [...DESKTOP_TARGETS, ...ARM_TARGETS]
