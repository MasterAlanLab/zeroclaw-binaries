# ZeroClaw Binaries

ZeroClaw 的下载站点与 CI/CD 发布管线。包含一个 React 驱动的下载页面和 GitHub Actions 自动构建流水线，将预编译的 ZeroClaw 二进制文件发布到 Cloudflare R2。

**线上地址**: [zeroclaw.mdzz.uk](https://zeroclaw.mdzz.uk)

## 一键安装

**macOS / Linux:**

```bash
curl -fsSL https://raw.githubusercontent.com/MasterAlanLab/zeroclaw-binaries/main/scripts/install.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/MasterAlanLab/zeroclaw-binaries/main/scripts/install.ps1 | iex
```

**卸载:**

```bash
curl -fsSL https://raw.githubusercontent.com/MasterAlanLab/zeroclaw-binaries/main/scripts/uninstall.sh | sh
# 连配置数据一起清除: 末尾加 -s -- --purge
```

## 支持平台

| 平台 | 架构 | 构建方式 |
|------|------|---------|
| macOS | Apple Silicon (ARM64) | 原生编译 |
| Linux | x86_64 | 原生编译 |
| Linux | ARM64 (musl 静态链接) | 交叉编译 |
| Linux | ARMv7 (musl 静态链接) | 交叉编译 |
| Windows | x86_64 | 原生编译 |

## 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS 4
- **构建**: Vite 7 (SWC)
- **包管理**: Bun
- **CI/CD**: GitHub Actions (每日 08:00 UTC 自动构建)
- **存储**: Cloudflare R2
- **托管**: Cloudflare Pages

## 项目结构

```
├── .github/workflows/    # Nightly build 流水线
├── scripts/
│   ├── install.sh        # macOS/Linux 安装脚本
│   ├── install.ps1       # Windows 安装脚本
│   ├── uninstall.sh      # macOS/Linux 卸载脚本
│   └── uninstall.ps1     # Windows 卸载脚本
├── src/
│   ├── components/       # Hero, Downloads, Install, Versions
│   └── lib/              # manifest 类型定义, 平台检测
├── public/
│   └── mock-manifest.json # 本地开发用 mock 数据
└── r2-cors.json          # R2 CORS 配置
```

## 工作原理

网站和安装脚本共用同一份 `manifest.json`（存储在 R2），其中包含所有版本的下载链接、SHA256 校验和与文件大小。不依赖数据库或 API 服务。

**CI 流水线**每日自动从 [zeroclaw-labs/zeroclaw](https://github.com/zeroclaw-labs/zeroclaw) 拉取源码，交叉编译 5 个目标平台的二进制文件（`strip=symbols`, `lto=true`, `codegen-units=1`），上传至 R2 并更新 manifest。超过 15 天的旧构建自动清理。

## 本地开发

```bash
bun install
bun run dev
```

开发模式下会使用 `public/mock-manifest.json` 作为数据源，无需连接 R2。

```bash
bun run build    # 生产构建
bun run preview  # 预览构建产物
bun run lint     # ESLint 检查
```

## 相关仓库

- [zeroclaw-labs/zeroclaw](https://github.com/zeroclaw-labs/zeroclaw) — ZeroClaw 主仓库
