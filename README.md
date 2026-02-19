# MusicNBrain

> **Copyright (c) 2025 MusicNBrain Media Lab. All Rights Reserved.**
> See [LICENSE](./LICENSE) for full terms.

## Project Structure

```
MusicNBrain/
├── LICENSE                ← Proprietary license
├── README.md              ← This file
├── artifacts/             ← Versioned documents & design artifacts (append-only)
└── src/                   ← Current working source code (Next.js app)
```

### artifacts/ — Explicit Versioning
All documents are versioned explicitly with `_v1`, `_v2`, etc. Files are **never updated** — new versions are appended. This makes it easy to trace issues and progress.

### src/ — Single State System
Source code always reflects the current working solution. Edit files in place and let Git handle implicit versioning.

## Getting Started

```bash
cd src
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Contact

For permissions and inquiries: **developer@musicnbrain.org**
